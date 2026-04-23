'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Input, Select, Btn, Card, SectionTitle, colors } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import type { Team, Player } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function PlayerForm({ teams, players, onAdd }: { teams: Team[]; players: Player[]; onAdd: (p: Player) => void }) {
  const [form, setForm] = useState({ name: '', team_id: '', position: '', jersey_number: '' });
  const [loading, setLoading] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (photoRef.current?.files?.[0]) fd.append('photo', photoRef.current.files[0]);
      const p = await apiFetch<Player>('/players', { method: 'POST', body: fd });
      onAdd(p);
      setForm({ name: '', team_id: '', position: '', jersey_number: '' });
      if (photoRef.current) photoRef.current.value = '';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Add Player</SectionTitle>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-3">
          <Input placeholder="Full name" value={form.name} onChange={set('name')} required />
          <Select value={form.team_id} onChange={set('team_id')} required>
            <option value="">Select team</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <Input placeholder="Position (e.g. PG, SG)" value={form.position} onChange={set('position')} />
          <Input placeholder="Jersey #" value={form.jersey_number} onChange={set('jersey_number')} />
          <div className="sm:col-span-2">
            <label className="text-xs block mb-1.5" style={{ color: colors.textDim }}>Profile Photo (optional)</label>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="text-sm w-full file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:font-bold file:cursor-pointer file:text-sm"
              style={{ color: colors.textMuted }}
            />
          </div>
          <div className="sm:col-span-2">
            <Btn type="submit" full disabled={loading}>{loading ? 'Adding…' : 'Add Player'}</Btn>
          </div>
        </form>
      </Card>

      {players.length > 0 && (
        <Card>
          <SectionTitle>Players ({players.length})</SectionTitle>
          <ul className="space-y-1">
            {players.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm" style={{ borderColor: colors.border }}>
                <div className="flex items-center gap-3">
                  {p.photo_path ? (
                    <Image src={`${STORAGE}/${p.photo_path}`} alt={p.name} width={32} height={32} className="rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: colors.primary }} />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: colors.border }}>👤</div>
                  )}
                  <span className="font-bold w-6 text-center text-xs" style={{ color: colors.gold }}>{p.jersey_number ?? '—'}</span>
                  <span className="font-semibold" style={{ color: colors.text }}>{p.name}</span>
                  {p.position && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.border, color: colors.textMuted }}>{p.position}</span>}
                </div>
                <span className="text-xs" style={{ color: colors.textDim }}>{p.team?.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
