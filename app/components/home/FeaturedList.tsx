"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ACCENT, MONO } from "@/app/music/[slug]/track-utils";

export interface FeaturedItem {
  slug: string;
  title: string;
  artist: string;
  genre: string;
  cover: string;
  streamUrl: string | null;
  streamName: string | null;
  previewUrl: string | null;
  price: string | null;
}

const BARS = 48;
function bars(seedStart: number) {
  let seed = seedStart;
  return Array.from({ length: BARS }, (_, i) => {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const env = 0.4 + 0.6 * Math.sin(Math.PI * (i / (BARS - 1)));
    return Math.max(12, Math.round((0.3 + 0.7 * r) * env * 100));
  });
}

export default function FeaturedList({ items }: { items: FeaturedItem[] }) {
  const genres = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.genre).filter(Boolean))).slice(0, 5)], [items]);
  const [filter, setFilter] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wave = useMemo(() => Object.fromEntries(items.map((t, i) => [t.slug, bars(11 + i * 7)])), [items]);
  const visible = items.filter((t) => filter === "All" || t.genre === filter).slice(0, 7);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onEnd = () => setPlaying(null);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = (t: FeaturedItem) => {
    const el = audioRef.current;
    if (!el || !t.previewUrl) return;
    if (playing === t.slug) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = t.previewUrl;
    setProgress(0);
    void el.play();
    setPlaying(t.slug);
  };

  const pill = "inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold";

  return (
    <div className="flex flex-col gap-7">
      <audio ref={audioRef} preload="none" />
      <div role="tablist" aria-label="Filter by genre" className="flex flex-wrap gap-2">
        {genres.map((g) => {
          const sel = filter === g;
          return (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setFilter(g)}
              className={`min-h-[40px] cursor-pointer rounded-full border px-4 text-sm font-semibold ${sel ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#0C0B0D]" : "border-[#2A272D] bg-transparent text-[#C9C4BD] hover:border-[#8C8781]"}`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col border-t border-[#242127]">
        {visible.map((t) => {
          const on = playing === t.slug;
          return (
            <div key={t.slug} className="flex flex-wrap items-center gap-[18px] border-b border-[#242127] py-3.5">
              {t.previewUrl ? (
                <button
                  type="button"
                  onClick={() => toggle(t)}
                  aria-label={`${on ? "Pause" : "Play"} ${t.title}`}
                  className="flex h-12 w-12 flex-none cursor-pointer items-center justify-center rounded-full border text-[#F4F1EC]"
                  style={{ background: on ? ACCENT : "transparent", borderColor: on ? ACCENT : "#3A363E" }}
                >
                  {on ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
                  )}
                </button>
              ) : (
                <Link href={`/music/${t.slug}`} aria-label={`Open ${t.title}`} className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-[#3A363E] text-[#8C8781] hover:border-[#8C8781] hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </Link>
              )}
              <span className="relative h-14 w-14 flex-none overflow-hidden rounded border border-[#2A272D] bg-[#1B191E]">
                {t.cover && <Image src={t.cover} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <Link href={`/music/${t.slug}`} className="flex min-w-0 flex-[1_1_220px] flex-col">
                <span className="truncate text-lg font-bold tracking-[-0.01em]">{t.title}</span>
                <span className="text-sm text-[#8C8781]">{t.artist}</span>
              </Link>
              <span className={`${MONO} flex-[0_0_160px] text-xs uppercase tracking-[0.06em] text-[#A39E98] max-md:hidden`}>{t.genre}</span>
              <div aria-hidden="true" className="flex h-8 flex-[1_1_200px] items-center gap-0.5 max-md:hidden">
                {wave[t.slug].map((h, i) => (
                  <span key={i} className="min-w-px flex-1 rounded-[1px]" style={{ height: `${h}%`, background: on && i / BARS < progress ? ACCENT : "#3A363E" }} />
                ))}
              </div>
              <div className="ml-auto flex min-w-[250px] flex-none justify-end gap-2 max-md:min-w-0">
                {t.streamUrl && (
                  <a href={t.streamUrl} target="_blank" rel="noopener noreferrer" className={`${pill} border border-[#3A363E] text-[#F4F1EC] hover:border-[#8C8781]`}>
                    Stream
                  </a>
                )}
                <Link href={`/music/${t.slug}`} className={`${pill} bg-[#F4F1EC] font-bold text-[#0C0B0D] hover:bg-white`}>
                  {t.price ? `Buy WAV · ${t.price}` : "Details"}
                </Link>
              </div>
            </div>
          );
        })}
        {visible.length === 0 && <p className="py-8 text-[#8C8781]">No releases in this genre yet.</p>}
      </div>
    </div>
  );
}
