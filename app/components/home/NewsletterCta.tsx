"use client";

import Link from "next/link";
import { useState } from "react";
import { MONO } from "@/app/music/[slug]/track-utils";

export default function NewsletterCta() {
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
      <label htmlFor="cta-email" className={`${MONO} text-[11px] uppercase tracking-[0.1em]`}>Email address</label>
      <div className="flex flex-wrap gap-2.5">
        <input
          id="cta-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="min-h-[56px] flex-[1_1_200px] rounded-xl border-none bg-white px-[18px] text-base text-[#141216] outline-none placeholder:text-[#8C8781]"
        />
        <button type="submit" disabled={status === "loading"} className="min-h-[56px] cursor-pointer rounded-xl border-none bg-[#0C0B0D] px-[26px] text-base font-bold text-white hover:bg-black disabled:opacity-60">
          {status === "loading" ? "Sending…" : "Get new drops"}
        </button>
      </div>
      {message && <p role="status" className="m-0 text-sm font-semibold">{message}</p>}
      <span className="text-[13px]">
        By subscribing you agree to our <Link href="/privacy" className="text-white underline">privacy policy</Link>. Or <Link href="/music" className="text-white underline">browse releases</Link> now.
      </span>
    </form>
  );
}
