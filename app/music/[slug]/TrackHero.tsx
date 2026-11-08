import Image from "next/image";
import Link from "next/link";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { PRIMARY_LABEL } from "@/lib/site";
import PreviewPlayer from "@/app/music/[slug]/PreviewPlayer";
import ShareButton from "@/app/music/[slug]/ShareButton";
import BuyButton from "@/app/music/[slug]/BuyButton";
import type { ShopProduct } from "@/lib/shop/catalog";
import HeroStage from "@/app/music/[slug]/HeroStage";
import { MONO, accentFor, formatReleaseDate, getTrackFacts, isExactLink } from "@/app/music/[slug]/track-utils";

interface TrackHeroProps {
  track: MusicData;
  coverUrl?: string | null;
  product?: ShopProduct | null;
}

export default function TrackHero({ track, coverUrl, product }: TrackHeroProps) {
  const facts = getTrackFacts(track);
  const labelName = track.label?.name ?? PRIMARY_LABEL.name;
  const labelShort = track.label?.short ?? PRIMARY_LABEL.short ?? labelName;
  const labelSlug = track.label?.slug ?? PRIMARY_LABEL.slug;
  const released = formatReleaseDate(track.publishedAt || track.createdAt);

  const streams: [string, string | null | undefined][] = [
    ["Spotify", track.Spotify],
    ["Apple Music", track.AppleMusic],
    ["YouTube Music", track.YouTubeMusic],
    ["Deezer", track.Deezer],
    ["Tidal", track.Tidal],
  ];
  const stream = streams.find(([, url]) => isExactLink(url));
  const downloads: [string, string | null | undefined][] = [
    ["Bandcamp", track.Bandcamp],
    ["Beatport", track.Beatport],
  ];
  const download = downloads.find(([, url]) => isExactLink(url));

  const previewSrc = product?.previewUrl || track.previewAudio || null;

  // "Title: Subtitle" -> big title + subtitle line
  const [mainTitle, ...rest] = track.Title.split(/:\s+/);
  const subtitle = rest.join(": ");

  const [accent, accentText] = accentFor(labelSlug);
  const words = mainTitle.split(/\s+/);
  const lines: string[] = [];
  for (let k = 0; k < words.length; ) {
    const take = lines.length === 0 ? Math.min(2, words.length - k) : Math.min(3, words.length - k);
    lines.push(words.slice(k, k + take).join(" "));
    k += take;
  }
  const last = lines.length > 1 ? lines.pop()! : "";

  const left = (
    <>
      <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
        <Link href={`/labels/${labelSlug}`} className="px-3 py-[7px] text-white hover:text-white" style={{ background: accent }}>{labelShort} Label</Link>
        {track.genre?.Genres && <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">{track.genre.Genres}</span>}
        <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{[facts.format, released].filter(Boolean).join(" · ")}</span>
      </div>
      <h1 className="m-0 text-[clamp(44px,7.4vw,124px)] font-black uppercase leading-[0.8] tracking-[-0.055em] [overflow-wrap:break-word] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={{ fontStretch: "125%" }}>
        {lines.map((l, k) => (<span key={k}>{l}<br /></span>))}
        {last && <span style={{ color: accentText }}>{last}</span>}
      </h1>
      {subtitle && (
        <p className="m-0 self-start bg-[#050405]/80 px-3.5 py-2.5 text-xl font-semibold">
          {subtitle} <span aria-hidden>—</span>{" "}
          <Link href={`/labels/${labelSlug}`} className="underline underline-offset-4">{labelName}</Link>
        </p>
      )}

      {previewSrc ? <PreviewPlayer src={previewSrc} label={track.Title} accent={accent} /> : null}

      <div className="flex flex-wrap items-stretch">
        {stream && (
          <a href={stream[1] as string} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[64px] items-center gap-2.5 border-2 border-[#F4F1EC] bg-[#F4F1EC] px-[30px] text-base font-black uppercase text-[#050405] hover:bg-white hover:text-[#050405]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>
            Stream on {stream[0]}
          </a>
        )}
        {product ? (
          <BuyButton slug={product.slug} priceCents={product.priceCents} currency={product.currency} variant="hero" />
        ) : download ? (
          <a href={download[1] as string} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[64px] items-center gap-2.5 border-2 border-[#F4F1EC] bg-[#050405]/60 px-[30px] text-base font-black uppercase text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]">
            Buy on {download[0]}
          </a>
        ) : null}
        <ShareButton title={track.Title} />
      </div>
    </>
  );

  const cover = coverUrl ? (
    <>
      <Image src={coverUrl} alt={`${track.Title} cover art`} fill priority sizes="(min-width: 1024px) 400px, 100vw" className="object-cover" />
      <span className={`absolute -bottom-0.5 -left-0.5 bg-[#F4F1EC] px-2.5 py-1.5 text-[11px] font-bold tracking-[0.1em] text-[#050405] ${MONO}`}>{labelShort} · {released?.slice(-4) ?? ""}</span>
    </>
  ) : (
    <div className={`flex h-full items-center justify-center text-xs uppercase tracking-[0.08em] text-[#8C8781] ${MONO}`}>No artwork</div>
  );

  return <HeroStage accent={accent} left={left} cover={cover} />;
}
