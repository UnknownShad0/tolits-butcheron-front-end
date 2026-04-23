'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Input, Btn, Card, SectionTitle, colors, cv } from '@/components/ui';
import { apiFetch } from '@/lib/api';
import type { Team } from '@/lib/types';

const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL ?? 'http://localhost:8000/storage';

export default function TeamForm({ teams, onAdd }: { teams: Team[]; onAdd: (t: Team) => void }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      if (logoRef.current?.files?.[0]) fd.append('logo', logoRef.current.files[0]);
      const t = await apiFetch<Team>('/teams', { method: 'POST', body: fd });
      onAdd(t);
      setName('');
      if (logoRef.current) logoRef.current.value = '';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Add Team</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Team name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="text-xs block mb-1.5" style={{ color: colors.textDim }}>Logo (optional)</label>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="text-sm w-full file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:font-bold file:cursor-pointer file:text-sm"
              style={{ color: colors.textMuted }}
            />
          </div>
          <Btn type="submit" full disabled={loading}>{loading ? 'Adding…' : 'Add Team'}</Btn>
        </form>
      </Card>

      {/* Team list */}
      {teams.length > 0 && (
        <Card>
          <SectionTitle>Teams ({teams.length})</SectionTitle>
          <ul className="space-y-2">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: colors.border }}>
                {t.logo_path
                  ? <Image src={`${STORAGE}/${t.logo_path}`} alt={t.name} width={36} height={36} className="rounded-full object-cover border-2 flex-shrink-0" style={{ borderColor: colors.primary }} />
                  : <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: colors.border }}>🏀</div>
                }
                <span className="font-semibold text-sm" style={{ color: colors.text }}>{t.name}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
