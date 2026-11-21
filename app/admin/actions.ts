"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, sessionValue } from "@/lib/admin/auth";

const attempts = new Map<string, { n: number; until: number }>();

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const ip = ((await headers()).get("cf-connecting-ip") || (await headers()).get("x-forwarded-for") || "?").split(",")[0];
  const a = attempts.get(ip);
  if (a && a.until > Date.now()) return "Too many attempts, try again in 15 minutes.";
  if (!checkPassword(String(form.get("password") || ""))) {
    const n = (a?.n || 0) + 1;
    attempts.set(ip, { n, until: n >= 5 ? Date.now() + 15 * 60_000 : 0 });
    await new Promise((r) => setTimeout(r, 600));
    return "Wrong password.";
  }
  attempts.delete(ip);
  const { value, maxAge } = sessionValue();
  (await cookies()).set(ADMIN_COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/admin", maxAge });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
