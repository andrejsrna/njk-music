import type { Metadata } from "next";
import Link from "next/link";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { SITE_URL, getCanonicalUrl } from "@/lib/env";
import MusicBrowser from "@/app/music/MusicBrowser";
import { slugify } from "@/lib/utils";
import { PRIMARY_LABEL, SITE_NAME } from "@/lib/site";

const pageTitle = `${SITE_NAME} Label Library`;
const pageDescription =
  "Browse NJK Music releases across our labels and genres. Explore the roster, filter by mood, and find your next track.";

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen bg-transparent py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mb-12 space-y-5 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
              Music Library
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              NJK Music releases across our labels
            </h1>
            <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
              Browse our multi-label catalog by mood, label, or genre.
            </p>
            <div className="flex justify-center">
              <Link
                href={`/labels/${PRIMARY_LABEL.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-950 transition hover:opacity-90"
              >
                Browse our music →
              </Link>
            </div>
          </header>

          <MusicBrowser tracks={sortedMusic} genres={genres} labels={labels} initialQuery={initialQuery} />

          <section className="mx-auto mt-16 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-soft backdrop-blur sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{faq.answer}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
