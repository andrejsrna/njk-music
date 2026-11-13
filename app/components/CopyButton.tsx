"use client";

export default function CopyButton({ template }: { template: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(template)}
      className="mt-4 inline-flex items-center justify-center bg-[#C62828] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#E03535]"
    >
      Copy template
    </button>
  );
}
