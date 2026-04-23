'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { cv } from '@/components/ui';
import type { Player } from '@/lib/types';
import Image from 'next/image';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  useEffect(() => { apiFetch<Player[]>('/players').then(setPlayers).catch(console.error); }, []);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-6" style={{ color: cv.text }}>Players</h1>
      {players.length === 0 ? (
        <p style={{ color: cv.textDim }}>No players yet. Add one in Admin.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: cv.border }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: cv.primary, color: cv.bg }}>
              <tr>
                {['', '#', 'Name', 'Team', 'Position'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-display uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} className="border-t" style={{ backgroundColor: i % 2 === 0 ? cv.surface : cv.surfaceDeep, borderColor: cv.border }}>
                  <td className="px-4 py-2">
                    {p.photo_path ? (
                      <Image src={`${STORAGE}/${p.photo_path}`} alt={p.name} width={36} height={36}
                        className="rounded-full object-cover border-2" style={{ borderColor: cv.primary }} />
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: cv.border }}>👤</div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-bold" style={{ color: cv.gold }}>{p.jersey_number ?? '—'}</td>
                  <td className="px-4 py-2 font-semibold" style={{ color: cv.text }}>{p.name}</td>
                  <td className="px-4 py-2" style={{ color: cv.primaryLight }}>{p.team?.name ?? '—'}</td>
                  <td className="px-4 py-2" style={{ color: cv.textMuted }}>{p.position ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
