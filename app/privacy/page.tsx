import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import {
  FaChevronLeft,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";

type Section = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
};

const sections: Section[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    description: "We collect only what we need to run and improve the site.",
    bullets: [
      "Basic usage data (pages visited, device/browser info) for performance and troubleshooting",
      "Email address if you subscribe to the newsletter",
      "Support messages you send us (and any details you include, like order IDs or URLs)",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use it",
    description: "We use data to operate the service, respond to requests, and improve the experience.",
    bullets: [
      "Operate and secure the website",
      "Send newsletter updates if you opted in",
      "Handle licensing, whitelisting, and claim support when you contact us",
      "Understand what pages are useful so we can improve navigation and content",
    ],
  },
  {
    id: "sharing",
    title: "Sharing",
    description: "We don’t sell personal data. We share only when necessary to operate the service.",
    bullets: [
      "Service providers that help run the site (hosting, email, analytics) where applicable",
      "Legal or enforcement requests when required by law",
      "Store/platform support flows when you request help and provide details to share",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    description: "You can reach out to access, correct, or request deletion of your personal data.",
    bullets: [
      "Request access to the personal data we hold about you",
      "Request correction of inaccurate data",
      "Request deletion where applicable",
      "Opt out of newsletters at any time (unsubscribe links where available)",
    ],
  },
];

export default function PrivacyPage() {
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
                Privacy policy
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                This policy explains how NJK Music collects and uses information when you visit njkmusic.com or contact
                us for support.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cookies"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Cookies
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
        <section aria-labelledby="highlights">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaShieldAlt className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="highlights" className="text-xl font-semibold text-white">
                  Key points
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  We keep data collection minimal and use it to run the site, provide support, and improve the catalog
                  experience.
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {[
                "We don’t sell your personal data.",
                "Newsletter signups store your email address and timestamp.",
                "You can request deletion or correction by emailing us.",
                "Some providers (hosting/email) may process data on our behalf.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label="Privacy policy sections">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-white">Jump to</h2>
                <p className="text-sm text-[#A39E98]">
                  Quick links to each section of the policy.
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
                <FaUserShield className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="contact" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Contact for privacy requests
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  For access, correction, or deletion requests, email us with enough detail to identify your request.
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
                <span className="inline-flex items-center justify-center gap-2 border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC]">
                  <FaLock className="h-4 w-4" aria-hidden />
                  Please don’t send passwords
                </span>
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

