"use client";

import { useEffect, useRef, useState } from "react";

/** Small play/pause button for one EP track preview. Starting one preview pauses the others. */
export default function TrackRowPreview({ src, title, accent }: { src: string; title: string; accent: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onOther = (e: Event) => e.target !== el && el.pause();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    document.addEventListener("play", onOther, true);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onPause);
    return () => {
      document.removeEventListener("play", onOther, true);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onPause);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : void ref.current?.play())}
        aria-label={`${playing ? "Pause" : "Play"} preview: ${title}`}
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 text-[#050405]"
        style={{ background: accent, borderColor: accent }}
      >
        {playing ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>
        )}
      </button>
      <audio ref={ref} src={src} preload="none" />
    </>
  );
}
