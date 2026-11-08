import { getYouTubeEmbedUrl } from "@/app/lib/youtubeEmbed";

export default function YouTubeEmbedSection({ source }: { source: string }) {
  const embedUrl = getYouTubeEmbedUrl(source);
  if (!embedUrl) return null;

  return (
    <section aria-label="Video" className="mx-auto max-w-[1280px] px-8 pb-28 max-sm:px-5">
      <div className="relative aspect-video overflow-hidden rounded-[18px] border border-[#242127] bg-[#141216]">
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
