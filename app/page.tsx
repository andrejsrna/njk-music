import Link from "next/link";
import Image from "next/image";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { getShopProducts } from "@/lib/shop/catalog";
import { LABEL_DEFINITIONS } from "@/lib/site";
import { resolveStrapiImageUrl } from "@/lib/utils";
import { MONO, isExactLink } from "@/app/music/[slug]/track-utils";
import HomeHeroGL from "@/app/components/home/HomeHeroGL";
import FeaturedList, { type FeaturedItem } from "@/app/components/home/FeaturedList";
import FaqList from "@/app/components/home/FaqList";
import NewsletterCta from "@/app/components/home/NewsletterCta";

export const revalidate = 60;

const RED = "#C62828";
const RED_TEXT = "#FF6B5E";
const H2 = "m-0 text-[clamp(48px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]";
const WRAP = "mx-auto w-full max-w-[1360px] px-5 sm:px-8";
const chip = `${MONO} inline-flex min-h-[36px] items-center border border-[#F4F1EC] bg-[#050405]/70 px-3 text-xs font-bold uppercase tracking-[0.06em] hover:bg-[#F4F1EC] hover:text-[#050405]`;
const arrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);

const TRUST = [
  { t: "Monetisation guidance", d: "Twitch, YouTube, TikTok and client work." },
  { t: "Lossless WAV", d: "Instant download after purchase." },
  { t: "6 labels, one catalog", d: "Gaming, chill, cinematic, jazz, DnB." },
  { t: "New releases regularly", d: "Follow the labels for fresh drops." },
];
const MARQUEE = ["Monetisation guidance", "Lossless WAV", "6 labels · 1 catalog", "Creator-safe", "Twitch · YouTube · TikTok", "Instant download"];

const STEPS = [
  { n: "01", t: "Discover", d: "Browse curated playlists and releases by mood, genre or label." },
  { n: "02", t: "Download", d: "Grab the lossless WAV or stream the release on your platform." },
  { n: "03", t: "Create", d: "Use the tracks in streams, videos, podcasts and client work. Credit where required." },
];

const LABEL_ORDER: [string, string, string][] = [
  ["no-copyright-gaming-music", "NCGM · Gaming", "#2A1416"],
  ["chill-music-motif", "Chill", "#14202A"],
  ["calm-spirit-music", "Calm", "#14241C"],
  ["jazz-and-bass", "Jazz · DnB", "#1E1428"],
  ["koldman", "Artist label", "#20201A"],
  ["ludovky-od-andreja", "Folk", "#241A14"],
];

const FAQS = [
  { q: "What is NJK Music?", a: "A multi-label music brand for creators — curated moods, clear licensing guidance and regular new releases across gaming, chill, cinematic and drum & bass." },
  { q: "Can I use NJK Music in monetised videos and streams?", a: "Generally yes. Exact usage depends on the label, the track and the platform — check the release page and our monetisation guidelines." },
  { q: "Do I need to credit NJK Music or the label?", a: "We recommend crediting the artist or label and linking back where possible. Ready-made templates are in the attribution guide." },
  { q: "What formats are available for downloads?", a: "Tracks in the shop are sold as lossless WAV masters with instant delivery after payment. Every release also lists where to stream it." },
];

function streamOf(t: Awaited<ReturnType<typeof getMusicData>>[number]): [string, string] | null {
  const options: [string, string | null | undefined][] = [
    ["Spotify", t.Spotify], ["Apple Music", t.AppleMusic], ["YouTube Music", t.YouTubeMusic], ["Deezer", t.Deezer], ["Tidal", t.Tidal],
  ];
  const hit = options.find(([, url]) => isExactLink(url));
  return hit ? [hit[0], hit[1] as string] : null;
}

export default async function Home() {
  const music = await getMusicData();
  const recent = music.filter((t) => resolveStrapiImageUrl(t.Cover)).slice(0, 24);
  const products = await getShopProducts(recent.map((t) => t.slug));
  const fmt = (cents: number, cur: string) =>
    new Intl.NumberFormat("en-IE", { style: "currency", currency: cur.toUpperCase() }).format(cents / 100);

  const items: FeaturedItem[] = recent.map((t) => {
    const stream = streamOf(t);
    const p = products[t.slug];
    const genre = t.genre?.Genres?.trim();
    return {
      slug: t.slug,
      title: t.Title,
      artist: t.label?.name ?? "NJK Music",
      genre: genre && genre !== "All Genres" ? genre : "",
      cover: resolveStrapiImageUrl(t.Cover),
      streamUrl: stream?.[1] ?? null,
      streamName: stream?.[0] ?? null,
      previewUrl: p?.previewUrl ?? null,
      price: p ? fmt(p.priceCents, p.currency) : null,
    };
  });

  const h2s = { fontStretch: "125%" } as const;
  return (
    <main className="bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      {/* HERO */}
      <section className="relative flex min-h-[820px] flex-col overflow-hidden bg-[#050405] sm:min-h-[900px]">
        <HomeHeroGL accent={RED} />
        <div className={`${WRAP} pointer-events-none relative z-[2] flex flex-1 flex-col justify-between gap-12 pb-14 pt-12`}>
          <div className="flex flex-col gap-7">
            <span className={`${MONO} inline-flex items-center gap-2.5 self-start bg-[#F4F1EC] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#050405]`}>
              <span className="h-2 w-2" style={{ background: RED }} />Creator-safe music for streams, edits &amp; drops
            </span>
            <h1 className="m-0 text-[clamp(44px,8.6vw,140px)] font-black uppercase leading-[0.8] tracking-[-0.055em] [text-shadow:0_0_50px_rgba(0,0,0,0.6)]" style={h2s}>
              Monetise it.<br /><span style={{ color: RED_TEXT }}>No claims.</span>
            </h1>
          </div>
          <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-8">
            <form role="search" action="/music" method="get" className="flex max-w-[760px] flex-[1_1_560px] flex-col gap-3">
              <p className="m-0 mb-1.5 max-w-[560px] bg-[#050405]/80 px-[18px] py-3.5 text-lg font-semibold leading-[1.35] sm:text-xl">
                High-energy releases for gaming culture and creator workflows, with clear usage guidance for Twitch, YouTube and TikTok. Lossless WAV downloads.
              </p>
              <label htmlFor="hero-q" className={`${MONO} text-[11px] font-bold uppercase tracking-[0.12em] text-[#C9C4BD]`}>Find a track for your next video</label>
              <div className="flex flex-wrap border-2 border-[#F4F1EC] bg-[#050405]">
                <div className="flex flex-[1_1_280px] items-center gap-3 px-[18px] text-[#A39E98]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  <input id="hero-q" name="q" type="search" placeholder="boss fight, phonk, lofi study…" className="min-h-[60px] min-w-0 flex-1 border-none bg-transparent text-lg text-[#F4F1EC] outline-none placeholder:text-[#8C8781]" />
                </div>
                <button type="submit" className="min-h-[64px] cursor-pointer border-none px-8 text-base font-black uppercase tracking-[0.02em] text-white hover:brightness-110" style={{ background: RED }}>Search</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Gaming edits", "Stream background", "Drum & Bass", "Cinematic", "Chill"].map((q) => (
                  <Link key={q} href={`/music?q=${encodeURIComponent(q)}`} className={chip}>{q}</Link>
                ))}
              </div>
            </form>
            <div className={`${MONO} flex flex-col items-end gap-1.5 text-right text-xs font-bold uppercase tracking-[0.12em] max-sm:hidden`}>
              <span className="bg-[#050405]/80 px-2.5 py-1.5">6 labels · 1 catalog</span>
              <span className="bg-[#050405]/80 px-2.5 py-1.5">Move your cursor ↔</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <div aria-hidden="true" className="overflow-hidden border-y-2 border-[#050405] bg-[#F4F1EC] text-[#050405]">
        <div className="label-marquee flex w-max whitespace-nowrap py-4 text-[30px] font-black uppercase tracking-[-0.02em]" style={{ ...h2s, animationDuration: "32s" }}>
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
            <span key={i} className="inline-flex items-center gap-10 px-5">{w}<span className="h-3.5 w-3.5" style={{ background: RED }} /></span>
          ))}
        </div>
      </div>

      {/* TRUST GRID */}
      <section className="border-b border-[#2A272D]">
        <div className={`${WRAP} grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]`}>
          {TRUST.map((x, i) => (
            <div key={x.t} className={`flex flex-col gap-1.5 py-8 ${i > 0 ? "border-[#2A272D] lg:border-l lg:pl-6" : "lg:pr-6"}`}>
              <span className={`${MONO} text-xs font-bold`} style={{ color: RED_TEXT }}>{String(i + 1).padStart(2, "0")}</span>
              <strong className="text-[22px] font-extrabold tracking-[-0.02em]">{x.t}</strong>
              <span className="text-[15px] text-[#A39E98]">{x.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className={`${WRAP} flex flex-col gap-8 py-20 sm:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className={H2} style={h2s}>Press play.<br />Get the WAV.</h2>
          <Link href="/music" className={`${MONO} inline-flex min-h-[44px] items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#C9C4BD] hover:text-white`}>See all releases {arrow}</Link>
        </div>
        <FeaturedList items={items} />
        <Link href="/music" className="inline-flex min-h-[60px] items-center gap-3 self-center border-2 border-[#F4F1EC] px-9 text-base font-black uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">See all releases {arrow}</Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#F4F1EC] text-[#050405]">
        <div className={`${WRAP} flex flex-col gap-12 py-24 sm:py-[104px]`}>
          <h2 className={H2} style={h2s}>Search → upload<br />in three moves</h2>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] border-l-2 border-t-2 border-[#050405] p-0">
            {STEPS.map((s, i) => (
              <li key={s.n} className="flex min-h-[240px] flex-col gap-[18px] border-b-2 border-r-2 border-[#050405] p-8" style={i === 2 ? { background: RED, color: "#fff" } : undefined}>
                <span className="text-[88px] font-black leading-[0.8] tracking-[-0.06em]" style={{ fontStretch: "125%" }}>{s.n}</span>
                <strong className="text-[30px] font-black uppercase tracking-[-0.03em]" style={{ fontStretch: "115%" }}>{s.t}</strong>
                <span className={`text-[17px] ${i === 2 ? "" : "text-[#3A363E]"}`}>{s.d}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-8 border-2 border-[#050405] p-8">
            <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-2.5">
              <strong className="text-[28px] font-black uppercase tracking-[-0.025em]" style={{ fontStretch: "112%" }}>Licensing without the fine print</strong>
              <span className="max-w-[620px] text-base text-[#3A363E]">Usage depends on the label, track and platform. Every release page says exactly what&apos;s cleared, and the Content ID guide covers what to do if a claim ever appears.</span>
            </div>
            <div className="flex flex-[1_1_320px] flex-wrap">
              <Link href="/license" className="inline-flex min-h-[56px] flex-1 items-center justify-center bg-[#050405] px-[22px] text-sm font-black uppercase text-[#F4F1EC] hover:text-white">How licensing works</Link>
              <Link href="/help/attribution" className="inline-flex min-h-[56px] flex-1 items-center justify-center border-2 border-[#050405] px-[22px] text-sm font-extrabold uppercase text-[#050405] hover:bg-[#050405] hover:text-[#F4F1EC]">Attribution guide</Link>
            </div>
          </div>
        </div>
      </section>

      {/* LABELS */}
      <section className={`${WRAP} flex flex-col gap-8 py-20 sm:py-28`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className={H2} style={h2s}>Pick your<br />label</h2>
          <span className={`${MONO} text-xs font-bold uppercase tracking-[0.12em] text-[#8C8781]`}>6 labels · one licence promise</span>
        </div>
        <div className="flex flex-col border-t-2 border-[#F4F1EC]">
          {LABEL_ORDER.map(([slug], i) => {
            const l = LABEL_DEFINITIONS[slug];
            if (!l) return null;
            return (
              <Link key={slug} href={`/labels/${slug}`} className="group flex min-h-[112px] flex-wrap items-center gap-x-8 gap-y-3 border-b border-[#2A272D] px-3 py-4">
                <span className={`${MONO} w-10 flex-none text-[13px] font-bold`} style={{ color: RED_TEXT }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-[1_1_360px] text-[clamp(32px,4.4vw,64px)] font-black uppercase leading-[0.95] tracking-[-0.045em] transition-transform duration-[250ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-2.5" style={{ fontStretch: "120%" }}>{l.name}</span>
                <span className="flex-[0_1_300px] text-[15px] text-[#A39E98]">{l.tagline}</span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F4F1EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOUNDER */}
      <section className="border-y-2 border-[#F4F1EC]">
        <div className={`${WRAP} flex flex-wrap items-stretch gap-14 py-20 sm:py-[88px]`}>
          <div className="relative min-h-[320px] w-[260px] flex-none overflow-hidden border-2 border-[#F4F1EC] bg-[#141216]">
            <Image src="/asana-profile.jpeg" alt="Andrej “Asana” Srna" fill sizes="260px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col justify-between gap-8">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em] text-[#8C8781]`}>Made by a producer, for creators</span>
            <p className="m-0 text-[clamp(30px,3.4vw,48px)] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:pretty]">
              “I build creator-focused catalogs that mix drum &amp; bass, cinematic textures and gaming culture. Music I&apos;d want under my own videos.”
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="flex flex-col"><strong className="text-lg">Andrej “Asana” Srna</strong><span className="text-sm text-[#8C8781]">CEO, producer &amp; label manager</span></span>
              <Link href="/contact" className="inline-flex min-h-[48px] items-center border-2 border-[#F4F1EC] px-[22px] text-sm font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${WRAP} flex flex-wrap items-start gap-14 py-20 sm:py-28`}>
        <div className="flex flex-[1_1_360px] flex-col gap-5">
          <h2 className="m-0 text-[clamp(44px,5.5vw,80px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={h2s}>Before you<br />hit upload</h2>
          <Link href="/contact" className="inline-flex min-h-[52px] items-center self-start border-2 border-[#F4F1EC] px-6 text-sm font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Contact support</Link>
        </div>
        <FaqList items={FAQS} />
      </section>

      {/* FINAL CTA */}
      <section className="border-t-2 border-[#050405] text-white" style={{ background: RED }}>
        <div className={`${WRAP} flex flex-wrap items-end justify-between gap-12 py-20 sm:py-24`}>
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-[18px]">
            <h2 className="m-0 text-[clamp(52px,8vw,128px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2s}>Level up<br />your sound</h2>
            <p className="m-0 max-w-[500px] text-[19px] font-medium">Get new drops first. One email when fresh releases land. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterCta variant="square" idPrefix="cta" />
        </div>
      </section>
    </main>
  );
}
