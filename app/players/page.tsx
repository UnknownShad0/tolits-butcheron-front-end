'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { cv } from '@/components/ui';
import { useFetch } from '@/lib/useFetch';
import { FetchError, FetchLoading } from '@/components/FetchState';
import type { Player } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';
type SortKey = 'none' | 'team' | 'position';

export default function PlayersPage() {
  const { data: players, error, loading } = useFetch<Player[]>('/players');
  const [sortBy, setSortBy] = useState<SortKey>('none');

  const sorted = useMemo(() => {
    if (!players || sortBy === 'none') return players ?? [];
    return [...players].sort((a, b) => {
      const av = sortBy === 'team' ? (a.team?.name ?? '') : (a.position ?? '');
      const bv = sortBy === 'team' ? (b.team?.name ?? '') : (b.position ?? '');
      return av.localeCompare(bv);
    });
  }, [players, sortBy]);

  const btnStyle = (key: SortKey) => ({
    backgroundColor: sortBy === key ? cv.primary : cv.surface,
    color: sortBy === key ? cv.bg : cv.textMuted,
    borderColor: cv.border,
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide" style={{ color: cv.text }}>Players</h1>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span style={{ color: cv.textDim }}>Sort:</span>
          {(['none', 'team', 'position'] as SortKey[]).map((k) => (
            <button key={k} onClick={() => setSortBy(k)} className="px-3 py-1.5 rounded-lg border capitalize transition-all" style={btnStyle(k)}>
              {k === 'none' ? 'Default' : k}
            </button>
          ))}
        </div>
      </div>
      {error && <FetchError message={error} />}
      {loading && <FetchLoading />}
      {!loading && sorted.length === 0 && !error && <p style={{ color: cv.textDim }}>No players yet.</p>}
      {sorted.length > 0 && (
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
              {sorted.map((p, i) => (
                <tr key={p.id} className="border-t" style={{ backgroundColor: i % 2 === 0 ? cv.surface : cv.surfaceDeep, borderColor: cv.border }}>
                  <td className="px-4 py-2">
                    {p.photo_path
                      ? <Image src={`${STORAGE}/${p.photo_path}`} alt={p.name} width={36} height={36} className="rounded-full object-cover border-2" style={{ borderColor: cv.primary }} />
                      : <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: cv.border }}>👤</div>}
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
