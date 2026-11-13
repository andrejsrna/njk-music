import type { Metadata } from "next";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import {
  FaBolt,
  FaBuilding,
  FaChevronRight,
  FaClock,
  FaCog,
  FaEnvelope,
  FaFileContract,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact NJK Music | ${SITE_NAME}`,
  description:
    "Reach the NJK Music team for support, licensing guidance, or partnership opportunities. We respond quickly and keep creators moving.",
};

type ContactMethod = {
  title: string;
  email: string;
  description: string;
  responseTime: string;
  icon: IconType;
};

const contactMethods: ContactMethod[] = [
  {
    title: "Creator support",
    email: "support@njkmusic.com",
    description: "Help with downloads, subscriptions, or account access.",
    responseTime: "Replies within 1-2 business days",
    icon: FaEnvelope,
  },
  {
    title: "Licensing requests",
    email: "licensing@njkmusic.com",
    description: "Custom clearances, sync requests, or commercial usage questions.",
    responseTime: "Typically answers within 1 business day",
    icon: FaFileContract,
  },
  {
    title: "Technical assistance",
    email: "tech@njkmusic.com",
    description: "Issues with stems, downloads, or integration with your tools.",
    responseTime: "Replies within 1-2 business days",
    icon: FaCog,
  },
  {
    title: "Content claims",
    email: "claims@njkmusic.com",
    description: "Report Content ID matches or platform strikes for NJK releases.",
    responseTime: "Priority responses within 24 hours",
    icon: FaBolt,
  },
];

const officeInfo = {
  company: "Enhold s.r.o.",
  address: ["Drobneho 1900/2", "841 02 Bratislava", "Dubravka district", "Slovakia"],
  hours: ["Monday to Friday", "09:00-17:00 CET"],
};

const commonTopics = [
  {
    title: "Licensing & usage",
    links: [
      { text: "Music licensing overview", href: "/license" },
      { text: "Attribution guidelines", href: "/help/attribution" },
      { text: "Platform policies", href: "/help/platforms" },
    ],
  },
  {
    title: "Technical help",
    links: [
      { text: "Troubleshooting guide", href: "/help/technical" },
      { text: "Purchase questions", href: "/help/purchase-issues" },
      { text: "Content ID support", href: "/help/content-id" },
    ],
  },
  {
    title: "Get to know NJK",
    links: [
      { text: "About the team", href: "/about" },
      { text: "Creator FAQ", href: "/faq" },
      { text: "Support centre", href: "/help" },
    ],
  },
];

export default function ContactPage() {
  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] py-16 sm:py-24">
        <LabelHeroGL accent="#C62828" intensity={0.55} />
        <div className="relative z-[2] mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-[900px]">
            <span className="inline-flex w-fit items-center gap-2 border border-[#2A272D] bg-[#0B0A0C] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
              Get in touch
            </span>
            <div className="mt-6 max-w-2xl space-y-4">
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                Contact NJK Music
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Reach out for support, licensing, partnerships, or anything else. We&apos;ll route you to the right person
                and keep things moving.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <section>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Email the right team
                </h2>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
                  Responsive within 24-48 hrs
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.title}
                      className="flex h-full flex-col gap-4 border border-[#2A272D] bg-[#0B0A0C] p-6 transition hover:border-[#F4F1EC] hover:bg-white/10"
                    >
                      <span className="inline-flex h-10 w-10 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{method.title}</h3>
                        <p className="mt-2 text-sm text-[#A39E98]">{method.description}</p>
                      </div>
                      <div className="mt-auto space-y-2 text-sm">
                        <a
                          href={`mailto:${method.email}`}
                          className="font-medium text-[#FF6B5E] transition hover:text-white"
                        >
                          {method.email}
                        </a>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                          {method.responseTime}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border border-dashed border-[#3A363E] bg-[#0B0A0C] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-white">Need something else?</h2>
              <p className="mt-3 text-sm text-[#A39E98]">
                Share as much detail as you can, including links to the platforms or videos affected. Our team routes
                every message to the right specialist and will follow up with next steps.
              </p>
              <Link
                href="mailto:support@njkmusic.com"
                className="mt-6 inline-flex items-center gap-2 bg-[#C62828] px-5 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              >
                Email support@njkmusic.com
              </Link>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="border border-[#2A272D] bg-[#0B0A0C] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                  <FaBuilding className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold text-white">Registered office</h2>
              </div>
              <div className="mt-6 space-y-2 text-sm text-[#A39E98]">
                <p className="font-medium text-white">{officeInfo.company}</p>
                {officeInfo.address.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-[#A39E98]">
                <FaClock className="h-4 w-4 text-[#8C8781]" />
                <div>
                  {officeInfo.hours.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </section>

            <section className="border border-[#2A272D] bg-[#0B0A0C] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white">Press & partnerships</h2>
              <p className="mt-3 text-sm text-[#A39E98]">
                For media features, distribution opportunities, or collaborative releases, reach us directly at{" "}
                <a href="mailto:partnerships@njkmusic.com" className="font-medium text-[#FF6B5E] hover:text-white">
                  partnerships@njkmusic.com
                </a>
                .
              </p>
            </section>
          </aside>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">Quick links</h2>
          <p className="mt-2 text-sm text-[#A39E98]">
            Start with these resources if you&apos;re looking for immediate answers.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {commonTopics.map((topic) => (
              <div key={topic.title} className="border border-[#2A272D] bg-[#0B0A0C] p-6">
                <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {topic.links.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="group/link inline-flex items-center gap-2 text-[#FF6B5E] transition hover:text-white"
                      >
                        <FaChevronRight className="h-3 w-3 text-[#8C8781] transition-transform group-hover/link:translate-x-1" />
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 border border-[#2A272D] bg-[#0B0A0C] p-8 text-center sm:p-12">
          <p className="mx-auto max-w-2xl text-sm text-[#A39E98] sm:text-base">
            We partner closely with creators, agencies, and studios around the world. If you need something specific,
            we&apos;re here to help you clear music quickly and confidently.
          </p>
          <Link
            href="/help"
            className="mt-8 inline-flex items-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold tracking-[0.2em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
          >
            Explore help centre
          </Link>
        </section>
      </div>
    </div>
  );
}
