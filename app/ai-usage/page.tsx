import type { Metadata } from "next";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import {
  FaChevronLeft,
  FaEnvelope,
  FaLightbulb,
  FaRobot,
  FaShieldAlt,
} from "react-icons/fa";
import { getCanonicalUrl } from "@/lib/env";

type Section = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

export const metadata: Metadata = {
  title: "AI Usage Information | NJK Music",
  description:
    "Transparency about where AI-assisted tools may be used across NJK Music releases and visuals, and how we review and clear what we publish.",
  alternates: {
    canonical: getCanonicalUrl("/ai-usage"),
  },
  openGraph: {
    title: "AI Usage Information | NJK Music",
    description:
      "Some NJK Music releases may include AI-assisted elements. Learn what that means, how we review it, and how to contact us.",
    url: getCanonicalUrl("/ai-usage"),
    siteName: "NJK Music",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AI Usage Information | NJK Music",
    description:
      "Transparency about AI-assisted tools used in NJK Music releases and visuals.",
  },
};

const sections: Section[] = [
  {
    id: "why-we-share-this",
    title: "Why we’re sharing this",
    description:
      "We want listeners and creators to know how releases are made, what’s human, what’s tool-assisted, and what that means for usage.",
    bullets: [
      "Transparency builds trust with listeners, creators, and partners",
      "Different platforms and clients have different requirements around AI",
      "Clear documentation helps avoid confusion when licensing or clearing usage",
    ],
  },
  {
    id: "where-ai-may-be-used",
    title: "Where AI may be used",
    description:
      "AI can be used as an assistive tool in parts of the workflow. Not every release uses it.",
    bullets: [
      "Artwork concepts or variations (e.g., cover art drafts)",
      "Sound design experiments and ideation",
      "Arrangement or composition assistance (human-directed)",
      "Editorial tasks like tagging, copy drafts, or metadata cleanup",
    ],
  },
  {
    id: "review-and-quality",
    title: "Review and quality control",
    description:
      "Regardless of tools, we publish only releases that pass our review for quality and consistency.",
    bullets: [
      "Human review of the final deliverables before publishing",
      "Listening checks for mix balance, clipping, artifacts, and mastering consistency",
      "Metadata and store links verified to match the correct release",
    ],
  },
  {
    id: "rights-and-usage",
    title: "Rights, licensing, and usage",
    description:
      "Usage rights come from the license model attached to each release/label, not from the tools used to create it.",
    bullets: [
      "Follow the release licensing rules shown on the single music page and the license page",
      "Some catalogues may be rights-managed and monetized with Content ID (clearance may be required)",
      "If you have a client/platform requirement (e.g., “no AI”), contact us and we’ll help you choose the right music",
    ],
  },
];

export default function AiUsagePage() {
  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] py-16 sm:py-24">
        <LabelHeroGL accent="#C62828" intensity={0.55} />
        <div className="relative z-[2] mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-[900px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#FF6B5E] hover:text-white"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>

            <div className="mt-8 max-w-3xl space-y-4">
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                AI usage information
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Some NJK Music releases and visuals may include AI-assisted elements. We want to be fully transparent
                about what that can mean, how we review what we publish, and how to reach us if you need specifics for a
                project, platform, or client policy.
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
                href="/contact"
                className="inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="summary">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaRobot className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="summary" className="text-xl font-semibold text-white">
                  Quick summary
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  AI can be used as an assistive tool in parts of our workflow, but every release goes through human
                  review before publishing.
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {[
                "Not every release uses AI-assisted tools.",
                "We can clarify AI involvement on request for a specific release.",
                "Licensing terms are defined by the release/label model shown on the site.",
                "If your platform/client requires “no AI”, contact us and we’ll help you choose.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="AI usage details">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">Jump to</h2>
                <p className="text-sm text-[#A39E98]">
                  Navigate to the part you care about.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-4 py-2 text-sm font-medium text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 space-y-12">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border border-[#2A272D] bg-[#0B0A0C] p-8"
              >
                <h2 className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm text-[#A39E98]">{section.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-[#A39E98]">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaLightbulb className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="contact" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Need a clear yes/no for a project?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Send us the release link (or slug) and where you plan to use it. We’ll confirm the best option and any
                  licensing/clearance steps.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                  Contact us
                </Link>
                <span className="inline-flex items-center justify-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC]">
                  <FaShieldAlt className="h-4 w-4" aria-hidden />
                  We keep requests confidential
                </span>
              </div>
              <p className="text-xs text-[#8C8781]">
                This page is for transparency and informational purposes and does not constitute legal advice.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

