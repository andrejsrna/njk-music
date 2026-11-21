import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin | NJK Music", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#050405] px-4 pb-20 pt-28 text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif] sm:px-8">{children}</div>;
}
