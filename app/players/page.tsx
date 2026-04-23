'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Player } from '@/lib/types';

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    apiFetch<Player[]>('/players').then(setPlayers).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      {players.length === 0 ? (
        <p className="text-gray-500">No players yet. Add one in Admin.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-left">Position</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{p.jersey_number ?? '—'}</td>
                  <td className="px-4 py-2 font-medium">{p.name}</td>
                  <td className="px-4 py-2">{p.team?.name ?? '—'}</td>
                  <td className="px-4 py-2">{p.position ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
