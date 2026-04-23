'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { colors } from '@/components/ui';
import type { LeaderboardEntry } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    apiFetch<LeaderboardEntry[]>('/leaderboard').then(setLeaders).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-1" style={{ color: colors.text }}>Leaderboard</h1>
      <p className="text-sm font-semibold mb-6" style={{ color: colors.gold }}>
        🏆 Top scorer this week wins FREE Tolit&apos;s Butcheron!
      </p>

      {leaders.length === 0 ? (
        <p style={{ color: colors.textDim }}>No stats recorded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: colors.border }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: colors.primary, color: colors.bg }}>
              <tr>
                {['Rank', '', 'Player', 'Team', 'GP', 'PPG', 'APG', 'RPG'].map((h) => (
                  <th key={h} className={`px-4 py-3 font-display uppercase ${['GP','PPG','APG','RPG'].includes(h) ? 'text-center' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaders.map((l, i) => (
                <tr
                  key={l.player_id}
                  className="border-t"
                  style={{
                    backgroundColor: i === 0 ? '#0D2A1A' : i % 2 === 0 ? colors.surface : '#0F1E30',
                    borderColor: colors.border,
                  }}
                >
                  <td className="px-4 py-3 font-bold text-lg" style={{ color: colors.text }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td className="px-3 py-2">
                    {l.player?.photo_path ? (
                      <Image src={`${STORAGE}/${l.player.photo_path}`} alt={l.player.name ?? ''} width={36} height={36} className="rounded-full object-cover border-2" style={{ borderColor: colors.primary }} />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.border }}>👤</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{ color: colors.text }}>{l.player?.name ?? `Player #${l.player_id}`}</td>
                  <td className="px-4 py-3" style={{ color: colors.primaryLight }}>{l.player?.team?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-center" style={{ color: colors.textMuted }}>{l.games_played}</td>
                  <td className="px-4 py-3 text-center font-display font-bold text-base" style={{ color: colors.gold }}>{l.ppg}</td>
                  <td className="px-4 py-3 text-center" style={{ color: colors.textMuted }}>{(l.total_assists / l.games_played).toFixed(1)}</td>
                  <td className="px-4 py-3 text-center" style={{ color: colors.textMuted }}>{(l.total_rebounds / l.games_played).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-xl p-4 flex items-center gap-3 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
        <Image src="/logos/tolit-business-logo.jpg" alt="Tolit's" width={40} height={40} className="rounded-full object-cover flex-shrink-0" />
        <p className="text-sm" style={{ color: colors.textMuted }}>
          🥩 <strong style={{ color: colors.primaryLight }}>Powered by Tolit&apos;s Butcheron</strong> — The #1 player each week earns a free butcheron pack. Keep grinding!
        </p>
      </div>
    </div>
  );
}
