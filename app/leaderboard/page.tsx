'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    apiFetch<LeaderboardEntry[]>('/leaderboard').then(setLeaders).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
      <p className="text-sm text-red-700 font-semibold mb-6">
        🏆 Top scorer this week wins FREE Tolit&apos;s Butcheron!
      </p>

      {leaders.length === 0 ? (
        <p className="text-gray-500">No stats recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-center">GP</th>
                <th className="px-4 py-3 text-center">PPG</th>
                <th className="px-4 py-3 text-center">APG</th>
                <th className="px-4 py-3 text-center">RPG</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, i) => (
                <tr key={l.player_id} className={i === 0 ? 'bg-yellow-50 font-semibold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{i === 0 ? '🥇' : i + 1}</td>
                  <td className="px-4 py-2">{l.player?.name ?? `Player #${l.player_id}`}</td>
                  <td className="px-4 py-2">{l.player?.team?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-center">{l.games_played}</td>
                  <td className="px-4 py-2 text-center text-red-700 font-bold">{l.ppg}</td>
                  <td className="px-4 py-2 text-center">{(l.total_assists / l.games_played).toFixed(1)}</td>
                  <td className="px-4 py-2 text-center">{(l.total_rebounds / l.games_played).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Brand note */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800">
        🥩 <strong>Powered by Tolit&apos;s Butcheron</strong> — The #1 player each week earns a
        free butcheron pack. Keep grinding!
      </div>
    </div>
  );
}
