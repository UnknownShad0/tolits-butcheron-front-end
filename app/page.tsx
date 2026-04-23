import Link from 'next/link';
import Image from 'next/image';
import { cv } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12">
        <Image src="/logos/tolits-basketball-logo.jpg" alt="Tolit's Basketball" width={110} height={110}
          className="rounded-full mx-auto mb-4 object-cover border-4" style={{ borderColor: cv.primary }} />
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-wide" style={{ color: cv.text }}>
          Tolit&apos;s Butcheron
        </h1>
        <p className="mt-2 text-base" style={{ color: cv.primaryLight }}>
          Track players, games, and stats — powered by the community.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link href="/leaderboard" className="px-6 py-2.5 rounded font-bold font-display uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{ backgroundColor: cv.primary, color: cv.bg }}>
            Leaderboard
          </Link>
          <Link href="/matches" className="px-6 py-2.5 rounded font-bold font-display uppercase tracking-wide border transition-opacity hover:opacity-80"
            style={{ borderColor: cv.primary, color: cv.primaryLight }}>
            Matches
          </Link>
        </div>
      </section>

      {/* Player of the Week */}
      <section className="rounded-xl p-6 text-center border" style={{ backgroundColor: cv.surface, borderColor: cv.gold }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: cv.gold }}>
          Powered by Tolit&apos;s Butcheron
        </p>
        <h2 className="font-display text-3xl font-bold uppercase" style={{ color: cv.text }}>⭐ Player of the Week</h2>
        <p className="text-sm mt-2 italic" style={{ color: cv.primaryLight }}>
          Check the leaderboard to see who&apos;s dominating this week!
        </p>
        <Link href="/leaderboard" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: cv.gold }}>
          See Leaderboard →
        </Link>
      </section>

      {/* Product Spotlight */}
      <section className="rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center border" style={{ backgroundColor: cv.surface, borderColor: cv.primary }}>
        <Image src="/logos/tolit-business-logo.jpg" alt="Tolit's Butcheron" width={100} height={100} className="rounded-xl object-cover flex-shrink-0" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: cv.primaryLight }}>Product Spotlight</p>
          <h2 className="font-display text-2xl font-bold uppercase mt-1" style={{ color: cv.text }}>
            Tolit&apos;s Special Pork Liempo
          </h2>
          <p className="text-sm mt-1" style={{ color: cv.textMuted }}>
            Freshly cut daily. Perfect for your post-game grill. Visit Tolit&apos;s Butcheron and fuel up like a champion!
          </p>
          <p className="mt-2 text-xs font-semibold" style={{ color: cv.gold }}>
            🏆 This week&apos;s MVP wins a FREE pack — keep playing hard!
          </p>
        </div>
      </section>

      {/* Team photos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: cv.border }}>
          <Image src="/tolits-team/tolits-team-2.jpg" alt="Tolit's Butcheron Team" width={900} height={400} className="w-full object-cover max-h-64" />
        </div>
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: cv.border }}>
          <Image src="/tolits-team/tolits-team-st-anne.jpg" alt="Tolit's Butcheron Team" width={900} height={400} className="w-full object-cover max-h-64" />
        </div>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { href: '/teams', label: '🏅 Teams' },
          { href: '/players', label: '👤 Players' },
          { href: '/matches', label: '📅 Matches' },
          { href: '/admin', label: '⚙️ Admin' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="rounded-xl py-6 font-display font-bold uppercase tracking-wide text-sm border transition-all hover:opacity-80"
            style={{ backgroundColor: cv.surface, borderColor: cv.border, color: cv.textMuted }}>
            {item.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
