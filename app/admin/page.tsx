'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { colors } from '@/components/ui';
import TeamForm from '@/components/admin/TeamForm';
import PlayerForm from '@/components/admin/PlayerForm';
import MatchForm from '@/components/admin/MatchForm';
import StatsForm from '@/components/admin/StatsForm';
import type { Team, Player, Match } from '@/lib/types';

type Tab = 'teams' | 'players' | 'matches' | 'stats';

const tabs: { key: Tab; label: string; icon: string }[] = [
  { key: 'teams', label: 'Teams', icon: '🏅' },
  { key: 'players', label: 'Players', icon: '👤' },
  { key: 'matches', label: 'Matches', icon: '📅' },
  { key: 'stats', label: 'Stats', icon: '📊' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [msg, setMsg] = useState('');

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    apiFetch<Team[]>('/teams').then(setTeams).catch(console.error);
    apiFetch<Player[]>('/players').then(setPlayers).catch(console.error);
    apiFetch<Match[]>('/matches').then(setMatches).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold uppercase tracking-wide mb-6" style={{ color: colors.text }}>
        Admin Panel
      </h1>

      {msg && (
        <div className="mb-5 px-4 py-3 rounded-lg border text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: '#0D2A1A', borderColor: '#2A6B3A', color: '#5DD98A' }}>
          ✓ {msg}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ backgroundColor: colors.surfaceDeep }}>
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={
                active
                  ? { backgroundColor: colors.primary, color: colors.bg }
                  : { color: colors.textDim }
              }
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline font-display uppercase tracking-wide">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === 'teams' && (
        <TeamForm
          teams={teams}
          onAdd={(t) => { setTeams((p) => [...p, t]); notify('Team added!'); }}
        />
      )}
      {tab === 'players' && (
        <PlayerForm
          teams={teams}
          players={players}
          onAdd={(p) => { setPlayers((prev) => [...prev, p]); notify('Player added!'); }}
        />
      )}
      {tab === 'matches' && (
        <MatchForm
          teams={teams}
          matches={matches}
          onAdd={(m) => { setMatches((p) => [...p, m]); notify('Match recorded!'); }}
        />
      )}
      {tab === 'stats' && (
        <StatsForm
          players={players}
          matches={matches}
          onSave={() => notify('Stats saved!')}
        />
      )}
    </div>
  );
}
