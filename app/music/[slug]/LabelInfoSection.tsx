import Link from "next/link";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { PRIMARY_LABEL, getLabelDefinition } from "@/lib/site";
import { MONO, accentFor } from "@/app/music/[slug]/track-utils";

export default function LabelInfoSection({ label }: { label: MusicData["label"] }) {
  const fallback = label ?? PRIMARY_LABEL;
  const slug = fallback.slug ?? PRIMARY_LABEL.slug;
  const definition = getLabelDefinition(slug) ?? PRIMARY_LABEL;
  const name = fallback.name ?? definition.name;
  const short = fallback.short ?? definition.short ?? name;
  if (!name) return null;
  const [accent] = accentFor(slug);

  return (
    <section className="border-y-2 border-[#050405] text-white" style={{ background: accent }}>
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-10 px-5 py-20 sm:px-8 sm:py-[88px]">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em]`}>Released under</span>
          <h2 className="m-0 text-[clamp(64px,11vw,176px)] font-black leading-[0.78] tracking-[-0.06em] [overflow-wrap:anywhere]" style={{ fontStretch: "125%" }}>{short}</h2>
          <p className="m-0 text-[22px] font-bold">{definition.tagline}</p>
          <p className="m-0 max-w-[560px] text-base">{definition.description}</p>
        </div>
        <Link href={`/labels/${slug}`} className="inline-flex min-h-[64px] items-center gap-2.5 bg-[#050405] px-[30px] text-base font-black uppercase text-white hover:text-white">
          Explore label catalog
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </section>
  );
}
