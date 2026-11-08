"use client";

import { useState } from "react";

type Props = { slug: string; priceCents: number; currency: string };

export default function BuyButton({ slug, priceCents, currency }: Props) {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const price = new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() }).format(priceCents / 100);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: slug, consent }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Checkout failed");
      window.location.href = json.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#C62828] px-[26px] text-[15px] font-bold text-white hover:bg-[#d93434]"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
        Buy WAV · {price}
      </button>
      {open && (
        <div className="mt-4 max-w-md rounded-xl border border-[#2A262E] bg-[#141216] p-4 text-sm text-[#A39E98]">
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C62828]" />
            <span>I agree to immediate delivery of the digital file and acknowledge that I lose my right of withdrawal once delivery begins.</span>
          </label>
          <button
            type="button"
            disabled={!consent || busy}
            onClick={checkout}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[#F4F1EC] px-6 text-sm font-bold text-[#0C0B0D] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Redirecting…" : "Continue to secure payment"}
          </button>
          {error && <p role="alert" className="mt-3 text-[#ff8a80]">{error}</p>}
        </div>
      )}
    </div>
  );
}
