import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12">
        <Image
          src="/logos/tolits-basketball-logo.jpg"
          alt="Tolit's Basketball"
          width={110}
          height={110}
          className="rounded-full mx-auto mb-4 object-cover border-4"
          style={{ borderColor: '#7EC8E3' }}
        />
        <h1 className="font-display text-5xl font-extrabold uppercase tracking-wide" style={{ color: '#E8F4FD' }}>
          Tolit&apos;s Butcheron
        </h1>
        <p className="mt-2 text-base" style={{ color: '#7EC8E3' }}>
          Track players, games, and stats — powered by the community.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            href="/leaderboard"
            className="px-6 py-2.5 rounded font-bold font-display uppercase tracking-wide transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#5BB8D4', color: '#0D1B2A' }}
          >
            Leaderboard
          </Link>
          <Link
            href="/matches"
            className="px-6 py-2.5 rounded font-bold font-display uppercase tracking-wide border transition-opacity hover:opacity-80"
            style={{ borderColor: '#5BB8D4', color: '#7EC8E3' }}
          >
            Matches
          </Link>
        </div>
      </section>

      {/* Player of the Week */}
      <section className="rounded-xl p-6 text-center border" style={{ backgroundColor: '#112236', borderColor: '#FFD700' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FFD700' }}>
          Powered by Tolit&apos;s Butcheron
        </p>
        <h2 className="font-display text-3xl font-bold uppercase" style={{ color: '#E8F4FD' }}>⭐ Player of the Week</h2>
        <p className="text-sm mt-2 italic" style={{ color: '#7EC8E3' }}>
          Check the leaderboard to see who&apos;s dominating this week!
        </p>
        <Link href="/leaderboard" className="mt-3 inline-block text-sm font-semibold hover:underline" style={{ color: '#FFD700' }}>
          See Leaderboard →
        </Link>
      </section>

      {/* Product Spotlight */}
      <section className="rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-center border" style={{ backgroundColor: '#112236', borderColor: '#5BB8D4' }}>
        <Image
          src="/logos/tolit-business-logo.jpg"
          alt="Tolit's Butcheron"
          width={100}
          height={100}
          className="rounded-xl object-cover flex-shrink-0"
        />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#7EC8E3' }}>Product Spotlight</p>
          <h2 className="font-display text-2xl font-bold uppercase mt-1" style={{ color: '#E8F4FD' }}>
            Tolit&apos;s Special Pork Liempo
          </h2>
          <p className="text-sm mt-1" style={{ color: '#B8DFF0' }}>
            Freshly cut daily. Perfect for your post-game grill. Visit Tolit&apos;s Butcheron and fuel up like a champion!
          </p>
          <p className="mt-2 text-xs font-semibold" style={{ color: '#FFD700' }}>
            🏆 This week&apos;s MVP wins a FREE pack — keep playing hard!
          </p>
        </div>
      </section>

      {/* Team photo */}
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#1E3A5F' }}>
          <Image src="/tolits-team/tolits-team-2.jpg" alt="Tolit's Butcheron Team" width={900} height={400} className="w-full object-cover max-h-72" />
        </div>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#1E3A5F' }}>
          <Image src="/tolits-team/tolits-team-st-anne.jpg" alt="Tolit's Butcheron Team" width={900} height={400} className="w-full object-cover max-h-72" />
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
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl py-6 font-display font-bold uppercase tracking-wide text-sm border transition-all hover:opacity-80"
            style={{ backgroundColor: '#112236', borderColor: '#1E3A5F', color: '#B8DFF0' }}
          >
            {item.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
