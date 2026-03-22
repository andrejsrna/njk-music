import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaSoundcloud, FaSpotify, FaYoutube } from "react-icons/fa";
import { getMusicData } from "@/app/hooks/useMusicQuery";
import MusicCard from "@/app/music/MusicCard";
import { getLabelDefinition, LABEL_LIST } from "@/lib/site";
import { getCanonicalUrl } from "@/lib/env";
import { slugify } from "@/lib/utils";
import LabelReleasesGrid from "@/app/labels/[slug]/LabelReleasesGrid";

const PickYourGenre = dynamic(() => import("@/app/components/PickYourGenre"));
const MusicProfile = dynamic(() => import("@/app/components/MusicProfile"));

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LABEL_LIST.map((label) => ({ slug: label.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = getLabelDefinition(slug);

  if (!label) {
    return {};
  }

  return {
    title: label.seo.title,
    description: label.seo.description,
    keywords: label.seo.keywords,
    alternates: {
      canonical: getCanonicalUrl(`/labels/${label.slug}`),
    },
    openGraph: {
      title: label.seo.title,
      description: label.seo.description,
      url: getCanonicalUrl(`/labels/${label.slug}`),
      siteName: "NJK Music",
      type: "website",
      images: label.heroImage
        ? [
            {
              url: label.heroImage,
              width: 1600,
              height: 900,
              alt: `${label.name} Label Artwork`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: label.seo.title,
      description: label.seo.description,
      images: label.heroImage ? [label.heroImage] : undefined,
    },
  };
}

export default async function LabelPage({ params }: PageProps) {
  const { slug } = await params;
  const label = getLabelDefinition(slug);

  if (!label) {
    notFound();
  }

  const releases = (await getMusicData())
    .filter((track) => {
      const trackLabelSlug =
        track.label?.slug ?? (track.label?.name ? slugify(track.label.name) : null);
      return trackLabelSlug === label.slug;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt ?? a.pubDate ?? a.updatedAt ?? "").getTime();
      const dateB = new Date(b.publishedAt ?? b.pubDate ?? b.updatedAt ?? "").getTime();
      return dateB - dateA;
    });

  const releaseCount = releases.length;
  const hasHeroImage = Boolean(label.heroImage);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: label.name,
    url: getCanonicalUrl(`/labels/${label.slug}`),
    description: label.description,
    genre: "Electronic Music",
    memberOf: {
      "@type": "Organization",
      name: "NJK Music",
      url: getCanonicalUrl("/"),
    },
    numberOfAlbums: releaseCount,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-transparent py-16 text-white">
        <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header
            className={`grid gap-12 ${hasHeroImage ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start" : ""}`}
          >
            <div className="space-y-8">
              <Link
                href="/labels"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur transition hover:bg-white/10"
              >
                Back to Labels
              </Link>

              <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
                  NJK Music Label
                </span>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    {label.heroImage && (
                      <Image
                        src={label.heroImage}
                        alt={`${label.name} icon`}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                      />
                    )}
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      {label.name}
                    </h1>
                  </div>
                  <p className="text-base uppercase tracking-[0.3em] text-slate-300 sm:text-sm">
                    {label.tagline}
                  </p>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {label.description}
                </p>
                {label.socialLinks?.length ? (
                  <div className="flex flex-wrap gap-3">
                    {label.socialLinks.map((social) => (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 backdrop-blur transition hover:bg-white/10"
                      >
                        {social.label === "Spotify" && <FaSpotify className="h-4 w-4 text-emerald-400" />}
                        {social.label === "YouTube" && <FaYoutube className="h-4 w-4 text-rose-400" />}
                        {social.label === "Facebook" && <FaFacebookF className="h-4 w-4 text-sky-300" />}
                        {social.label === "SoundCloud" && <FaSoundcloud className="h-4 w-4 text-orange-300" />}
                        {social.label === "Instagram" && <FaInstagram className="h-4 w-4 text-pink-300" />}
                        {social.label}
                        <span className="text-cyan-200">→</span>
                      </a>
                    ))}
                  </div>
                ) : null}
                {label.highlights.length > 0 ? (
                  <ul className="grid gap-4 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm text-slate-300 backdrop-blur sm:grid-cols-2 sm:text-base">
                    {label.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.45)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            {label.heroImage && (
              <aside className="space-y-6">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft backdrop-blur">
                  <Image
                    src={label.heroImage}
                    alt={`${label.name} artwork`}
                    width={900}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
              </aside>
            )}
          </header>

          <section className="mt-16">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Latest Releases
                </h2>
                <p className="text-sm text-slate-300">
                  Latest drops from {label.name}.
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                {releaseCount} release{releaseCount === 1 ? "" : "s"}
              </p>
            </div>
            {releaseCount > 0 ? (
              <LabelReleasesGrid releases={releases} />
            ) : (
              <p className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-sm text-slate-300 shadow-soft backdrop-blur sm:text-base">
                Releases from this label are loading soon. Check back for fresh drops or explore other NJK Music
                catalogues.
              </p>
            )}
          </section>

          {label.slug === "no-copyright-gaming-music" && (
            <div className="mt-16 flex flex-col gap-16">
              <PickYourGenre />
              <MusicProfile />
            </div>
          )}

          <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-200">
              Explore More Labels
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {LABEL_LIST.filter((item) => item.slug !== label.slug).map((item) => (
                <Link
                  key={item.slug}
                  href={`/labels/${item.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/0 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 backdrop-blur transition hover:bg-white/5"
                >
                  <span>{item.name}</span>
                  <span className="text-cyan-200 group-hover:translate-x-0.5 transition">→</span>
                </Link>
              ))}
              {LABEL_LIST.length <= 1 && (
                <span className="text-sm text-slate-300">
                  New labels are coming soon to the NJK Music roster.
                </span>
              )}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
