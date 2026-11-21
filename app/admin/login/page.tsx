import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";
import LoginForm from "@/app/admin/login/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  if (!adminConfigured()) return <p className="text-center text-[#A39E98]">Admin is not configured (ADMIN_PASSWORD missing).</p>;
  return <LoginForm />;
}
