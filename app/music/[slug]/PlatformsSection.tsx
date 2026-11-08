import type { MusicData } from "@/app/hooks/useMusicQuery";
import { EYEBROW, isExactLink } from "@/app/music/[slug]/track-utils";

export default function PlatformsSection({ track }: { track: MusicData }) {
  const all: { name: string; url?: string | null; note: string }[] = [
    { name: "Spotify", url: track.Spotify, note: "Stream" },
    { name: "Apple Music", url: track.AppleMusic, note: "Stream" },
    { name: "YouTube Music", url: track.YouTubeMusic, note: "Stream" },
    { name: "Deezer", url: track.Deezer, note: "Stream" },
    { name: "Tidal", url: track.Tidal, note: "Hi-fi stream" },
    { name: "Amazon Music", url: track.Amazon, note: "Stream / buy" },
    { name: "Pandora", url: track.Pandora, note: "Stream" },
    { name: "Bandcamp", url: track.Bandcamp, note: "Lossless download" },
    { name: "Beatport", url: track.Beatport, note: "DJ download" },
  ];
  const platforms = all.filter((p) => isExactLink(p.url));
  if (!platforms.length) return null;

  return (
    <section aria-labelledby="platforms" className="mx-auto flex max-w-[1280px] flex-col gap-7 px-8 pb-24 max-sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="platforms" className="m-0 text-[40px] font-extrabold tracking-[-0.03em] max-sm:text-3xl" style={{ fontStretch: "110%" }}>Listen everywhere</h2>
        <span className={EYEBROW}>02 - Platforms</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[92px] flex-col justify-between gap-3.5 rounded-[14px] border border-[#242127] bg-[#141216] px-[22px] py-5 transition hover:border-[#3A363E] hover:bg-[#1A181D]"
          >
            <span className="flex items-center justify-between text-[17px] font-bold">
              {p.name}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C8781" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </span>
            <span className="font-[family-name:var(--font-jetbrains)] text-[11px] uppercase tracking-[0.08em] text-[#8C8781]">{p.note}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
