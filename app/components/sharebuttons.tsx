"use client";

import { Post } from "@/app/lib/posts";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaLink } from "react-icons/fa";
import { useMemo, useState } from "react";

export default function ShareButtons({
  post,
  shareUrl,
}: {
  post: Post;
  shareUrl?: string;
}) {
  const resolvedUrl = shareUrl?.trim() || "";
  const [copied, setCopied] = useState(false);

  const handleShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const urls = useMemo(() => {
    if (!resolvedUrl) {
      return null;
    }

    return {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        post.title
      )}&url=${encodeURIComponent(resolvedUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        resolvedUrl
      )}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        resolvedUrl
      )}&title=${encodeURIComponent(post.title)}`,
    };
  }, [post.title, resolvedUrl]);

  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof (navigator as any).share === "function" &&
    Boolean(resolvedUrl);

  const nativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await (navigator as any).share({
        title: post.title,
        text: post.description || post.title,
        url: resolvedUrl,
      });
    } catch {
      // user cancelled or platform rejected
    }
  };

  const copyToClipboard = async () => {
    if (!resolvedUrl) return;
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="border border-[#2A272D] bg-black/20 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Share</h2>
          <p className="mt-1 text-sm text-[#A39E98]">
            Send this article to your audience or save the link.
          </p>
        </div>

        {canNativeShare ? (
          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
          >
            Share…
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => (urls ? handleShare(urls.twitter) : null)}
          disabled={!urls}
          className="inline-flex items-center gap-2 border border-[#F4F1EC] bg-transparent px-4 py-2 text-sm font-medium text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaTwitter className="h-4 w-4 text-[#1DA1F2]" />
          X / Twitter
        </button>
        <button
          type="button"
          onClick={() => (urls ? handleShare(urls.facebook) : null)}
          disabled={!urls}
          className="inline-flex items-center gap-2 border border-[#F4F1EC] bg-transparent px-4 py-2 text-sm font-medium text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaFacebookF className="h-4 w-4 text-[#4267B2]" />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => (urls ? handleShare(urls.linkedin) : null)}
          disabled={!urls}
          className="inline-flex items-center gap-2 border border-[#F4F1EC] bg-transparent px-4 py-2 text-sm font-medium text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaLinkedinIn className="h-4 w-4 text-[#0A66C2]" />
          LinkedIn
        </button>
        <button
          type="button"
          onClick={copyToClipboard}
          disabled={!resolvedUrl}
          className="inline-flex items-center gap-2 border border-[#F4F1EC] bg-transparent px-4 py-2 text-sm font-medium text-[#F4F1EC] transition hover:bg-[#F4F1EC] hover:text-[#050405] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaLink className="h-4 w-4" />
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
