import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "njk_admin";
const DAYS = 30;

const key = () => process.env.SHOP_SECRET || "";
const sign = (exp: string) => createHmac("sha256", key()).update(`admin:${exp}`).digest("base64url");

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && key());
}

export function checkPassword(input: string) {
  const want = Buffer.from(process.env.ADMIN_PASSWORD || "");
  const got = Buffer.from(input);
  return want.length > 0 && got.length === want.length && timingSafeEqual(got, want);
}

export function sessionValue() {
  const exp = String(Math.floor(Date.now() / 1000) + DAYS * 86400);
  return { value: `${exp}.${sign(exp)}`, maxAge: DAYS * 86400 };
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(ADMIN_COOKIE)?.value || "";
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) * 1000 < Date.now()) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
