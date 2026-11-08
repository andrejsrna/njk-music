import { getYouTubeEmbedUrl } from "@/app/lib/youtubeEmbed";

export default function YouTubeEmbedSection({ source }: { source: string }) {
  const embedUrl = getYouTubeEmbedUrl(source);
  if (!embedUrl) return null;

  return (
    <section aria-label="Video" className="mx-auto max-w-[1360px] px-5 pb-24 sm:px-8 sm:pb-28">
      <div className="relative aspect-video overflow-hidden border-2 border-[#F4F1EC] bg-[#110F12]">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
