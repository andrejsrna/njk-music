"use client";

import Link from "next/link";
import { useState } from "react";
import { MONO } from "@/app/music/[slug]/track-utils";

export default function NewsletterCta({ variant = "round", idPrefix = "cta", cta = "Get new drops" }: { variant?: "round" | "square"; idPrefix?: string; cta?: string }) {
  const sq = variant === "square";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletters", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error();
      setStatus("ok");
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Unable to subscribe at the moment.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-[1_1_380px] flex-col gap-2.5">
      <label htmlFor={`${idPrefix}-email`} className={`${MONO} text-[11px] uppercase tracking-[0.1em]`}>Email address</label>
      <div className={`flex flex-wrap ${sq ? "gap-0" : "gap-2.5"}`}>
        <input
          id={`${idPrefix}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className={`flex-[1_1_200px] bg-white px-[18px] text-base text-[#141216] outline-none placeholder:text-[#8C8781] ${sq ? "min-h-[60px] border-2 border-[#050405]" : "min-h-[56px] rounded-xl border-none"}`}
        />
        <button type="submit" disabled={status === "loading"} className={`cursor-pointer bg-[#0C0B0D] text-white hover:bg-black disabled:opacity-60 ${sq ? "min-h-[60px] border-2 border-[#050405] px-7 text-[15px] font-extrabold uppercase tracking-[0.02em]" : "min-h-[56px] rounded-xl border-none px-[26px] text-base font-bold"}`}>
          {status === "loading" ? "Sending…" : cta}
        </button>
      </div>
      {message && <p role="status" className="m-0 text-sm font-semibold">{message}</p>}
      <span className="text-[13px]">
        By subscribing you agree to our <Link href="/privacy" className="text-white underline">privacy policy</Link>. Or <Link href="/music" className="text-white underline">browse releases</Link> now.
      </span>
    </form>
  );
}
