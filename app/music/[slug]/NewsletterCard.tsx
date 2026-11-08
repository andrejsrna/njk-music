"use client";

import Link from "next/link";
import { useState } from "react";
import { EYEBROW } from "@/app/music/[slug]/track-utils";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="mx-auto max-w-[1280px] px-8 pb-[104px]">
      <div className="flex flex-wrap items-center justify-between gap-8 rounded-[22px] border border-[#242127] bg-[#141216] p-12 max-sm:p-6">
        <div className="flex flex-[1_1_360px] flex-col gap-2.5">
          <h2 className="m-0 text-[32px] font-extrabold tracking-[-0.025em]" style={{ fontStretch: "108%" }}>Stay in the loop</h2>
          <p className="m-0 text-base text-[#A39E98]">New releases, label drops and creator tools, straight to your inbox.</p>
        </div>
        <form onSubmit={submit} className="flex flex-[1_1_420px] flex-col gap-2.5">
          <label htmlFor="track-nl-email" className={EYEBROW}>Email address</label>
          <div className="flex flex-wrap gap-2.5">
            <input
              id="track-nl-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="min-h-[52px] flex-[1_1_220px] rounded-xl border border-[#3A363E] bg-[#0C0B0D] px-[18px] text-[15px] text-[#F4F1EC] placeholder:text-[#6F6A64]"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="min-h-[52px] rounded-xl bg-[#F4F1EC] px-[26px] text-[15px] font-bold text-[#0C0B0D] disabled:opacity-60"
            >
              {state === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          <span className="text-xs text-[#8C8781]" role="status">
            {state === "done" ? "Thanks, you are subscribed." : state === "error" ? "Something went wrong, please try again." : (
              <>By subscribing you agree to our <Link href="/privacy" className="text-[#C9C4BD] underline">privacy policy</Link>.</>
            )}
          </span>
        </form>
      </div>
    </section>
  );
}
