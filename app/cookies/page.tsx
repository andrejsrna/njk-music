import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import { FaChevronLeft, FaCookieBite, FaEnvelope, FaInfoCircle, FaLock } from "react-icons/fa";

type CookieCategory = {
  title: string;
  description: string;
  required: boolean;
  examples: string[];
};

const categories: CookieCategory[] = [
  {
    title: "Essential cookies",
    description:
      "These help the site function reliably (navigation, security, and basic preferences).",
    required: true,
    examples: [
      "Load balancing / security protections",
      "Remembering basic UI preferences (when applicable)",
      "Preventing abuse and spam",
    ],
  },
  {
    title: "Analytics cookies",
    description:
      "These help us understand how the site is used so we can improve pages and navigation.",
    required: false,
    examples: [
      "Anonymous page view counts",
      "Performance and error monitoring",
      "Feature usage metrics",
    ],
  },
  {
    title: "Preference cookies",
    description:
      "These remember optional choices (for example language or display preferences) to improve your experience.",
    required: false,
    examples: ["Language preference", "UI settings", "Remembering dismissed notices"],
  },
];

export default function CookiesPage() {
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
                Cookies
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                This page explains how NJK Music may use cookies and similar technologies to keep the site working and
                improve the experience.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Privacy policy
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
        <section aria-labelledby="what">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaCookieBite className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="what" className="text-xl font-semibold text-white">
                  What are cookies?
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  Cookies are small text files stored by your browser. Sites use them for essential functionality,
                  preferences, and (optionally) analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="categories">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="categories" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                Cookie categories
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                Not every category is always active. Some cookies may be set by third-party services we integrate with.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
              Overview
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.title}
                className="flex h-full flex-col border border-[#2A272D] bg-[#0B0A0C] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    {category.required ? (
                      <FaLock className="h-5 w-5" aria-hidden />
                    ) : (
                      <FaInfoCircle className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <span
                    className={`inline-flex items-center  border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                      category.required
                        ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-200"
                        : "border-[#2A272D] bg-[#0B0A0C] text-[#F4F1EC]"
                    }`}
                  >
                    {category.required ? "Required" : "Optional"}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-[#A39E98]">{category.description}</p>

                <ul className="mt-5 space-y-2 text-sm text-[#A39E98]">
                  {category.examples.map((example) => (
                    <li key={example} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="manage">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="manage" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Questions or requests?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  If you have questions about cookies or privacy on NJK Music, contact us and we’ll help.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:privacy@njkmusic.com"
                  className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                  Email privacy@njkmusic.com
                </a>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  Read privacy policy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

