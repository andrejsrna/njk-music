import Link from "next/link";
import Image from "next/image";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { getShopProducts } from "@/lib/shop/catalog";
import { LABEL_DEFINITIONS } from "@/lib/site";
import { resolveStrapiImageUrl } from "@/lib/utils";
import { ACCENT, MONO, isExactLink } from "@/app/music/[slug]/track-utils";
import FeaturedList, { type FeaturedItem } from "@/app/components/home/FeaturedList";
import FaqList from "@/app/components/home/FaqList";
import NewsletterCta from "@/app/components/home/NewsletterCta";

export const revalidate = 60;

const H2 = "m-0 text-[44px] font-extrabold leading-none tracking-[-0.03em] max-sm:text-[34px]";
const EYEBROW = `${MONO} text-xs uppercase tracking-[0.12em] text-[#8C8781]`;
const WRAP = "mx-auto w-full max-w-[1280px] px-5 sm:px-8";
const chip = "inline-flex min-h-[36px] items-center rounded-full border border-[#2A272D] bg-[#17151A] px-3.5 text-sm hover:border-[#8C8781]";
const arrow = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
);

const TRUST = [
  { t: "Monetisation guidance", d: "Twitch, YouTube, TikTok", icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></> },
  { t: "Lossless WAV", d: "Instant download after purchase", icon: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /> },
  { t: "6 labels, one catalog", d: "Gaming, chill, cinematic, DnB", icon: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></> },
  { t: "New releases regularly", d: "Follow the labels for fresh drops", icon: <><path d="M12 8v4l3 2" /><circle cx="12" cy="12" r="9" /></> },
];

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

  return (
    <main className="bg-[#0C0B0D] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      {/* HERO */}
      <section className={`${WRAP} flex flex-col gap-9 pb-16 pt-16 sm:pt-[88px]`}>
        <span className={`${MONO} inline-flex items-center gap-2.5 self-start rounded-full border border-[#2A272D] px-3.5 py-2 text-xs uppercase tracking-[0.08em] text-[#C9C4BD]`}>
          <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />Creator-safe music for streams, edits &amp; drops
        </span>
        <h1 className="m-0 max-w-[1100px] text-[clamp(44px,8vw,124px)] font-extrabold leading-[0.9] tracking-[-0.045em] [text-wrap:balance]" style={{ fontStretch: "114%" }}>
          Music you can monetise. No claims.
        </h1>
        <p className="m-0 max-w-[640px] text-[19px] leading-[1.45] text-[#A39E98] sm:text-[21px]">
          High-energy releases built for gaming culture and creator workflows — clear usage guidance for Twitch, YouTube and TikTok, with lossless WAV downloads.
        </p>
        <form role="search" action="/music" method="get" className="flex max-w-[760px] flex-col gap-3.5">
          <label htmlFor="hero-q" className={`${MONO} text-[11px] uppercase tracking-[0.1em] text-[#8C8781]`}>Find a track for your next video</label>
          <div className="flex flex-wrap gap-2.5 rounded-2xl border border-[#2A272D] bg-[#141216] p-2">
            <div className="flex flex-[1_1_280px] items-center gap-3 px-3 text-[#8C8781]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input id="hero-q" name="q" type="search" placeholder="Try “boss fight”, “phonk”, “lofi study”…" className="min-h-[52px] min-w-0 flex-1 border-none bg-transparent text-[17px] text-[#F4F1EC] outline-none placeholder:text-[#8C8781]" />
            </div>
            <button type="submit" className="min-h-[56px] cursor-pointer rounded-[10px] border-none px-7 text-base font-bold text-white hover:brightness-110" style={{ background: ACCENT }}>Search music</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-[#8C8781]">Popular:</span>
            {["Gaming edits", "Stream background", "Drum & Bass", "Cinematic", "Chill"].map((q) => (
              <Link key={q} href={`/music?q=${encodeURIComponent(q)}`} className={chip}>{q}</Link>
            ))}
          </div>
        </form>
      </section>

      {/* TRUST */}
      <section className="border-y border-[#1F1D21]">
        <div className={`${WRAP} grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]`}>
          {TRUST.map((x, i) => (
            <div key={x.t} className={`flex items-start gap-3.5 py-[26px] ${i > 0 ? "border-[#1F1D21] pl-5 lg:border-l" : "pr-5"}`}>
              <svg className="mt-0.5 flex-none" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F4F1EC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{x.icon}</svg>
              <span className="flex flex-col"><strong className="text-base">{x.t}</strong><span className="text-sm text-[#8C8781]">{x.d}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className={`${WRAP} flex flex-col gap-7 py-16 sm:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className={EYEBROW}>Fresh drops</span>
            <h2 className={H2} style={{ fontStretch: "110%" }}>Press play. Get the WAV in one click.</h2>
          </div>
          <Link href="/music" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[#C9C4BD] hover:text-white">See all releases {arrow}</Link>
        </div>
        <FeaturedList items={items} />
      </section>

      {/* HOW IT WORKS */}
      <section className={`${WRAP} flex flex-col gap-8 pb-24 sm:pb-[104px]`}>
        <h2 className={H2} style={{ fontStretch: "110%" }}>From search to upload in three steps</h2>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4 p-0">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3.5 rounded-[18px] border border-[#242127] bg-[#141216] p-8">
              <span className={`${MONO} text-[13px] text-[#FF8A80]`}>{s.n}</span>
              <strong className="text-2xl font-extrabold tracking-[-0.02em]">{s.t}</strong>
              <span className="text-base text-[#A39E98]">{s.d}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* LICENSING */}
      <section className={`${WRAP} pb-24 sm:pb-[104px]`}>
        <div className="flex flex-wrap items-center gap-12 rounded-3xl bg-[#F4F1EC] p-8 text-[#141216] sm:p-14">
          <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-[18px]">
            <span className={`${MONO} text-xs uppercase tracking-[0.12em] text-[#5C5752]`}>Licensing, without the fine print</span>
            <h2 className="m-0 text-[clamp(36px,4.4vw,56px)] font-extrabold leading-[0.98] tracking-[-0.035em]" style={{ fontStretch: "112%" }}>Publish today. Keep 100% of your revenue.</h2>
            <p className="m-0 max-w-[560px] text-[17px] text-[#4A4641]">Usage depends on the label, track and platform — every release page tells you exactly what&apos;s cleared, and our Content ID guide covers what to do if a claim ever appears.</p>
          </div>
          <div className="flex flex-[1_1_340px] flex-col gap-3">
            {[
              ["How licensing works", "/license", true],
              ["Monetisation guidelines", "/help/monetization", false],
              ["Attribution templates", "/help/attribution", false],
            ].map(([label, href, primary]) => (
              <Link key={href as string} href={href as string} className={`flex min-h-[56px] items-center justify-between rounded-[14px] px-[22px] text-base ${primary ? "bg-[#141216] font-bold text-[#F4F1EC] hover:text-white" : "border border-[#C9C4BD] font-semibold text-[#141216] hover:text-[#141216] hover:border-[#141216]"}`}>
                {label as string}{arrow}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LABELS */}
      <section className={`${WRAP} flex flex-col gap-7 pb-24 sm:pb-[104px]`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className={EYEBROW}>Pick your sound</span>
            <h2 className={H2} style={{ fontStretch: "110%" }}>Six labels. One licence promise.</h2>
          </div>
          <Link href="/labels/no-copyright-gaming-music" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[#C9C4BD] hover:text-white">Browse labels {arrow}</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {LABEL_ORDER.map(([slug, tag, bg]) => {
            const l = LABEL_DEFINITIONS[slug];
            if (!l) return null;
            return (
              <Link key={slug} href={`/labels/${slug}`} className="flex min-h-[200px] flex-col justify-between gap-6 rounded-[18px] border border-[#2A272D] p-7 hover:border-[#8C8781]" style={{ background: bg }}>
                <span className="flex items-start justify-between gap-3">
                  <span className={`${MONO} text-xs uppercase tracking-[0.1em] text-[#C9C4BD]`}>{tag}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9C4BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-[26px] font-extrabold leading-[1.05] tracking-[-0.025em]" style={{ fontStretch: "108%" }}>{l.name}</span>
                  <span className="text-[15px] text-[#C9C4BD]">{l.tagline}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOUNDER */}
      <section className="border-y border-[#1F1D21] bg-[#110F12]">
        <div className={`${WRAP} flex flex-wrap items-center gap-14 py-16 sm:py-[88px]`}>
          <div className="relative aspect-[4/5] w-[240px] flex-none overflow-hidden rounded-[18px] border border-[#2A272D] bg-[#1B191E]">
            <Image src="/asana-profile.jpeg" alt="Andrej “Asana” Srna" fill sizes="240px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
            <span className={EYEBROW}>Made by a producer, for creators</span>
            <p className="m-0 text-[26px] font-medium leading-[1.25] tracking-[-0.02em] [text-wrap:pretty] sm:text-[30px]">
              “I build creator-focused catalogs that mix drum &amp; bass, cinematic textures and gaming culture — music I&apos;d want under my own videos.”
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <span className="flex flex-col"><strong className="text-[17px]">Andrej “Asana” Srna</strong><span className="text-sm text-[#8C8781]">CEO, producer &amp; label manager</span></span>
              <Link href="/contact" className="inline-flex min-h-[44px] items-center rounded-full border border-[#3A363E] px-5 text-sm font-semibold hover:border-[#8C8781]">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${WRAP} flex flex-wrap items-start gap-14 py-20 sm:py-[104px]`}>
        <div className="flex flex-[1_1_320px] flex-col gap-4">
          <h2 className={H2} style={{ fontStretch: "110%" }}>Questions before you hit upload</h2>
          <p className="m-0 text-base text-[#A39E98]">Still unsure? Our team answers licensing questions directly.</p>
          <Link href="/contact" className="inline-flex min-h-[48px] items-center self-start rounded-full border border-[#3A363E] px-[22px] text-[15px] font-semibold hover:border-[#8C8781]">Contact support</Link>
        </div>
        <FaqList items={FAQS} />
      </section>

      {/* FINAL CTA */}
      <section className={`${WRAP} pb-24 sm:pb-[104px]`}>
        <div className="flex flex-wrap items-center justify-between gap-12 rounded-3xl p-8 text-white sm:px-14 sm:py-16" style={{ background: ACCENT }}>
          <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(40px,5vw,68px)] font-black leading-[0.95] tracking-[-0.04em]" style={{ fontStretch: "116%" }}>Ready to level up your sound?</h2>
            <p className="m-0 max-w-[520px] text-lg">Get new drops first — one email when fresh releases land. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterCta />
        </div>
      </section>
    </main>
  );
}
