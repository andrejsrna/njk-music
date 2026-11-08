import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { retrieveCheckoutSession } from "@/lib/shop/stripe";
import { fulfilSession, downloadUrl } from "@/lib/shop/orders";
import { issueInvoice } from "@/lib/shop/invoices";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order confirmed | NJK Music", robots: { index: false } };

export default async function CheckoutSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let items: { id: string; title: string }[] = [];
  let state: "paid" | "pending" | "unknown" = "unknown";

  if (session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const session = await retrieveCheckoutSession(session_id);
      const r = await fulfilSession(session); // idempotent: the webhook may already have done it
      if (r.status === "paid") await issueInvoice(String(session.metadata?.orderId));
      const order = await prisma.order.findUnique({ where: { stripeSessionId: session.id }, include: { items: true } });
      if (order?.status === "PAID") {
        state = "paid";
        items = order.items.map((i) => ({ id: i.id, title: i.title }));
      } else state = "pending";
    } catch (e) {
      console.error("[shop] success page failed", e instanceof Error ? e.message : e);
    }
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-24 text-[#F4F1EC]">
      {state === "paid" ? (
        <>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C62828]">Payment received</p>
          <h1 className="mt-3 text-4xl font-bold">Your track is ready</h1>
          <p className="mt-4 text-[#A39E98]">We also sent the download link and your invoice to your email.</p>
          <ul className="mt-8 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 rounded-xl border border-[#2A262E] bg-[#141216] p-4">
                <span className="font-semibold">{i.title}</span>
                <a href={downloadUrl(i.id)} className="rounded-full bg-[#C62828] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#d93434]">Download WAV</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold">{state === "pending" ? "Waiting for your payment" : "Order not found"}</h1>
          <p className="mt-4 text-[#A39E98]">
            {state === "pending" ? "The payment is still being confirmed. Reload this page in a minute, or check your email." : "We could not find this order. If you paid, the download link arrives by email shortly."}
          </p>
        </>
      )}
      <Link href="/music" className="mt-10 text-sm font-semibold text-[#F4F1EC] underline underline-offset-4">Back to the catalog</Link>
    </main>
  );
}
