import type { Metadata } from "next";
import Link from "next/link";
import {
  FaBalanceScale,
  FaBug,
  FaChalkboardTeacher,
  FaEnvelope,
  FaFileContract,
  FaHeadset,
  FaPlay,
  FaPlug,
  FaQuestionCircle,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { SITE_NAME } from "@/lib/site";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";

export const metadata: Metadata = {
  title: `Help Centre | ${SITE_NAME}`,
  description:
    "Browse licensing guidance, troubleshooting tips, and platform playbooks for NJK Music. Find answers fast or contact the team for hands-on support.",
};

type QuickLink = {
  title: string;
  description: string;
  href: string;
  icon: IconType;
};

type HelpArticle = {
  title: string;
  description: string;
  href: string;
  icon: IconType;
};

type HelpCategory = {
  title: string;
  description: string;
  articles: HelpArticle[];
};

const quickLinks: QuickLink[] = [
  {
    title: "Licensing overview",
    description: "Understand how NJK Music clears tracks for streamers and clients.",
    href: "/license",
    icon: FaFileContract,
  },
  {
    title: "Creator FAQ",
    description: "Answers to the questions we hear most from our label community and fans.",
    href: "/faq",
    icon: FaQuestionCircle,
  },
  {
    title: "Contact support",
    description: "Email the team for one-on-one help with releases or claims.",
    href: "/contact",
    icon: FaEnvelope,
  },
];

const helpCategories: HelpCategory[] = [
  {
    title: "Start with licensing",
    description: "Set expectations for commercial use, attribution, and platform policies.",
    articles: [
      {
        title: "Music licensing guide",
        description: "Review when you need additional clearance and how to request it.",
        href: "/license",
        icon: FaBalanceScale,
      },
      {
        title: "Attribution checklist",
        description: "Follow recommended credit formats for YouTube, Twitch, and client work.",
        href: "/help/attribution",
        icon: FaChalkboardTeacher,
      },
      {
        title: "Platform usage playbook",
        description: "See what is approved across streaming, social, and broadcast channels.",
        href: "/help/platforms",
        icon: FaPlay,
      },
    ],
  },
  {
    title: "Stay monetized",
    description: "Keep your videos claim-free and react quickly to Content ID matches.",
    articles: [
      {
        title: "Content ID support",
        description: "Learn how claims occur and how to dispute them with our team.",
        href: "/help/content-id",
        icon: FaShieldAlt,
      },
      {
        title: "Monetization tips",
        description: "Best practices for ad safe uploads and keeping your revenue flowing.",
        href: "/help/monetization",
        icon: FaHeadset,
      },
      {
        title: "Recommended tools",
        description: "Affiliate links for DJ stores, plugins, samples, and producer workflows.",
        href: "/help/affiliate-links",
        icon: FaPlug,
      },
      {
        title: "Usage guidelines",
        description: "Clarify limits for paid ads, sponsorships, and agency deliverables.",
        href: "/help/guidelines",
        icon: FaFileContract,
      },
    ],
  },
  {
    title: "Fix an issue",
    description: "Run through solutions for technical glitches or purchase questions.",
    articles: [
      {
        title: "Download troubleshooting",
        description: "Resolve broken links, missing stems, or slow delivery speeds.",
        href: "/help/technical",
        icon: FaTools,
      },
      {
        title: "Order support",
        description: "Get help with failed transactions or missing invoices.",
        href: "/help/purchase-issues",
        icon: FaBug,
      },
      {
        title: "Copyright disputes",
        description: "Report false claims or takedowns so we can unlock your content.",
        href: "/help/copyright-claims",
        icon: FaShieldAlt,
      },
    ],
  },
];

const MONO = "font-[family-name:var(--font-jetbrains)]";
const h2 = { fontStretch: "125%" } as const;
const H2 = "m-0 text-[clamp(44px,6vw,88px)] font-black uppercase leading-[0.85] tracking-[-0.05em]";
const ARROW = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M7 7h10v10" /></svg>
);

export default function HelpPage() {
  const total = helpCategories.reduce((n, c) => n + c.articles.length, 0);
  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative flex min-h-[520px] flex-col overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] sm:min-h-[600px]">
        <LabelHeroGL accent="#C62828" intensity={0.8} />
        <div className="pointer-events-none relative z-[2] mx-auto flex w-full max-w-[1360px] flex-1 flex-col justify-end gap-7 px-5 pb-12 pt-16 sm:px-8">
          <div className={`flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] ${MONO}`}>
            <span className="bg-[#F4F1EC] px-3 py-[7px] text-[#050405]">Help centre</span>
            <span className="border border-[#F4F1EC] bg-[#050405]/60 px-3 py-[7px]">{total + quickLinks.length} guides</span>
          </div>
          <h1 className="m-0 text-[clamp(56px,12vw,192px)] font-black uppercase leading-[0.78] tracking-[-0.06em] [text-shadow:0_0_50px_rgba(0,0,0,0.7)]" style={h2}>
            How can<br /><span style={{ color: "#FF6B5E" }}>we help?</span>
          </h1>
          <p className="m-0 max-w-[620px] self-start bg-[#050405]/80 px-3.5 py-2.5 text-lg font-semibold sm:text-xl">Licensing guidance, troubleshooting and platform playbooks. Find answers fast or contact the team.</p>
        </div>
      </section>

      <section className="bg-[#F4F1EC] text-[#050405]">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={H2} style={h2}>Start<br />here</h2>
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.12em] text-[#3A363E]`}>Most requested resources</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] border-l-2 border-t-2 border-[#050405]">
            {quickLinks.map((link, i) => (
              <Link key={link.title} href={link.href} className="group flex min-h-[240px] flex-col justify-between gap-6 border-b-2 border-r-2 border-[#050405] p-7 text-[#050405] transition-colors hover:bg-[#050405] hover:text-[#F4F1EC]" style={i === 0 ? { background: "#C62828", color: "#fff" } : undefined}>
                <span className={`${MONO} flex justify-between text-xs font-bold`}><span>{String(i + 1).padStart(2, "0")}</span>{ARROW}</span>
                <span className="flex flex-col gap-2">
                  <strong className="text-[30px] font-black uppercase leading-[0.95] tracking-[-0.03em]" style={{ fontStretch: "118%" }}>{link.title}</strong>
                  <span className="text-base">{link.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {helpCategories.map((category, ci) => (
        <section key={category.title} className="mx-auto flex w-full max-w-[1360px] flex-wrap items-start gap-12 px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 lg:sticky lg:top-24">
            <span className={`${MONO} text-xs font-bold uppercase tracking-[0.14em] text-[#FF6B5E]`}>{String(ci + 1).padStart(2, "0")}</span>
            <h2 className="m-0 text-[clamp(36px,4.4vw,64px)] font-black uppercase leading-[0.9] tracking-[-0.05em]" style={h2}>{category.title}</h2>
            <p className="m-0 max-w-[360px] text-base text-[#A39E98]">{category.description}</p>
          </div>
          <div className="flex min-w-0 flex-[2_1_560px] flex-col border-t-2 border-[#F4F1EC]">
            {category.articles.map((article, i) => (
              <Link key={article.title} href={article.href} className="group flex min-h-[96px] items-center justify-between gap-5 border-b border-[#2A272D] px-3 py-5 transition-colors hover:bg-[#110F12]">
                <span className="flex min-w-0 items-baseline gap-5">
                  <span className={`${MONO} text-[13px] font-bold text-[#8C8781]`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <strong className="text-[clamp(22px,2.4vw,32px)] font-extrabold tracking-[-0.025em] transition-transform duration-200 group-hover:translate-x-2" style={{ fontStretch: "112%" }}>{article.title}</strong>
                    <span className="text-base text-[#A39E98]">{article.description}</span>
                  </span>
                </span>
                <span className="flex-none text-[#F4F1EC]">{ARROW}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="border-t-2 border-[#050405] text-white" style={{ background: "#C62828" }}>
        <div className="mx-auto flex w-full max-w-[1360px] flex-wrap items-end justify-between gap-12 px-5 py-20 sm:px-8 sm:py-[88px]">
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4">
            <h2 className="m-0 text-[clamp(48px,7vw,112px)] font-black uppercase leading-[0.8] tracking-[-0.055em]" style={h2}>Talk to<br />a human</h2>
            <p className="m-0 max-w-[520px] text-lg">Share links, timestamps and any claim IDs in your message so we can respond quickly. Most requests are answered within 24 to 48 hours on business days.</p>
          </div>
          <div className="flex flex-wrap">
            <a href="mailto:support@njkmusic.com" className="inline-flex min-h-[64px] items-center bg-[#050405] px-[30px] text-base font-black uppercase text-white hover:text-white">Email support</a>
            <Link href="/contact" className="inline-flex min-h-[64px] items-center border-2 border-[#050405] px-[30px] text-base font-black uppercase text-white hover:bg-[#050405] hover:text-white">Contact page</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
