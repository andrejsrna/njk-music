"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = { slug: string; priceCents: number; currency: string; variant?: "hero" | "card"; label?: string };

const Icon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
);

export default function BuyButton({ slug, priceCents, currency, variant = "hero", label }: Props) {
  const card = variant === "card";
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const price = new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() }).format(priceCents / 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy]);

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
    <div className={card ? "w-full" : "w-full sm:w-auto"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        className={
          card
            ? "flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-2.5 border-none bg-[#050405] text-[15px] font-black uppercase text-[#F4F1EC] hover:bg-black"
            : "inline-flex min-h-[64px] cursor-pointer items-center gap-2.5 border-2 border-[#F4F1EC] bg-[#050405]/60 px-[30px] text-base font-black uppercase text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]"
        }
      >
        <Icon />
        {label ?? "Buy WAV"} · {price}
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => !busy && setOpen(false)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`buy-${slug}`}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md border-2 border-[#F4F1EC] bg-[#141216] p-6 text-sm text-[#A39E98] shadow-2xl [font-family:var(--font-archivo),system-ui,sans-serif]"
            >
              <button type="button" onClick={() => setOpen(false)} disabled={busy} aria-label="Close" className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center text-[#A39E98] hover:bg-white/5 hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <h2 id={`buy-${slug}`} className="m-0 pr-10 text-xl font-extrabold tracking-[-0.02em] text-[#F4F1EC]">Buy WAV · {price}</h2>
              <p className="mt-2 text-[#A39E98]">Lossless WAV master, download link sent by email right after payment. Invoice follows in a separate email.</p>
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#B71C1C]" />
                <span>I agree to immediate delivery of the digital file and acknowledge that I lose my right of withdrawal once delivery begins.</span>
              </label>
              <button
                type="button"
                disabled={!consent || busy}
                onClick={checkout}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center bg-[#C62828] px-6 text-[15px] font-black uppercase text-white hover:bg-[#d93434] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? "Redirecting…" : "Continue to secure payment"}
              </button>
              {error && <p role="alert" className="mt-3 text-[#ff8a80]">{error}</p>}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
