'use client';
import Image from 'next/image';
import { cv } from '@/components/ui';
import { useFetch } from '@/lib/useFetch';
import { FetchError, FetchLoading } from '@/components/FetchState';
import type { Match } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function MatchesPage() {
  const { data: matches, error, loading } = useFetch<Match[]>('/matches');

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-6" style={{ color: cv.text }}>Matches</h1>
      {error && <FetchError message={error} />}
      {loading && <FetchLoading />}
      {!loading && !error && matches?.length === 0 && <p style={{ color: cv.textDim }}>No matches recorded yet.</p>}
      {matches && matches.length > 0 && (
        <div className="space-y-3">
          {matches.map((m) => (
            <div key={m.id} className="rounded-xl p-4 flex items-center justify-between border"
              style={{ backgroundColor: cv.surface, borderColor: cv.border }}>
              <div className="text-center flex-1 flex flex-col items-center gap-1">
                {m.home_team?.logo_path
                  ? <Image src={`${STORAGE}/${m.home_team.logo_path}`} alt={m.home_team.name} width={36} height={36} className="rounded-full object-cover border-2" style={{ borderColor: cv.primary }} />
                  : <span className="text-2xl">🏀</span>}
                <p className="font-display font-bold uppercase text-sm" style={{ color: cv.text }}>{m.home_team?.name}</p>
              </div>
              <div className="text-center px-6">
                <p className="font-display text-3xl font-extrabold" style={{ color: cv.primaryLight }}>
                  {m.home_score} <span style={{ color: cv.border }}>—</span> {m.away_score}
                </p>
                <p className="text-xs mt-1" style={{ color: cv.textDim }}>{m.played_at}</p>
              </div>
              <div className="text-center flex-1 flex flex-col items-center gap-1">
                {m.away_team?.logo_path
                  ? <Image src={`${STORAGE}/${m.away_team.logo_path}`} alt={m.away_team.name} width={36} height={36} className="rounded-full object-cover border-2" style={{ borderColor: cv.primary }} />
                  : <span className="text-2xl">🏀</span>}
                <p className="font-display font-bold uppercase text-sm" style={{ color: cv.text }}>{m.away_team?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
