/**
 * Sell an EP: full EP as one ZIP (default 500 cents) + every track as a single (150 cents).
 *   npx tsx scripts/upload-ep.ts <release-slug> <ep.zip> <01 Track.wav> <02 Track.wav> ...
 * Track order = argument order; track title = file name without number prefix and extension.
 * Products: `<release>` (ZIP, title "<Release> (full EP)") and `<release>--<track-slug>` (WAV, title "<Track> (<Release>)").
 * Env: same as upload-wav.ts. Flags: --dry-run, --ep-price=<cents>.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseMarkdown } from "../lib/markdown";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const { SHOP_R2_ENDPOINT: endpoint, SHOP_R2_ACCESS_KEY_ID: accessKeyId, SHOP_R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env;
const bucket = process.env.SHOP_R2_BUCKET!;
if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) throw new Error("R2 env not set");
const s3 = new S3Client({ region: "auto", endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });

const DRY = process.argv.includes("--dry-run");
const EP_PRICE = Number(process.argv.find((a) => a.startsWith("--ep-price="))?.split("=")[1] ?? 500);
const TRACK_PRICE = 150;
const PREVIEW_SECONDS = 90;
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-");

function makePreview(wav: string): Buffer {
  const out = path.join(os.tmpdir(), `njk-preview-${randomBytes(6).toString("hex")}.mp3`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-t", String(PREVIEW_SECONDS), "-af", `afade=t=out:st=${PREVIEW_SECONDS - 3}:d=3`, "-ac", "2", "-b:a", "128k", out]);
  const buf = fs.readFileSync(out);
  fs.unlinkSync(out);
  return buf;
}

async function put(slug: string, title: string, price: number, file: string, ext: "wav" | "zip", previewFrom: string) {
  const size = fs.statSync(file).size;
  const key = `njk/downloads/${randomBytes(16).toString("hex")}/${slug}.${ext}`;
  if (DRY) return console.log(`DRY ${slug} "${title}" ${price}c ${(size / 1e6).toFixed(1)} MB`);
  const previewKey = `njk/previews/${randomBytes(8).toString("hex")}/${slug}.mp3`;
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: previewKey, Body: makePreview(previewFrom), ContentType: "audio/mpeg" }));
  await new Upload({ client: s3, params: { Bucket: bucket, Key: key, Body: fs.createReadStream(file), ContentType: ext === "zip" ? "application/zip" : "audio/wav" } }).done();
  const data = { title, priceCents: price, active: true, fileKey: key, fileName: `${slug}.${ext}`, fileSize: size, previewKey };
  await prisma.product.upsert({ where: { slug }, create: { slug, ...data }, update: data });
  console.log(`OK ${slug} "${title}" ${price}c ${(size / 1e6).toFixed(1)} MB`);
}

async function main() {
  const [release, zip, ...wavs] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (!release || !zip?.endsWith(".zip") || !wavs.length) throw new Error("usage: upload-ep.ts <release-slug> <ep.zip> <track.wav>...");
  const md = path.join(__dirname, "..", "content", "music", `${release}.md`);
  if (!fs.existsSync(md)) throw new Error(`no content/music/${release}.md`);
  const releaseTitle = (parseMarkdown<{ Title?: string }>(fs.readFileSync(md, "utf8")).metadata.Title || release).split(":")[0].trim();
  await put(release, `${releaseTitle} (full EP)`, EP_PRICE, zip, "zip", wavs[0]);
  for (const wav of wavs) {
    const name = path.basename(wav).replace(/\.wav$/i, "").replace(/^\d+[\s._-]+/, "").trim();
    await put(`${release}--${slugify(name)}`, `${name} (${releaseTitle})`, TRACK_PRICE, wav, "wav", wav);
  }
}

main().finally(() => prisma.$disconnect());
