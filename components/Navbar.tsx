'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cv } from './ui';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/lib/auth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/scoreboard', label: 'Scoreboard' },
  { href: '/scoresheet', label: 'Scoresheet' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  return (
    <>
      {/* MVP Banner */}
      <div className="text-center text-xs py-2 font-bold tracking-widest uppercase" style={{ backgroundColor: cv.gold, color: cv.bg }}>
        🏆 MVP of the Week wins FREE Tolit&apos;s Butcheron! 🥩
      </div>

      {/* Navbar */}
      <nav className="px-4 flex items-center border-b" style={{ backgroundColor: cv.surfaceDeep, borderColor: cv.primary }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 py-3 flex-shrink-0" onClick={() => setOpen(false)}>
          <Image src="/logos/tolits-basketball-logo.jpg" alt="Tolit's Basketball" width={36} height={36}
            className="rounded-full object-cover border-2" style={{ borderColor: cv.primary }} />
          <div className="leading-tight">
            <p className="font-display font-extrabold uppercase tracking-wider text-sm leading-none" style={{ color: cv.primaryLight }}>
              Tolit&apos;s Butcheron
            </p>
            <p className="text-[9px] uppercase tracking-widest hidden sm:block" style={{ color: cv.textDim }}>
              Basketball League
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 ml-6">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className="px-3 py-4 text-sm font-medium border-b-2 transition-all"
                style={{ color: active ? cv.primary : cv.textMuted, borderBottomColor: active ? cv.primary : 'transparent' }}>
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side: auth + theme toggle + burger */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <button onClick={handleLogout}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:brightness-110"
              style={{ borderColor: cv.border, color: cv.textMuted, backgroundColor: cv.surface }}>
              <span style={{ color: cv.primaryLight }}>{user.name}</span>
              <span className="ml-1">· Logout</span>
            </button>
          ) : (
            <Link href="/login"
              className="hidden md:flex items-center px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all hover:brightness-110"
              style={{ borderColor: cv.primary, color: cv.primary, backgroundColor: 'transparent' }}>
              Login
            </Link>
          )}
          <button onClick={toggle}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all hover:scale-110 border"
            style={{ backgroundColor: cv.surface, borderColor: cv.border }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Burger — mobile only */}
          <button onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border"
            style={{ backgroundColor: cv.surface, borderColor: cv.border }}
            aria-label="Toggle menu">
            <span className={`block h-0.5 w-5 transition-all origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: cv.text }} />
            <span className={`block h-0.5 w-5 transition-all ${open ? 'opacity-0' : ''}`} style={{ backgroundColor: cv.text }} />
            <span className={`block h-0.5 w-5 transition-all origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: cv.text }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b" style={{ backgroundColor: cv.surfaceDeep, borderColor: cv.border }}>
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center px-5 py-3.5 text-sm font-medium border-l-4 transition-all"
                style={{
                  color: active ? cv.primary : cv.textMuted,
                  borderLeftColor: active ? cv.primary : 'transparent',
                  backgroundColor: active ? `color-mix(in srgb, var(--primary) 8%, var(--surface-deep))` : 'transparent',
                }}>
                {l.label}
              </Link>
            );
          })}
          {user ? (
            <button onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center px-5 py-3.5 text-sm font-medium border-l-4 border-transparent"
              style={{ color: cv.textMuted }}>
              Logout ({user.name})
            </button>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}
              className="flex items-center px-5 py-3.5 text-sm font-bold border-l-4 border-transparent"
              style={{ color: cv.primary }}>
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
}
