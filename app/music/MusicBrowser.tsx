'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MusicHeroGL from "@/app/music/MusicHeroGL";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { resolveStrapiImageUrl, slugify } from "@/lib/utils";

interface GenreFilter { label: string; count: number }
interface LabelFilter { label: string; slug: string; count: number }
interface ProductInfo { priceCents: number; currency: string; previewUrl: string | null }

interface MusicBrowserProps {
  tracks: MusicData[];
  genres: GenreFilter[];
  labels: LabelFilter[];
  products?: Record<string, ProductInfo>;
  initialQuery?: string;
}

const RED = "#C62828";
const RED_TEXT = "#FF6B5E";
const MONO = "font-[family-name:var(--font-jetbrains)]";
const PER_PAGE = 12;
const SORTS = ["Newest", "Oldest", "A–Z"] as const;
type Sort = (typeof SORTS)[number];

const LABEL_BADGE: Record<string, string> = {
  "no-copyright-gaming-music": RED,
  koldman: RED,
  "chill-music-motif": "#0E7490",
  "calm-spirit-music": "#7C3AED",
};

const ts = (t: MusicData) => new Date(t.pubDate ?? t.publishedAt ?? t.updatedAt ?? 0).getTime();
const chipCls = (sel: boolean) =>
  `inline-flex min-h-[40px] cursor-pointer items-center gap-2 border px-3.5 text-sm font-bold ${sel ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#050405]" : "border-[#3A363E] bg-transparent text-[#F4F1EC] hover:border-[#F4F1EC]"}`;

export default function MusicBrowser({ tracks, genres, labels, products = {}, initialQuery = "" }: MusicBrowserProps) {
  const [genre, setGenre] = useState("all");
  const [label, setLabel] = useState("all");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("Newest");
  const [page, setPage] = useState(1);
  const [allGenres, setAllGenres] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const labelOf = (t: MusicData) => t.label?.slug ?? (t.label?.name ? slugify(t.label.name) : "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tracks.filter((t) => {
      const g = t.genre?.Genres?.trim();
      if (genre !== "all" && g !== genre) return false;
      if (label !== "all" && labelOf(t) !== label) return false;
      if (q && ![t.Title, t.label?.name, g, t.Description].some((v) => v?.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === "A–Z") list.sort((a, b) => a.Title.localeCompare(b.Title));
    else if (sort === "Oldest") list.sort((a, b) => ts(a) - ts(b));
    else list.sort((a, b) => ts(b) - ts(a));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, genre, label, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const cur = Math.min(page, totalPages);
  const shown = filtered.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const hasFilters = genre !== "all" || label !== "all" || query.trim() !== "";
  const topGenres = [...genres].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const genreChips = allGenres ? topGenres : topGenres.slice(0, 8);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const end = () => setPlaying(null);
    el.addEventListener("ended", end);
    return () => el.removeEventListener("ended", end);
  }, []);

  const togglePlay = (slug: string, src: string) => {
    const el = audioRef.current;
    if (!el) return;
    if (playing === slug) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = src;
    void el.play();
    setPlaying(slug);
  };

  const go = (fn: () => void) => { fn(); setPage(1); };
  const changePage = (p: number) => {
    setPage(p);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const clear = () => { setQuery(""); setLabel("all"); setGenre("all"); setPage(1); };

  const pageNums: (number | "…")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - cur) <= 1) pageNums.push(p);
    else if (pageNums[pageNums.length - 1] !== "…") pageNums.push("…");
  }

  return (
    <>
      <audio ref={audioRef} preload="none" />

      {/* HERO */}
      <section className="relative flex min-h-[560px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#050405] sm:min-h-[640px]">
        <MusicHeroGL accent={RED} />
        <div className="pointer-events-none relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-end gap-7 px-5 pb-12 pt-16 sm:px-8">
          <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
            <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">Music library</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{tracks.length} releases</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{labels.length} labels</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{genres.length} genres</span>
          </div>
          <h1 className="m-0 text-[clamp(56px,12vw,192px)] font-black uppercase leading-[0.78] tracking-[-0.06em] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={{ fontStretch: "125%" }}>
            The<br /><span style={{ color: RED_TEXT }}>library</span>
          </h1>
          <form role="search" onSubmit={(e) => { e.preventDefault(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="pointer-events-auto flex max-w-[880px] flex-col gap-2.5">
            <label htmlFor="music-q" className={`${MONO} self-start bg-[#050405]/80 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#C9C4BD]`}>Search by title, genre or label</label>
            <div className="flex flex-wrap border-2 border-[#F4F1EC] bg-[#050405]">
              <div className="flex flex-[1_1_280px] items-center gap-3.5 px-5 text-[#A39E98]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input id="music-q" type="search" value={query} onChange={(e) => go(() => setQuery(e.target.value))} placeholder="frostbolt, liquid dnb, jazz…" className="min-h-[68px] min-w-0 flex-1 border-none bg-transparent text-xl font-semibold text-[#F4F1EC] outline-none placeholder:text-[#6F6A64]" />
              </div>
              <button type="submit" className="min-h-[72px] cursor-pointer border-none px-9 text-[17px] font-black uppercase text-white hover:brightness-110" style={{ background: RED }}>Search</button>
            </div>
          </form>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-[#2A272D] bg-[#0B0A0C]">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-5 py-7 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${MONO} flex-[0_0_88px] text-[11px] font-bold uppercase tracking-[0.12em] text-[#8C8781]`}>Label</span>
            <button type="button" aria-pressed={label === "all"} onClick={() => go(() => setLabel("all"))} className={chipCls(label === "all")}>All labels<span className={`${MONO} text-[11px] opacity-70`}>{tracks.length}</span></button>
            {[...labels].sort((a, b) => b.count - a.count).map((l) => (
              <button key={l.slug} type="button" aria-pressed={label === l.slug} onClick={() => go(() => setLabel(l.slug))} className={chipCls(label === l.slug)}>{l.label}<span className={`${MONO} text-[11px] opacity-70`}>{l.count}</span></button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`${MONO} flex-[0_0_88px] text-[11px] font-bold uppercase tracking-[0.12em] text-[#8C8781]`}>Genre</span>
            <button type="button" aria-pressed={genre === "all"} onClick={() => go(() => setGenre("all"))} className={chipCls(genre === "all")}>All genres<span className={`${MONO} text-[11px] opacity-70`}>{tracks.length}</span></button>
            {genreChips.map((g) => (
              <button key={g.label} type="button" aria-pressed={genre === g.label} onClick={() => go(() => setGenre(g.label))} className={chipCls(genre === g.label)}>{g.label}<span className={`${MONO} text-[11px] opacity-70`}>{g.count}</span></button>
            ))}
            {topGenres.length > 8 && (
              <button type="button" onClick={() => setAllGenres((v) => !v)} className={`${MONO} min-h-[40px] cursor-pointer border border-dashed border-[#8C8781] bg-transparent px-3.5 text-xs font-bold uppercase tracking-[0.06em] text-[#C9C4BD]`}>{allGenres ? "− Fewer" : `+ ${topGenres.length - 8} more`}</button>
            )}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section ref={resultsRef} className="mx-auto flex w-full max-w-[1360px] scroll-mt-4 flex-col gap-8 px-5 pb-24 pt-12 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#F4F1EC] pb-[18px]">
          <div className="flex flex-wrap items-baseline gap-3.5">
            <span className="text-[44px] font-black leading-[0.9] tracking-[-0.04em]" style={{ fontStretch: "125%" }}>{filtered.length}</span>
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.1em] text-[#A39E98]`}>{hasFilters ? "matching releases" : "releases"}</span>
            {hasFilters && (
              <button type="button" onClick={clear} className={`${MONO} min-h-[36px] cursor-pointer border border-[#F4F1EC] bg-transparent px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#F4F1EC]`}>Clear filters ✕</button>
            )}
          </div>
          <div className="flex" role="group" aria-label="Sort">
            {SORTS.map((s, i) => (
              <button key={s} type="button" aria-pressed={sort === s} onClick={() => go(() => setSort(s))} className={`${MONO} min-h-[44px] cursor-pointer border border-[#F4F1EC] px-4 text-xs font-bold uppercase tracking-[0.08em] ${i > 0 ? "-ml-px" : ""} ${sort === s ? "bg-[#F4F1EC] text-[#050405]" : "bg-transparent text-[#F4F1EC]"}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-start gap-4 border-2 border-dashed border-[#3A363E] p-8 sm:p-14">
            <span className="text-[40px] font-black uppercase leading-[0.9] tracking-[-0.04em]" style={{ fontStretch: "120%" }}>No match</span>
            <span className="text-[17px] text-[#A39E98]">Try another genre or clear the filters, or ask us for a track that fits your project.</span>
            <div className="flex flex-wrap">
              <button type="button" onClick={clear} className="min-h-[52px] cursor-pointer border-2 border-[#F4F1EC] bg-[#F4F1EC] px-[22px] text-sm font-black uppercase text-[#050405]">Clear filters</button>
              <Link href="/contact" className="inline-flex min-h-[52px] items-center border-2 border-[#F4F1EC] px-[22px] text-sm font-extrabold uppercase">Request a track</Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-x-[22px] gap-y-11">
          {shown.map((t) => {
            const cover = resolveStrapiImageUrl(t.Cover);
            const ls = labelOf(t);
            const prod = products[t.slug];
            const on = playing === t.slug;
            const badge = LABEL_BADGE[ls] ?? "#F4F1EC";
            const light = badge === "#F4F1EC";
            const price = prod ? new Intl.NumberFormat("en-IE", { style: "currency", currency: prod.currency.toUpperCase() }).format(prod.priceCents / 100) : null;
            return (
              <article key={t.documentId ?? t.slug} className="group flex flex-col gap-3.5">
                <div className="relative aspect-square overflow-hidden border border-[#2A272D] bg-[#050405]">
                  <Link href={`/music/${t.slug}`} aria-label={t.Title} className="absolute inset-0 block transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-1 group-hover:scale-[1.04]">
                    {cover && <Image src={cover} alt={`${t.Title} cover`} fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover" />}
                  </Link>
                  {t.label?.name && (
                    <Link href={`/labels/${ls}`} className={`${MONO} absolute left-2.5 top-2.5 px-[9px] py-[5px] text-[11px] font-bold tracking-[0.1em] ${light ? "text-[#050405]" : "text-white"} hover:text-inherit`} style={{ background: badge }}>{t.label.short ?? t.label.name}</Link>
                  )}
                  {prod?.previewUrl && (
                    <button type="button" onClick={() => togglePlay(t.slug, prod.previewUrl as string)} aria-label={`${on ? "Pause" : "Play"} preview of ${t.Title}`} className="absolute bottom-3 right-3 flex h-14 w-14 cursor-pointer items-center justify-center border-none text-white transition-all duration-200 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100" style={{ background: RED, ...(on ? { opacity: 1, transform: "none" } : null) }}>
                      {on ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Link href={`/music/${t.slug}`} className="text-[21px] font-extrabold leading-[1.1] tracking-[-0.02em]">{t.Title}</Link>
                  {t.genre?.Genres && <span className={`${MONO} text-xs uppercase tracking-[0.08em]`} style={{ color: RED_TEXT }}>{t.genre.Genres}</span>}
                </div>
                <div className="flex">
                  <Link href={`/music/${t.slug}`} className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-[#F4F1EC] text-xs font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Listen</Link>
                  <Link href={`/music/${t.slug}`} className="-ml-px inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 border border-[#F4F1EC] bg-[#F4F1EC] text-xs font-black uppercase text-[#050405] hover:bg-white hover:text-[#050405]">{price ? `Buy WAV · ${price}` : "Get it"}</Link>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length > PER_PAGE && (
          <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-[#F4F1EC] pt-6">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.1em] text-[#A39E98]`}>Showing {(cur - 1) * PER_PAGE + 1}–{Math.min(cur * PER_PAGE, filtered.length)} of {filtered.length} releases</span>
            <div className="flex">
              <button type="button" disabled={cur === 1} onClick={() => changePage(cur - 1)} className={`${MONO} min-h-[52px] cursor-pointer border border-[#3A363E] bg-transparent px-[18px] text-[13px] font-bold text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:text-[#6F6A64] disabled:hover:bg-transparent disabled:hover:text-[#6F6A64]`}>← Prev</button>
              {pageNums.map((p, i) => p === "…" ? (
                <span key={`e${i}`} className={`${MONO} -ml-px inline-flex min-h-[52px] min-w-[52px] items-center justify-center border border-[#3A363E] text-sm font-bold`}>…</span>
              ) : (
                <button key={p} type="button" aria-current={p === cur ? "page" : undefined} onClick={() => changePage(p)} className={`${MONO} -ml-px min-h-[52px] min-w-[52px] cursor-pointer border text-sm font-bold ${p === cur ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#050405]" : "border-[#3A363E] bg-transparent text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]"}`}>{p}</button>
              ))}
              <button type="button" disabled={cur === totalPages} onClick={() => changePage(cur + 1)} className={`${MONO} -ml-px min-h-[52px] cursor-pointer border border-[#F4F1EC] bg-transparent px-[18px] text-[13px] font-bold text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:border-[#3A363E] disabled:text-[#6F6A64] disabled:hover:bg-transparent disabled:hover:text-[#6F6A64]`}>Next →</button>
            </div>
          </nav>
        )}
      </section>
    </>
  );
}
