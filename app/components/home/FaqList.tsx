"use client";

import { useState } from "react";

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex min-w-0 flex-[999_1_560px] flex-col border-t-2 border-[#F4F1EC]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-[#2A272D]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex min-h-[80px] w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent py-5 text-left text-[21px] font-extrabold tracking-[-0.01em] text-[#F4F1EC]"
            >
              {f.q}
              <span className={`flex h-9 w-9 flex-none items-center justify-center border-2 border-[#F4F1EC] text-xl font-bold ${isOpen ? "bg-[#F4F1EC] text-[#050405]" : ""}`} aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="m-0 pb-6 pr-14 text-[17px] text-[#A39E98]">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
