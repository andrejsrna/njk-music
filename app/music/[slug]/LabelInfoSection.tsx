import Link from "next/link";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { PRIMARY_LABEL, getLabelDefinition } from "@/lib/site";
import { ACCENT, EYEBROW } from "@/app/music/[slug]/track-utils";

export default function LabelInfoSection({ label }: { label: MusicData["label"] }) {
  const fallback = label ?? PRIMARY_LABEL;
  const slug = fallback.slug ?? PRIMARY_LABEL.slug;
  const definition = getLabelDefinition(slug) ?? PRIMARY_LABEL;
  const name = fallback.name ?? definition.name;
  const short = fallback.short ?? definition.short ?? name;
  if (!name) return null;

  return (
    <section className="border-y border-[#1F1D21] bg-[#110F12]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-12 px-8 py-[88px] max-sm:px-5 max-sm:py-14">
        <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-[18px]">
          <span className={EYEBROW}>03 - Released under</span>
          <h2 className="m-0 text-[clamp(40px,5vw,72px)] font-black leading-[0.95] tracking-[-0.04em]" style={{ fontStretch: "118%" }}>{short}</h2>
          <p className="m-0 text-[22px] font-medium tracking-[-0.01em]">{definition.tagline}</p>
          <p className="m-0 max-w-[560px] text-base text-[#A39E98]">{definition.description}</p>
        </div>
        <Link href={`/labels/${slug}`} className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full px-[26px] text-[15px] font-bold text-white" style={{ background: ACCENT }}>
          Explore label catalog
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </Link>
      </div>
    </section>
  );
}
