"use client";

import { useState } from "react";

export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex min-w-0 flex-[999_1_560px] flex-col border-t border-[#242127]">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-[#242127]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent py-5 text-left text-[19px] font-bold text-[#F4F1EC]"
            >
              {f.q}
              <span className="flex-none text-2xl font-normal text-[#A39E98]" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <p className="m-0 pb-6 pr-12 text-base text-[#A39E98]">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
