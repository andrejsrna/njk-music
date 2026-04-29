'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LABEL_LIST } from '@/lib/site';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const pathname = usePathname();
  const isDarkRoute =
    pathname === '/' ||
    pathname === '/about' ||
    pathname.startsWith('/music') ||
    pathname.startsWith('/labels') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/help') ||
    pathname.startsWith('/faq') ||
    pathname.startsWith('/license') ||
    pathname.startsWith('/cookies') ||
    pathname.startsWith('/dmca') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/ai-usage') ||
    pathname.startsWith('/contact');

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
    <footer
      className={`border-t ${
        isDarkRoute ? 'border-white/10 bg-slate-950 text-white' : 'border-border/80 bg-white'
      }`}
    >
      <div className="mx-auto flex flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md space-y-4">
          <h2 className={`text-lg font-semibold ${isDarkRoute ? 'text-white' : 'text-slate-900'}`}>
            Stay in the loop
          </h2>
          <p className={`text-sm ${isDarkRoute ? 'text-slate-300' : 'text-slate-600'}`}>
            Get occasional updates about new releases, label news, and curated resources
            for creators.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                  isDarkRoute
                    ? 'border-white/15 text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-cyan-300/20'
                    : 'border-border text-slate-900 focus:border-primary focus:ring-primary/20'
                }`}
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-soft transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isDarkRoute
                    ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 hover:opacity-90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>

            <label className={`flex items-start gap-2 text-xs ${isDarkRoute ? 'text-slate-300' : 'text-slate-600'}`}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                className={`mt-0.5 h-4 w-4 rounded border ${
                  isDarkRoute
                    ? 'border-white/20 text-cyan-300 focus:ring-cyan-300/30'
                    : 'border-border text-primary focus:ring-primary/40'
                }`}
              />
              I agree to the{' '}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy policy
              </Link>
              .
            </label>

            {message && (
              <p
                className={`text-xs ${
                  status === 'success'
                    ? isDarkRoute
                      ? 'text-emerald-300'
                      : 'text-emerald-600'
                    : isDarkRoute
                      ? 'text-rose-300'
                      : 'text-rose-600'
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkRoute ? 'text-white' : 'text-slate-900'}`}>
              Explore
            </h3>
            <ul className={`mt-4 space-y-2 text-sm ${isDarkRoute ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>
                <Link href="/music" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Music Library
                </Link>
              </li>
              <li>
                <Link href="/labels" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Labels
                </Link>
              </li>
              {LABEL_LIST.map((label) => (
                <li key={label.slug}>
                  <Link
                    href={`/labels/${label.slug}`}
                    className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}
                  >
                    {label.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkRoute ? 'text-white' : 'text-slate-900'}`}>
              Support
            </h3>
            <ul className={`mt-4 space-y-2 text-sm ${isDarkRoute ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>
                <Link href="/help" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/license" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Licensing
                </Link>
              </li>
              <li>
                <Link href="/help/affiliate-links" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Recommended Tools
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wide ${isDarkRoute ? 'text-white' : 'text-slate-900'}`}>
              Company
            </h3>
            <ul className={`mt-4 space-y-2 text-sm ${isDarkRoute ? 'text-slate-300' : 'text-slate-600'}`}>
              <li>
                <Link href="/terms" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/ai-usage" className={`transition ${isDarkRoute ? 'hover:text-white' : 'hover:text-slate-900'}`}>
                  AI Usage Information
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`border-t ${isDarkRoute ? 'border-white/10' : 'border-border/80'}`}>
        <div className={`mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:flex-row sm:px-6 lg:px-8 ${isDarkRoute ? 'text-slate-400' : 'text-slate-500'}`}>
          <p>© {new Date().getFullYear()} NJK Music. All rights reserved.</p>
          <p>Built for creators, streamers, and teams everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
