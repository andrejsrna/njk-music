'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiArrowLeft, FiMenu, FiX } from 'react-icons/fi';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Music', href: '/music' },
  { name: 'Labels', href: '/labels' },
  { name: 'News', href: '/news' },
  { name: 'Help', href: '/help' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isTrackPage = /^\/music\/[^/]+/.test(pathname);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1F1D21] bg-[#0C0B0D]/90 text-[#F4F1EC] backdrop-blur [font-family:var(--font-archivo),system-ui,sans-serif]">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-[#B71C1C]">
            <Image src="/njk.jpg" alt="NJK Music logo" fill sizes="36px" className="object-cover" />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.01em]">NJK Music</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-wrap items-center gap-x-7 gap-y-1 text-sm md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`transition-colors ${isActive(item.href) ? 'font-semibold text-[#F4F1EC]' : 'text-[#A39E98] hover:text-[#F4F1EC]'}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {isTrackPage ? (
          <Link href="/music" className="hidden min-h-[44px] items-center gap-2 text-sm text-[#A39E98] transition-colors hover:text-[#F4F1EC] md:flex">
            <FiArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to music
          </Link>
        ) : (
          <span className="hidden w-[120px] md:block" aria-hidden="true" />
        )}

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#2A272D] text-[#C9C4BD] transition hover:bg-white/5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-[#1F1D21] bg-[#0C0B0D] px-5 py-3 md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block min-h-[44px] py-3 text-[15px] ${isActive(item.href) ? 'font-semibold text-[#F4F1EC]' : 'text-[#A39E98]'}`}
            >
              {item.name}
            </Link>
          ))}
          {isTrackPage && (
            <Link href="/music" onClick={() => setOpen(false)} className="flex min-h-[44px] items-center gap-2 py-3 text-[15px] text-[#A39E98]">
              <FiArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to music
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
