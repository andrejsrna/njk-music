import { prisma } from "@/lib/prisma";

export type ShopProduct = { slug: string; priceCents: number; currency: string };

/** Product for sale on a release page, or null when there is no master file yet / the DB is unavailable. */
export async function getShopProduct(slug: string): Promise<ShopProduct | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const p = await prisma.product.findUnique({ where: { slug } });
    if (!p || !p.active || !p.fileKey) return null;
    return { slug: p.slug, priceCents: p.priceCents, currency: p.currency };
  } catch (e) {
    console.error("[shop] catalog lookup failed", slug, e instanceof Error ? e.message : e);
    return null;
  }
}
