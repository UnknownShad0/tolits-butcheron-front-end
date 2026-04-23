'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { colors } from './ui';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* MVP Banner */}
      <div
        className="text-center text-xs py-2 font-bold tracking-widest uppercase"
        style={{ backgroundColor: colors.gold, color: colors.bg }}
      >
        🏆 MVP of the Week wins FREE Tolit&apos;s Butcheron! 🥩
      </div>

      {/* Navbar */}
      <nav
        className="px-6 py-0 flex items-center border-b"
        style={{ backgroundColor: colors.surfaceDeep, borderColor: colors.primary }}
      >
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 py-3 mr-8 flex-shrink-0">
          <Image
            src="/logos/tolits-basketball-logo.jpg"
            alt="Tolit's Basketball"
            width={40}
            height={40}
            className="rounded-full object-cover border-2"
            style={{ borderColor: colors.primary }}
          />
          <div className="leading-tight">
            <p className="font-display font-extrabold uppercase tracking-wider text-base leading-none" style={{ color: colors.primaryLight }}>
              Tolit&apos;s Butcheron
            </p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: colors.textDim }}>
              Basketball League
            </p>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-wrap">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-4 text-sm font-medium border-b-2 transition-all"
                style={{
                  color: active ? colors.primary : colors.textMuted,
                  borderBottomColor: active ? colors.primary : 'transparent',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
