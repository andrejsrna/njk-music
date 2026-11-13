import type { Metadata } from "next";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import {
  FaBan,
  FaCheckCircle,
  FaChevronLeft,
  FaEnvelope,
  FaFileSignature,
  FaFolderOpen,
  FaInfoCircle,
  FaListUl,
  FaShieldAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Licensing | ${SITE_NAME}`,
  description:
    "Understand how NJK Music licensing works across our labels, including royalty-free releases, rights-managed catalogs, attribution, and Content ID whitelisting.",
};

type HighlightCard = {
  title: string;
  description: string;
  bullets: string[];
  icon: IconType;
};

const licenseModels: HighlightCard[] = [
  {
    title: "Royalty-free labels",
    description:
      "Use these releases in streams, videos, and client work with clear, creator-friendly terms.",
    bullets: [
      "Great for YouTube, Twitch, TikTok, reels, podcasts, and long-form content",
      "Designed for creators, studios, and editors working for clients",
      "Follow attribution guidance where required (when the platform allows)",
    ],
    icon: FaCheckCircle,
  },
  {
    title: "Rights-managed labels",
    description:
      "Some catalogs require a purchase/licence before use and may run Content ID monetization.",
    bullets: [
      "A purchase/licence is required before any commercial or monetized use",
      "Creators should request a whitelist after licensing (to prevent/resolve claims)",
      "Contact us if you need a bespoke agreement (ads, sync, distribution) or invoicing help",
    ],
    icon: FaShieldAlt,
  },
  {
    title: "Custom clearance",
    description:
      "Need sync, distribution, or something outside standard usage? We’ll scope it and confirm approvals.",
    bullets: [
      "Ads, trailers, broadcast, and brand campaigns",
      "Apps, games, and interactive experiences",
      "DSP releases and compilations",
    ],
    icon: FaFileSignature,
  },
];

const restrictedUses = [
  "Releasing NJK tracks as your own music or uploading them to digital streaming platforms.",
  "Creating NFTs, AI training datasets, or other derivatives that redistribute the audio files.",
  "Using the catalog in national or broadcast advertising without written approval.",
  "Reselling, sublicensing, or offering the music as part of a competing library or subscription.",
  "Removing or altering embedded metadata in a way that obscures ownership.",
];

export default function LicensePage() {
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

            <div className="mt-6 max-w-3xl space-y-4">
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                How NJK Music licensing works
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Our catalog includes both <span className="text-white">royalty-free</span> releases (creator-ready) and{" "}
                <span className="text-white">rights-managed</span> catalogs (purchase/licence + Content ID workflows).
                Use this page to confirm what’s allowed, how to credit, and when to reach out for clearance.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/help/attribution"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Attribution guide
              </Link>
              <Link
                href="/help/purchase-guide"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Purchase guide
              </Link>
              <Link
                href="/help/content-id"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Content ID guide
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
              >
                Contact licensing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="license-models">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="license-models" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                Licensing models
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                The right workflow depends on which label a release belongs to.
              </p>
            </div>
            <Link
              href="/music"
              className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98] hover:text-[#F4F1EC]"
            >
              Browse music
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {licenseModels.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex h-full flex-col gap-4 border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-[#A39E98]">{item.description}</p>
                  </div>
                  <ul className="mt-2 space-y-2 text-sm text-[#A39E98]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <FaCheckCircle className="mt-1 h-3.5 w-3.5 text-[#FF6B5E]" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {item.title === "Rights-managed labels" ? (
                    <div className="mt-auto flex flex-wrap gap-3 pt-2">
                      <Link
                        href="/help/purchase-guide"
                        className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                      >
                        Purchase guide
                      </Link>
                      <Link
                        href="/labels/jazz-and-bass"
                        className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                      >
                        Jazz &amp; Bass
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="how-to-check">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaInfoCircle className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="how-to-check" className="text-xl font-semibold text-white">
                  How to know which model applies
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  The license model depends on the label. Check the label name on the release page (or open the label
                  page) before you publish monetized content.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="border border-[#2A272D] bg-black/20 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  1) Open the release
                </div>
                <p className="mt-2 text-sm text-[#A39E98]">
                  Go to the track page and confirm the label shown under the title.
                </p>
                <div className="mt-4">
                  <Link
                    href="/music"
                    className="text-sm font-medium text-[#FF6B5E] hover:text-white"
                  >
                    Browse music →
                  </Link>
                </div>
              </div>

              <div className="border border-[#2A272D] bg-black/20 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  2) Check the label page
                </div>
                <p className="mt-2 text-sm text-[#A39E98]">
                  Label pages summarize whether a catalog is creator-ready or rights-managed.
                </p>
                <div className="mt-4">
                  <Link
                    href="/labels"
                    className="text-sm font-medium text-[#FF6B5E] hover:text-white"
                  >
                    Browse labels →
                  </Link>
                </div>
              </div>

              <div className="border border-[#2A272D] bg-black/20 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  3) Monetized catalog?
                </div>
                <p className="mt-2 text-sm text-[#A39E98]">
                  If the release is monetized via Content ID, licensed creators should request a whitelist.
                </p>
                <div className="mt-4">
                  <Link
                    href="/help/content-id"
                    className="text-sm font-medium text-[#FF6B5E] hover:text-white"
                  >
                    Content ID steps →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="included">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaFolderOpen className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="included" className="text-xl font-semibold text-white">
                  What’s typically included (royalty-free releases)
                </h2>
                <p className="max-w-2xl text-sm text-[#A39E98]">
                  Most creator-ready releases are cleared for common platform usage. Always follow any label-specific
                  notes on the track page.
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {[
                "Streams, VODs, highlight reels, shorts, and reels (with monetization enabled)",
                "YouTube, Twitch, Kick, Instagram, TikTok, podcasts, and community clips",
                "Client deliverables (edits, campaigns, and social cutdowns) with proper credit where required",
                "Internal projects (presentations, courses, product demos, prototypes)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="attribution">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                  <FaListUl className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <h2 id="attribution" className="text-xl font-semibold text-white">
                    Attribution
                  </h2>
                  <p className="max-w-2xl text-sm text-[#A39E98]">
                    When a platform gives you a description or metadata field, credit the release and link back when
                    possible.
                  </p>
                </div>
              </div>

              <Link
                href="/help/attribution"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Open attribution guide
              </Link>
            </div>

            <div className="mt-6 border border-[#2A272D] bg-black/20 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                Example format
              </div>
              <p className="mt-2 text-sm text-[#A39E98]">
                Track: <span className="text-white">[Title]</span> —{" "}
                <span className="text-white">[Label / NJK Music]</span> · Licensed via{" "}
                <span className="text-white">njkmusic.com</span>
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="content-id">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                  <FaInfoCircle className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <h2 id="content-id" className="text-xl font-semibold text-white">
                    Content ID &amp; whitelisting
                  </h2>
                  <p className="max-w-2xl text-sm text-[#A39E98]">
                    Some catalogs are monetized with Content ID. If you’re licensed and you still get a claim, follow
                    the guide and contact us with the claim details so we can whitelist or resolve it.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/help/content-id"
                  className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  Content ID guide
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
                >
                  Request whitelist
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="restricted">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h2 id="restricted" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  What’s not allowed
                </h2>
                <p className="text-sm text-[#A39E98]">
                  These use cases require a separate agreement or are prohibited entirely.
                </p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center border border-[#2A272D] bg-rose-500/10 text-rose-300">
                <FaBan className="h-5 w-5" aria-hidden />
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-[#A39E98]">
              {restrictedUses.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border border-dashed border-[#3A363E] bg-black/20 px-4 py-3"
                >
                  <FaBan className="mt-1 h-3.5 w-3.5 text-rose-300" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="custom">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="custom" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Need a custom license?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Share project details (platforms, scope, timeline, distribution plans) and we’ll confirm what’s
                  needed—clearance, whitelisting, or a bespoke agreement.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:licensing@njkmusic.com"
                  className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  Email licensing@njkmusic.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  Visit contact page
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
