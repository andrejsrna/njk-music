import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { getLabelDefinition, LABEL_LIST } from "@/lib/site";
import { getCanonicalUrl } from "@/lib/env";
import { resolveStrapiImageUrl, slugify } from "@/lib/utils";
import { genres as playlistGenres } from "@/data/genres";
import { MONO, getTrackFacts, isRightsManaged } from "@/app/music/[slug]/track-utils";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import LabelReleases from "@/app/labels/[slug]/LabelReleases";
import NewsletterCta from "@/app/components/home/NewsletterCta";

const ACCENTS: Record<string, [string, string]> = {
  "no-copyright-gaming-music": ["#C62828", "#FF6B5E"],
  "chill-music-motif": ["#0E7490", "#5EE0F5"],
  "calm-spirit-music": ["#7C3AED", "#B794F6"],
  "jazz-and-bass": ["#C2410C", "#FF9A62"],
  koldman: ["#C62828", "#FF6B5E"],
  "ludovky-od-andreja": ["#C2410C", "#FF9A62"],
};

const NCGM_PLATFORMS: [string, string][] = [
  ["Spotify", "https://open.spotify.com/artist/702mas8Kyj9BGvD6dZGML8"],
  ["Apple Music", "https://music.apple.com/sk/artist/no-copyright-gaming-music/1699748922"],
  ["YouTube Music", "https://music.youtube.com/channel/UC6FzeY54doTLkzPJYaapmnQ"],
  ["Amazon Music", "https://www.amazon.com/music/player/artists/B0CD2BDVWG/no-copyright-gaming-music"],
  ["Deezer", "https://www.deezer.com/en/artist/223452715"],
  ["Tidal", "https://tidal.com/browse/artist/41512847"],
];

const arrowDown = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
);
const arrowRight = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);
const outBtn = "inline-flex min-h-[60px] items-center gap-2.5 border-2 border-[#F4F1EC] px-[30px] text-base font-extrabold uppercase tracking-[0.02em]";

const CATALOG_INTRO: Record<string, string> = {
  "no-copyright-gaming-music":
    "Every No Copyright Gaming Music release in one place. You will find high-energy gaming music for FPS highlights, racing edits and boss fights, plus lofi gaming tapes, phonk and hip hop beats for calmer streams. Each title opens its release page with a preview, platform links and licensing notes.",
  "jazz-and-bass":
    "The full Jazz & Bass discography: jazzy liquid drum and bass built on saxophone, clarinet, Rhodes keys and upright bass. If you are looking for drum and bass songs with a warmer, more musical feel, any title on this list is a good place to start.",
  "calm-spirit-music":
    "Calm music for slow mornings, meditation and quiet visuals. This is every Calm Spirit Music release, from long ambient journeys to soft downtempo EPs.",
  "chill-music-motif":
    "Focus and study music from Chill Music Motif. Lofi, downtempo and glitch-hop releases that keep a steady groove without pulling your attention away from work.",
  koldman: "Bass rap and dubstep from Koldman: wobble-heavy, rough-edged releases with plenty of low end.",
  "ludovky-od-andreja":
    "Slovak bedtime stories (rozprávky na dobrú noc) from Ľudovky od Andreja, narrated slowly for calm evenings and children's bedtime routines.",
};

const firstSentence = (text?: string | null, max = 170) => {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const m = clean.match(/^.{20,}?[.!?](?=\s|$)/);
  const out = m ? m[0] : clean;
  return out.length > max ? `${out.slice(0, max).replace(/\s+\S*$/, "")}…` : out;
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LABEL_LIST.map((label) => ({ slug: label.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = getLabelDefinition(slug);

  if (!label) {
    return {};
  }

  return {
    title: label.seo.title,
    description: label.seo.description,
    keywords: label.seo.keywords,
    alternates: {
      canonical: getCanonicalUrl(`/labels/${label.slug}`),
    },
    openGraph: {
      title: label.seo.title,
      description: label.seo.description,
      url: getCanonicalUrl(`/labels/${label.slug}`),
      siteName: "NJK Music",
      type: "website",
      images: label.heroImage
        ? [
            {
              url: label.heroImage,
              width: 1600,
              height: 900,
              alt: `${label.name} Label Artwork`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: label.seo.title,
      description: label.seo.description,
      images: label.heroImage ? [label.heroImage] : undefined,
    },
  };
}

export default async function LabelPage({ params }: PageProps) {
  const { slug } = await params;
  const label = getLabelDefinition(slug);

  if (!label) {
    notFound();
  }

  const releases = (await getMusicData())
    .filter((track) => {
      const trackLabelSlug =
        track.label?.slug ?? (track.label?.name ? slugify(track.label.name) : null);
      return trackLabelSlug === label.slug;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt ?? a.pubDate ?? a.updatedAt ?? "").getTime();
      const dateB = new Date(b.publishedAt ?? b.pubDate ?? b.updatedAt ?? "").getTime();
      return dateB - dateA;
    });

  const releaseCount = releases.length;
  const [accent, accentText] = ACCENTS[label.slug] ?? ACCENTS["no-copyright-gaming-music"];
  const managed = isRightsManaged(label.slug);
  const isNcgm = label.slug === "no-copyright-gaming-music";

  const items = releases.map((t) => {
    const facts = getTrackFacts(t);
    const g = t.genre?.Genres?.trim();
    return {
      slug: t.slug,
      title: t.Title,
      genre: g && g !== "All Genres" ? g : "",
      type: facts.trackCount > 1 ? `${facts.format} · ${facts.trackCount} tracks` : facts.format ?? "Single",
      cover: resolveStrapiImageUrl(t.Cover),
    };
  });

  const platforms: [string, string][] = isNcgm
    ? NCGM_PLATFORMS
    : (label.socialLinks ?? []).map((l) => [l.label, l.href] as [string, string]);
  const spotify = platforms.find(([n]) => n === "Spotify")?.[1];
  const marqueeBase = Array.from(new Set(items.map((i) => i.genre).filter(Boolean)));
  const words = [...marqueeBase, ...(managed ? ["Rights-managed", "Sync-ready"] : ["Twitch-safe", "YouTube-safe"])];
  const marquee = words.length < 6 ? [...words, ...words, ...words] : words;
  const points = label.highlights.length ? label.highlights.slice(0, 3) : label.callouts.map((c) => `${c.title}: ${c.detail}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: label.name,
    url: getCanonicalUrl(`/labels/${label.slug}`),
    description: label.description,
    genre: "Electronic Music",
    memberOf: { "@type": "Organization", name: "NJK Music", url: getCanonicalUrl("/") },
    numberOfAlbums: releaseCount,
  };

  const H2 = "m-0 font-black uppercase tracking-[-0.05em]";
  const nameLines = label.name.split(" ");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="overflow-hidden bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
        {/* HERO */}
        <section className="relative flex min-h-[760px] flex-col overflow-hidden bg-[#0A0506] sm:min-h-[860px]">
          <LabelHeroGL accent={accent} />
          <div className="relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-end gap-9 px-5 pb-14 pt-10 sm:px-8">
            <div className="pointer-events-none flex flex-wrap gap-2.5 text-xs font-bold uppercase tracking-[0.14em] [font-family:var(--font-jetbrains),monospace]">
              <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">NJK Music Label</span>
              <span className="border border-[#F4F1EC] bg-[#050405]/50 px-3 py-[7px]">{releaseCount} release{releaseCount === 1 ? "" : "s"}</span>
              <span className="border border-[#F4F1EC] bg-[#050405]/50 px-3 py-[7px]">{managed ? "Rights-managed" : "Monetisation cleared"}</span>
            </div>
            <h1 className="pointer-events-none m-0 text-[clamp(40px,9.2vw,168px)] font-black uppercase leading-[0.8] tracking-[-0.055em] [text-shadow:0_0_60px_rgba(0,0,0,0.5)]" style={{ fontStretch: "125%" }}>
              {nameLines.map((w, i) => (<span key={i}>{w}{i < nameLines.length - 1 && <br />}</span>))}
            </h1>
            <div className="flex flex-wrap items-end justify-between gap-7">
              <p className="m-0 max-w-[560px] bg-[#050405]/70 px-[22px] py-[18px] text-2xl font-semibold leading-[1.25] tracking-[-0.01em]">{label.tagline}.</p>
              <div className="flex flex-wrap gap-3">
                {spotify && (
                  <a href={spotify} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[60px] items-center gap-2.5 bg-[#F4F1EC] px-[30px] text-base font-extrabold uppercase tracking-[0.02em] text-[#050405] hover:bg-white hover:text-[#050405]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
                    Play on Spotify
                  </a>
                )}
                <a href="#releases" className={`${outBtn} bg-[#050405]/50 hover:bg-[#F4F1EC] hover:text-[#050405]`}>Browse releases {arrowDown}</a>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div aria-hidden="true" className="overflow-hidden border-y-2 border-[#050405] text-white" style={{ background: accent }}>
          <div className="label-marquee flex w-max whitespace-nowrap py-[18px] text-[34px] font-black uppercase tracking-[-0.02em]" style={{ fontStretch: "125%" }}>
            {[...marquee, ...marquee].map((w, i) => (
              <span key={i} className="inline-flex items-center gap-11 px-[22px]">{w}<span className="text-xl">✕</span></span>
            ))}
          </div>
        </div>

        {/* MANIFESTO */}
        <section className="mx-auto flex max-w-[1360px] flex-wrap gap-16 px-5 pb-24 pt-24 sm:px-8 sm:pt-[120px]">
          <div className="flex flex-[1_1_320px] flex-col gap-1">
            <span className="text-[clamp(120px,16vw,240px)] font-black leading-[0.8] tracking-[-0.06em]" style={{ fontStretch: "125%", color: accentText }}>{releaseCount}</span>
            <span className={`${MONO} text-[13px] font-bold uppercase tracking-[0.14em] text-[#A39E98]`}>Releases &amp; counting</span>
          </div>
          <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-10">
            <p className="m-0 text-[clamp(26px,3vw,42px)] font-bold leading-[1.15] tracking-[-0.025em] [text-wrap:pretty]">{label.description}</p>
            {points.length > 0 && (
              <ol className="m-0 list-none border-t-2 border-[#F4F1EC] p-0">
                {points.map((t, i) => (
                  <li key={t} className="flex items-baseline gap-7 border-b border-[#2A272D] py-6">
                    <span className={`${MONO} text-[13px] font-bold`} style={{ color: accentText }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-semibold">{t}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* RELEASES */}
        <section id="releases" className="mx-auto flex max-w-[1360px] scroll-mt-4 flex-col gap-9 px-5 pb-24 sm:px-8 sm:pb-[120px]">
          {releaseCount > 0 ? (
            <LabelReleases releases={items} accentText={accentText} />
          ) : (
            <p className="border border-dashed border-[#3A363E] p-8 text-base text-[#A39E98]">Releases from this label are coming soon. Explore other NJK Music labels below.</p>
          )}
          <Link href="/music" className={`${outBtn} self-center hover:bg-[#F4F1EC] hover:text-[#050405]`}>See the full catalog {arrowRight}</Link>
        </section>

        {/* FULL TRACKLIST (server-rendered, crawlable) */}
        {releaseCount > 0 && (
          <section id="tracklist" aria-labelledby="tracklist-title" className="mx-auto flex max-w-[1360px] scroll-mt-4 flex-col gap-8 px-5 pb-24 sm:px-8 sm:pb-[120px]">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-[#F4F1EC] pb-5">
              <h2 id="tracklist-title" className={`${H2} text-[clamp(36px,4.5vw,64px)] leading-[0.9]`} style={{ fontStretch: "125%" }}>
                {label.name}<br />tracklist
              </h2>
              <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em]`} style={{ color: accentText }}>{releaseCount} releases</span>
            </div>
            {CATALOG_INTRO[label.slug] && <p className="m-0 max-w-[820px] text-lg leading-relaxed text-[#C9C4BD]">{CATALOG_INTRO[label.slug]}</p>}
            <ol className="m-0 list-none p-0">
              {releases.map((t, i) => {
                const it = items[i];
                const year = (t.publishedAt ?? t.pubDate ?? "").slice(0, 4);
                const meta = [it.genre, it.type, year].filter(Boolean).join(" · ");
                const blurb = firstSentence(t.Description);
                return (
                  <li key={t.slug} className="border-b border-[#2A272D]">
                    <Link href={`/music/${t.slug}`} className="group flex flex-col gap-1.5 px-1 py-5 transition-colors hover:bg-[#141216] sm:flex-row sm:items-baseline sm:gap-7 sm:px-3">
                      <span className={`${MONO} shrink-0 text-[13px] font-bold`} style={{ color: accentText }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span className="text-xl font-extrabold tracking-[-0.02em] group-hover:underline sm:text-2xl">{t.Title}</span>
                        {meta && <span className={`${MONO} text-xs uppercase tracking-[0.08em] text-[#8C8781]`}>{meta}</span>}
                        {blurb && <span className="text-base leading-snug text-[#A39E98]">{blurb}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* LOADOUT (NCGM playlists) */}
        {isNcgm && (
          <section className="bg-[#F4F1EC] text-[#050405]">
            <div className="mx-auto flex max-w-[1360px] flex-col gap-10 px-5 py-24 sm:px-8 sm:py-[104px]">
              <div className="flex flex-wrap items-end justify-between gap-5">
                <h2 className={`${H2} text-[clamp(44px,7vw,104px)] leading-[0.85]`} style={{ fontStretch: "125%" }}>Pick your<br />loadout</h2>
                <p className="m-0 max-w-[420px] text-lg font-medium text-[#3A363E]">Curated Spotify playlists across electronic, hip hop, lofi and cinematic. Hit one and go.</p>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] border-l-2 border-t-2 border-[#050405]">
                {playlistGenres.map((g, i) => (
                  <a key={g.name} href={g.spotifyLink} target="_blank" rel="noopener noreferrer" className="flex min-h-[150px] flex-col justify-between border-b-2 border-r-2 border-[#050405] bg-[#F4F1EC] p-[22px] text-[#050405] transition-colors hover:bg-[#050405] hover:text-[#F4F1EC]">
                    <span className={`${MONO} flex justify-between text-xs font-bold tracking-[0.1em]`}><span>{String(i + 1).padStart(2, "0")}</span><span>PLAYLIST ↗</span></span>
                    <span className="text-[32px] font-black uppercase leading-[0.95] tracking-[-0.035em]" style={{ fontStretch: "120%" }}>{g.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PLATFORMS */}
        {platforms.length > 0 && (
          <section className="mx-auto flex max-w-[1360px] flex-col gap-9 px-5 py-24 sm:px-8 sm:py-[120px]">
            <h2 className={`${H2} text-[clamp(40px,5vw,72px)] leading-[0.9]`} style={{ fontStretch: "125%" }}>Listen where<br />you play</h2>
            <div className="flex flex-col border-t-2 border-[#F4F1EC]">
              {platforms.map(([name, href], i) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex min-h-[84px] items-center justify-between gap-5 border-b border-[#2A272D] px-3 transition-colors hover:bg-[#141216]">
                  <span className="flex items-baseline gap-6">
                    <span className={`${MONO} text-[13px] font-bold text-[#8C8781]`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.03em]" style={{ fontStretch: "115%" }}>{name}</span>
                  </span>
                  <span className={`${MONO} flex items-center gap-3.5 text-xs uppercase tracking-[0.1em] text-[#A39E98]`}>
                    Open
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4F1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto max-w-[1360px] px-5 pb-24 sm:px-8 sm:pb-[120px]">
          <div className="flex flex-wrap items-end justify-between gap-12 p-8 text-white sm:px-14 sm:py-[72px]" style={{ background: accent }}>
            <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-[18px]">
              <h2 className={`${H2} text-[clamp(44px,6.5vw,96px)] leading-[0.85]`} style={{ fontStretch: "125%" }}>Never miss<br />a drop</h2>
              <p className="m-0 max-w-[480px] text-lg">One email when new {label.short ?? label.name} releases land. No spam, unsubscribe anytime.</p>
            </div>
            <NewsletterCta variant="square" idPrefix="label" cta="Subscribe" />
          </div>
        </section>

        {/* MORE LABELS */}
        <section className="border-t-2 border-[#F4F1EC]">
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-10 gap-y-4 px-5 py-14 sm:px-8">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em] text-[#8C8781]`}>More labels</span>
            {LABEL_LIST.filter((item) => item.slug !== label.slug).map((item) => (
              <Link key={item.slug} href={`/labels/${item.slug}`} className="text-[22px] font-extrabold tracking-[-0.02em] hover:underline">{item.name}</Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
