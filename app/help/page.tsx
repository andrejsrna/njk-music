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

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 backdrop-blur">
              Help centre
            </span>
            <div className="mt-6 max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                How can we help?
              </h1>
              <p className="text-base text-slate-300 sm:text-lg">
                Browse licensing guidance, troubleshooting tips, and platform playbooks for NJK Music. Find answers fast
                or contact the team for hands-on support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Start here
            </h2>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-300">
              Most requested resources
            </span>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="group flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 backdrop-blur">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{link.title}</h3>
                    <p className="text-sm text-slate-300">{link.description}</p>
                  </div>
                  <span className="mt-auto text-sm font-medium text-cyan-200 transition group-hover:text-cyan-100">
                    Open guide
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-20 space-y-16">
          {helpCategories.map((category) => (
            <div key={category.title} className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">{category.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{category.description}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {category.articles.map((article) => {
                  const Icon = article.icon;
                  return (
                    <Link
                      key={article.title}
                      href={article.href}
                      className="group flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur transition hover:border-fuchsia-300/40 hover:bg-white/10"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fuchsia-200 backdrop-blur">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                        <p className="text-sm text-slate-300">{article.description}</p>
                      </div>
                      <span className="mt-auto text-sm font-medium text-cyan-200 transition group-hover:text-cyan-100">
                        View article
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur sm:p-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200 backdrop-blur">
              <FaHeadset className="h-6 w-6" />
            </span>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Prefer to talk to someone?
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                Share links, timestamps, and any claim IDs in your message so we can respond quickly. Most requests are
                answered within 24 to 48 hours on business days.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@njkmusic.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Email support
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/0 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-slate-200 backdrop-blur transition hover:bg-white/5"
              >
                View contact page
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
