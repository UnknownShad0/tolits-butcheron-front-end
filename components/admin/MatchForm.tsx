'use client';
import { useState } from 'react';
import { Input, Select, Btn, Card, SectionTitle, colors } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import type { Team, Match } from '@/lib/types';

export default function MatchForm({ teams, matches, onAdd }: { teams: Team[]; matches: Match[]; onAdd: (m: Match) => void }) {
  const [form, setForm] = useState({ home_team_id: '', away_team_id: '', home_score: '', away_score: '', played_at: '' });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const m = await apiFetch<Match>('/matches', {
        method: 'POST',
        body: JSON.stringify({
          home_team_id: Number(form.home_team_id),
          away_team_id: Number(form.away_team_id),
          home_score: Number(form.home_score),
          away_score: Number(form.away_score),
          played_at: form.played_at,
        }),
      });
      onAdd(m);
      setForm({ home_team_id: '', away_team_id: '', home_score: '', away_score: '', played_at: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Record Match</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={form.home_team_id} onChange={set('home_team_id')} required>
              <option value="">Home team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Select value={form.away_team_id} onChange={set('away_team_id')} required>
              <option value="">Away team</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </div>

          {/* Score row */}
          <div className="flex items-center gap-3">
            <Input type="number" min="0" placeholder="Home score" value={form.home_score} onChange={set('home_score')} required className="text-center text-lg font-bold" />
            <span className="font-display font-bold text-xl flex-shrink-0" style={{ color: colors.textDim }}>VS</span>
            <Input type="number" min="0" placeholder="Away score" value={form.away_score} onChange={set('away_score')} required className="text-center text-lg font-bold" />
          </div>

          <Input type="date" value={form.played_at} onChange={set('played_at')} required />
          <Btn type="submit" full disabled={loading}>{loading ? 'Saving…' : 'Record Match'}</Btn>
        </form>
      </Card>

      {matches.length > 0 && (
        <Card>
          <SectionTitle>Recent Matches ({matches.length})</SectionTitle>
          <ul className="space-y-1">
            {matches.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: colors.border }}>
                <span style={{ color: colors.text }}>
                  {m.home_team?.name ?? '?'}{' '}
                  <strong style={{ color: colors.primary }}>{m.home_score}–{m.away_score}</strong>{' '}
                  {m.away_team?.name ?? '?'}
                </span>
                <span className="text-xs" style={{ color: colors.textDim }}>{m.played_at}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
