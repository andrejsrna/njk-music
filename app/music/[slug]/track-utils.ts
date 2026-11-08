import type { MusicData } from "@/app/hooks/useMusicQuery";

export interface TrackFacts {
  duration: string | null;
  isrcs: string[];
  upc: string | null;
  format: string | null;
  trackCount: number;
}

const toSeconds = (value: string) => {
  const [m, s] = value.split(":").map(Number);
  return m * 60 + s;
};

const formatSeconds = (total: number) =>
  `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;

/** Duration, ISRC and format are read from the release body (tracklist) so no frontmatter migration is needed. */
export function getTrackFacts(track: MusicData): TrackFacts {
  const body = track.Content ?? "";
  const durations = [...body.matchAll(/^\s*\d+\.\s.*?\u2014\s*(\d{1,2}:\d{2})/gm)].map((m) => m[1]);
  const total = durations.reduce((sum, d) => sum + toSeconds(d), 0);

  const fromBody = [...body.matchAll(/ISRC:\s*`([A-Z0-9]{12})`/g)].map((m) => m[1]);
  const isrcs = track.isrcs?.length ? track.isrcs : track.isrc ? [track.isrc] : fromBody;

  const trackCount = durations.length;
  const format =
    trackCount === 0 ? null : trackCount === 1 ? "Single" : trackCount <= 6 ? "EP" : "Album";

  return {
    duration: total > 0 ? formatSeconds(total) : null,
    isrcs,
    upc: track.upc ?? null,
    format,
    trackCount,
  };
}

const MADE_FOR: Record<string, string[]> = {
  "no-copyright-gaming-music": ["Gaming edits", "Gameplay highlights", "Twitch streams", "YouTube videos", "Trailers"],
  "chill-music-motif": ["Study streams", "Coding sessions", "Podcasts", "Cozy gaming", "Tutorials"],
  "jazz-and-bass": ["DJ sets", "Mixes", "Playlists", "Licensed video edits", "Brand films"],
};

export const getMadeFor = (labelSlug?: string | null) =>
  (labelSlug && MADE_FOR[labelSlug]) || ["Video edits", "Streams", "Podcasts", "Playlists"];

export const isRightsManaged = (labelSlug?: string | null) => labelSlug === "jazz-and-bass";

/** Search-page URLs are fallbacks, not real release listings: hide them from the platform grid. */
export const isExactLink = (url?: string | null): url is string =>
  Boolean(url) && !/search\?q=|\/search\/|\/search\?/.test(url as string);

export const formatReleaseDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : null;

export const ACCENT = "#C62828";
export const MONO = "font-[family-name:var(--font-jetbrains)]";
export const EYEBROW = `${MONO} text-[12px] uppercase tracking-[0.12em] text-[#8C8781]`;
