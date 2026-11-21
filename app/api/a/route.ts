import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TYPES = new Set(["pageview", "preview_play", "buy_click", "platform_click"]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|curl|wget|python|node-fetch|axios|monitor|uptime/i;
const SELF = /(^|\.)njkmusic\.com$/i;

const clip = (v: unknown, n: number) => (typeof v === "string" && v ? v.slice(0, n) : null);

function device(ua: string) {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

/** Daily-rotating visitor id: no cookie, no stored IP; the same person gets a new id each UTC day. */
function visitorId(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", process.env.SHOP_SECRET || "njk-analytics").update(`${day}|${ip}|${ua}`).digest("base64url").slice(0, 22);
}

export async function POST(request: NextRequest) {
  const ok = new NextResponse(null, { status: 204 });
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua) || request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1") return ok;
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return ok;
  }
  const type = typeof body.t === "string" && TYPES.has(body.t) ? body.t : null;
  const path = clip(body.p, 300);
  if (!type || !path || !path.startsWith("/") || path.startsWith("/admin")) return ok;

  let referrer: string | null = null;
  const ref = clip(body.r, 500);
  if (ref) {
    try {
      const host = new URL(ref).hostname.replace(/^www\./, "");
      if (!SELF.test(host)) referrer = host;
    } catch {}
  }
  const utm = clip(body.u, 80);
  const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  try {
    await prisma.analyticsEvent.create({
      data: {
        type,
        path,
        slug: clip(body.s, 160),
        target: clip(body.g, 120),
        referrer: utm ? `utm:${utm.toLowerCase()}` : referrer,
        country: clip(request.headers.get("cf-ipcountry"), 2),
        device: device(ua),
        visitor: visitorId(ip, ua),
      },
    });
  } catch (e) {
    console.error("[analytics] insert failed", e instanceof Error ? e.message : e);
  }
  return ok;
}
