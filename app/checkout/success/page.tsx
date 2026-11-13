import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { retrieveCheckoutSession } from "@/lib/shop/stripe";
import { fulfilSession, downloadUrl } from "@/lib/shop/orders";
import { issueInvoice } from "@/lib/shop/invoices";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";

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

  const MONO = "font-[family-name:var(--font-jetbrains)]";
  const h1 = "m-0 text-[clamp(44px,8vw,128px)] font-black uppercase leading-[0.85] tracking-[-0.055em] [font-stretch:125%] [overflow-wrap:anywhere] [text-shadow:0_0_40px_rgba(0,0,0,0.7)]";

  return (
    <main className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506]">
        <LabelHeroGL accent={state === "paid" ? "#C62828" : "#3A363E"} intensity={state === "paid" ? 1 : 0.4} />
        <div className="relative z-[2] mx-auto flex w-full max-w-[1100px] flex-col gap-7 px-5 pb-14 pt-24 sm:px-8">
          {state === "paid" ? (
            <>
              <span className={`${MONO} w-fit bg-[#C62828] px-3 py-[7px] text-xs font-bold uppercase tracking-[0.12em] text-white`}>Payment received</span>
              <h1 className={h1}>Your track<br />is ready</h1>
              <p className="m-0 max-w-[560px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-lg font-semibold">We also sent the download link and your invoice to your email.</p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {items.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-4 border-2 border-[#F4F1EC] bg-[#050405]/85 p-4 sm:p-5">
                    <span className="text-xl font-extrabold tracking-[-0.02em]">{i.title}</span>
                    <a href={downloadUrl(i.id)} className="inline-flex min-h-[56px] items-center bg-[#C62828] px-8 text-base font-black uppercase text-white hover:bg-[#E03535] hover:text-white">Download WAV</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <span className={`${MONO} w-fit border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px] text-xs font-bold uppercase tracking-[0.12em]`}>{state === "pending" ? "Pending" : "Not found"}</span>
              <h1 className={h1}>{state === "pending" ? <>Waiting for<br />payment</> : <>Order<br />not found</>}</h1>
              <p className="m-0 max-w-[560px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-lg font-semibold">
                {state === "pending" ? "The payment is still being confirmed. Reload this page in a minute, or check your email." : "We could not find this order. If you paid, the download link arrives by email shortly."}
              </p>
            </>
          )}
          <Link href="/music" className="inline-flex min-h-[56px] w-fit items-center border-2 border-[#F4F1EC] bg-[#050405]/60 px-8 text-base font-black uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Back to the catalog</Link>
        </div>
      </section>
    </main>
  );
}
