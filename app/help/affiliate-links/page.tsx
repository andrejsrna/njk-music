import type { Metadata } from "next";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import {
  FaChevronLeft,
  FaCompactDisc,
  FaExternalLinkAlt,
  FaHeadphones,
  FaInfoCircle,
  FaPlug,
  FaSlidersH,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Recommended Music Tools | ${SITE_NAME}`,
  description:
    "Recommended DJ stores, producer tools, plugins, sample libraries, and music production resources selected for NJK Music creators.",
};

type AffiliateLink = {
  name: string;
  description: string;
  href: string;
  icon: IconType;
};

type LinkGroup = {
  title: string;
  eyebrow: string;
  description: string;
  links: AffiliateLink[];
};

const groups: LinkGroup[] = [
  {
    title: "DJ Group",
    eyebrow: "For DJs",
    description:
      "Stores and DJ-focused platforms for browsing releases, building crates, and keeping sets supplied with fresh music.",
    links: [
      {
        name: "Beatport",
        description:
          "Electronic music store for DJ downloads, charts, labels, and club-ready release discovery.",
        href: "https://www.beatport.com/?a_aid=69dac828ced75",
        icon: FaHeadphones,
      },
      {
        name: "DJcity",
        description:
          "DJ record pool and music discovery platform for open-format DJs, edits, and curated selections.",
        href: "https://www.djcity.com/?a_aid=69dac828ced75",
        icon: FaCompactDisc,
      },
    ],
  },
  {
    title: "Producer Group",
    eyebrow: "For producers",
    description:
      "Production tools, plugins, samples, and sound libraries for building tracks, edits, intros, and creator-ready music.",
    links: [
      {
        name: "Plugin Boutique",
        description:
          "Plugins, virtual instruments, effects, bundles, and production utilities for modern music workflows.",
        href: "https://pluginboutique.com/?a_aid=69dac828ced75",
        icon: FaPlug,
      },
      {
        name: "Loopcloud",
        description:
          "Cloud-based sample discovery, loop browsing, and DAW-connected sound management for producers.",
        href: "https://loopcloud.com/?a_aid=69dac828ced75",
        icon: FaSlidersH,
      },
      {
        name: "Loopmasters",
        description:
          "Sample packs, loops, MIDI, presets, and production-ready sound libraries across electronic genres.",
        href: "https://loopmasters.com/?a_aid=69dac828ced75",
        icon: FaCompactDisc,
      },
    ],
  },
];

export default function AffiliateLinksPage() {
  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] py-16 sm:py-24">
        <LabelHeroGL accent="#C62828" intensity={0.55} />
        <div className="relative z-[2] mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-[900px]">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#FF6B5E] hover:text-white"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
              Back to Help Centre
            </Link>

            <div className="mt-8 max-w-3xl space-y-4">
              <span className="inline-flex w-fit items-center gap-2 border border-[#2A272D] bg-[#0B0A0C] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
                Recommended tools
              </span>
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                Music tools for DJs and producers
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                A short list of platforms we recommend for release discovery, DJ downloads, plugins, samples, and
                production workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="affiliate-disclosure">
          <div className="border border-cyan-300/20 bg-cyan-300/10 p-6">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-cyan-200/20 bg-[#FF6B5E]/10 text-white">
                <FaInfoCircle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="affiliate-disclosure" className="text-lg font-semibold text-white">
                  Affiliate disclosure
                </h2>
                <p className="mt-2 text-sm text-[#F4F1EC]">
                  Some links on this page are affiliate links. If you purchase through them, NJK Music may earn a
                  commission at no extra cost to you. We only list platforms that fit DJ, producer, or creator workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        {groups.map((group) => (
          <section key={group.title} aria-labelledby={`${group.title.toLowerCase().replaceAll(" ", "-")}-heading`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B5E]">
                  {group.eyebrow}
                </span>
                <h2 id={`${group.title.toLowerCase().replaceAll(" ", "-")}-heading`} className="mt-2 text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  {group.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[#A39E98]">{group.description}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.links.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="group flex h-full flex-col gap-5 border border-[#2A272D] bg-[#0B0A0C] p-6 transition hover:border-[#F4F1EC] hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <FaExternalLinkAlt className="mt-1 h-4 w-4 text-[#8C8781] transition group-hover:text-[#FF6B5E]" aria-hidden />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                      <p className="text-sm leading-6 text-[#A39E98]">{item.description}</p>
                    </div>
                    <span className="mt-auto text-sm font-medium text-[#FF6B5E] transition group-hover:text-white">
                      Open platform
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
