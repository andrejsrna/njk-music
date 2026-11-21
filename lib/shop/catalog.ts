import { prisma } from "@/lib/prisma";

export type ShopProduct = { slug: string; priceCents: number; currency: string; previewUrl: string | null; bundle?: boolean };
export type TrackProduct = ShopProduct & { title: string };

/** Individual tracks of an EP sold separately: products with slug `<release>--<track>`, in upload order. */
export async function getTrackProducts(releaseSlug: string): Promise<TrackProduct[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await prisma.product.findMany({
      where: { slug: { startsWith: `${releaseSlug}--` }, active: true, fileKey: { not: "" } },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((p) => ({ slug: p.slug, title: p.title, priceCents: p.priceCents, currency: p.currency, previewUrl: p.previewKey ? `/api/shop/preview/${p.slug}` : null }));
  } catch (e) {
    console.error("[shop] track products failed", releaseSlug, e instanceof Error ? e.message : e);
    return [];
  }
}

/** Product for sale on a release page, or null when there is no master file yet / the DB is unavailable. */
export async function getShopProduct(slug: string): Promise<ShopProduct | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const p = await prisma.product.findUnique({ where: { slug } });
    if (!p || !p.active || !p.fileKey) return null;
    return { slug: p.slug, priceCents: p.priceCents, currency: p.currency, previewUrl: p.previewKey ? `/api/shop/preview/${p.slug}` : null, bundle: /\.zip$/i.test(p.fileName ?? "") };
  } catch (e) {
    console.error("[shop] catalog lookup failed", slug, e instanceof Error ? e.message : e);
    return null;
  }
}

/** Slugs (from the given list) that have an active WAV, with price and preview clip. Empty when the DB is unavailable. */
export async function getShopProducts(slugs: string[]): Promise<Record<string, ShopProduct>> {
  if (!process.env.DATABASE_URL || slugs.length === 0) return {};
  try {
    const rows = await prisma.product.findMany({ where: { slug: { in: slugs }, active: true, fileKey: { not: "" } } });
    return Object.fromEntries(
      rows.map((p) => [p.slug, { slug: p.slug, priceCents: p.priceCents, currency: p.currency, previewUrl: p.previewKey ? `/api/shop/preview/${p.slug}` : null }]),
    );
  } catch (e) {
    console.error("[shop] catalog list failed", e instanceof Error ? e.message : e);
    return {};
  }
}
