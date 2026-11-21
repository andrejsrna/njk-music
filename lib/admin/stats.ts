import { prisma } from "@/lib/prisma";

const n = (v: unknown) => Number(v ?? 0);
type Row = Record<string, unknown>;

export type Stats = Awaited<ReturnType<typeof getStats>>;

export async function getStats(days: number) {
  const since = new Date(Date.now() - days * 86400_000);
  const q = <T extends Row = Row>(sql: TemplateStringsArray, ...v: unknown[]) => prisma.$queryRaw<T[]>(sql, ...v);

  const [traffic, daily, sales, salesDaily, started, pages, refs, countries, devices, platforms, products, releases, recent] = await Promise.all([
    q`select count(*) filter (where type='pageview') pv,
             count(distinct (visitor, date_trunc('day', "createdAt"))) filter (where type='pageview') uv,
             count(*) filter (where type='preview_play') plays,
             count(*) filter (where type='buy_click') buys,
             count(*) filter (where type='platform_click') outs
      from "AnalyticsEvent" where "createdAt" >= ${since}`,
    q`select to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') d, count(*) pv, count(distinct visitor) uv
      from "AnalyticsEvent" where type='pageview' and "createdAt" >= ${since} group by 1 order by 1`,
    q`select count(*) filter (where status='PAID') orders, coalesce(sum("amountTotal") filter (where status='PAID'),0) revenue,
             count(*) filter (where status='REFUNDED') refunds, coalesce(sum("amountTotal") filter (where status='REFUNDED'),0) refunded
      from "Order" where "paidAt" >= ${since}`,
    q`select to_char(date_trunc('day', "paidAt"), 'YYYY-MM-DD') d, sum("amountTotal") rev, count(*) c
      from "Order" where status='PAID' and "paidAt" >= ${since} group by 1 order by 1`,
    q`select count(*) c from "Order" where "createdAt" >= ${since}`,
    q`select path k, count(*) c, count(distinct visitor) u from "AnalyticsEvent" where type='pageview' and "createdAt" >= ${since} group by 1 order by 2 desc limit 15`,
    q`select coalesce(referrer,'(direct)') k, count(distinct visitor) c from "AnalyticsEvent" where type='pageview' and "createdAt" >= ${since} group by 1 order by 2 desc limit 12`,
    q`select coalesce(country,'??') k, count(distinct visitor) c from "AnalyticsEvent" where type='pageview' and "createdAt" >= ${since} group by 1 order by 2 desc limit 12`,
    q`select coalesce(device,'?') k, count(distinct visitor) c from "AnalyticsEvent" where type='pageview' and "createdAt" >= ${since} group by 1 order by 2 desc`,
    q`select target k, count(*) c from "AnalyticsEvent" where type='platform_click' and "createdAt" >= ${since} group by 1 order by 2 desc limit 12`,
    q`select p.slug, p.title, p."priceCents" price, p.active,
             count(i.id) filter (where o.status='PAID' and o."paidAt" >= ${since}) sold,
             coalesce(sum(i."priceCents") filter (where o.status='PAID' and o."paidAt" >= ${since}),0) revenue,
             count(i.id) filter (where o.status='PAID') sold_all,
             coalesce(sum(i."downloadCount") filter (where o.status='PAID'),0) downloads
      from "Product" p left join "OrderItem" i on i."productId"=p.id left join "Order" o on o.id=i."orderId"
      group by p.id order by revenue desc, sold_all desc, p.slug`,
    q`select split_part(slug, '--', 1) k, count(*) filter (where type='pageview') views, count(distinct visitor) filter (where type='pageview') uv,
             count(*) filter (where type='preview_play') plays, count(*) filter (where type='buy_click') buys,
             count(*) filter (where type='platform_click') outs
      from "AnalyticsEvent" where slug is not null and "createdAt" >= ${since} group by 1 order by 2 desc limit 25`,
    prisma.order.findMany({
      where: { status: { in: ["PAID", "REFUNDED", "PENDING"] } },
      orderBy: { createdAt: "desc" },
      take: 25,
      include: { items: { select: { title: true, downloadCount: true } } },
    }),
  ]);

  const t = traffic[0] || {};
  const s = sales[0] || {};
  const uv = n(t.uv);
  const orders = n(s.orders);
  const revByDay = new Map(salesDaily.map((r) => [String(r.d), n(r.rev)]));
  const series: { d: string; pv: number; uv: number; rev: number }[] = [];
  const dmap = new Map(daily.map((r) => [String(r.d), r]));
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    const r = dmap.get(d);
    series.push({ d, pv: n(r?.pv), uv: n(r?.uv), rev: revByDay.get(d) || 0 });
  }
  const kv = (rows: Row[]) => rows.map((r) => ({ k: String(r.k ?? "?"), c: n(r.c), u: n(r.u) }));

  return {
    days,
    kpi: {
      pageviews: n(t.pv), visitors: uv, plays: n(t.plays), buyClicks: n(t.buys), platformClicks: n(t.outs),
      orders, revenue: n(s.revenue), refunds: n(s.refunds), refunded: n(s.refunded), checkouts: n(started[0]?.c),
      aov: orders ? n(s.revenue) / orders : 0, conversion: uv ? orders / uv : 0,
    },
    series,
    pages: kv(pages), referrers: kv(refs), countries: kv(countries), devices: kv(devices), platforms: kv(platforms),
    products: products.map((p) => ({ slug: String(p.slug), title: String(p.title), price: n(p.price), active: Boolean(p.active), sold: n(p.sold), revenue: n(p.revenue), soldAll: n(p.sold_all), downloads: n(p.downloads) })),
    releases: releases.map((r) => ({ slug: String(r.k), views: n(r.views), uv: n(r.uv), plays: n(r.plays), buys: n(r.buys), outs: n(r.outs) })),
    recent: recent.map((o) => ({ id: o.id, at: (o.paidAt || o.createdAt).toISOString(), status: o.status, email: o.email, name: o.customerName, total: o.amountTotal, invoice: o.invoiceNumber || o.invoiceState, invoiceUrl: o.invoiceUrl, items: o.items.map((i) => `${i.title} (${i.downloadCount}×)`).join(", ") })),
  };
}
