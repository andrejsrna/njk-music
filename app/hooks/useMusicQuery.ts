import path from "path";
import { readMarkdownDirectory, readMarkdownFile } from "@/lib/markdown";
import { PRIMARY_LABEL } from "@/lib/site";
import { slugify } from "@/lib/utils";

export interface MusicData {
  pubDate?: string;
  id?: number;
  documentId?: string;
  Title: string;
  Spotify?: string | null;
  AppleMusic?: string | null;
  iTunes?: string | null;
  YouTubeMusic?: string | null;
  Amazon?: string | null;
  Pandora?: string | null;
  slug: string;
  Description?: string | null;
  Deezer?: string | null;
  Tidal?: string | null;
  iHeartRadio?: string | null;
  Boomplay?: string | null;
  Beatport?: string | null;
  Bandcamp?: string | null;
  spotify_embed?: string | null;
  youtube_embed?: string | null;
  Content: string;
  upc?: string | null;
  isrc?: string | null;
  isrcs?: string[] | null;
  recordLabel?: string | null;
  previewAudio?: string | null;
  Cover?: {
    url?: string;
    formats?: {
      large?: {
        url?: string;
      };
    };
  };
  genre?: {
    Genres?: string;
  } | null;
  label?: {
    name?: string;
    slug?: string;
    short?: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

type MusicFrontmatter = Omit<MusicData, "Content">;

const MUSIC_DIR = path.join(process.cwd(), "content", "music");

export const getMusicData = async (): Promise<MusicData[]> => {
  const entries = await readMarkdownDirectory<MusicFrontmatter>(MUSIC_DIR);
  const tracks = entries.map(({ metadata, body, slug }) =>
    hydrateTrack(metadata, body, slug)
  );

  return tracks.sort((a, b) => {
    const dateA = getComparableDate(a);
    const dateB = getComparableDate(b);
    return dateB - dateA;
  });
};

export const getMusicBySlug = async (
  slug: string
): Promise<MusicData | null> => {
  const filePath = path.join(MUSIC_DIR, `${slug}.md`);

  try {
    const { metadata, body } = await readMarkdownFile<MusicFrontmatter>(
      filePath
    );
    return hydrateTrack(metadata, body, slug);
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
};

function hydrateTrack(
  metadata: MusicFrontmatter,
  body: string,
  fallbackSlug: string
): MusicData {
  const slug = metadata.slug ?? fallbackSlug;
  const label = ensureLabel(metadata.label);

  return {
    ...metadata,
    label,
    slug,
    documentId: metadata.documentId ?? slug,
    Content: body,
    publishedAt:
      metadata.publishedAt ?? metadata.pubDate ?? metadata.updatedAt,
    updatedAt: metadata.updatedAt ?? metadata.publishedAt,
  };
}

function getComparableDate(track: MusicData): number {
  const reference =
    track.publishedAt ??
    track.pubDate ??
    track.updatedAt ??
    new Date().toISOString();
  const timestamp = new Date(reference).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function ensureLabel(
  label: MusicFrontmatter["label"]
): MusicData["label"] {
  if (!label) {
    return { ...PRIMARY_LABEL };
  }

  if (typeof label === "string") {
    return {
      name: label,
      slug: slugify(label),
      short: label === PRIMARY_LABEL.name ? PRIMARY_LABEL.short : undefined,
    };
  }

  const name = label.name ?? PRIMARY_LABEL.name;
  return {
    ...label,
    name,
    slug: label.slug ?? slugify(name),
    short: label.short ?? (name === PRIMARY_LABEL.name ? PRIMARY_LABEL.short : undefined),
  };
}
