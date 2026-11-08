import Image from "next/image";
import Link from "next/link";

export interface RelatedTrackItem {
  slug: string;
  title: string;
  labelName: string;
  labelSlug: string;
  genre?: string | null;
  coverUrl: string;
}

export default function RelatedTracksSection({ tracks, heading = "More from the catalog" }: { tracks: RelatedTrackItem[]; heading?: string }) {
  if (!tracks.length) return null;

  return (
    <section aria-labelledby="related-tracks" className="mx-auto flex max-w-[1280px] flex-col gap-8 px-8 py-[104px] max-sm:px-5 max-sm:py-14">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="related-tracks" className="m-0 text-[40px] font-extrabold tracking-[-0.03em] max-sm:text-3xl" style={{ fontStretch: "110%" }}>{heading}</h2>
        <Link href="/music" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[#A39E98] hover:text-white">
          View full catalog
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6">
        {tracks.map((t) => (
          <Link key={t.slug} href={`/music/${t.slug}`} className="group flex flex-col gap-3.5">
            <span className="relative block aspect-square overflow-hidden rounded-md border border-[#2A272D] bg-[#17151A]">
              <Image src={t.coverUrl} alt={`${t.title} cover`} fill sizes="(min-width: 1024px) 200px, 45vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[17px] font-bold tracking-[-0.01em]">{t.title}</span>
              <span className="text-sm text-[#8C8781]">{t.genre ?? t.labelName}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
