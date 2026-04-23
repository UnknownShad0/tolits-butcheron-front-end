'use client';
import { useState } from 'react';
import { Input, Select, Btn, Card, SectionTitle } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import type { Player, Match } from '@/lib/types';

export default function StatsForm({ players, matches, onSave }: { players: Player[]; matches: Match[]; onSave?: () => void }) {
  const [form, setForm] = useState({ player_id: '', match_id: '', points: '', assists: '', rebounds: '' });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/game-stats', {
        method: 'POST',
        body: JSON.stringify({
          player_id: Number(form.player_id),
          match_id: Number(form.match_id),
          points: Number(form.points),
          assists: Number(form.assists),
          rebounds: Number(form.rebounds),
        }),
      });
      setForm({ player_id: '', match_id: '', points: '', assists: '', rebounds: '' });
      onSave?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <SectionTitle>Input Player Stats</SectionTitle>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Select value={form.player_id} onChange={set('player_id')} required>
          <option value="">Select player</option>
          {players.map((p) => <option key={p.id} value={p.id}>{p.name} {p.jersey_number ? `(#${p.jersey_number})` : ''}</option>)}
        </Select>
        <Select value={form.match_id} onChange={set('match_id')} required>
          <option value="">Select match</option>
          {matches.map((m) => (
            <option key={m.id} value={m.id}>
              {m.home_team?.name ?? '?'} vs {m.away_team?.name ?? '?'} — {m.played_at}
            </option>
          ))}
        </Select>

        {/* Stat inputs in a row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs block mb-1 text-center" style={{ color: '#4A7A9B' }}>Points</label>
            <Input type="number" min="0" placeholder="0" value={form.points} onChange={set('points')} required className="text-center font-bold text-lg" />
          </div>
          <div>
            <label className="text-xs block mb-1 text-center" style={{ color: '#4A7A9B' }}>Assists</label>
            <Input type="number" min="0" placeholder="0" value={form.assists} onChange={set('assists')} required className="text-center font-bold text-lg" />
          </div>
          <div>
            <label className="text-xs block mb-1 text-center" style={{ color: '#4A7A9B' }}>Rebounds</label>
            <Input type="number" min="0" placeholder="0" value={form.rebounds} onChange={set('rebounds')} required className="text-center font-bold text-lg" />
          </div>
        </div>

        <Btn type="submit" full disabled={loading}>{loading ? 'Saving…' : 'Save Stats'}</Btn>
      </form>
    </Card>
  );
}
