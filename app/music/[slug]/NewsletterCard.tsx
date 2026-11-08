"use client";

import Link from "next/link";
import { useState } from "react";
import { MONO } from "@/app/music/[slug]/track-utils";

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
    <section className="mx-auto max-w-[1360px] px-5 pb-24 sm:px-8 sm:pb-28">
      <div className="flex flex-wrap items-end justify-between gap-10 border-2 border-[#F4F1EC] p-6 sm:p-14">
        <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-3">
          <h2 className="m-0 text-[clamp(40px,5vw,72px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={{ fontStretch: "125%" }}>Stay in<br />the loop</h2>
          <p className="m-0 text-[17px] text-[#A39E98]">New releases and label drops, straight to your inbox.</p>
        </div>
        <form onSubmit={submit} className="flex flex-[1_1_400px] flex-col gap-2.5">
          <label htmlFor="track-nl-email" className={`${MONO} text-[11px] font-bold uppercase tracking-[0.12em] text-[#A39E98]`}>Email address</label>
          <div className="flex flex-wrap">
            <input id="track-nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" className="min-h-[60px] min-w-0 flex-[1_1_200px] border-2 border-[#F4F1EC] bg-[#050405] px-[18px] text-base text-[#F4F1EC] placeholder:text-[#6F6A64]" />
            <button type="submit" disabled={state === "loading"} className="min-h-[60px] cursor-pointer border-2 border-[#F4F1EC] bg-[#F4F1EC] px-7 text-[15px] font-black uppercase text-[#050405] disabled:opacity-60">
              {state === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          <span className="text-[13px] text-[#8C8781]" role="status">
            {state === "done" ? "Thanks, you are subscribed." : state === "error" ? "Something went wrong, please try again." : (
              <>By subscribing you agree to our <Link href="/privacy" className="text-[#C9C4BD] underline">privacy policy</Link>.</>
            )}
          </span>
        </form>
      </div>
    </section>
  );
}
