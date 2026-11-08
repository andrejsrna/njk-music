import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { verifyDownloadToken } from "@/lib/shop/tokens";

export const dynamic = "force-dynamic";

// A shared link can't be farmed forever.
const LINK_DOWNLOAD_CAP = 25;

const deny = (status: number, error: string) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

function s3() {
  const { SHOP_R2_ENDPOINT: endpoint, SHOP_R2_ACCESS_KEY_ID: accessKeyId, SHOP_R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env;
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  return new S3Client({ region: "auto", endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  if (!token) return deny(400, "Missing download reference");
  const itemId = verifyDownloadToken(token);
  if (!itemId) return deny(410, "This download link has expired. Contact support@njkmusic.com with your order number.");

  const item = await prisma.orderItem.findUnique({
    where: { id: itemId },
    include: { order: { select: { status: true } }, product: { select: { fileKey: true, fileName: true } } },
  });
  if (!item || item.order.status !== "PAID") return deny(404, "Download not found");
  if (item.downloadCount >= LINK_DOWNLOAD_CAP) return deny(429, "Download limit reached. Contact support@njkmusic.com.");
  if (!item.product.fileKey) return deny(500, "File not available");

  const client = s3();
  const bucket = process.env.SHOP_R2_BUCKET;
  if (!client || !bucket) return deny(500, "Storage not configured");
  const obj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: item.product.fileKey }));
  if (!obj.Body) return deny(500, "File not available");

  await prisma.orderItem.update({ where: { id: item.id }, data: { downloadCount: { increment: 1 } } });

  const name = (item.product.fileName || "track.wav").replace(/[^\w.\- ]/g, "");
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Type": obj.ContentType || "audio/wav",
    "Content-Disposition": `attachment; filename="${name}"`,
  });
  if (obj.ContentLength) headers.set("Content-Length", String(obj.ContentLength));
  return new NextResponse(Readable.toWeb(obj.Body as Readable) as ReadableStream, { status: 200, headers });
}
