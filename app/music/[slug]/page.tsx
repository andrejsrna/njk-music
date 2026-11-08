import { getMusicBySlug, getMusicData, type MusicData } from "@/app/hooks/useMusicQuery";
import { SITE_URL, getCanonicalUrl } from "@/lib/env";
import { resolveStrapiImageUrl } from "@/lib/utils";
import TrackHero from "@/app/music/[slug]/TrackHero";
import AboutLicenseSection from "@/app/music/[slug]/AboutLicenseSection";
import SpecStrip from "@/app/music/[slug]/SpecStrip";
import NewsletterCard from "@/app/music/[slug]/NewsletterCard";
import YouTubeEmbedSection from "@/app/music/[slug]/YouTubeEmbedSection";
import PlatformsSection from "@/app/music/[slug]/PlatformsSection";
import LabelInfoSection from "@/app/music/[slug]/LabelInfoSection";
import RelatedTracksSection, {
  type RelatedTrackItem,
} from "@/app/music/[slug]/RelatedTracksSection";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { PRIMARY_LABEL, SITE_NAME } from "@/lib/site";
import { getShopProduct } from "@/lib/shop/catalog";

const notFoundMetadata = {
  title: `Track Not Found - ${SITE_NAME}`,
  description: "The requested music track could not be found.",
};

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const track = (await getMusicBySlug(slug)) as MusicData | undefined;

    if (!track) {
      return notFoundMetadata;
    }

    const coverUrl = resolveStrapiImageUrl(track.Cover);
    const labelName = track.label?.name ?? PRIMARY_LABEL.name;

    // Extract plain text from HTML description
    const descriptionSource = track.Description ?? track.Content ?? "";
    const plainDescription = descriptionSource
      ? descriptionSource.replace(/<[^>]*>/g, "").substring(0, 160)
      : `Listen to ${track.Title} from the ${labelName} label on ${SITE_NAME}. Crafted for creators seeking stream-safe ${track.genre?.Genres || "music"}.`;

    const title = `${track.Title} – ${labelName} | ${SITE_NAME}`;
    const canonical = getCanonicalUrl(`/music/${slug}`);

    return {
      title,
      description: plainDescription,
      keywords: [
        track.Title,
        "no copyright music",
        "royalty-free music",
        track.genre?.Genres || "music",
        "gaming music",
        "stream music",
        "youtube music",
        "content creator music",
        "copyright free",
        labelName,
        SITE_NAME,
      ],
      authors: [{ name: labelName }],
      openGraph: {
        title,
        description: plainDescription,
        url: canonical,
        siteName: SITE_NAME,
        images: [
          {
            url: coverUrl || `${SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: `${track.Title} - Album Cover`,
          },
        ],
        locale: "en_US",
        type: "music.song",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: plainDescription,
        images: [coverUrl || `${SITE_URL}/og-image.jpg`],
      },
      alternates: {
        canonical,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    return notFoundMetadata;
  }
}

export default async function MusicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const track = (await getMusicBySlug(slug)) as MusicData | undefined;
  const product = await getShopProduct(slug);

  if (!track) {
    notFound();
  }

  const coverUrl = resolveStrapiImageUrl(track.Cover);
  const contentHtml = track.Content ? await marked(track.Content) : "";
  const labelName = track.label?.name ?? PRIMARY_LABEL.name;
  const labelSlug = track.label?.slug ?? PRIMARY_LABEL.slug;
  const genreName = track.genre?.Genres ?? null;

  const relatedTracks = await getRelatedTracks({
    currentSlug: slug,
    labelSlug,
    genreName,
    limit: 6,
  });

  // Generate structured data (JSON-LD) for rich snippets
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: track.Title,
    genre: track.genre?.Genres || "Electronic",
    datePublished: track.publishedAt || track.createdAt,
    image: coverUrl,
    description: track.Content
      ? track.Content.replace(/<[^>]*>/g, "").substring(0, 200)
      : `${track.Title} - No copyright ${track.genre?.Genres || "music"} for content creators`,
    url: getCanonicalUrl(`/music/${slug}`),
    license: `${SITE_URL}/license`,
    author: {
      "@type": "Organization",
      name: labelName,
      url: SITE_URL,
    },
    offers:
      track.Beatport || track.Bandcamp
        ? {
            "@type": "AggregateOffer",
            availability: "https://schema.org/InStock",
            priceCurrency: "USD",
            url: track.Beatport || track.Bandcamp,
          }
        : undefined,
    audio: track.Spotify
      ? {
          "@type": "AudioObject",
          contentUrl: track.Spotify,
          encodingFormat: "audio/mpeg",
        }
      : undefined,
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Music",
        item: getCanonicalUrl("/music"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: track.Title,
        item: getCanonicalUrl(`/music/${slug}`),
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <article className="bg-[#0C0B0D] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
        <TrackHero track={track} coverUrl={coverUrl} product={product} />
        <SpecStrip track={track} />
        <AboutLicenseSection track={track} contentHtml={contentHtml} product={product} />
        <PlatformsSection track={track} />
        <YouTubeEmbedSection source={track.youtube_embed ?? ""} />
        <LabelInfoSection label={track.label} />
        <RelatedTracksSection tracks={relatedTracks} />
        <NewsletterCard />
      </article>
    </>
  );
}

async function getRelatedTracks({
  currentSlug,
  labelSlug,
  genreName,
  limit,
}: {
  currentSlug: string;
  labelSlug: string;
  genreName: string | null;
  limit: number;
}): Promise<RelatedTrackItem[]> {
  const all = await getMusicData();
  const candidates = all
    .filter((candidate) => candidate.slug !== currentSlug)
    .map((candidate) => {
      const cover = resolveStrapiImageUrl(candidate.Cover);
      const candidateLabelSlug = candidate.label?.slug ?? PRIMARY_LABEL.slug;
      const candidateLabelName = candidate.label?.name ?? PRIMARY_LABEL.name;

      return {
        slug: candidate.slug,
        title: candidate.Title,
        labelSlug: candidateLabelSlug,
        labelName: candidateLabelName,
        genre: candidate.genre?.Genres ?? null,
        coverUrl: cover ?? "",
        score:
          (candidateLabelSlug === labelSlug ? 100 : 0) +
          (genreName && candidate.genre?.Genres === genreName ? 50 : 0),
      };
    })
    .filter((candidate) => Boolean(candidate.coverUrl));

  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, limit).map(({ score: _score, ...rest }) => rest);
}
