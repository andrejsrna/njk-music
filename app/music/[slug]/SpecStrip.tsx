import type { MusicData } from "@/app/hooks/useMusicQuery";
import { EYEBROW, MONO, formatReleaseDate, getTrackFacts, isRightsManaged } from "@/app/music/[slug]/track-utils";

export default function SpecStrip({ track }: { track: MusicData }) {
  const facts = getTrackFacts(track);
  const released = formatReleaseDate(track.publishedAt || track.createdAt);
  const managed = isRightsManaged(track.label?.slug);

  const cells: { label: string; value: string; mono?: boolean; dot?: string }[] = [
    facts.duration && { label: facts.trackCount > 1 ? `Duration (${facts.trackCount} tracks)` : "Duration", value: facts.duration },
    released && { label: "Released", value: released },
    track.genre?.Genres && { label: "Genre", value: track.genre.Genres },
    facts.isrcs.length > 0 && { label: facts.isrcs.length > 1 ? "ISRC (first)" : "ISRC", value: facts.isrcs[0], mono: true },
    facts.upc && { label: "UPC", value: facts.upc, mono: true },
    { label: "Licence", value: managed ? "Licence required" : "Stream-safe", dot: managed ? "#FBBF24" : "#4ADE80" },
  ].filter(Boolean) as { label: string; value: string; mono?: boolean; dot?: string }[];

  return (
    <section className="mx-auto max-w-[1280px] px-8 max-sm:px-5">
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] border-y border-[#242127]">
        {cells.map((cell, i) => (
          <div key={cell.label} className={`flex flex-col gap-1.5 py-[22px] pl-5 pr-5 ${i === 0 ? "pl-0" : "border-l border-[#242127] max-sm:border-l-0"}`}>
            <dt className={EYEBROW.replace("text-[12px]", "text-[11px]").replace("tracking-[0.12em]", "tracking-[0.1em]")}>{cell.label}</dt>
            <dd className={`m-0 flex items-center gap-2 ${cell.mono ? `pt-[3px] text-base ${MONO}` : "text-xl font-semibold"}`}>
              {cell.dot && <span className="h-2 w-2 rounded-full" style={{ background: cell.dot }} />}
              {cell.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
