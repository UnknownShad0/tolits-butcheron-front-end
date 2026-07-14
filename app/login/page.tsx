'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { Input, Btn, cv } from '@/components/ui';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('admin@tolits.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border p-8 shadow-lg"
        style={{ backgroundColor: cv.surface, borderColor: cv.border }}>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logos/tolits-basketball-logo.jpg" alt="Tolit's Basketball"
            width={64} height={64} className="rounded-full object-cover border-2 mb-3"
            style={{ borderColor: cv.primary }} />
          <h1 className="font-display font-extrabold uppercase tracking-widest text-lg"
            style={{ color: cv.primaryLight }}>
            Admin Login
          </h1>
          <p className="text-xs mt-1" style={{ color: cv.textDim }}>
            Tolit&apos;s Butcheron Basketball
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-1 block"
              style={{ color: cv.textMuted }}>
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@tolits.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-1 block"
              style={{ color: cv.textMuted }}>
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <Btn type="submit" full disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Btn>
        </form>
      </div>
    </div>
  );
}
