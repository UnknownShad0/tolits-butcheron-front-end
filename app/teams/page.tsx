'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Team } from '@/lib/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    apiFetch<Team[]>('/teams').then(setTeams).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      {teams.length === 0 ? (
        <p className="text-gray-500">No teams yet. Add one in Admin.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white border rounded-lg p-5 shadow-sm">
              <h2 className="text-lg font-semibold">{team.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {team.players?.length ?? 0} player(s)
              </p>
              {team.players && team.players.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                  {team.players.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
