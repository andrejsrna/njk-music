import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { getStats } from "@/lib/admin/stats";
import { logout } from "@/app/admin/actions";
import { MONO } from "@/app/music/[slug]/track-utils";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90, 365];
const eur = (c: number) => new Intl.NumberFormat("sk-SK", { style: "currency", currency: "EUR" }).format(c / 100);
const num = (v: number) => new Intl.NumberFormat("sk-SK").format(v);
const pct = (v: number) => `${(v * 100).toFixed(2)} %`;

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border-2 border-[#F4F1EC]/15 bg-[#141216] p-4">
      <p className={`${MONO} m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#8C8781]`}>{label}</p>
      <p className="m-0 mt-1 text-2xl font-black">{value}</p>
      {sub && <p className="m-0 mt-1 text-xs text-[#8C8781]">{sub}</p>}
    </div>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <section className="min-w-0 border-2 border-[#F4F1EC]/15 bg-[#141216] p-4">
      <h2 className={`${MONO} m-0 mb-3 text-xs font-bold uppercase tracking-[0.1em] text-[#B794F6]`}>{title}</h2>
      {rows.length === 0 ? (
        <p className="m-0 text-sm text-[#8C8781]">No data yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>{head.map((h, i) => <th key={h} className={`border-b border-[#F4F1EC]/15 pb-2 font-bold text-[#8C8781] ${i ? "text-right" : "text-left"}`}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-[#F4F1EC]/5">
                  {r.map((c, j) => <td key={j} className={`py-1.5 ${j ? "whitespace-nowrap pl-3 text-right tabular-nums" : "max-w-[360px] truncate"}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Chart({ series }: { series: { d: string; uv: number; rev: number }[] }) {
  const maxU = Math.max(1, ...series.map((s) => s.uv));
  const maxR = Math.max(1, ...series.map((s) => s.rev));
  const W = 1000, H = 160, bw = W / series.length;
  const line = series.map((s, i) => `${i ? "L" : "M"}${(i + 0.5) * bw},${H - (s.rev / maxR) * (H - 10)}`).join(" ");
  return (
    <section className="border-2 border-[#F4F1EC]/15 bg-[#141216] p-4">
      <div className={`${MONO} mb-3 flex flex-wrap gap-5 text-xs font-bold uppercase tracking-[0.1em]`}>
        <span className="text-[#B794F6]">■ Visitors / day (max {num(maxU)})</span>
        {maxR > 1 && <span className="text-[#4ADE80]">— Revenue / day (max {eur(maxR)})</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-40 w-full" role="img" aria-label="Daily visitors and revenue">
        {series.map((s, i) => (
          <rect key={s.d} x={i * bw + bw * 0.15} width={bw * 0.7} y={H - (s.uv / maxU) * (H - 10)} height={(s.uv / maxU) * (H - 10)} fill="#7C3AED">
            <title>{`${s.d}: ${s.uv} visitors, ${eur(s.rev)}`}</title>
          </rect>
        ))}
        {maxR > 1 && <path d={line} fill="none" stroke="#4ADE80" strokeWidth={2} vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className={`${MONO} mt-1 flex justify-between text-[11px] text-[#8C8781]`}><span>{series[0]?.d}</span><span>{series.at(-1)?.d}</span></div>
    </section>
  );
}

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const d = Number((await searchParams).d);
  const days = RANGES.includes(d) ? d : 30;
  const s = await getStats(days);
  const k = s.kpi;

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-5">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-3xl font-black uppercase tracking-[-0.02em]">Sales &amp; analytics</h1>
        <div className="flex flex-wrap items-center gap-2">
          {RANGES.map((r) => (
            <Link key={r} href={`/admin?d=${r}`} className={`border-2 px-3 py-1.5 text-sm font-bold ${r === days ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#050405]" : "border-[#F4F1EC]/30 text-[#F4F1EC]"}`}>{r} d</Link>
          ))}
          <form action={logout}><button className="ml-2 cursor-pointer border-2 border-[#F4F1EC]/30 bg-transparent px-3 py-1.5 text-sm font-bold text-[#A39E98]">Log out</button></form>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <Kpi label="Revenue" value={eur(k.revenue)} sub={k.refunds ? `${k.refunds} refunded (${eur(k.refunded)})` : "gross, incl. VAT if any"} />
        <Kpi label="Paid orders" value={num(k.orders)} sub={`AOV ${eur(k.aov)}`} />
        <Kpi label="Checkouts started" value={num(k.checkouts)} sub={k.checkouts ? `${pct(k.orders / k.checkouts)} completed` : undefined} />
        <Kpi label="Visitors" value={num(k.visitors)} sub={`${num(k.pageviews)} page views`} />
        <Kpi label="Conversion" value={pct(k.conversion)} sub="paid orders / visitors" />
        <Kpi label="Interactions" value={num(k.plays)} sub={`previews · ${num(k.buyClicks)} buy clicks · ${num(k.platformClicks)} platform clicks`} />
      </div>

      <Chart series={s.series} />

      <Table
        title="Products (sales in range / all time)"
        head={["Product", "Price", "Sold", "Revenue", "Sold all-time", "Downloads"]}
        rows={s.products.map((p) => [<Link key={p.slug} href={`/music/${p.slug.split("--")[0]}`} className="underline-offset-2 hover:underline">{p.title}{p.active ? "" : " (inactive)"}</Link>, eur(p.price), p.sold, eur(p.revenue), p.soldAll, p.downloads])}
      />

      <Table
        title="Release funnel"
        head={["Release", "Views", "Visitors", "Preview plays", "Buy clicks", "Platform clicks"]}
        rows={s.releases.map((r) => [r.slug, r.views, r.uv, r.plays, r.buys, r.outs])}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Table title="Top pages" head={["Path", "Views", "Visitors"]} rows={s.pages.map((r) => [r.k, r.c, r.u])} />
        <Table title="Referrers (visitors)" head={["Source", "Visitors"]} rows={s.referrers.map((r) => [r.k, r.c])} />
        <Table title="Countries (visitors)" head={["Country", "Visitors"]} rows={s.countries.map((r) => [r.k, r.c])} />
        <Table title="Platform clicks" head={["Platform", "Clicks"]} rows={s.platforms.map((r) => [r.k, r.c])} />
        <Table title="Devices (visitors)" head={["Device", "Visitors"]} rows={s.devices.map((r) => [r.k, r.c])} />
      </div>

      <Table
        title="Recent orders"
        head={["Date", "Status", "Customer", "Items (downloads)", "Total", "Invoice"]}
        rows={s.recent.map((o) => [
          new Date(o.at).toLocaleString("sk-SK", { timeZone: "Europe/Bratislava" }),
          o.status,
          [o.name, o.email].filter(Boolean).join(" · ") || "-",
          o.items,
          eur(o.total),
          o.invoiceUrl ? <a key="i" href={o.invoiceUrl} target="_blank" rel="noopener noreferrer" className="underline">{o.invoice}</a> : o.invoice,
        ])}
      />
      <p className="m-0 text-xs text-[#8C8781]">Analytics are first-party and cookieless (daily-rotating visitor hash, no IP stored); bots and Do-Not-Track/GPC visitors are skipped, so numbers run lower than Google Analytics would show. Sales come from the shop database.</p>
    </div>
  );
}
