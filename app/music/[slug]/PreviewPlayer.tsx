"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MONO } from "@/app/music/[slug]/track-utils";
import { useStage } from "@/app/music/[slug]/HeroStage";

const BAR_COUNT = 96;

function buildBars() {
  let seed = 7;
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const env = 0.35 + 0.65 * Math.sin(Math.PI * (i / (BAR_COUNT - 1))) * (0.75 + 0.25 * Math.sin(i / 4));
    return Math.max(10, Math.round((0.35 + 0.65 * r) * env * 100));
  });
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function PreviewPlayer({ src, label, accent }: { src: string; label: string; accent: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { playing, setPlaying } = useStage();
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const bars = useMemo(buildBars, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
      setPlaying(false);
    };
  }, [setPlaying]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    el.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
  };

  const frac = duration ? time / duration : 0;

  return (
    <div className="flex max-w-[720px] items-center gap-5 border-2 border-[#F4F1EC] bg-[#050405] py-3.5 pl-3.5 pr-5">
      <audio ref={audioRef} src={src} preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pause preview of ${label}` : `Play preview of ${label}`}
        className="flex h-16 w-16 flex-none cursor-pointer items-center justify-center border-none text-white"
        style={{ background: accent }}
      >
        {playing ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
        )}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div onClick={seek} aria-hidden="true" className="flex h-11 cursor-pointer items-center gap-[2px] overflow-hidden">
          {bars.map((h, i) => (
            <span key={i} className="min-w-px flex-1" style={{ height: `${h}%`, background: i / BAR_COUNT < frac ? accent : "#3A363E" }} />
          ))}
        </div>
        <div className={`flex justify-between text-xs font-bold text-[#A39E98] ${MONO}`}>
          <span>{fmt(time)}</span>
          <span>PREVIEW</span>
          <span>{duration ? fmt(duration) : "1:30"}</span>
        </div>
      </div>
    </div>
  );
}
