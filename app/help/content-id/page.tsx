import type { Metadata } from "next";
import ContentIdPageClient from "./ContentIdPageClient";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Content ID Whitelist for Licensed Creators | ${SITE_NAME}`,
  description:
    "Learn how Content ID works, why claims happen, how to request a whitelist for licensed creators, and what to send us to resolve a claim quickly.",
};

export default function ContentIdPage() {
  return <ContentIdPageClient />;
}
