"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Payload = { t: string; p: string; s?: string | null; g?: string | null; r?: string; u?: string | null };

function send(data: Payload) {
  const body = JSON.stringify(data);
  if (navigator.sendBeacon) navigator.sendBeacon("/api/a", new Blob([body], { type: "text/plain" }));
  else void fetch("/api/a", { method: "POST", body, keepalive: true });
}

const slugOf = (path: string) => (path.startsWith("/music/") ? path.split("/")[2] || null : null);

/** First-party, cookieless page views and a few interaction events. Skips /admin. */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const params = new URLSearchParams(window.location.search);
    send({ t: "pageview", p: pathname, s: slugOf(pathname), r: first.current ? document.referrer : "", u: first.current ? params.get("utm_source") : null });
    first.current = false;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track], a[href^='http']");
      if (!el) return;
      const path = window.location.pathname;
      if (path.startsWith("/admin")) return;
      if (el.dataset.track === "buy") return send({ t: "buy_click", p: path, s: el.dataset.slug || slugOf(path) });
      const href = el.getAttribute("href");
      if (!href) return;
      try {
        const host = new URL(href).hostname.replace(/^www\./, "");
        if (!/njkmusic\.com$/.test(host)) send({ t: "platform_click", p: path, s: slugOf(path), g: host });
      } catch {}
    };
    const onPlay = (e: Event) => {
      const path = window.location.pathname;
      const src = (e.target as HTMLAudioElement).currentSrc || "";
      const m = src.match(/\/api\/shop\/preview\/([a-z0-9-]+)/);
      send({ t: "preview_play", p: path, s: m ? m[1] : slugOf(path) });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("play", onPlay, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("play", onPlay, true);
    };
  }, []);

  return null;
}
