import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Public low-bitrate preview clip (not the master). Supports Range so the player can seek. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { SHOP_R2_ENDPOINT: endpoint, SHOP_R2_ACCESS_KEY_ID: accessKeyId, SHOP_R2_SECRET_ACCESS_KEY: secretAccessKey, SHOP_R2_BUCKET: bucket } = process.env;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) return new NextResponse("Not found", { status: 404 });
  const product = await prisma.product.findUnique({ where: { slug }, select: { active: true, previewKey: true } });
  if (!product?.active || !product.previewKey) return new NextResponse("Not found", { status: 404 });

  const client = new S3Client({ region: "auto", endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });
  const obj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: product.previewKey }));
  if (!obj.Body) return new NextResponse("Not found", { status: 404 });
  const buf = Buffer.from(await obj.Body.transformToByteArray());
  const total = buf.length;
  const base = { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600" };

  const m = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (m && (m[1] || m[2])) {
    let start = m[1] ? Number(m[1]) : total - Number(m[2]);
    let end = m[1] && m[2] ? Number(m[2]) : total - 1;
    start = Math.max(0, start);
    end = Math.min(total - 1, end);
    if (start > end) return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
    return new NextResponse(new Uint8Array(buf.subarray(start, end + 1)), {
      status: 206,
      headers: { ...base, "Content-Range": `bytes ${start}-${end}/${total}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new NextResponse(new Uint8Array(buf), { status: 200, headers: { ...base, "Content-Length": String(total) } });
}
