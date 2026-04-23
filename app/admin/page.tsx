'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Team, Player, Match } from '@/lib/types';

type Tab = 'teams' | 'players' | 'matches' | 'stats';

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

  // --- Team form ---
  const [teamName, setTeamName] = useState('');
  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = await apiFetch<Team>('/teams', { method: 'POST', body: JSON.stringify({ name: teamName }) });
    setTeams((prev) => [...prev, t]);
    setTeamName('');
    notify('Team added!');
  };

  // --- Player form ---
  const [playerForm, setPlayerForm] = useState({ name: '', team_id: '', position: '', jersey_number: '' });
  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = await apiFetch<Player>('/players', { method: 'POST', body: JSON.stringify({ ...playerForm, team_id: Number(playerForm.team_id) }) });
    setPlayers((prev) => [...prev, p]);
    setPlayerForm({ name: '', team_id: '', position: '', jersey_number: '' });
    notify('Player added!');
  };

  // --- Match form ---
  const [matchForm, setMatchForm] = useState({ home_team_id: '', away_team_id: '', home_score: '', away_score: '', played_at: '' });
  const addMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = await apiFetch<Match>('/matches', {
      method: 'POST',
      body: JSON.stringify({
        home_team_id: Number(matchForm.home_team_id),
        away_team_id: Number(matchForm.away_team_id),
        home_score: Number(matchForm.home_score),
        away_score: Number(matchForm.away_score),
        played_at: matchForm.played_at,
      }),
    });
    setMatches((prev) => [...prev, m]);
    setMatchForm({ home_team_id: '', away_team_id: '', home_score: '', away_score: '', played_at: '' });
    notify('Match recorded!');
  };

  // --- Stats form ---
  const [statForm, setStatForm] = useState({ player_id: '', match_id: '', points: '', assists: '', rebounds: '' });
  const addStat = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/game-stats', {
      method: 'POST',
      body: JSON.stringify({
        player_id: Number(statForm.player_id),
        match_id: Number(statForm.match_id),
        points: Number(statForm.points),
        assists: Number(statForm.assists),
        rebounds: Number(statForm.rebounds),
      }),
    });
    setStatForm({ player_id: '', match_id: '', points: '', assists: '', rebounds: '' });
    notify('Stats saved!');
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'teams', label: 'Teams' },
    { key: 'players', label: 'Players' },
    { key: 'matches', label: 'Matches' },
    { key: 'stats', label: 'Player Stats' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h1>

      {msg && <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded">{msg}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded font-medium text-sm ${tab === t.key ? 'bg-gray-900 text-white' : 'bg-white border hover:bg-gray-100'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Teams */}
      {tab === 'teams' && (
        <div className="space-y-6">
          <form onSubmit={addTeam} className="flex gap-3">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800">Add Team</button>
          </form>
          <ul className="space-y-2">
            {teams.map((t) => (
              <li key={t.id} className="bg-white border rounded px-4 py-2">{t.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Players */}
      {tab === 'players' && (
        <div className="space-y-6">
          <form onSubmit={addPlayer} className="grid sm:grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Player name" value={playerForm.name} onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} required />
            <select className="border rounded px-3 py-2" value={playerForm.team_id} onChange={(e) => setPlayerForm({ ...playerForm, team_id: e.target.value })} required>
              <option value="">Select team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input className="border rounded px-3 py-2" placeholder="Position (e.g. PG)" value={playerForm.position} onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Jersey #" value={playerForm.jersey_number} onChange={(e) => setPlayerForm({ ...playerForm, jersey_number: e.target.value })} />
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 sm:col-span-2">Add Player</button>
          </form>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="bg-white border rounded px-4 py-2 flex justify-between">
                <span>{p.name}</span>
                <span className="text-gray-400 text-sm">{p.team?.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Matches */}
      {tab === 'matches' && (
        <div className="space-y-6">
          <form onSubmit={addMatch} className="grid sm:grid-cols-2 gap-3">
            <select className="border rounded px-3 py-2" value={matchForm.home_team_id} onChange={(e) => setMatchForm({ ...matchForm, home_team_id: e.target.value })} required>
              <option value="">Home team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={matchForm.away_team_id} onChange={(e) => setMatchForm({ ...matchForm, away_team_id: e.target.value })} required>
              <option value="">Away team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input className="border rounded px-3 py-2" type="number" min="0" placeholder="Home score" value={matchForm.home_score} onChange={(e) => setMatchForm({ ...matchForm, home_score: e.target.value })} required />
            <input className="border rounded px-3 py-2" type="number" min="0" placeholder="Away score" value={matchForm.away_score} onChange={(e) => setMatchForm({ ...matchForm, away_score: e.target.value })} required />
            <input className="border rounded px-3 py-2 sm:col-span-2" type="date" value={matchForm.played_at} onChange={(e) => setMatchForm({ ...matchForm, played_at: e.target.value })} required />
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 sm:col-span-2">Record Match</button>
          </form>
          <ul className="space-y-2">
            {matches.map((m) => (
              <li key={m.id} className="bg-white border rounded px-4 py-2 text-sm">
                {m.home_team?.name ?? m.home_team_id} {m.home_score} — {m.away_score} {m.away_team?.name ?? m.away_team_id} &nbsp;
                <span className="text-gray-400">{m.played_at}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats */}
      {tab === 'stats' && (
        <div className="space-y-6">
          <form onSubmit={addStat} className="grid sm:grid-cols-2 gap-3">
            <select className="border rounded px-3 py-2" value={statForm.player_id} onChange={(e) => setStatForm({ ...statForm, player_id: e.target.value })} required>
              <option value="">Select player</option>
              {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={statForm.match_id} onChange={(e) => setStatForm({ ...statForm, match_id: e.target.value })} required>
              <option value="">Select match</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.home_team?.name ?? m.home_team_id} vs {m.away_team?.name ?? m.away_team_id} ({m.played_at})
                </option>
              ))}
            </select>
            <input className="border rounded px-3 py-2" type="number" min="0" placeholder="Points" value={statForm.points} onChange={(e) => setStatForm({ ...statForm, points: e.target.value })} required />
            <input className="border rounded px-3 py-2" type="number" min="0" placeholder="Assists" value={statForm.assists} onChange={(e) => setStatForm({ ...statForm, assists: e.target.value })} required />
            <input className="border rounded px-3 py-2" type="number" min="0" placeholder="Rebounds" value={statForm.rebounds} onChange={(e) => setStatForm({ ...statForm, rebounds: e.target.value })} required />
            <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 sm:col-span-2">Save Stats</button>
          </form>
        </div>
      )}
    </div>
  );
}
