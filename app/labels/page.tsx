import type { Metadata } from "next";
import Link from "next/link";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { getCanonicalUrl } from "@/lib/env";
import { LABEL_LIST, SITE_NAME } from "@/lib/site";
import { slugify } from "@/lib/utils";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import NewsletterCta from "@/app/components/home/NewsletterCta";

const ACCENTS: Record<string, [string, string]> = {
  "no-copyright-gaming-music": ["#C62828", "#FF6B5E"],
  "chill-music-motif": ["#0E7490", "#5EE0F5"],
  "calm-spirit-music": ["#7C3AED", "#B794F6"],
  "jazz-and-bass": ["#C2410C", "#FF9A62"],
  koldman: ["#C62828", "#FF6B5E"],
  "ludovky-od-andreja": ["#C2410C", "#FF9A62"],
};

const pageTitle = "Explore NJK Music Labels";
const pageDescription =
  "Browse every label in the NJK Music ecosystem and discover stream-safe releases for creators, studios, and storytellers.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "njk music labels",
    "stream safe labels",
    "royalty free music labels",
    "no copyright music",
  ],
  alternates: {
    canonical: getCanonicalUrl("/labels"),
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: getCanonicalUrl("/labels"),
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

export default async function LabelsIndexPage() {
  const releases = await getMusicData();
  const releaseCounts = releases.reduce<Record<string, number>>((acc, track) => {
    const trackLabelSlug =
      track.label?.slug ?? (track.label?.name ? slugify(track.label.name) : null);

    if (!trackLabelSlug) {
      return acc;
    }

    acc[trackLabelSlug] = (acc[trackLabelSlug] ?? 0) + 1;
    return acc;
  }, {});

  const labels = [...LABEL_LIST].sort((a, b) => a.name.localeCompare(b.name));

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NJK Music Labels",
    itemListElement: labels.map((label, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: getCanonicalUrl(`/labels/${label.slug}`),
      name: label.name,
      description: label.description,
    })),
  };

  const MONO = "font-[family-name:var(--font-jetbrains)]";
  const h2 = { fontStretch: "125%" } as const;
  const total = Object.values(releaseCounts).reduce((n, c) => n + c, 0);
  const byCount = [...labels].sort((a, b) => (releaseCounts[b.slug] ?? 0) - (releaseCounts[a.slug] ?? 0));

  return (
    <div className="bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <section className="relative flex min-h-[560px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] sm:min-h-[640px]">
        <LabelHeroGL accent="#C62828" />
        <div className="pointer-events-none relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-end gap-7 px-5 pb-12 pt-16 sm:px-8">
          <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
            <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">Labels</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{labels.length} labels</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{total} releases</span>
          </div>
          <h1 className="m-0 text-[clamp(56px,12vw,192px)] font-black uppercase leading-[0.78] tracking-[-0.06em] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={h2}>
            Pick<br /><span style={{ color: "#FF6B5E" }}>your sound</span>
          </h1>
          <p className="m-0 max-w-[560px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-xl font-semibold">Six labels, each with its own mood. Every release is cleared for creators.</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col border-t-2 border-[#F4F1EC]">
          {byCount.map((label, i) => {
            const count = releaseCounts[label.slug] ?? 0;
            const [accent, accentText] = ACCENTS[label.slug] ?? ACCENTS["no-copyright-gaming-music"];
            return (
              <Link key={label.slug} href={`/labels/${label.slug}`} className="group relative flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-[#2A272D] px-3 py-8 transition-colors hover:bg-[#110F12]">
                <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 transition-all group-hover:w-3" style={{ background: accent }} />
                <span className={`${MONO} w-10 flex-none pl-3 text-[13px] font-bold`} style={{ color: accentText }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex min-w-0 flex-[1_1_380px] flex-col gap-2.5">
                  <span className="text-[clamp(34px,4.6vw,68px)] font-black uppercase leading-[0.95] tracking-[-0.045em] transition-transform duration-[250ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-2.5" style={h2}>{label.name}</span>
                  <span className={`${MONO} text-xs font-bold uppercase tracking-[0.1em]`} style={{ color: accentText }}>{label.tagline}</span>
                </span>
                <span className="flex-[1_1_340px] text-base text-[#A39E98] [text-wrap:pretty]">{label.description.split(". ")[0]}.</span>
                <span className="flex items-center gap-4">
                  <span className={`${MONO} text-xs font-bold uppercase tracking-[0.1em]`}>{count} release{count === 1 ? "" : "s"}</span>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F4F1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </span>
              </Link>
            );
          })}
          {labels.length === 0 && <p className="py-10 text-[#A39E98]">Label roster updates are coming soon.</p>}
        </div>
      </section>

      <section className="border-t-2 border-[#050405] text-white" style={{ background: "#C62828" }}>
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-12 px-5 py-20 sm:px-8 sm:py-[88px]">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(48px,7vw,112px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2}>Never miss<br />a drop</h2>
            <p className="m-0 max-w-[480px] text-lg">One email when new releases land. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterCta variant="square" idPrefix="labels" cta="Subscribe" />
        </div>
      </section>
    </div>
  );
}
