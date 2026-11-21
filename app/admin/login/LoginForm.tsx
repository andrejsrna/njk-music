"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto flex max-w-sm flex-col gap-4 border-2 border-[#F4F1EC]/20 bg-[#141216] p-6">
      <h1 className="m-0 text-2xl font-black uppercase">NJK Admin</h1>
      <label className="flex flex-col gap-2 text-sm text-[#A39E98]">
        Password
        <input name="password" type="password" autoComplete="current-password" required autoFocus className="border-2 border-[#F4F1EC]/30 bg-[#050405] px-3 py-2.5 text-base text-white outline-none focus:border-[#F4F1EC]" />
      </label>
      <button disabled={pending} className="min-h-[46px] cursor-pointer bg-[#C62828] font-black uppercase text-white hover:bg-[#d93434] disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
      {error && <p role="alert" className="m-0 text-sm text-[#ff8a80]">{error}</p>}
    </form>
  );
}
