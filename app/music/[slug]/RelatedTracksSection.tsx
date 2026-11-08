import Image from "next/image";
import Link from "next/link";
import { MONO } from "@/app/music/[slug]/track-utils";

export interface RelatedTrackItem {
  slug: string;
  title: string;
  labelName: string;
  labelSlug: string;
  genre?: string | null;
  coverUrl: string;
}

export default function RelatedTracksSection({ tracks, accentText = "#FF6B5E", heading = "Next quest" }: { tracks: RelatedTrackItem[]; accentText?: string; heading?: string }) {
  if (!tracks.length) return null;
  const [first, ...rest] = heading.split(" ");

  return (
    <section aria-labelledby="related-tracks" className="mx-auto flex max-w-[1360px] flex-col gap-9 px-5 py-24 sm:px-8 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b-2 border-[#F4F1EC] pb-5">
        <h2 id="related-tracks" className="m-0 text-[clamp(48px,7vw,104px)] font-black uppercase leading-[0.85] tracking-[-0.05em]" style={{ fontStretch: "125%" }}>{first}<br />{rest.join(" ")}</h2>
        <Link href="/music" className="inline-flex min-h-[48px] items-center gap-2.5 border-2 border-[#F4F1EC] px-[22px] text-sm font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">
          Full catalog
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-5 gap-y-9">
        {tracks.map((t) => (
          <Link key={t.slug} href={`/music/${t.slug}`} className="group flex flex-col gap-3.5">
            <span className="relative block aspect-square overflow-hidden bg-[#050405]">
              <Image src={t.coverUrl} alt={`${t.title} cover`} fill sizes="(min-width: 1024px) 200px, 45vw" className="border border-[#2A272D] object-cover transition duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-1 group-hover:scale-[1.04]" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-xl font-extrabold leading-[1.1] tracking-[-0.02em]">{t.title}</span>
              <span className={`${MONO} text-xs uppercase tracking-[0.08em]`} style={{ color: accentText }}>{t.genre ?? t.labelName}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
