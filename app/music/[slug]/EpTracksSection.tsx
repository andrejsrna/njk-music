import BuyButton from "@/app/music/[slug]/BuyButton";
import TrackRowPreview from "@/app/music/[slug]/TrackRowPreview";
import { MONO } from "@/app/music/[slug]/track-utils";
import type { ShopProduct, TrackProduct } from "@/lib/shop/catalog";

const fmtPrice = (c: number, cur: string) => new Intl.NumberFormat("en-IE", { style: "currency", currency: cur.toUpperCase() }).format(c / 100);

/** Per-track previews and single-track purchases for an EP that is also sold as a full ZIP. */
export default function EpTracksSection({ tracks, ep, accent, accentText }: { tracks: TrackProduct[]; ep: ShopProduct | null; accent: string; accentText: string }) {
  if (!tracks.length) return null;
  const single = tracks[0];
  const sum = tracks.reduce((s, t) => s + t.priceCents, 0);
  return (
    <section id="buy-tracks" className="border-b-2 border-[#050405] bg-[#0E0C10] px-5 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
        <p className={`${MONO} m-0 text-xs font-bold uppercase tracking-[0.12em]`} style={{ color: accentText }}>Buy single tracks</p>
        <h2 className="m-0 text-3xl font-black uppercase tracking-[-0.02em] sm:text-4xl">Preview every track</h2>
        <p className="m-0 max-w-[720px] text-base leading-relaxed text-[#A39E98]">
          Each track is {fmtPrice(single.priceCents, single.currency)} as a lossless WAV
          {ep ? <>, or get all {tracks.length} in one ZIP for {fmtPrice(ep.priceCents, ep.currency)} instead of {fmtPrice(sum, single.currency)}.</> : "."} Previews are the first 90 seconds.
        </p>
        <ol className="m-0 flex list-none flex-col border-t-2 border-[#F4F1EC]/20 p-0">
          {tracks.map((t, i) => {
            const name = t.title.replace(/\s*\([^)]*\)\s*$/, "");
            return (
              <li key={t.slug} className="flex flex-wrap items-center gap-4 border-b border-[#F4F1EC]/15 py-4 sm:flex-nowrap">
                {t.previewUrl ? <TrackRowPreview src={t.previewUrl} title={name} accent={accent} /> : null}
                <span className={`${MONO} w-6 text-sm text-[#8C8781]`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1 text-lg font-extrabold">{name}</span>
                <BuyButton slug={t.slug} priceCents={t.priceCents} currency={t.currency} variant="row" itemTitle={name} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
