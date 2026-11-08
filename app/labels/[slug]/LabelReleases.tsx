"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { MONO } from "@/app/music/[slug]/track-utils";

export interface LabelRelease {
  slug: string;
  title: string;
  genre: string;
  type: string;
  cover: string;
}

export default function LabelReleases({ releases, accentText }: { releases: LabelRelease[]; accentText: string }) {
  const genres = useMemo(() => ["All", ...Array.from(new Set(releases.map((r) => r.genre).filter(Boolean))).slice(0, 5)], [releases]);
  const [filter, setFilter] = useState("All");
  const [shown, setShown] = useState(12);
  const list = releases.filter((r) => filter === "All" || r.genre === filter);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-[#F4F1EC] pb-5">
        <h2 className="m-0 text-[clamp(44px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={{ fontStretch: "125%" }}>
          Latest<br />drops
        </h2>
        {genres.length > 2 && (
          <div role="tablist" aria-label="Filter releases" className="flex flex-wrap gap-1.5">
            {genres.map((g) => {
              const sel = filter === g;
              return (
                <button
                  key={g}
                  type="button"
                  role="tab"
                  aria-selected={sel}
                  onClick={() => { setFilter(g); setShown(12); }}
                  className={`${MONO} min-h-[44px] cursor-pointer border px-4 text-xs font-bold uppercase tracking-[0.08em] ${sel ? "border-[#F4F1EC] bg-[#F4F1EC] text-[#050405]" : "border-[#3A363E] bg-transparent text-[#F4F1EC] hover:border-[#F4F1EC]"}`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-x-6 gap-y-10">
        {list.slice(0, shown).map((r, i) => (
          <Link key={r.slug} href={`/music/${r.slug}`} className="group flex flex-col gap-4">
            <span className="relative aspect-square overflow-hidden bg-[#050405]">
              <span className="absolute inset-0 border border-[#2A272D] bg-[#14121A] transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-[-1deg] group-hover:scale-[1.04]">
                {r.cover && <Image src={r.cover} alt={r.title} fill sizes="(min-width:1280px) 20vw, (min-width:640px) 33vw, 100vw" className="object-cover" />}
              </span>
              <span className={`${MONO} absolute left-3 top-3 bg-[#050405] px-[9px] py-[5px] text-[11px] font-bold uppercase tracking-[0.1em]`}>{r.type}</span>
            </span>
            <span className="flex items-baseline gap-3.5">
              <span className={`${MONO} text-[13px] font-bold text-[#8C8781] transition-colors group-hover:text-white`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[21px] font-extrabold leading-[1.1] tracking-[-0.02em]">{r.title}</span>
                {r.genre && <span className={`${MONO} text-xs uppercase tracking-[0.08em]`} style={{ color: accentText }}>{r.genre}</span>}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {list.length > shown && (
        <button
          type="button"
          onClick={() => setShown((n) => n + 12)}
          className="min-h-[60px] cursor-pointer self-center border-2 border-[#F4F1EC] bg-transparent px-9 text-base font-extrabold uppercase tracking-[0.02em] text-[#F4F1EC] hover:bg-[#F4F1EC] hover:text-[#050405]"
        >
          Show more ({list.length - shown})
        </button>
      )}
    </>
  );
}
