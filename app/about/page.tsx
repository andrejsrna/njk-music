import { Metadata } from "next";
import Link from "next/link";
import {
  FaHeadphones,
  FaHandshake,
  FaRegLightbulb,
  FaShieldAlt,
  FaSpotify,
  FaUsers,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "About NJK Music | Creator-Ready Label Moods & Licensing",
  description:
    "Meet NJK Music — a multi-label music brand releasing across genres for listeners worldwide, with clear licensing and hands-on support.",
};

const missionHighlights = [
  {
    title: "Creator-First Music",
    description:
      "We release across multiple label moods designed to fit real projects — from content and campaigns to studios and live experiences.",
    icon: FaHeadphones,
  },
  {
    title: "Built for listeners",
    description:
      "We produce and release music for everyday listeners too — delivering label-led drops that stand on their own beyond any brief.",
    icon: FaSpotify,
  },
  {
    title: "Trusted Licensing",
    description:
      "Clear, transparent usage rights help teams move fast — whether you’re publishing content, running a campaign, or shipping a product.",
    icon: FaShieldAlt,
  },
];

const stats = [
  { label: "Label moods in the roster", value: "3+" },
  { label: "Creator-friendly releases", value: "75+" },
  { label: "Global markets reached", value: "190+" },
  { label: "Licensing partners", value: "40+" },
];

const timeline = [
  {
    year: "2018",
    title: "NJK Music launches",
    description:
      "The first catalogues release under No Copyright Gaming Music with a mission to keep gamers monetized.",
  },
  {
    year: "2021",
    title: "Global Distribution",
    description:
      "Streaming partnerships and DSP distribution come online, opening catalogues to new listeners worldwide.",
  },
  {
    year: "2024",
    title: "Label Expansion",
    description:
      "Creator feedback informs new ambient and jazz-driven labels to support a wider set of storytelling moments.",
  },
  {
    year: "Today",
    title: "Rights-Managed Innovation",
    description:
      "We serve both rights-managed and stream-safe releases, giving partners more flexibility for premium projects.",
  },
];

const values = [
  {
    title: "Curate with care",
    description:
      "Every release is checked for quality, clean metadata, and clear usage info.",
    icon: FaRegLightbulb,
  },
  {
    title: "Support every project",
    description:
      "Fast answers on licensing plus help with assets when you need something bespoke.",
    icon: FaUsers,
  },
  {
    title: "Protect the catalogue",
    description:
      "Clear agreements and systems that protect artists, partners, and releases.",
    icon: FaShieldAlt,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
            About NJK Music
          </span>
          <div className="mt-6">
            <div className="space-y-5">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                A multi-label music brand built for modern projects.
              </h1>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                NJK Music curates label moods across genres for creators, studios, agencies, and brands. Our catalogue
                spans stream-safe releases and rights-managed drops, so you can choose the right fit for content,
                campaigns, venues, or long-form productions—without guesswork. We also produce and release music for
                normal listeners on streaming platforms, building label identities that fans can follow.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:opacity-90"
                >
                  Connect with us
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/music"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/0 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-200 backdrop-blur transition hover:bg-white/5"
                >
                  Explore releases
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {missionHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur">
          <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
                What Guides Us
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Built on clarity and craft.
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                We focus on strong releases, clear licensing, and fast support—so listeners and teams can move with confidence.
              </p>
              <div className="grid gap-6 sm:grid-cols-3">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <article
                      key={value.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur"
                    >
                      <div className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cyan-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-semibold text-white">{value.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{value.description}</p>
                    </article>
                  );
                })}
              </div>
          </div>
        </section>

        <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
                Our Story
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Built in Bratislava, broadcasting worldwide.
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                NJK Music began in 2018 and grew into a multi-label studio releasing across different moods and genres.
                We work with producers and partners worldwide, with a focus on quality, consistency, and clear usage.
              </p>
              <p className="text-sm leading-relaxed text-slate-300">
                Based in Bratislava, we ship releases to streaming platforms, support licensing requests, and help teams
                get the right music quickly.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              {timeline.map((entry) => (
                <div key={entry.year} className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">{entry.year}</span>
                  <h3 className="mt-2 text-base font-semibold text-white">{entry.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-200 backdrop-blur">
                Get in touch
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Let’s build the soundtrack for your next story.
              </h2>
              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Whether you’re producing content, building a product, planning a campaign, or scoring a film, we can
                help you find the right label match and licensing path. Reach out for bespoke assets, custom music
                briefs, or partnership opportunities.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:opacity-90"
              >
                Contact team
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
              <FaSpotify className="h-4 w-4 text-emerald-500" />
              Streaming ready
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
              <FaShieldAlt className="h-4 w-4 text-cyan-200" />
              Licensing support
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">
              <FaUsers className="h-4 w-4 text-fuchsia-200" />
              Creator community
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
