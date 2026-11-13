import type { Metadata } from "next";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import CopyButton from "@/app/components/CopyButton";
import { SITE_NAME } from "@/lib/site";
import {
  FaChevronLeft,
  FaClipboard,
  FaEnvelope,
  FaFileContract,
  FaShieldAlt,
  FaYoutube,
  FaTwitch,
  FaHashtag,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: `Attribution | ${SITE_NAME}`,
  description:
    "Copy-paste attribution templates for YouTube, Twitch, and social posts. Learn what to include, where to place credits, and how to handle Content ID workflows.",
};

type AttributionCard = {
  title: string;
  icon: React.ReactNode;
  where: string;
  template: string;
  tips: string[];
};

const templates: AttributionCard[] = [
  {
    title: "YouTube (description)",
    icon: <FaYoutube className="h-5 w-5" aria-hidden />,
    where: "Video description (top or near credits), pinned comment if needed.",
    template: [
      "Track: [Title] — [Label / NJK Music]",
      "Licensed via: https://njkmusic.com/music/[slug]",
      "",
      "If you need proof: [order ID / receipt]",
    ].join("\n"),
    tips: [
      "Include the release link when possible (it helps support verify your license fast).",
      "If you used multiple tracks, list them as separate lines.",
      "Keep your receipt/order ID handy for rights-managed catalogs.",
    ],
  },
  {
    title: "Twitch (panel or chatbot command)",
    icon: <FaTwitch className="h-5 w-5" aria-hidden />,
    where: "Stream panels or a `!music` / `!track` chatbot command.",
    template: [
      "Now playing: [Title] — [Label / NJK Music]",
      "Release: https://njkmusic.com/music/[slug]",
      "",
      "More music: https://njkmusic.com/music",
    ].join("\n"),
    tips: [
      "A panel + a command is ideal for VOD replays and clips.",
      "Update the text when the track changes (or keep a short playlist list).",
      "For monetized catalogs, whitelist is recommended to prevent claims.",
    ],
  },
  {
    title: "Instagram / TikTok / Reels (caption)",
    icon: <FaHashtag className="h-5 w-5" aria-hidden />,
    where: "Caption, pinned comment, or the post description (where available).",
    template: [
      "Music: [Title] — [Label / NJK Music]",
      "Licensed via njkmusic.com",
      "",
      "#njkmusic",
    ].join("\n"),
    tips: [
      "Some platforms limit links in captions—use the domain line if you can’t link directly.",
      "If a claim happens, send us the post link + claim details + your proof of license.",
      "For brand work, keep a copy of the final deliverable + receipt/order ID.",
    ],
  },
];

const quickChecklist = [
  "Track title (or release name)",
  "Label name (or “NJK Music”)",
  "Link to the release page when possible",
  "Proof of purchase/licence for rights-managed catalogs (order ID / receipt)",
];

export default function AttributionPage() {
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
                Attribution templates
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Copy-paste credits for YouTube, Twitch, and social posts. These templates help you stay consistent and
                make support resolutions faster if you ever receive a claim.
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
        <section aria-labelledby="checklist">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaClipboard className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="checklist" className="text-xl font-semibold text-white">
                  Quick checklist
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  If you include these items, attribution is usually “good enough” for most platforms.
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {quickChecklist.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="templates">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="templates" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                Copy-paste templates
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                Pick your platform and swap the placeholders.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
              Templates
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.title}
                className="flex h-full flex-col border border-[#2A272D] bg-[#0B0A0C] p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    {template.icon}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{template.title}</h3>
                    <p className="text-sm text-[#A39E98]">{template.where}</p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden border border-[#2A272D] bg-black/40">
                  <pre className="whitespace-pre-wrap p-5 text-sm text-[#F4F1EC]">
                    {template.template}
                  </pre>
                </div>

                <CopyButton template={template.template} />

                <div className="mt-6 space-y-2 text-sm text-[#A39E98]">
                  {template.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="rights-managed">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                  <FaShieldAlt className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <h2 id="rights-managed" className="text-xl font-semibold text-white">
                    Rights-managed catalogs &amp; Content ID
                  </h2>
                  <p className="max-w-3xl text-sm text-[#A39E98]">
                    Some labels are rights-managed and monetized via Content ID. In those cases, attribution alone is
                    not enough—you need a purchase/licence, and licensed creators should request a whitelist to avoid
                    claims.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
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
                  Content ID steps
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

        <section aria-labelledby="need-help">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="need-help" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Need help with a claim?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Send us your channel URL, the video URL, and claim details. If the release is licensed, include your
                  order ID/receipt so we can whitelist you quickly.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:support@njkmusic.com"
                  className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                  Email support
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  Contact form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

