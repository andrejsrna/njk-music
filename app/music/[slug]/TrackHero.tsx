import Image from "next/image";
import Link from "next/link";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { PRIMARY_LABEL } from "@/lib/site";
import PreviewPlayer from "@/app/music/[slug]/PreviewPlayer";
import ShareButton from "@/app/music/[slug]/ShareButton";
import BuyButton from "@/app/music/[slug]/BuyButton";
import type { ShopProduct } from "@/lib/shop/catalog";
import { ACCENT, MONO, formatReleaseDate, getTrackFacts, isExactLink } from "@/app/music/[slug]/track-utils";

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

  return (
    <section className="mx-auto max-w-[1280px] px-8 pb-14 pt-16 max-sm:px-5 max-sm:pt-10">
      <div className="flex flex-wrap items-end gap-16 max-lg:gap-10">
        <div className="relative aspect-square max-w-[520px] flex-[1_1_380px] overflow-hidden rounded-md border border-[#2A272D] bg-[#17151A] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
          {coverUrl ? (
            <Image src={coverUrl} alt={`${track.Title} cover art`} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
          ) : (
            <div className={`flex h-full items-center justify-center text-xs uppercase tracking-[0.08em] text-[#8C8781] ${MONO}`}>No artwork</div>
          )}
          <span className={`absolute bottom-4 left-4 rounded bg-black/55 px-2 py-1 text-[11px] tracking-[0.1em] text-[#C9C4BD] ${MONO}`}>
            {labelShort} · {released?.slice(-4) ?? ""}
          </span>
        </div>

        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
          <div className={`flex flex-wrap items-center gap-2.5 text-xs uppercase tracking-[0.1em] ${MONO}`}>
            <Link href={`/labels/${labelSlug}`} className="rounded px-2.5 py-1.5 font-medium text-white" style={{ background: ACCENT }}>
              {labelShort} Label
            </Link>
            {track.genre?.Genres && (
              <span className="rounded border border-[#2A272D] px-2.5 py-1.5 text-[#C9C4BD]">{track.genre.Genres}</span>
            )}
            <span className="text-[#8C8781]">{[facts.format, released].filter(Boolean).join(" · ")}</span>
          </div>

          <h1 className="m-0 text-[clamp(44px,6.2vw,92px)] font-extrabold leading-[0.92] tracking-[-0.035em] [text-wrap:balance]" style={{ fontStretch: "112%" }}>
            {mainTitle}
          </h1>
          {subtitle && (
            <p className="-mt-2 text-[22px] tracking-[-0.01em] text-[#A39E98]">
              {subtitle} <span aria-hidden>·</span>{" "}
              <Link href={`/labels/${labelSlug}`} className="font-semibold text-[#F4F1EC]">{labelName}</Link>
            </p>
          )}

          {previewSrc ? <PreviewPlayer src={previewSrc} label={track.Title} /> : null}

          <div className="flex flex-wrap items-start gap-3">
            {product ? (
              <BuyButton slug={product.slug} priceCents={product.priceCents} currency={product.currency} variant="hero" />
            ) : download ? (
              <a href={download[1] as string} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#F4F1EC] px-[26px] text-[15px] font-bold text-[#0C0B0D] hover:bg-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                Buy on {download[0]}
              </a>
            ) : stream ? (
              <a href={stream[1] as string} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#F4F1EC] px-[26px] text-[15px] font-bold text-[#0C0B0D] hover:bg-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" /></svg>
                Stream on {stream[0]}
              </a>
            ) : null}
            <ShareButton title={track.Title} />
          </div>
        </div>
      </div>
    </section>
  );
}
