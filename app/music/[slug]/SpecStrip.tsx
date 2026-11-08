import type { MusicData } from "@/app/hooks/useMusicQuery";
import { MONO, formatReleaseDate, getTrackFacts, isRightsManaged } from "@/app/music/[slug]/track-utils";

export default function SpecStrip({ track }: { track: MusicData }) {
  const facts = getTrackFacts(track);
  const released = formatReleaseDate(track.publishedAt || track.createdAt);
  const managed = isRightsManaged(track.label?.slug);

  const cells: { label: string; value: string; mono?: boolean; big?: boolean; invert?: boolean }[] = [
    facts.duration && { label: facts.trackCount > 1 ? `Duration (${facts.trackCount} tracks)` : "Duration", value: facts.duration, big: true },
    released && { label: "Released", value: released },
    track.genre?.Genres && { label: "Genre", value: track.genre.Genres },
    facts.isrcs.length > 0 && { label: facts.isrcs.length > 1 ? "ISRC (first)" : "ISRC", value: facts.isrcs[0], mono: true },
    facts.upc && { label: "UPC", value: facts.upc, mono: true },
    { label: "Licence", value: managed ? "Licence required" : "Stream-safe", invert: true },
  ].filter(Boolean) as { label: string; value: string; mono?: boolean; big?: boolean; invert?: boolean }[];

  return (
    <section className="mx-auto max-w-[1360px] px-5 sm:px-8">
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-l border-[#2A272D]">
        {cells.map((cell) => (
          <div key={cell.label} className={`flex flex-col gap-2 border-b border-r border-[#2A272D] px-[22px] py-7 ${cell.invert ? "bg-[#F4F1EC] text-[#050405]" : ""}`}>
            <dt className={`${MONO} text-[11px] font-bold uppercase tracking-[0.12em] ${cell.invert ? "text-[#3A363E]" : "text-[#8C8781]"}`}>{cell.label}</dt>
            <dd className={`m-0 ${cell.mono ? `${MONO} text-[17px] font-bold` : cell.big ? "text-[44px] font-black leading-[0.9] tracking-[-0.04em]" : "text-[26px] font-black uppercase leading-none tracking-[-0.02em]"}`} style={cell.mono ? undefined : { fontStretch: "120%" }}>{cell.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
