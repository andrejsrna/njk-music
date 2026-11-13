import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { LABEL_LIST } from "@/lib/site";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import NewsletterCta from "@/app/components/home/NewsletterCta";

export const metadata: Metadata = {
  title: "About NJK Music | Creator-Ready Label Moods & Licensing",
  description:
    "Meet NJK Music — a multi-label music brand releasing across genres for listeners worldwide, with clear licensing and hands-on support.",
};

const MONO = "font-[family-name:var(--font-jetbrains)]";
const RED = "#C62828";
const RED_TEXT = "#FF6B5E";
const WRAP = "mx-auto w-full max-w-[1360px] px-5 sm:px-8";
const h2 = { fontStretch: "125%" } as const;
const H2 = "m-0 text-[clamp(48px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]";

const pillars = [
  { t: "Creator-first music", d: "Label moods designed to fit real projects, from content and campaigns to studios and live experiences." },
  { t: "Built for listeners", d: "We also release for everyday listeners on streaming platforms, with label identities that fans can follow." },
  { t: "Trusted licensing", d: "Clear usage rights help teams move fast, whether you publish content, run a campaign or ship a product." },
];

const timeline = [
  { year: "2018", title: "NJK Music launches", description: "The first catalogues release under No Copyright Gaming Music with a mission to keep gamers monetised." },
  { year: "2021", title: "Global distribution", description: "Streaming partnerships and DSP distribution open the catalogues to listeners worldwide." },
  { year: "2024", title: "Label expansion", description: "Creator feedback informs new ambient and jazz-driven labels for a wider set of storytelling moments." },
  { year: "Today", title: "Rights-managed innovation", description: "We serve both rights-managed and stream-safe releases, giving partners flexibility for premium projects." },
];

const values = [
  { t: "Curate with care", d: "Every release is checked for quality, clean metadata and clear usage info." },
  { t: "Support every project", d: "Fast answers on licensing plus help with assets when you need something bespoke." },
  { t: "Protect the catalogue", d: "Clear agreements and systems that protect artists, partners and releases." },
];

export default async function AboutPage() {
  const releases = await getMusicData();

  const stats = [
    { v: String(releases.length), l: "Releases in the catalogue" },
    { v: String(LABEL_LIST.length), l: "Labels, each with its own mood" },
    { v: "2018", l: "Releasing since" },
    { v: "WAV", l: "Lossless downloads in the shop" },
  ];

  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      {/* HERO */}
      <section className="relative flex min-h-[600px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] sm:min-h-[700px]">
        <LabelHeroGL accent={RED} />
        <div className={`${WRAP} pointer-events-none relative z-[2] flex flex-1 flex-col justify-end gap-7 pb-12 pt-16`}>
          <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
            <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">About NJK Music</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">Bratislava · since 2018</span>
          </div>
          <h1 className="m-0 text-[clamp(52px,10.5vw,170px)] font-black uppercase leading-[0.8] tracking-[-0.055em] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={h2}>
            Many labels.<br /><span style={{ color: RED_TEXT }}>One promise.</span>
          </h1>
          <p className="m-0 max-w-[640px] self-start bg-[#050405]/80 px-3.5 py-3 text-lg font-semibold sm:text-xl">
            NJK Music curates label moods across genres for creators, studios, agencies and brands. Stream-safe and rights-managed releases, with no guesswork about usage.
          </p>
          <div className="pointer-events-auto flex flex-wrap">
            <Link href="/music" className="inline-flex min-h-[60px] items-center border-2 border-[#F4F1EC] bg-[#F4F1EC] px-8 text-base font-black uppercase text-[#050405] hover:bg-white hover:text-[#050405]">Explore releases</Link>
            <Link href="/contact" className="inline-flex min-h-[60px] items-center border-2 border-[#F4F1EC] bg-[#050405]/60 px-8 text-base font-black uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Connect with us</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-[#2A272D]">
        <dl className={`${WRAP} m-0 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] border-l border-[#2A272D]`}>
          {stats.map((s) => (
            <div key={s.l} className="flex flex-col gap-2 border-r border-[#2A272D] px-6 py-9">
              <dd className="m-0 text-[clamp(48px,5vw,72px)] font-black leading-[0.9] tracking-[-0.05em]" style={h2}>{s.v}</dd>
              <dt className={`${MONO} text-[11px] font-bold uppercase tracking-[0.12em] text-[#8C8781]`}>{s.l}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* PILLARS */}
      <section className="bg-[#F4F1EC] text-[#050405]">
        <div className={`${WRAP} flex flex-col gap-12 py-24 sm:py-28`}>
          <h2 className={H2} style={h2}>What we<br />do</h2>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(280px,1fr))] border-l-2 border-t-2 border-[#050405] p-0">
            {pillars.map((p, i) => (
              <li key={p.t} className="flex min-h-[260px] flex-col gap-4 border-b-2 border-r-2 border-[#050405] p-8" style={i === 2 ? { background: RED, color: "#fff" } : undefined}>
                <span className={`${MONO} text-xs font-bold`}>{String(i + 1).padStart(2, "0")}</span>
                <strong className="text-[clamp(26px,2.4vw,34px)] font-black uppercase leading-[0.95] tracking-[-0.03em]" style={{ fontStretch: "115%" }}>{p.t}</strong>
                <span className={`text-[17px] ${i === 2 ? "" : "text-[#3A363E]"}`}>{p.d}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STORY */}
      <section className={`${WRAP} flex flex-wrap items-start gap-14 py-24 sm:py-28`}>
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6 lg:sticky lg:top-24">
          <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em]`} style={{ color: RED_TEXT }}>01 — Our story</span>
          <h2 className="m-0 text-[clamp(36px,4vw,60px)] font-black uppercase leading-[0.9] [overflow-wrap:anywhere] tracking-[-0.05em]" style={h2}>Built in Bratislava, broadcasting worldwide</h2>
          <p className="m-0 max-w-[560px] text-lg text-[#A39E98]">
            NJK Music began in 2018 and grew into a multi-label studio releasing across different moods and genres. We work with producers and partners worldwide, with a focus on quality, consistency and clear usage.
          </p>
          <p className="m-0 max-w-[560px] text-lg text-[#A39E98]">
            We ship releases to streaming platforms, support licensing requests and help teams get the right music quickly.
          </p>
        </div>
        <ol className="m-0 flex min-w-0 flex-[1_1_480px] list-none flex-col border-t-2 border-[#F4F1EC] p-0">
          {timeline.map((e) => (
            <li key={e.year} className="flex flex-wrap gap-x-10 gap-y-2 border-b border-[#2A272D] py-8">
              <span className="w-[140px] flex-none text-[44px] font-black leading-[0.9] tracking-[-0.04em]" style={{ ...h2, color: e.year === "Today" ? RED_TEXT : undefined }}>{e.year}</span>
              <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2">
                <strong className="text-2xl font-extrabold tracking-[-0.02em]">{e.title}</strong>
                <span className="text-base text-[#A39E98]">{e.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* LABELS */}
      <section className="border-y-2 border-[#050405] text-white" style={{ background: RED }}>
        <div className={`${WRAP} flex flex-wrap items-end justify-between gap-10 py-20 sm:py-24`}>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em]`}>The roster</span>
            <h2 className="m-0 text-[clamp(56px,9vw,144px)] font-black uppercase leading-[0.8] tracking-[-0.06em]" style={h2}>{LABEL_LIST.length} labels</h2>
            <p className="m-0 max-w-[520px] text-lg">Each label is its own mood. Pick one and the whole catalogue fits your channel.</p>
          </div>
          <Link href="/labels" className="inline-flex min-h-[64px] items-center bg-[#050405] px-[30px] text-base font-black uppercase text-white hover:text-white">Meet the labels</Link>
        </div>
      </section>

      {/* VALUES + FOUNDER */}
      <section className={`${WRAP} flex flex-col gap-14 py-24 sm:py-28`}>
        <h2 className={H2} style={h2}>What guides<br />us</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] border-t-2 border-[#F4F1EC]">
          {values.map((v, i) => (
            <div key={v.t} className={`flex flex-col gap-3 border-b border-[#2A272D] py-9 ${i > 0 ? "lg:border-l lg:pl-8" : "lg:pr-8"}`}>
              <span className={`${MONO} text-xs font-bold`} style={{ color: RED_TEXT }}>{String(i + 1).padStart(2, "0")}</span>
              <strong className="text-[26px] font-extrabold tracking-[-0.02em]">{v.t}</strong>
              <span className="text-base text-[#A39E98]">{v.d}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-stretch gap-14 border-y-2 border-[#F4F1EC] py-16">
          <div className="relative min-h-[320px] w-[260px] flex-none overflow-hidden border-2 border-[#F4F1EC] bg-[#141216]">
            <Image src="/asana-profile.jpeg" alt="Andrej “Asana” Srna" fill sizes="260px" className="object-cover" />
          </div>
          <div className="flex min-w-0 flex-[999_1_480px] flex-col justify-between gap-8">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em] text-[#8C8781]`}>Made by a producer, for creators</span>
            <p className="m-0 text-[clamp(28px,3.2vw,46px)] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:pretty]">
              “I build creator-focused catalogs that mix drum &amp; bass, cinematic textures and gaming culture. Music I&apos;d want under my own videos.”
            </p>
            <span className="flex flex-col"><strong className="text-lg">Andrej “Asana” Srna</strong><span className="text-sm text-[#8C8781]">CEO, producer &amp; label manager</span></span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-[#050405] text-white" style={{ background: RED }}>
        <div className={`${WRAP} flex flex-wrap items-end justify-between gap-12 py-20 sm:py-24`}>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(48px,7vw,112px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2}>Let&apos;s score<br />your story</h2>
            <p className="m-0 max-w-[520px] text-lg">Producing content, building a product or planning a campaign? We help you find the right label match and licensing path. Bespoke assets and custom briefs on request.</p>
            <div className="flex flex-wrap pt-2">
              <Link href="/contact" className="inline-flex min-h-[60px] items-center bg-[#050405] px-8 text-base font-black uppercase text-white hover:text-white">Contact team</Link>
              <Link href="/license" className="inline-flex min-h-[60px] items-center border-2 border-[#050405] px-8 text-base font-black uppercase text-white hover:bg-[#050405] hover:text-white">Licensing</Link>
            </div>
          </div>
          <NewsletterCta variant="square" idPrefix="about" cta="Subscribe" />
        </div>
      </section>
    </div>
  );
}
