import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold mb-2">🏀 Tolit&apos;s Hoops League</h1>
        <p className="text-gray-500">Track players, games, and stats — powered by the community.</p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link href="/leaderboard" className="bg-red-700 text-white px-5 py-2 rounded font-semibold hover:bg-red-800">
            View Leaderboard
          </Link>
          <Link href="/matches" className="bg-gray-800 text-white px-5 py-2 rounded font-semibold hover:bg-gray-700">
            Recent Matches
          </Link>
        </div>
      </section>

      {/* Player of the Week */}
      <section className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-yellow-800 mb-1">⭐ Player of the Week</h2>
        <p className="text-yellow-700 text-sm mb-2">Powered by Tolit&apos;s Butcheron</p>
        <p className="text-gray-600 italic">Check the leaderboard to see who&apos;s dominating this week!</p>
        <Link href="/leaderboard" className="mt-3 inline-block text-sm text-red-700 font-semibold underline">
          See Leaderboard →
        </Link>
      </section>

      {/* Product Spotlight */}
      <section className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="text-5xl">🥩</div>
        <div>
          <h2 className="text-xl font-bold text-red-800">Product Spotlight</h2>
          <p className="text-red-700 font-semibold mt-1">Tolit&apos;s Special Pork Liempo</p>
          <p className="text-gray-600 text-sm mt-1">
            Freshly cut daily. Perfect for your post-game grill. Visit Tolit&apos;s Butcheron and
            fuel up like a champion!
          </p>
          <p className="mt-2 text-xs text-gray-400 italic">
            🏆 This week&apos;s MVP wins a FREE pack — keep playing hard!
          </p>
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
            className="bg-white border rounded-lg py-6 font-semibold hover:bg-gray-100 transition-colors shadow-sm"
          >
            {item.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
