import type { MusicData } from "@/app/hooks/useMusicQuery";
import { MONO, isExactLink } from "@/app/music/[slug]/track-utils";

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
    <section aria-labelledby="platforms" className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 pb-24 sm:px-8 sm:pb-28">
      <h2 id="platforms" className="m-0 text-[clamp(48px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={{ fontStretch: "125%" }}>Listen<br />everywhere</h2>
      <div className="flex flex-col border-t-2 border-[#F4F1EC]">
        {platforms.map((p, i) => (
          <a key={p.name} href={p.url as string} target="_blank" rel="noopener noreferrer" className="flex min-h-[84px] items-center justify-between gap-5 border-b border-[#2A272D] px-3 transition-colors hover:bg-[#110F12]">
            <span className="flex items-baseline gap-6">
              <span className={`${MONO} text-[13px] font-bold text-[#8C8781]`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.03em]" style={{ fontStretch: "115%" }}>{p.name}</span>
            </span>
            <span className={`flex items-center gap-3.5 text-xs font-bold uppercase tracking-[0.1em] text-[#A39E98] ${MONO}`}>
              {p.note}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
