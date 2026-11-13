import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import {
  FaChevronLeft,
  FaEnvelope,
  FaFileAlt,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa";

type ChecklistSection = {
  title: string;
  description: string;
  items: string[];
};

const noticeRequirements: ChecklistSection = {
  title: "DMCA takedown notice (what to include)",
  description:
    "To report alleged copyright infringement, your notice should include the following information:",
  items: [
    "Your full name and contact information (email + address)",
    "A description of the copyrighted work you believe is infringed",
    "The exact URL(s) of the allegedly infringing material on njkmusic.com",
    "A statement that you have a good faith belief the use is not authorized by the rights holder, agent, or law",
    "A statement that the information in the notice is accurate, under penalty of perjury",
    "A physical or electronic signature of the rights holder or authorized agent",
  ],
};

const counterNoticeRequirements: ChecklistSection = {
  title: "DMCA counter-notice (if your content was removed)",
  description:
    "If you believe your material was removed by mistake or misidentification, you may submit a counter-notice:",
  items: [
    "Your name, address, phone number, and email",
    "The URL(s) or description of the material that was removed",
    "A statement under penalty of perjury that you have a good faith belief the removal was a mistake or misidentification",
    "Your consent to the jurisdiction of the appropriate court (and acceptance of service of process from the claimant)",
    "A physical or electronic signature",
  ],
};

export default function DmcaPage() {
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
                DMCA
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                This page explains how to send a DMCA notice or counter-notice related to content hosted on
                njkmusic.com.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:dmca@njkmusic.com"
                className="inline-flex items-center justify-center gap-2 bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
              >
                <FaEnvelope className="h-4 w-4" aria-hidden />
                Email dmca@njkmusic.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="notice">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaFileAlt className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="notice" className="text-xl font-semibold text-white">
                  {noticeRequirements.title}
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  {noticeRequirements.description}
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {noticeRequirements.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="counter-notice">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaInfoCircle className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="counter-notice" className="text-xl font-semibold text-white">
                  {counterNoticeRequirements.title}
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  {counterNoticeRequirements.description}
                </p>
              </div>
            </div>

            <ul className="mt-6 grid gap-3 text-sm text-[#A39E98] sm:grid-cols-2">
              {counterNoticeRequirements.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="address">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-rose-500/10 text-rose-200">
                <FaLock className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="address" className="text-xl font-semibold text-white">
                  DMCA contact
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  Send notices to our designated email. Include URLs and complete information so we can respond quickly.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="border border-[#2A272D] bg-black/20 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  Email
                </div>
                <a
                  href="mailto:dmca@njkmusic.com"
                  className="mt-3 inline-block text-sm font-medium text-[#FF6B5E] hover:text-white"
                >
                  dmca@njkmusic.com
                </a>
              </div>

              <div className="border border-[#2A272D] bg-black/20 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                  Postal address
                </div>
                <div className="mt-3 space-y-1 text-sm text-[#A39E98]">
                  <div>No Copyright Gaming Music</div>
                  <div>Enhold s.r.o.</div>
                  <div>Drobného 1900/2</div>
                  <div>841 02 Bratislava - mestská časť Dúbravka</div>
                  <div>Slovakia</div>
                </div>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#8C8781]">
              This page is provided for informational purposes and does not constitute legal advice.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

