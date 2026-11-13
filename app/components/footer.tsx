'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LABEL_LIST } from '@/lib/site';

const socials = [
  { href: 'https://youtube.com/channel/UCWVxIOcVIyuXJ0yCIevHS2w/', label: 'YouTube' },
  { href: 'https://open.spotify.com/artist/0N0TGSkeeLoh5G7QTJ226Q?si=qF3oTBsERP6EOBvhZ7_AlA', label: 'Chill Music Motif on Spotify' },
  { href: 'https://open.spotify.com/artist/702mas8Kyj9BGvD6dZGML8?si=YLtxCd8hQd2ODGYRVuceYw', label: 'NCGM on Spotify' },
];

const colHead = "mb-1 text-[11px] uppercase tracking-[0.1em] text-[#8C8781] [font-family:var(--font-jetbrains),monospace]";
const linkCls = 'text-[#C9C4BD] transition-colors hover:text-white';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const pathname = usePathname();
  const showSignup = pathname !== '/' && pathname !== '/music' && pathname !== '/labels' && pathname !== '/about' && !/^\/(music|labels)\/[^/]+/.test(pathname);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!accepted) {
      setStatus('error');
      setMessage('Please accept the privacy notice.');
      return;
    }

    try {
      setStatus('loading');
      setMessage(null);

      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Unable to subscribe at the moment.');
      }

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');
      setAccepted(false);
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error ? error.message : 'Unable to subscribe at the moment.'
      );
    }
  };

  return (
    <footer className="border-t border-[#1F1D21] bg-[#0C0B0D] text-[#F4F1EC] [font-family:var(--font-archivo),system-ui,sans-serif]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-5 pb-10 pt-16 sm:px-8">
      <div className="flex flex-wrap justify-between gap-12">
        <div className="flex flex-[1_1_280px] flex-col gap-4">
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B71C1C] text-[13px] font-black text-white">NJK</span>
            <span className="text-[17px] font-bold">NJK Music</span>
          </span>
          <p className="max-w-[280px] text-sm text-[#8C8781]">Built for creators, streamers and teams everywhere.</p>
          {showSignup && (
          <form onSubmit={handleSubmit} className="max-w-[320px] space-y-2.5">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                disabled={status === 'loading'}
                className="min-h-[44px] w-full min-w-0 rounded-lg border border-[#2A272D] bg-[#141216] px-3 text-sm text-[#F4F1EC] placeholder:text-[#8C8781] focus:border-[#B71C1C] focus:outline-none"
              />
              <button type="submit" disabled={status === 'loading'} className="min-h-[44px] rounded-lg bg-[#F4F1EC] px-4 text-sm font-bold text-[#0C0B0D] transition hover:bg-white disabled:opacity-60">
                {status === 'loading' ? '…' : 'Subscribe'}
              </button>
            </div>
            <label className="flex items-start gap-2 text-xs text-[#8C8781]">
              <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#B71C1C]" />
              <span>I agree to the <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>.</span>
            </label>
            {message && <p role="status" className={`text-xs ${status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{message}</p>}
          </form>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8C8781]">
            {socials.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-white hover:underline">{l.label}</a>
            ))}
          </div>
        </div>
        <nav aria-label="Explore" className="flex flex-col gap-2.5 text-sm md:flex-[0_1_180px]">
          <span className={colHead}>Explore</span>
          <Link href="/music" className={linkCls}>Music library</Link>
          <Link href="/labels" className={linkCls}>Labels</Link>
          {LABEL_LIST.map((label) => (
            <Link key={label.slug} href={`/labels/${label.slug}`} className={linkCls}>{label.name}</Link>
          ))}
        </nav>
        <nav aria-label="Support" className="flex flex-col gap-2.5 text-sm md:flex-[0_1_180px]">
          <span className={colHead}>Support</span>
          <Link href="/help" className={linkCls}>Help centre</Link>
          <Link href="/license" className={linkCls}>Licensing</Link>
          <Link href="/help/affiliate-links" className={linkCls}>Recommended tools</Link>
          <Link href="/contact" className={linkCls}>Contact</Link>
        </nav>
        <nav aria-label="Company" className="flex flex-col gap-2.5 text-sm md:flex-[0_1_180px]">
          <span className={colHead}>Company</span>
          <Link href="/terms" className={linkCls}>Terms &amp; conditions</Link>
          <Link href="/privacy" className={linkCls}>Privacy policy</Link>
          <Link href="/cookies" className={linkCls}>Cookies</Link>
          <Link href="/ai-usage" className={linkCls}>AI usage</Link>
        </nav>
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-[#1F1D21] pt-6 text-[13px] text-[#8C8781]">
        <span>© {new Date().getFullYear()} NJK Music. All rights reserved.</span>
        <span className="text-xs [font-family:var(--font-jetbrains),monospace]">Distributed by 5767746 Records DK</span>
      </div>
      </div>
    </footer>
  );
}
