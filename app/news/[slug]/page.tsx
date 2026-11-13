import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Remarkable } from "remarkable";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import ShareButtons from "@/app/components/sharebuttons";
import { getPostBySlug, type Post } from "@/app/lib/posts";
import { SITE_URL, getCanonicalUrl } from "@/lib/env";
import { resolveStrapiImageUrl } from "@/lib/utils";

const markdown = new Remarkable({ breaks: true, html: true });

interface PageProps {
  params: Promise<{ slug: string }>;
}

const fallbackMetadata: Metadata = {
  title: "Article Not Found | NJK Music",
  description: "The requested news article could not be located.",
};

const formatPlainText = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const buildDescription = (post: Post, plainText: string) => {
  if (post.description?.length) {
    return post.description;
  }
  return plainText.slice(0, 160);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return fallbackMetadata;
  }

  const imageUrl = resolveStrapiImageUrl(post.image);
  const htmlContent = markdown.render(post.content || "");
  const plainText = formatPlainText(htmlContent);
  const description = buildDescription(post, plainText);
  const canonical = getCanonicalUrl(`/news/${slug}`);
  const publishedTime = post.publishedAt || post.pubDate;

  return {
    title: `${post.title} | NJK Music News`,
    description,
    keywords: [
      post.title,
      post.category,
      "njk music news",
      "label updates",
    ].filter(Boolean) as string[],
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      siteName: "No Copyright Gaming Music",
      type: "article",
      publishedTime,
      modifiedTime: post.updatedAt,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = resolveStrapiImageUrl(post.image);
  const htmlContent = markdown.render(post.content || "");
  const plainText = formatPlainText(htmlContent);
  const description = buildDescription(post, plainText);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 225));
  const publishedDate = post.publishedAt || post.pubDate;
  const publishedIso = publishedDate ? new Date(publishedDate).toISOString() : undefined;
  const updatedIso = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedIso;
  const formattedDate = publishedDate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(publishedDate))
    : post.pubDate;
  const canonical = `${SITE_URL}/news/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description,
    datePublished: publishedIso,
    dateModified: updatedIso,
    mainEntityOfPage: canonical,
    image: imageUrl ? [imageUrl] : undefined,
    author: {
      "@type": "Organization",
      name: "NJK Music",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "NJK Music",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
        <section className="relative flex min-h-[460px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506]">
          <LabelHeroGL accent="#C62828" intensity={0.6} />
          <div className="relative z-[2] mx-auto flex w-full max-w-[1100px] flex-1 flex-col justify-end gap-6 px-5 pb-12 pt-14 sm:px-8">
            <Link href="/news" aria-label="Back to news index" className="inline-flex min-h-[40px] w-fit items-center gap-2 border border-[#F4F1EC] bg-[#050405]/70 px-3.5 text-xs font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">
              <span aria-hidden>←</span> Back to News
            </Link>
            <div className="flex flex-wrap gap-2 font-[family-name:var(--font-jetbrains)] text-xs font-bold uppercase tracking-[0.12em]">
              {post.category && <span className="bg-[#C62828] px-3 py-[7px] text-white">{post.category}</span>}
              {formattedDate && <time dateTime={publishedIso} className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{formattedDate}</time>}
              <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{readingTime} min read</span>
            </div>
            <h1 className="m-0 text-[clamp(36px,6vw,92px)] font-black uppercase leading-[0.88] tracking-[-0.05em] [overflow-wrap:anywhere] [text-shadow:0_0_40px_rgba(0,0,0,0.7)]" style={{ fontStretch: "125%" }}>{post.title}</h1>
            <p className="m-0 max-w-[720px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-lg font-semibold">{description}</p>
          </div>
        </section>

        <article className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-20">
          {imageUrl && (
            <figure className="relative m-0 mb-14 aspect-[16/9] overflow-hidden border-2 border-[#F4F1EC] bg-[#110F12]">
              <Image src={imageUrl} alt={post.title} fill sizes="(min-width: 1024px) 836px, 100vw" className="object-cover" priority />
              <figcaption className="sr-only">{post.title}</figcaption>
            </figure>
          )}
          <div
            className="prose prose-invert max-w-none text-[18px] leading-[1.7]
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
              prose-a:text-[#FF6B5E] prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-white
              prose-code:rounded-none prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#FF6B5E]
              prose-blockquote:rounded-none prose-blockquote:border-l-4 prose-blockquote:border-[#C62828] prose-blockquote:bg-[#110F12] prose-blockquote:px-6 prose-blockquote:py-4
              prose-img:rounded-none prose-li:marker:text-[#FF6B5E] prose-hr:border-[#2A272D]"
          >
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
          <aside className="mt-16 border-2 border-[#F4F1EC] px-6 py-8">
            <ShareButtons post={post} shareUrl={canonical} />
          </aside>
        </article>

        <section className="border-t-2 border-[#050405] text-white" style={{ background: "#C62828" }}>
          <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-end justify-between gap-10 px-5 py-16 sm:px-8">
            <h2 className="m-0 text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.82] tracking-[-0.055em]" style={{ fontStretch: "125%" }}>More from<br />NJK Music</h2>
            <div className="flex flex-wrap">
              <Link href="/news" className="inline-flex min-h-[60px] items-center bg-[#050405] px-8 text-base font-black uppercase text-white hover:text-white">All news</Link>
              <Link href="/music" className="inline-flex min-h-[60px] items-center border-2 border-[#050405] px-8 text-base font-black uppercase text-white hover:bg-[#050405] hover:text-white">Explore releases</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
