'use client';

import { useMemo, useState } from "react";
import MusicCard from "@/app/music/MusicCard";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { slugify } from "@/lib/utils";

interface GenreFilter {
  label: string;
  count: number;
}

interface LabelFilter {
  label: string;
  slug: string;
  count: number;
}

interface MusicBrowserProps {
  tracks: MusicData[];
  genres: GenreFilter[];
  labels: LabelFilter[];
  initialQuery?: string;
}

export default function MusicBrowser({ tracks, genres, labels, initialQuery = "" }: MusicBrowserProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedLabel, setSelectedLabel] = useState<string>("all");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      const genreName = track.genre?.Genres?.trim();
      const matchesGenre = selectedGenre === "all" || genreName === selectedGenre;

      const trackLabelSlug =
        track.label?.slug ?? (track.label?.name ? slugify(track.label.name) : "");
      const matchesLabel = selectedLabel === "all" || trackLabelSlug === selectedLabel;

      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        [track.Title, track.label?.name, genreName, track.Description].some((v) => v?.toLowerCase().includes(q));

      return matchesGenre && matchesLabel && matchesQuery;
    });
  }, [selectedGenre, selectedLabel, query, tracks]);

  const totalPages = Math.max(1, Math.ceil(filteredTracks.length / perPage));
  const currentPage = Math.min(page, totalPages);

  const pagedTracks = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    return filteredTracks.slice(startIndex, startIndex + perPage);
  }, [filteredTracks, currentPage]);

  return (
    <section className="space-y-10">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft backdrop-blur">
        <div className="mb-4 space-y-2">
          <label htmlFor="music-q" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
            Search
          </label>
          <input
            id="music-q"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Title, label or genre…"
            className="w-full rounded-md border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {labels.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
                Label
              </label>
              <select
                value={selectedLabel}
                onChange={(event) => {
                  setSelectedLabel(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
              >
                <option value="all">All labels ({tracks.length})</option>
                {labels.map((label) => (
                  <option key={label.slug} value={label.slug}>
                    {label.label} ({label.count})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(event) => {
                setSelectedGenre(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            >
              <option value="all">All genres ({tracks.length})</option>
              {genres.map((genre) => (
                <option key={genre.label} value={genre.label}>
                  {genre.label} ({genre.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-300">
          {filteredTracks.length === 0 ? (
            <>Showing 0 releases.</>
          ) : (
            <>
              Showing {(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredTracks.length)} of{" "}
              {filteredTracks.length} release{filteredTracks.length === 1 ? "" : "s"}.
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.length > 0 ? (
          pagedTracks.map((track) => (
            <MusicCard key={track.documentId ?? track.slug} track={track} />
          ))
        ) : (
          <p className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-300 shadow-soft backdrop-blur">
            No tracks found for this combination yet. Try adjusting your filters or check back soon.
          </p>
        )}
      </div>

      {filteredTracks.length > perPage && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 shadow-soft backdrop-blur transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage === totalPages}
            className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 shadow-soft backdrop-blur transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
