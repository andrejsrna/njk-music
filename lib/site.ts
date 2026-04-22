export const SITE_NAME = "NJK Music";
export const SITE_DOMAIN = "njkmusic.com";
export const SITE_DESCRIPTION =
  "NJK Music curates in-house label moods with creator-ready soundscapes for streamers, studios, and storytellers.";

export interface LabelDefinition {
  slug: string;
  name: string;
  short?: string;
  tagline: string;
  description: string;
  heroImage?: string;
  socialLinks?: {
    label: string;
    href: string;
  }[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  highlights: string[];
  callouts: {
    title: string;
    detail: string;
  }[];
}

export const LABEL_DEFINITIONS: Record<string, LabelDefinition> = {
  "chill-music-motif": {
    slug: "chill-music-motif",
    name: "Chill Music Motif",
    short: "CMM",
    tagline: "Lo-fi focus motifs for late-night study and deep work",
    description:
      "Chill Music Motif curates downtempo lo-fi, chillhop, and mellow electronica designed for focus, journaling, and ambient streaming. The label keeps melodies soft, textures warm, and mixes clean so creators can loop tracks for hours without listener fatigue.",
    seo: {
      title: "Chill Music Motif Label | LoFi & Study Beats",
      description:
        "Discover Chill Music Motif—creator-safe lo-fi study beats and chillhop instrumentals built for late-night focus, cozy streams, and ambient storytelling.",
      keywords: [
        "chill music motif",
        "lofi study beats label",
        "lofi focus music",
        "chillhop for creators",
        "royalty free lofi label",
      ],
    },
    highlights: [
      "Lo-fi and chillhop cues crafted for long-form focus, journaling, and coding streams",
      "Mixes engineered to sit under dialogue, voiceovers, and ASMR without masking",
      "Creator-friendly licensing for YouTube, Twitch, podcasts, and branded content",
    ],
    callouts: [
      { title: "Releases", detail: "Debut drop" },
      { title: "Focus", detail: "LoFi, Chillhop, Study Beats" },
      { title: "Rights", detail: "Royalty-free for creators" },
    ],
  },
  "no-copyright-gaming-music": {
    slug: "no-copyright-gaming-music",
    name: "No Copyright Gaming Music",
    short: "NCGM",
    tagline: "Stream-Safe Power Tracks for the Gaming Universe",
    description:
      "No Copyright Gaming Music delivers adrenaline-fueled soundtracks engineered for streamers, esports orgs, and content studios. Every release is cleared for monetisation, giving creators a reliable source of high-octane, copyright-free music.",
    heroImage: "/logo.png",
    seo: {
      title: "No Copyright Gaming Music Label | NJK Music",
      description:
        "Browse the complete No Copyright Gaming Music catalog – stream-safe, royalty-free releases designed for gamers, streamers, and digital storytellers.",
      keywords: [
        "no copyright gaming music",
        "ncgm label",
        "royalty free gaming music",
        "stream safe music",
        "gaming label",
      ],
    },
    highlights: [
      "Royalty-free catalogue engineered for Twitch, YouTube, and esports productions",
      "High-impact EDM, synthwave, hip hop, phonk, and cinematic cues for digital storytellers",
      "Creator-friendly licensing with lifetime usage and monetisation approved worldwide",
    ],
    callouts: [
      { title: "Releases", detail: "40+ curated drops" },
      { title: "Focus", detail: "Gaming, Esports, Streaming" },
    ],
  },
  "calm-spirit-music": {
    slug: "calm-spirit-music",
    name: "Calm Spirit Music",
    short: "CSM",
    tagline: "Mindful soundscapes for meditation, yoga, and deep focus",
    description:
      "Calm Spirit Music delivers serene, restorative compositions for meditation guides, wellness studios, and creators who need soothing background scores. Each release balances ambient textures with gentle rhythms to help audiences disconnect from stress and reconnect with calm.",
    seo: {
      title: "Calm Spirit Music Label | NJK Music",
      description:
        "Explore Calm Spirit Music releases—soothing, stream-safe ambient and meditation tracks for wellness creators, spas, and mindfulness apps.",
      keywords: [
        "calm spirit music",
        "meditation music label",
        "relaxing ambient music",
        "yoga background music",
        "wellness soundtrack",
      ],
    },
    highlights: [
      "Guided-meditation ready beds crafted for wellness studios and mindfulness apps",
      "Gentle ambient textures ideal for yoga flows, breathwork, and deep focus sessions",
      "Stream-safe licensing for creators, therapists, and live wellness broadcasts",
    ],
    callouts: [
      { title: "Releases", detail: "1st healing drop" },
      { title: "Focus", detail: "Meditation, Wellness, Relaxation" },
    ],
  },
  "jazz-and-bass": {
    slug: "jazz-and-bass",
    name: "Jazz & Bass",
    short: "J&B",
    tagline: "Funky liquid drum & bass with jazz-soaked grooves",
    description:
      "Jazz & Bass blends rolling liquid drum & bass grooves with jazz-soaked chords, warm basslines, and late-night swing. It’s built for listeners who want something smooth but energetic—perfect for drives, focus sessions, and chill club moments. For commercial/social usage, check licensing or contact our team for clearance.",
    heroImage: "/images/music/berts-jazz-bar.jpg",
    socialLinks: [
      {
        label: "Spotify",
        href: "https://open.spotify.com/artist/5eAsn3hATbZmP69ZZAmfXk?si=r6X7VMdmROWc86NS-LSRjA",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/channel/UCk3HfyyqI8Zwd326DIuaTHw/",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/bassandjazz",
      },
      {
        label: "SoundCloud",
        href: "https://soundcloud.com/jazzandbassdnb",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/jazzandbass_/",
      },
    ],
    seo: {
      title: "Jazz & Bass Label | Liquid Drum and Bass for Creators",
      description:
        "Discover Jazz & Bass releases—funky liquid drum & bass infused with jazz instrumentation. Rights-managed catalogue for sync, ads, and premium storytelling.",
      keywords: [
        "liquid drum and bass",
        "jazz drum and bass label",
        "jazz and bass music",
        "funky liquid dnb",
        "rights managed drum and bass",
      ],
    },
    highlights: [
    ],
    callouts: [
      { title: "Releases", detail: "Debut set dropping soon" },
      { title: "Rights", detail: "Copyrighted / Rights-managed" },
      { title: "Focus", detail: "Liquid DnB, Funk, Jazz Fusion" },
    ],
  },
};

export const PRIMARY_LABEL = LABEL_DEFINITIONS["no-copyright-gaming-music"];

export const SITE_AUTHOR = {
  name: SITE_NAME,
  url: `https://${SITE_DOMAIN}`,
};

export const LABEL_LIST = Object.values(LABEL_DEFINITIONS);

export function getLabelDefinition(slug: string): LabelDefinition | undefined {
  return LABEL_DEFINITIONS[slug];
}
