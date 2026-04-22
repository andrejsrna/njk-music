import type { MetadataRoute } from "next";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import { getPosts } from "@/app/lib/posts";
import { getCanonicalUrl } from "@/lib/env";
import { LABEL_LIST } from "@/lib/site";
import { slugify } from "@/lib/utils";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/music", priority: 0.9 },
  { path: "/labels", priority: 0.8 },
  { path: "/news", priority: 0.8 },
  { path: "/license", priority: 0.7 },
  { path: "/help", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/faq", priority: 0.6 },
  { path: "/help/attribution", priority: 0.6 },
  { path: "/help/content-id", priority: 0.6 },
  { path: "/help/copyright-claims", priority: 0.6 },
  { path: "/help/guidelines", priority: 0.6 },
  { path: "/help/monetization", priority: 0.6 },
  { path: "/help/platforms", priority: 0.6 },
  { path: "/help/purchase-guide", priority: 0.6 },
  { path: "/help/purchase-issues", priority: 0.6 },
  { path: "/help/technical", priority: 0.6 },
  { path: "/ai-usage", priority: 0.4 },
  { path: "/cookies", priority: 0.3 },
  { path: "/dmca", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
] as const;

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tracks, posts] = await Promise.all([getMusicData(), getPosts()]);

  const labelLastModified = tracks.reduce<Record<string, Date>>((acc, track) => {
    const labelSlug =
      track.label?.slug ?? (track.label?.name ? slugify(track.label.name) : null);
    const modified = toDate(track.updatedAt ?? track.publishedAt ?? track.pubDate);

    if (!labelSlug || !modified) {
      return acc;
    }

    if (!acc[labelSlug] || modified > acc[labelSlug]) {
      acc[labelSlug] = modified;
    }

    return acc;
  }, {});

  return [
    ...staticRoutes.map(
      ({ path, priority }): SitemapEntry => ({
        url: getCanonicalUrl(path),
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority,
      })
    ),
    ...LABEL_LIST.map(
      (label): SitemapEntry => ({
        url: getCanonicalUrl(`/labels/${label.slug}`),
        lastModified: labelLastModified[label.slug],
        changeFrequency: "weekly",
        priority: 0.8,
      })
    ),
    ...tracks.map(
      (track): SitemapEntry => ({
        url: getCanonicalUrl(`/music/${track.slug}`),
        lastModified: toDate(track.updatedAt ?? track.publishedAt ?? track.pubDate),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    ),
    ...posts.map(
      (post): SitemapEntry => ({
        url: getCanonicalUrl(`/news/${post.slug}`),
        lastModified: toDate(post.updatedAt ?? post.publishedAt ?? post.pubDate),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    ),
  ];
}

function toDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
