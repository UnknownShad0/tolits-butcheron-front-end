'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Match } from '@/lib/types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    apiFetch<Match[]>('/matches').then(setMatches).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Matches</h1>
      {matches.length === 0 ? (
        <p className="text-gray-500">No matches recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {matches.map((m) => (
            <div key={m.id} className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="font-semibold">{m.home_team?.name}</p>
                <p className="text-xs text-gray-400">Home</p>
              </div>
              <div className="text-center px-6">
                <p className="text-2xl font-bold">
                  {m.home_score} — {m.away_score}
                </p>
                <p className="text-xs text-gray-400">{m.played_at}</p>
              </div>
              <div className="text-center flex-1">
                <p className="font-semibold">{m.away_team?.name}</p>
                <p className="text-xs text-gray-400">Away</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
