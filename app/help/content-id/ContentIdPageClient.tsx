"use client";

import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import Link from "next/link";
import CopyButton from "@/app/components/CopyButton";
import type { IconType } from "react-icons";
import {
  FaChevronLeft,
  FaClipboard,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileContract,
  FaInfoCircle,
  FaShieldAlt,
} from "react-icons/fa";

type ClaimType = {
  title: string;
  description: string;
  icon: IconType;
  urgency: "high" | "medium";
  steps: string[];
};

type Tip = {
  title: string;
  description: string;
  icon: IconType;
};

const claimTypes: ClaimType[] = [
  {
    title: "Claim on a licensed release",
    description:
      "You bought/licensed the release, but Content ID still matched your video. This is usually resolved by whitelisting your channel or clearing the specific claim.",
    icon: FaShieldAlt,
    steps: [
      "Collect your proof of purchase/licence (receipt or order ID)",
      "Send us your channel URL + video URL + claim screenshot (or claim ID)",
      "We whitelist your channel (or clear the specific claim) and confirm back",
      "Re-check the claim status after we confirm (platforms can take time to sync)",
    ],
    urgency: "high",
  },
  {
    title: "Third‑party / wrong owner claim",
    description:
      "Another party is claiming a track incorrectly. Send us details so we can validate ownership and advise the right dispute path.",
    icon: FaExclamationTriangle,
    steps: [
      "Take a screenshot of the claim details (claimant name + asset)",
      "Send us the video URL + claim details + the NJK Music release link",
      "We confirm whether it’s our catalog and guide you on the safest dispute flow",
      "If it’s our catalog, we’ll help clear it; if not, we’ll point you to the correct rights holder",
    ],
    urgency: "high",
  },
  {
    title: "Missing attribution / policy mismatch",
    description:
      "Some releases require attribution or have label-specific usage notes. Missing credit can slow down resolution and increase claim likelihood.",
    icon: FaFileContract,
    steps: [
      "Add/repair attribution in the description/metadata where possible",
      "Confirm you used the correct release (same title/label) and not a reupload",
      "If you’re still claimed, send us the claim details and your video URL",
      "We’ll confirm the license model (royalty‑free vs rights‑managed) and next steps",
    ],
    urgency: "medium",
  },
];

const preventionTips: Tip[] = [
  {
    title: "Keep attribution consistent",
    description:
      "Credit the label/track whenever the platform gives you a description or metadata field.",
    icon: FaFileContract,
  },
  {
    title: "Save receipts and order IDs",
    description:
      "For licensed or rights-managed releases, we’ll ask for proof of purchase/licence to whitelist you.",
    icon: FaShieldAlt,
  },
  {
    title: "Check label notes on the track page",
    description:
      "Some labels are rights-managed and require purchase/licence before use in monetized content.",
    icon: FaInfoCircle,
  },
  {
    title: "Request a whitelist early",
    description:
      "If your channel is monetized and a catalog runs Content ID, whitelisting prevents most headaches.",
    icon: FaClipboard,
  },
];

const disputeTemplate = `
Subject: Content ID claim – licensed track (NJK Music)

Hi, I received a Content ID claim on my video, but this track is licensed via NJK Music (njkmusic.com).

Details:
- Track: [Track title] – [Label / NJK Music]
- Release link: https://njkmusic.com/music/[slug]
- My channel/profile URL: [URL]
- Video URL (claimed): [URL]
- Claim ID / claimant (if shown): [ID / claimant]
- Proof of purchase/licence (order ID / receipt): [ID]

If needed, I can add/confirm attribution in the description.

Please whitelist my channel (or clear this specific claim) and let me know once it’s resolved.
`.trim();

export default function ContentIdPageClient() {
  return (
    <div className="overflow-x-clip bg-[#050405] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <section className="relative overflow-hidden border-b-2 border-[#F4F1EC] bg-[#0A0506] py-16 sm:py-24">
        <LabelHeroGL accent="#C62828" intensity={0.55} />
        <div className="relative z-[2] mx-auto max-w-[1360px] px-5 sm:px-8">
          <div className="max-w-[900px]">
            <Link
              href="/help"
              className="flex w-fit items-center gap-2 text-sm font-medium text-[#FF6B5E] hover:text-white"
            >
              <FaChevronLeft className="h-4 w-4" aria-hidden />
              Back to Help Centre
            </Link>

            <span className="mt-4 inline-flex w-fit items-center gap-2 border border-[#2A272D] bg-[#0B0A0C] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC]">
              Content ID
            </span>

            <div className="mt-6 max-w-3xl space-y-4">
              <h1 className="text-[clamp(40px,6vw,88px)] font-black uppercase leading-[0.9] tracking-[-0.05em] [font-stretch:125%] [overflow-wrap:anywhere]">
                Content ID &amp; claims
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Content ID is an automated system that matches audio in videos. Depending on the label, some releases
                are creator-ready (royalty-free) and some are rights-managed and monetized—meaning licensed creators may
                need a whitelist to avoid claims.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
              >
                Request whitelist / support
              </Link>
              <Link
                href="/help/purchase-guide"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Purchase guide
              </Link>
              <Link
                href="/help/attribution"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Attribution guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1360px] space-y-16 px-5 py-16 sm:px-8 sm:py-20">
        <section aria-labelledby="prevention">
          <div>
            <h2 id="prevention" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
              Prevent most claims
            </h2>
            <p className="mt-2 text-sm text-[#A39E98]">
              A bit of prep goes a long way—especially for monetized channels and rights-managed catalogs.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {preventionTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{tip.title}</h3>
                  <p className="mt-2 text-sm text-[#A39E98]">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="claim-types">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="claim-types" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                If you received a claim
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                Pick the closest scenario and follow the steps. When in doubt, contact us first.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
              Fast paths
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {claimTypes.map((claim) => {
              const Icon = claim.icon;
              return (
                <div
                  key={claim.title}
                  className="flex h-full flex-col border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className={`inline-flex items-center  border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                        claim.urgency === "high"
                          ? "border-rose-300/30 bg-[#C62828]/20 text-[#FF6B5E]"
                          : "border-[#2A272D] bg-[#0B0A0C] text-[#F4F1EC]"
                      }`}
                    >
                      {claim.urgency === "high" ? "High priority" : "Medium priority"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">{claim.title}</h3>
                  <p className="mt-2 text-sm text-[#A39E98]">{claim.description}</p>

                  <ul className="mt-5 space-y-2 text-sm text-[#A39E98]">
                    {claim.steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-0.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6B5E]">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-6">
                    <Link
                      href="/contact"
                      className="inline-flex w-full items-center justify-center border border-[#F4F1EC] bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
                    >
                      Contact support
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="template">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaClipboard className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 id="template" className="text-xl font-semibold text-white">
                  Claim email template
                </h2>
                <p className="mt-1 text-sm text-[#A39E98]">
                  Paste this into your email to us (or use it as your support message).
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden border border-[#2A272D] bg-black/40">
              <pre className="whitespace-pre-wrap p-6 text-sm text-[#F4F1EC]">{disputeTemplate}</pre>
            </div>

            <CopyButton template={disputeTemplate} />
          </div>
        </section>

        <section aria-labelledby="important">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#C62828]/20 text-[#FF6B5E]">
                <FaExclamationTriangle className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="important" className="text-xl font-semibold text-white">
                  Important
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  Don’t dispute blindly. If you’re unsure whether the release is royalty-free or rights-managed, contact
                  us first and include the claim details. We’ll tell you the fastest safe path.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="help">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="help" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Need help resolving a claim?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Send us your channel URL, the claimed video URL, and the claim details. If the release is licensed,
                  include your receipt/order ID so we can whitelist you quickly.
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

