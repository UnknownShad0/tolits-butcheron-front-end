import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Tolit's Butcheron Basketball",
  description: 'Community basketball platform powered by Tolit\'s Butcheron',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/teams', label: 'Teams' },
  { href: '/players', label: 'Players' },
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        {/* Top brand bar */}
        <div className="bg-red-700 text-white text-center text-xs py-1 font-semibold tracking-wide">
          🏆 MVP of the Week gets FREE Tolit&apos;s Butcheron! 🥩
        </div>

        {/* Nav */}
        <nav className="bg-gray-900 text-white px-6 py-3 flex flex-wrap gap-4 items-center">
          <span className="font-bold text-red-400 mr-4">🏀 Tolit&apos;s Hoops</span>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm hover:text-red-400 transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 text-center text-sm py-4">
          Powered by{' '}
          <span className="text-red-400 font-semibold">Tolit&apos;s Butcheron</span> — Fresh cuts,
          every day. 🥩
        </footer>
      </body>
    </html>
  );
}
