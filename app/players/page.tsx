'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { colors } from '@/components/ui';
import type { Player } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    apiFetch<Player[]>('/players').then(setPlayers).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-6" style={{ color: colors.text }}>Players</h1>
      {players.length === 0 ? (
        <p style={{ color: colors.textDim }}>No players yet. Add one in Admin.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: colors.border }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: colors.primary, color: colors.bg }}>
              <tr>
                {['', '#', 'Name', 'Team', 'Position'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-display uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} className="border-t" style={{ backgroundColor: i % 2 === 0 ? colors.surface : '#0F1E30', borderColor: colors.border }}>
                  <td className="px-4 py-2">
                    {p.photo_path ? (
                      <Image src={`${STORAGE}/${p.photo_path}`} alt={p.name} width={36} height={36} className="rounded-full object-cover border-2" style={{ borderColor: colors.primary }} />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.border }}>👤</div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-bold" style={{ color: colors.gold }}>{p.jersey_number ?? '—'}</td>
                  <td className="px-4 py-2 font-semibold" style={{ color: colors.text }}>{p.name}</td>
                  <td className="px-4 py-2" style={{ color: colors.primaryLight }}>{p.team?.name ?? '—'}</td>
                  <td className="px-4 py-2" style={{ color: colors.textMuted }}>{p.position ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
