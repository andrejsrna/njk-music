import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import type { IconType } from "react-icons";
import {
  FaChevronLeft,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLock,
  FaTimesCircle,
} from "react-icons/fa";

type RuleCard = {
  title: string;
  description: string;
  icon: IconType;
  items: string[];
  tone: "do" | "dont" | "note";
};

const rules: RuleCard[] = [
  {
    title: "Allowed",
    description: "Typical creator workflows and everyday usage.",
    icon: FaCheckCircle,
    tone: "do",
    items: [
      "Use tracks in videos, livestreams, reels, shorts, and podcasts (where the release is licensed appropriately).",
      "Use tracks in client deliverables when the music stays embedded in the final edit.",
      "Basic edits like trimming, fades, volume matching, and transitions.",
      "Credit the release when a platform gives you a description/metadata field (when required).",
    ],
  },
  {
    title: "Not allowed",
    description: "These require a separate agreement or are prohibited.",
    icon: FaTimesCircle,
    tone: "dont",
    items: [
      "Reuploading our tracks as standalone audio or claiming them as your own music.",
      "Reselling, sublicensing, or bundling the audio into another library/subscription.",
      "Redistributing raw files (stems, WAV/MP3) as deliverables to third parties.",
      "Using tracks in large paid ad/broadcast distribution without written clearance (especially rights-managed catalogs).",
    ],
  },
  {
    title: "Content ID notes",
    description: "How to avoid monetization surprises.",
    icon: FaInfoCircle,
    tone: "note",
    items: [
      "Content ID is automated and can still match audio even when you’re licensed.",
      "For rights-managed / monetized catalogs, licensed creators should request a whitelist to prevent claims.",
      "If you receive a claim: save claim details + your receipt/order ID and contact support.",
    ],
  },
];

const safeEditing: string[] = [
  "Trim to length, add fades, normalize loudness, and duck under voiceover.",
  "Use short segments as beds, intros/outros, or transitions.",
  "Combine multiple NJK Music tracks in one edit (list credits if possible).",
];

const avoidEditing: string[] = [
  "Creating remixes/derivative songs intended for redistribution.",
  "Removing metadata in a way that obscures ownership.",
  "Publishing the music as a separate “album/playlist” of your own.",
];

export default function GuidelinesPage() {
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
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                Usage guidelines
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Practical rules for using NJK Music releases in content, client work, and campaigns—plus how Content ID
                and whitelisting fits in for monetized catalogs.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/license"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Licensing overview
              </Link>
              <Link
                href="/help/attribution"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Attribution templates
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
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="rules">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="rules" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                The core rules
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                The label’s license model always wins—check the release page if you’re unsure.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
              Quick reference
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {rules.map((rule) => {
              const Icon = rule.icon;
              const badge =
                rule.tone === "do"
                  ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-200"
                  : rule.tone === "dont"
                    ? "border-rose-300/30 bg-[#C62828]/20 text-[#FF6B5E]"
                    : "border-[#2A272D] bg-[#0B0A0C] text-[#F4F1EC]";

              return (
                <div
                  key={rule.title}
                  className="flex h-full flex-col border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className={`inline-flex items-center  border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${badge}`}>
                      {rule.title}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-[#A39E98]">{rule.description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-[#A39E98]">
                    {rule.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="editing">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaCheckCircle className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="editing" className="text-xl font-semibold text-white">
                  Editing guidelines
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  Basic editing is fine. The goal is to fit the track into your content—not to redistribute the music as
                  a new standalone product.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="border border-[#2A272D] bg-black/20 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  Safe edits
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#A39E98]">
                  {safeEditing.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[#2A272D] bg-black/20 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  Avoid
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#A39E98]">
                  {avoidEditing.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-rose-200" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="important">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#C62828]/20 text-[#FF6B5E]">
                <FaLock className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="important" className="text-xl font-semibold text-white">
                  When to contact us first
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  If you’re running paid ads, broadcast distribution, or a rights-managed catalog, reach out before
                  publishing so we can confirm clearance and whitelisting steps.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
              >
                Contact support
              </Link>
              <Link
                href="/help/purchase-guide"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Purchase guide
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="support">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="support" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Have a specific scenario?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Send us the release link, your platform, and how you plan to use the music (monetized channel, client
                  work, ads, etc.). We’ll confirm the correct model and next steps.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  Open contact page
                </Link>
                <a
                  href="mailto:support@njkmusic.com"
                  className="inline-flex items-center justify-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                  Email support@njkmusic.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

