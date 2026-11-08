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

  const pill = "inline-flex min-h-[48px] items-center gap-2 border-2 border-[#F4F1EC] px-[18px] text-[13px] font-extrabold uppercase";

  return (
    <div className="flex flex-col gap-0">
      <audio ref={audioRef} preload="none" />
      <div role="tablist" aria-label="Filter by genre" className="mb-6 flex flex-wrap gap-1.5">
        {genres.map((g) => {
          const sel = filter === g;
          return (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={sel}
              onClick={() => setFilter(g)}
              className={`${MONO} min-h-[44px] cursor-pointer border px-4 text-xs font-bold uppercase tracking-[0.08em] ${sel ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#050405]" : "border-[#3A363E] bg-transparent text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]"}`}
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col border-t-2 border-[#F4F1EC]">
        {visible.map((t, idx) => {
          const on = playing === t.slug;
          return (
            <div key={t.slug} className="flex flex-wrap items-center gap-5 border-b border-[#2A272D] px-3 py-4 transition-colors hover:bg-[#110F12]">
              <span className={`${MONO} w-7 flex-none text-[13px] font-bold text-[#8C8781] max-sm:hidden`}>{String(idx + 1).padStart(2, "0")}</span>
              {t.previewUrl ? (
                <button
                  type="button"
                  onClick={() => toggle(t)}
                  aria-label={`${on ? "Pause" : "Play"} ${t.title}`}
                  className="flex h-[52px] w-[52px] flex-none cursor-pointer items-center justify-center border-2 text-[#F4F1EC]"
                  style={{ background: on ? ACCENT : "transparent", borderColor: on ? ACCENT : "#F4F1EC" }}
                >
                  {on ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
                  )}
                </button>
              ) : (
                <Link href={`/music/${t.slug}`} aria-label={`Open ${t.title}`} className="flex h-[52px] w-[52px] flex-none items-center justify-center border-2 border-[#3A363E] text-[#8C8781] hover:border-[#F4F1EC] hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </Link>
              )}
              <span className="relative h-[60px] w-[60px] flex-none overflow-hidden border border-[#2A272D] bg-[#1B191E]">
                {t.cover && <Image src={t.cover} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <Link href={`/music/${t.slug}`} className="flex min-w-0 flex-[1_1_220px] flex-col">
                <span className="truncate text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</span>
                <span className={`${MONO} text-xs uppercase tracking-[0.08em]`} style={{ color: "#FF6B5E" }}>{t.genre || t.artist}</span>
              </Link>
              <div aria-hidden="true" className="flex h-8 flex-[1_1_200px] items-center gap-0.5 max-md:hidden">
                {wave[t.slug].map((h, i) => (
                  <span key={i} className="min-w-px flex-1 rounded-[1px]" style={{ height: `${h}%`, background: on && i / BARS < progress ? ACCENT : "#3A363E" }} />
                ))}
              </div>
              <div className="ml-auto flex min-w-[250px] flex-none justify-end max-md:min-w-0">
                {t.streamUrl && (
                  <a href={t.streamUrl} target="_blank" rel="noopener noreferrer" className={`${pill} text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]`}>
                    Stream
                  </a>
                )}
                <Link href={`/music/${t.slug}`} className={`${pill} bg-[#F4F1EC] font-black text-[#050405] hover:bg-white`}>
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
