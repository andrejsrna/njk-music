import type { Metadata } from "next";
import Link from "next/link";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { SITE_URL, getCanonicalUrl } from "@/lib/env";
import MusicBrowser from "@/app/music/MusicBrowser";
import { slugify } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site";
import { getShopProducts } from "@/lib/shop/catalog";
import FaqList from "@/app/components/home/FaqList";
import NewsletterCta from "@/app/components/home/NewsletterCta";

const pageTitle = `Music Library: Gaming, Liquid DnB & Lofi | ${SITE_NAME}`;
const pageDescription =
  "Browse 60+ NJK Music releases: no copyright gaming music, liquid drum and bass, dnb music and lofi. Filter by genre or label, preview tracks, buy WAV for €1.50.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "njk music",
    "label catalog",
    "royalty-free music",
    "stream safe music",
  ],
  alternates: {
    canonical: getCanonicalUrl("/music"),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: getCanonicalUrl("/music"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "NJK Music Label Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default async function MusicPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q) ?? "";
  const music = await getMusicData();

  const sortedMusic = [...music].sort((a, b) => {
    const dateA = new Date(a.pubDate ?? a.publishedAt ?? a.updatedAt ?? 0).getTime();
    const dateB = new Date(b.pubDate ?? b.publishedAt ?? b.updatedAt ?? 0).getTime();
    return dateB - dateA;
  });

  const genreMap = sortedMusic.reduce<Record<string, number>>((acc, track) => {
    const name = track.genre?.Genres?.trim();
    if (!name) {
      return acc;
    }
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const genres = Object.entries(genreMap)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const labelMap = sortedMusic.reduce<Record<
    string,
    { label: string; slug: string; count: number }
  >>((acc, track) => {
    const name = track.label?.name?.trim();
    if (!name) {
      return acc;
    }
    const slug = track.label?.slug ?? slugify(name);
    const existing = acc[slug] ?? { label: name, slug, count: 0 };
    existing.count += 1;
    existing.label = name;
    acc[slug] = existing;
    return acc;
  }, {});

  const labels = Object.values(labelMap).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const faqs = [
    {
      question: "What is included in a release?",
      answer:
        "Each release page includes streaming links and, when available, downloads and licensing notes. Details can vary by label and release, so check the track page for the most accurate info.",
    },
    {
      question: "Can I use NJK Music in monetized content?",
      answer:
        "In most cases, yes. Usage depends on the release and platform. Always follow the licensing/attribution guidance shown on the track page and in our help centre.",
    },
    {
      question: "How do I find the right label mood?",
      answer:
        "Use the label and genre filters to narrow down the vibe. If you’re not sure, start with our primary label and explore from there.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const products = await getShopProducts(sortedMusic.map((t) => t.slug));
  const productInfo = Object.fromEntries(
    Object.entries(products).map(([k, v]) => [k, { priceCents: v.priceCents, currency: v.currency, previewUrl: v.previewUrl }]),
  );
  const labelCards = [...labels].sort((a, b) => b.count - a.count);
  const h2 = { fontStretch: "125%" } as const;

  return (
    <div className="bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <MusicBrowser tracks={sortedMusic} genres={genres} labels={labels} products={productInfo} initialQuery={initialQuery} />

      {/* BROWSE BY LABEL */}
      <section className="bg-[#F4F1EC] text-[#050405]">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-9 px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="m-0 text-[clamp(48px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={h2}>Not sure?<br />Start with a label</h2>
            <p className="m-0 max-w-[380px] text-lg font-medium text-[#3A363E]">Each label is its own mood. Pick one and the whole catalogue fits your channel.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] border-l-2 border-t-2 border-[#050405]">
            {labelCards.map((l) => (
              <Link key={l.slug} href={`/labels/${l.slug}`} className="flex min-h-[170px] flex-col justify-between gap-4 border-b-2 border-r-2 border-[#050405] bg-[#F4F1EC] p-[22px] text-[#050405] transition-colors hover:bg-[#050405] hover:text-[#F4F1EC]">
                <span className="flex justify-between font-[family-name:var(--font-jetbrains)] text-xs font-bold tracking-[0.1em]"><span>{l.count} RELEASE{l.count === 1 ? "" : "S"}</span><span>↗</span></span>
                <span className="text-[32px] font-black uppercase leading-[0.95] tracking-[-0.035em]" style={{ fontStretch: "118%" }}>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto flex w-full max-w-[1360px] flex-wrap items-start gap-14 px-5 py-24 sm:px-8 sm:py-[104px]">
        <div className="flex flex-[1_1_340px] flex-col gap-5">
          <h2 className="m-0 text-[clamp(44px,5.5vw,80px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={h2}>Quick<br />answers</h2>
          <Link href="/help" className="inline-flex min-h-[52px] items-center self-start border-2 border-[#F4F1EC] px-6 text-sm font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Help centre</Link>
        </div>
        <FaqList items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      </section>

      {/* CTA */}
      <section className="border-t-2 border-[#050405] text-white" style={{ background: "#C62828" }}>
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-12 px-5 py-20 sm:px-8 sm:py-[88px]">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(48px,7vw,112px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2}>Never miss<br />a drop</h2>
            <p className="m-0 max-w-[480px] text-lg">One email when new releases land. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterCta variant="square" idPrefix="lib" cta="Subscribe" />
        </div>
      </section>
    </div>
  );
}
