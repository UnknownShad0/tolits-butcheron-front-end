'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import type { Team } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    apiFetch<Team[]>('/teams').then(setTeams).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-6" style={{ color: '#E8F4FD' }}>Teams</h1>
      {teams.length === 0 ? (
        <p style={{ color: '#4A7A9B' }}>No teams yet. Add one in Admin.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl p-5 flex gap-4 items-start border transition-all hover:opacity-90"
              style={{ backgroundColor: '#112236', borderColor: '#1E3A5F' }}
            >
              {team.logo_path ? (
                <Image
                  src={`${STORAGE}/${team.logo_path}`}
                  alt={team.name}
                  width={56}
                  height={56}
                  className="rounded-full object-cover flex-shrink-0 border-2"
                  style={{ borderColor: '#5BB8D4' }}
                />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#1E3A5F' }}>
                  🏀
                </div>
              )}
              <div>
                <h2 className="font-display text-xl font-bold uppercase" style={{ color: '#E8F4FD' }}>{team.name}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#4A7A9B' }}>{team.players?.length ?? 0} player(s)</p>
                {team.players && team.players.length > 0 && (
                  <ul className="mt-2 text-sm list-disc list-inside" style={{ color: '#B8DFF0' }}>
                    {team.players.map((p) => <li key={p.id}>{p.name}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
