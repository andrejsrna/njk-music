import Link from "next/link";
import type { MusicData } from "@/app/hooks/useMusicQuery";
import { PRIMARY_LABEL } from "@/lib/site";
import BuyButton from "@/app/music/[slug]/BuyButton";
import type { ShopProduct } from "@/lib/shop/catalog";
import { MONO, accentFor, getMadeFor, isExactLink, isRightsManaged } from "@/app/music/[slug]/track-utils";

// The page already shows tracklist, release facts, platform links and licensing elsewhere,
// so "About the track" keeps only the narrative (story) sections of the markdown body.
const DATA_HEADING = /tracklist|release details|streaming|store links|licens|usage|related|faq|what you.?ll get|highlights/i;

function storyOnly(html: string, hasLead: boolean) {
  const parts = html.replace(/<h1[\s\S]*?<\/h1>/i, "").split(/(?=<h2[\s>])/i);
  return parts
    .filter((part, i) => {
      if (!/^<h2[\s>]/i.test(part)) return !(i === 0 && hasLead); // intro boilerplate duplicates the lead
      const heading = part.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1].replace(/<[^>]+>/g, "") ?? "";
      return !DATA_HEADING.test(heading);
    })
    .join("")
    .trim();
}

const Check = () => (
  <svg className="mt-0.5 flex-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050405" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
);

export default function AboutLicenseSection({ track, contentHtml, product }: { track: MusicData; contentHtml: string; product?: ShopProduct | null }) {
  const labelSlug = track.label?.slug ?? PRIMARY_LABEL.slug;
  const labelName = track.label?.name ?? PRIMARY_LABEL.name;
  const story = storyOnly(contentHtml, Boolean(track.Description));
  const managed = isRightsManaged(labelSlug);
  const madeFor = getMadeFor(labelSlug);
  const [accent, accentText] = accentFor(labelSlug);
  const buy = [track.Bandcamp, track.Beatport].find(isExactLink);
  const buyName = buy === track.Bandcamp ? "Bandcamp" : "Beatport";

  const checklist = managed
    ? [
        "A purchase/licence is required before using this release in any content or campaign",
        "Monetized via Content ID: licensed creators should request a channel whitelist",
        "If you still receive a claim, follow the Content ID guide and contact us",
        `Credit ${labelName} / NJK Music where required`,
      ]
    : [
        product ? "Lossless WAV master, delivered instantly after payment" : "Broadcast-safe WAV + MP3 with every download",
        "Unlimited use across streams, podcasts and commercial projects",
        "Monetisation cleared for Twitch, YouTube, TikTok and client work",
        `Credit ${labelName} where required`,
      ];

  const links = managed
    ? [["Purchase guide", "/help/purchase-guide"], ["Content ID guide", "/help/content-id"], ["Full licence", "/license"]]
    : [["Attribution guide", "/help/attribution"], ["Full licence", "/license"], ["Content ID help", "/help/content-id"]];

  return (
    <section className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-14 px-5 py-24 sm:px-8 sm:py-28">
      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
        <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em]`} style={{ color: accentText }}>01 — About the track</span>
        {track.Description && (
          <p className="m-0 text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:pretty]">{track.Description}</p>
        )}
        {story && (
          <div
            className="prose prose-invert max-w-[720px] prose-p:text-[#A39E98] prose-a:text-[#F4F1EC] prose-a:underline prose-headings:tracking-tight prose-li:text-[#A39E98]"
            dangerouslySetInnerHTML={{ __html: story }}
          />
        )}
        <div className="flex flex-col gap-3.5 pt-2">
          <span className={`${MONO} text-[11px] font-bold uppercase tracking-[0.12em] text-[#8C8781]`}>Made for</span>
          <div className="flex flex-wrap gap-1.5">
            {madeFor.map((item) => (
              <span key={item} className={`inline-flex min-h-[40px] items-center border border-[#F4F1EC] px-3.5 text-xs font-bold uppercase tracking-[0.08em] ${MONO}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <aside className="flex min-w-0 flex-[1_1_400px] flex-col gap-6 border-2 border-[#F4F1EC] bg-[#F4F1EC] p-9 text-[#050405] lg:sticky lg:top-24" style={{ boxShadow: `14px 14px 0 ${accent}` }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-[32px] font-black uppercase leading-[0.9] tracking-[-0.04em]" style={{ fontStretch: "120%" }}>
            {managed ? "Licensing & clearance" : "Licensing at a glance"}
          </h2>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
        </div>
        <ul className="m-0 flex list-none flex-col border-t-2 border-[#050405] p-0 text-base font-semibold leading-[1.4]">
          {checklist.map((item) => (
            <li key={item} className="flex gap-3.5 border-b border-[#C9C4BD] py-3.5"><Check /><span>{item}</span></li>
          ))}
        </ul>
        {product ? (
          <BuyButton slug={product.slug} priceCents={product.priceCents} currency={product.currency} variant="card" label={managed ? "Get a licence (WAV)" : "Buy WAV"} />
        ) : buy && (
          <a href={buy} target="_blank" rel="noopener noreferrer" className="flex min-h-[60px] items-center justify-center gap-2.5 bg-[#050405] text-[15px] font-black uppercase text-[#F4F1EC] hover:text-white">
            {managed ? `Get a licence on ${buyName}` : `Get it on ${buyName} - lossless`}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
          </a>
        )}
        <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 pt-1 text-sm font-bold">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-[#050405] underline underline-offset-[3px]">{label}</Link>
          ))}
        </div>
        <p className="m-0 text-xs text-[#4A4641]">Streaming access is not a download or a separate licence grant.</p>
      </aside>
    </section>
  );
}
