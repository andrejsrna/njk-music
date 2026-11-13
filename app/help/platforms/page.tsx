import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import type { IconType } from "react-icons";
import {
  FaChevronLeft,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaFilm,
  FaLock,
  FaPodcast,
} from "react-icons/fa";
import { SiInstagram, SiTiktok, SiTwitch, SiYoutube } from "react-icons/si";

type PlatformCard = {
  name: string;
  description: string;
  status: "Approved" | "Approved with notes";
  icon: IconType;
  goodFor: string[];
  doThis: string[];
};

type RestrictedUse = {
  title: string;
  description: string;
  icon: IconType;
  action: string;
};

const platforms: PlatformCard[] = [
  {
    name: "YouTube",
    description:
      "Long-form videos, shorts, livestream VODs, and highlight edits. Content ID can still match audio, so keep receipts and request whitelisting when needed.",
    status: "Approved with notes",
    icon: SiYoutube,
    goodFor: [
      "Livestream VODs and highlights",
      "Monetized long-form uploads",
      "Shorts and reels-style edits",
    ],
    doThis: [
      "Add attribution in the description when possible",
      "Keep your purchase/licence proof (order ID / receipt)",
      "If you’re licensed and get a claim, request a whitelist",
    ],
  },
  {
    name: "Twitch",
    description:
      "Livestreams, VOD replays, and clips. Use a panel or chatbot command so attribution stays visible across clips and VODs.",
    status: "Approved",
    icon: SiTwitch,
    goodFor: ["Live streams", "Clips and highlights", "VOD archives"],
    doThis: [
      "Use a stream panel or `!music` command for attribution",
      "Keep receipts for rights-managed releases",
      "If Content ID affects exports, follow the claim steps",
    ],
  },
  {
    name: "TikTok",
    description:
      "Short-form edits and teasers. Caption space is limited—keep attribution short and use the domain when you can’t link.",
    status: "Approved with notes",
    icon: SiTiktok,
    goodFor: ["Short-form edits", "Teasers and snippets", "Behind-the-scenes clips"],
    doThis: [
      "Use a short credit in caption or pinned comment",
      "Keep a copy of your proof of licence for brand work",
      "If a claim happens, send us the post URL + claim details",
    ],
  },
  {
    name: "Instagram",
    description:
      "Reels, stories, and posts. For campaigns and sponsored work, confirm the release’s license model (royalty-free vs rights-managed).",
    status: "Approved with notes",
    icon: SiInstagram,
    goodFor: ["Reels and stories", "Lifestyle edits", "Brand recaps"],
    doThis: [
      "Add a short credit in caption when possible",
      "For sponsored/paid distribution, request clearance if needed",
      "If you’re licensed and a claim happens, request whitelisting",
    ],
  },
  {
    name: "Podcasts",
    description:
      "Intros, beds, and transitions for show episodes. Make sure the track is licensed appropriately for distribution and sponsorships.",
    status: "Approved with notes",
    icon: FaPodcast,
    goodFor: ["Podcast intros/outros", "Background beds", "Episode transitions"],
    doThis: [
      "Keep a record of the episode + timestamp where music appears",
      "Use attribution in show notes when possible",
      "For broad distribution/sync questions, contact us",
    ],
  },
  {
    name: "Client deliverables",
    description:
      "Edits and campaign assets delivered to a client are typically OK when the music stays embedded. Redistribution of raw audio files is not allowed.",
    status: "Approved with notes",
    icon: FaFilm,
    goodFor: ["Agency edits", "Brand content", "In-house marketing deliverables"],
    doThis: [
      "Keep your invoice/receipt and share proof with the client if needed",
      "Don’t share raw audio files as standalone deliverables",
      "For broadcast/paid ads, request clearance first",
    ],
  },
];

const restrictedUses: RestrictedUse[] = [
  {
    title: "Paid ads & broadcast",
    description:
      "Large paid distribution (national campaigns, broadcast, TV/radio) often requires custom clearance—especially for rights-managed catalogs.",
    icon: FaLock,
    action: "Request clearance via the contact page.",
  },
  {
    title: "Redistribution of audio",
    description:
      "Uploading our tracks as standalone audio, reselling them, or bundling them into another library is prohibited.",
    icon: FaExclamationTriangle,
    action: "Use the music only as part of your own content/edit.",
  },
  {
    title: "Unsure which license model applies?",
    description:
      "Some labels are royalty-free, others are rights-managed and monetized. If you’re not sure, don’t guess.",
    icon: FaExclamationTriangle,
    action: "Check the release page notes or contact us with the track link.",
  },
];

export default function PlatformsPage() {
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
                Platform usage
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Where you can use NJK Music releases—and what to do for attribution, receipts, Content ID claims, and
                rights-managed catalogs.
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
        <section aria-labelledby="supported-platforms">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="supported-platforms" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                Supported platforms
              </h2>
              <p className="mt-2 text-sm text-[#A39E98]">
                Most releases are safe for common creator workflows. Always follow release notes for label-specific
                rules.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#A39E98]">
              Quick reference
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.name}
                  className="flex h-full flex-col border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span
                      className={`inline-flex items-center  border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                        platform.status === "Approved"
                          ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-200"
                          : "border-[#2A272D] bg-[#0B0A0C] text-[#F4F1EC]"
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">{platform.name}</h3>
                  <p className="mt-2 text-sm text-[#A39E98]">{platform.description}</p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                        Good for
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-[#A39E98]">
                        {platform.goodFor.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <FaCheckCircle className="mt-0.5 h-4 w-4 text-[#FF6B5E]" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                        Do this
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-[#A39E98]">
                        {platform.doThis.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 bg-[#FF6B5E]" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="restrictions">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#C62828]/20 text-[#FF6B5E]">
                <FaLock className="h-5 w-5" aria-hidden />
              </span>
              <div className="space-y-2">
                <h2 id="restrictions" className="text-xl font-semibold text-white">
                  Restrictions &amp; when to contact us
                </h2>
                <p className="max-w-3xl text-sm text-[#A39E98]">
                  If your use case looks like one of these, don’t guess—reach out and we’ll confirm the correct path.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {restrictedUses.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="border border-[#2A272D] bg-black/20 p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <p className="mt-2 text-sm text-[#A39E98]">{item.description}</p>
                        <p className="mt-3 text-sm font-medium text-[#FF6B5E]">{item.action}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  Need help with a platform decision?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Send us the release link, your platform, and how you plan to use the music (monetized channel, client
                  work, ads, etc.). We’ll point you to the right license model and next steps.
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

