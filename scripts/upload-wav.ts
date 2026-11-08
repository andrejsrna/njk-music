/**
 * Upload master WAVs to R2 and activate the product for each release.
 *   npm run shop:upload -- <file.wav|dir> [...]   (file name = release slug, e.g. unleash-your-inner-hero-fantasy-rpg-soundtrack.wav)
 * Env: DATABASE_URL, SHOP_R2_ENDPOINT, SHOP_R2_ACCESS_KEY_ID, SHOP_R2_SECRET_ACCESS_KEY, SHOP_R2_BUCKET. Price default 150 cents.
 * R2 key is random (njk/downloads/<hex>/<slug>.wav) so the file can only be reached through a paid download link.
 */
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import os from "node:os";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseMarkdown } from "../lib/markdown";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const { SHOP_R2_ENDPOINT: endpoint, SHOP_R2_ACCESS_KEY_ID: accessKeyId, SHOP_R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env;
const bucket = process.env.SHOP_R2_BUCKET;
if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) throw new Error("R2 env not set");
const s3 = new S3Client({ region: "auto", endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } });

const DRY = process.argv.includes("--dry-run");
const PREVIEW_ONLY = process.argv.includes("--preview-only"); // regenerate teaser from the WAV, keep the stored master
const PRICE = 150;
const PREVIEW_SECONDS = 90;

/** 90 s, 128 kbps MP3 teaser from the start of the master with a short fade-out. */
function makePreview(wav: string): Buffer {
  const out = path.join(os.tmpdir(), `njk-preview-${randomBytes(6).toString("hex")}.mp3`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-t", String(PREVIEW_SECONDS), "-af", `afade=t=out:st=${PREVIEW_SECONDS - 3}:d=3`, "-ac", "2", "-b:a", "128k", out]);
  const buf = fs.readFileSync(out);
  fs.unlinkSync(out);
  return buf;
}

function collect(args: string[]) {
  const files: string[] = [];
  for (const a of args) {
    if (a.startsWith("--")) continue;
    if (fs.statSync(a).isDirectory()) files.push(...fs.readdirSync(a).filter((f) => /\.wav$/i.test(f)).map((f) => path.join(a, f)));
    else files.push(a);
  }
  return files;
}

async function main() {
  const files = collect(process.argv.slice(2));
  if (!files.length) throw new Error("No WAV files given");
  for (const file of files) {
    const slug = path.basename(file).replace(/\.wav$/i, "");
    const md = path.join(__dirname, "..", "content", "music", `${slug}.md`);
    if (!fs.existsSync(md)) { console.log(`SKIP ${slug}: no content/music/${slug}.md`); continue; }
    const title = (parseMarkdown<{ Title?: string }>(fs.readFileSync(md, "utf8")).metadata.Title || slug).trim();
    const size = fs.statSync(file).size;
    const key = `njk/downloads/${randomBytes(16).toString("hex")}/${slug}.wav`;
    if (DRY) { console.log(`DRY ${slug} "${title}" ${(size / 1e6).toFixed(1)} MB -> ${key}`); continue; }
    if (PREVIEW_ONLY) {
      const previewKey = `njk/previews/${randomBytes(8).toString("hex")}/${slug}.mp3`;
      await s3.send(new PutObjectCommand({ Bucket: bucket!, Key: previewKey, Body: makePreview(file), ContentType: "audio/mpeg" }));
      await prisma.product.update({ where: { slug }, data: { previewKey } });
      console.log(`PREVIEW ${slug} -> ${previewKey}`);
      continue;
    }
    const previewKey = `njk/previews/${randomBytes(8).toString("hex")}/${slug}.mp3`;
    await s3.send(new PutObjectCommand({ Bucket: bucket!, Key: previewKey, Body: makePreview(file), ContentType: "audio/mpeg" }));
    await new Upload({ client: s3, params: { Bucket: bucket!, Key: key, Body: fs.createReadStream(file), ContentType: "audio/wav" } }).done();
    const existing = await prisma.product.findUnique({ where: { slug } });
    await prisma.product.upsert({
      where: { slug },
      create: { slug, title, priceCents: PRICE, active: true, fileKey: key, fileName: `${slug}.wav`, fileSize: size, previewKey },
      update: { title, active: true, fileKey: key, fileName: `${slug}.wav`, fileSize: size, previewKey },
    });
    console.log(`OK ${slug} "${title}" ${(size / 1e6).toFixed(1)} MB${existing?.fileKey ? " (replaced file; old key kept in R2: " + existing.fileKey + ")" : ""}`);
  }
}

main().finally(() => prisma.$disconnect());
