import Link from "next/link";
import LabelHeroGL from "@/app/labels/[slug]/LabelHeroGL";
import type { IconType } from "react-icons";
import {
  FaChevronLeft,
  FaEnvelope,
  FaExclamationTriangle,
  FaFileAudio,
  FaHeadphones,
  FaSlidersH,
  FaTools,
  FaVideo,
} from "react-icons/fa";

type Topic = {
  title: string;
  description: string;
  icon: IconType;
  symptoms: string[];
  fixes: string[];
};

type SpecCard = {
  title: string;
  icon: IconType;
  items: string[];
};

const specs: SpecCard[] = [
  {
    title: "Recommended formats",
    icon: FaFileAudio,
    items: ["WAV (preferred)", "MP3 320kbps (common)", "Lossless formats when provided by the store"],
  },
  {
    title: "Export / delivery",
    icon: FaVideo,
    items: [
      "Keep music under voiceover (ducking) when needed",
      "Avoid clipping on the master bus",
      "Keep a copy of the final export + project file",
    ],
  },
  {
    title: "Playback & tools",
    icon: FaTools,
    items: [
      "Any modern DAW/editor (Premiere, Resolve, Final Cut, Ableton, etc.)",
      "Stable connection for large downloads",
      "A player that handles WAV/MP3 correctly",
    ],
  },
];

const topics: Topic[] = [
  {
    title: "Audio sounds distorted or low-quality",
    description:
      "Most issues come from compressed sources, incorrect export settings, or double-encoding.",
    icon: FaHeadphones,
    symptoms: ["Crackles/distortion", "Swishy/high-frequency artifacts", "Audio sounds muffled"],
    fixes: [
      "Use the highest-quality source you have (prefer WAV over streaming audio)",
      "Avoid double-encoding (don’t export MP3 from an MP3 if you can avoid it)",
      "Check sample rate and bitrate settings in your editor/export",
      "Make sure your master is not clipping (leave headroom)",
    ],
  },
  {
    title: "Volume is inconsistent (too loud / too quiet)",
    description:
      "Mismatch between voiceover and music is the #1 editing complaint. Fix it with loudness and ducking.",
    icon: FaSlidersH,
    symptoms: ["Music fights the voice", "Music jumps between scenes", "Peaks are clipping"],
    fixes: [
      "Lower the music bed and use ducking under speech",
      "Normalize dialogue and then set music relative to it",
      "Add a limiter on the master to avoid accidental clipping",
      "If exporting for streaming platforms, consider loudness targets (LUFS) for your format",
    ],
  },
  {
    title: "Streaming / OBS issues",
    description:
      "If music desyncs or glitches on stream, it’s usually buffering or audio device settings.",
    icon: FaVideo,
    symptoms: ["Audio desync", "Dropouts during live streams", "OBS audio conflicts"],
    fixes: [
      "Check your audio device sample rate and keep it consistent (OS + OBS)",
      "Increase buffer size if you hear dropouts",
      "Avoid routing through multiple virtual devices unless necessary",
      "Test a local recording first (it isolates network issues)",
    ],
  },
  {
    title: "File or metadata problems",
    description:
      "Sometimes files are missing, archives fail, or metadata looks wrong in your library.",
    icon: FaFileAudio,
    symptoms: ["Download link fails", "Archive won’t open", "Track name/artist looks incorrect"],
    fixes: [
      "Re-download on a stable connection and verify file size if possible",
      "Try a different browser/device for the download",
      "If it’s store delivery, contact the store support with your order ID",
      "If you need help verifying a release, send us the release link + receipt/order ID",
    ],
  },
];

export default function TechnicalPage() {
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
                Technical help
              </h1>
              <p className="text-base text-[#A39E98] sm:text-lg">
                Troubleshooting for downloads, audio quality, export settings, and streaming setups. If you’re stuck,
                send us your release link + order ID/receipt and we’ll help.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/help/purchase-issues"
                className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
              >
                Purchase issues
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
        <section aria-labelledby="specs">
          <div>
            <h2 id="specs" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
              Quick specs
            </h2>
            <p className="mt-2 text-sm text-[#A39E98]">
              A few defaults that prevent most technical issues.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.title}
                  className="border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{spec.title}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-[#A39E98]">
                    {spec.items.map((item) => (
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

        <section aria-labelledby="topics">
          <div>
            <h2 id="topics" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
              Troubleshooting topics
            </h2>
            <p className="mt-2 text-sm text-[#A39E98]">
              Pick the closest issue and try the fixes.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.title}
                  className="border border-[#2A272D] bg-[#0B0A0C] p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                      <p className="text-sm text-[#A39E98]">{topic.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="border border-[#2A272D] bg-black/20 p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                        Symptoms
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-[#A39E98]">
                        {topic.symptoms.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 bg-rose-200" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-[#2A272D] bg-black/20 p-5">
                      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A39E98]">
                        Fixes
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-[#A39E98]">
                        {topic.fixes.map((item) => (
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

        <section aria-labelledby="support">
          <div className="border border-[#2A272D] bg-[#0B0A0C] p-10">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-[#2A272D] bg-[#0B0A0C] text-[#FF6B5E]">
                <FaEnvelope className="h-6 w-6" aria-hidden />
              </span>
              <div className="space-y-3">
                <h2 id="support" className="text-3xl font-black uppercase tracking-[-0.03em] [font-stretch:115%]">
                  Still stuck?
                </h2>
                <p className="text-sm text-[#A39E98] sm:text-base">
                  Email us your release link, your platform/editor, and what you tried. If it’s purchase/download
                  related, include your order ID/receipt.
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
                  className="inline-flex items-center justify-center border border-[#F4F1EC] bg-transparent px-6 py-3 text-sm font-semibold text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405]"
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

