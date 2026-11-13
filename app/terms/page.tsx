import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import { FaChevronLeft, FaEnvelope, FaFileContract, FaInfoCircle, FaLock } from "react-icons/fa";

type Section = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

const sections: Section[] = [
  {
    id: "overview",
    title: "Overview",
    description: "These terms apply to your use of njkmusic.com and related services.",
    bullets: [
      "The site provides a catalog of releases, labels, and guidance (licensing, claims, support).",
      "Purchases and downloads typically happen via third-party stores linked from release pages.",
      "By using the site, you agree to these terms and applicable policies (Privacy, Cookies).",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    description: "Use the site responsibly and don’t interfere with other users or the service.",
    bullets: [
      "Do not attempt to abuse, scrape, or disrupt the site or its APIs.",
      "Do not submit false claims, fraudulent requests, or misleading information.",
      "Do not upload or distribute malware or exploit vulnerabilities.",
    ],
  },
  {
    id: "content-and-licensing",
    title: "Content & licensing",
    description: "License terms depend on the label and release you use.",
    bullets: [
      "Some releases are creator-ready (royalty-free workflows); others are rights-managed and require purchase/licence.",
      "Do not reupload, resell, or redistribute raw audio files unless explicitly authorized.",
      "For paid ads, broadcast, distribution, or special cases, request clearance before publishing.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    description: "Stores and platforms have their own terms and policies.",
    bullets: [
      "Store checkout, refunds, invoices, and delivery are controlled by the store you purchase from.",
      "Platform rules (YouTube/Twitch/etc.) may affect claims and monetization behavior.",
      "We can guide support flows, but we don’t control third-party policy decisions.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    description: "We may update these terms over time.",
    bullets: [
      "Updates will be reflected on this page.",
      "Continued use of the site after an update means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
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
                Terms &amp; conditions
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                These terms describe how you can use njkmusic.com, how licensing and third-party stores work, and how to
                contact us for support.
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
                href="/cookies"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Cookies
              </Link>
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
        <section aria-label="Terms navigation">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">Jump to</h2>
                <p className="text-sm text-[#A39E98]">
                  Quick links to the main sections.
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
        </section>

        <section aria-label="Terms sections">
          <div className="space-y-12">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border border-[#2A272D] bg-[#0B0A0C] p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    {section.id === "content-and-licensing" ? (
                      <FaFileContract className="h-5 w-5" aria-hidden />
                    ) : section.id === "acceptable-use" ? (
                      <FaLock className="h-5 w-5" aria-hidden />
                    ) : (
                      <FaInfoCircle className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                      {section.title}
                    </h2>
                    <p className="text-sm text-[#A39E98]">{section.description}</p>
                  </div>
                </div>

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
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="contact" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Questions?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  If you have questions about these terms, email us and include links or details so we can respond
                  faster.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:terms@njkmusic.com"
                  className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#E03535]"
                >
                  <FaEnvelope className="h-4 w-4" aria-hidden />
                  Email terms@njkmusic.com
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                >
                  Contact form
                </Link>
              </div>
              <p className="text-xs text-[#8C8781]">
                This page is provided for informational purposes and does not constitute legal advice.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

