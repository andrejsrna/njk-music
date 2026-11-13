import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LabelHeroGL from '@/app/labels/[slug]/LabelHeroGL';
import NewsletterCta from '@/app/components/home/NewsletterCta';
import { getPosts, type Post } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'News | NJK Music',
  description: 'Latest updates, releases, and announcements from across the NJK Music network.',
};

const MONO = 'font-[family-name:var(--font-jetbrains)]';
const h2 = { fontStretch: '125%' } as const;

export default async function NewsPage() {
  const posts = await Promise.resolve(getPosts());
  const formatDate = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  const imgOf = (p: Post) => p.image?.formats?.large?.url ?? p.image?.url ?? null;
  const [first, ...rest] = posts;
  const firstImg = first ? imgOf(first) : null;

  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative flex min-h-[520px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] sm:min-h-[600px]">
        <LabelHeroGL accent="#C62828" />
        <div className="pointer-events-none relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-end gap-7 px-5 pb-12 pt-16 sm:px-8">
          <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
            <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">News</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{posts.length} posts</span>
          </div>
          <h1 className="m-0 text-[clamp(56px,12vw,192px)] font-black uppercase leading-[0.78] tracking-[-0.06em] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={h2}>
            Latest<br /><span style={{ color: '#FF6B5E' }}>from NJK</span>
          </h1>
          <p className="m-0 max-w-[560px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-lg font-semibold sm:text-xl">New releases, label announcements and behind-the-scenes notes from across the roster.</p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-[1360px] flex-col gap-12 px-5 py-20 sm:px-8 sm:py-24">
        {posts.length === 0 && (
          <div className="flex flex-col gap-3 border-2 border-dashed border-[#3A363E] p-10">
            <span className="text-[40px] font-black uppercase leading-[0.9] tracking-[-0.04em]" style={h2}>No posts yet</span>
            <span className="text-[17px] text-[#A39E98]">Check back soon for NJK Music updates, releases and announcements.</span>
          </div>
        )}

        {first && (
          <Link href={`/news/${first.slug}`} className="group flex flex-wrap items-stretch border-2 border-[#F4F1EC] transition-colors hover:bg-[#110F12]">
            {firstImg && (
              <span className="relative block min-h-[280px] flex-[1_1_480px] overflow-hidden">
                <Image src={firstImg} alt={first.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-[500ms] group-hover:scale-[1.03]" />
              </span>
            )}
            <span className="flex min-w-0 flex-[1_1_420px] flex-col justify-between gap-8 p-6 sm:p-10">
              <span className={`flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] ${MONO}`}>
                <span className="bg-[#C62828] px-2.5 py-1.5 text-white">Newest</span>
                {formatDate(first.pubDate ?? first.publishedAt) && <span className="border border-[#F4F1EC] px-2.5 py-1.5">{formatDate(first.pubDate ?? first.publishedAt)}</span>}
                {first.category && <span className="border border-[#F4F1EC] px-2.5 py-1.5">{first.category}</span>}
              </span>
              <span className="flex flex-col gap-4">
                <span className="text-[clamp(32px,4vw,60px)] font-black uppercase leading-[0.92] tracking-[-0.045em] [overflow-wrap:anywhere]" style={h2}>{first.title}</span>
                {first.description && <span className="line-clamp-3 text-lg text-[#A39E98]">{first.description}</span>}
              </span>
              <span className="inline-flex items-center gap-2.5 text-sm font-black uppercase">Read the post <span aria-hidden className="transition group-hover:translate-x-1">→</span></span>
            </span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-6 gap-y-12">
            {rest.map((post: Post) => {
              const imageUrl = imgOf(post);
              const date = formatDate(post.pubDate ?? post.publishedAt);
              return (
                <article key={post.id ?? post.slug} className="group flex flex-col gap-4">
                  <Link href={`/news/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden border border-[#2A272D] bg-[#110F12]">
                    {imageUrl && <Image src={imageUrl} alt={post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-1 group-hover:scale-[1.04]" />}
                  </Link>
                  <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#FF6B5E] ${MONO}`}>
                    {date && <span>{date}</span>}
                    {post.category && <span className="text-[#A39E98]">{post.category}</span>}
                  </div>
                  <Link href={`/news/${post.slug}`} className="text-[24px] font-extrabold leading-[1.08] tracking-[-0.025em] [text-wrap:balance]">{post.title}</Link>
                  {post.description && <p className="m-0 line-clamp-3 text-base text-[#A39E98]">{post.description}</p>}
                  <Link href={`/news/${post.slug}`} className="mt-auto inline-flex min-h-[44px] items-center justify-center border border-[#F4F1EC] text-xs font-extrabold uppercase hover:bg-[#F4F1EC] hover:text-[#050405]">Read</Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-t-2 border-[#050405] text-white" style={{ background: '#C62828' }}>
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-12 px-5 py-20 sm:px-8 sm:py-[88px]">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(48px,7vw,112px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2}>Never miss<br />a drop</h2>
            <p className="m-0 max-w-[480px] text-lg">One email when new releases land. No spam, unsubscribe anytime.</p>
          </div>
          <NewsletterCta variant="square" idPrefix="news" cta="Subscribe" />
        </div>
      </section>
    </div>
  );
}
