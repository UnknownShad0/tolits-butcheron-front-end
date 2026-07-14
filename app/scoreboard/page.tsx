'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function EditableNumber({ value, onChange, style, min = 0, max = 999 }: {
  value: number; onChange: (v: number) => void;
  style?: React.CSSProperties; min?: number; max?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);
  function commit() {
    const n = parseInt(draft, 10);
    if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
    setEditing(false);
  }
  if (editing) return (
    <input ref={ref} type="number" value={draft}
      onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      className="bg-transparent border-b-2 border-yellow-400 outline-none text-center w-full"
      style={style} />
  );
  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true); }}
      className="tabular-nums cursor-pointer hover:brightness-150 transition-all"
      style={{ ...style, lineHeight: 1 }} title="Click to edit">{value}</button>
  );
}

function EditableText({ value, onChange, style }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editing) ref.current?.select(); }, [editing]);
  function commit() { onChange(draft.trim() || value); setEditing(false); }
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
      className="bg-transparent border-b-2 border-yellow-400 outline-none text-center uppercase w-full"
      style={style} />
  );
  return (
    <button onClick={() => { setDraft(value); setEditing(true); }}
      className="uppercase cursor-pointer hover:brightness-150 transition-all" style={style}
      title="Click to edit">{value}</button>
  );
}

export default function ScoreboardPage() {
  
  const [homeTeam, setHomeTeam] = useState('HOME');
  const [awayTeam, setAwayTeam] = useState('AWAY');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [possession, setPossession] = useState<'home' | 'away' | null>(null);
  const [timerSecs, setTimerSecs] = useState(10 * 60);
  const [timerMs, setTimerMs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerTotalMs = useRef(10 * 60 * 1000);
  const [shotClock, setShotClock] = useState(24);
  const [shotRunning, setShotRunning] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shotRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimerRunning(false);
  }, []);
  const stopShot = useCallback(() => {
    if (shotRef.current) { clearInterval(shotRef.current); shotRef.current = null; }
    setShotRunning(false);
  }, []);
  function startTimer() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      timerTotalMs.current -= 10;
      if (timerTotalMs.current <= 0) {
        timerTotalMs.current = 0;
        stopTimer();
      }
      setTimerSecs(Math.floor(timerTotalMs.current / 1000));
      setTimerMs(Math.floor((timerTotalMs.current % 1000) / 10));
    }, 10);
    setTimerRunning(true);
  }
  function startShot() {
    if (shotRef.current) return;
    shotRef.current = setInterval(() => setShotClock(s => { if (s <= 1) { stopShot(); return 0; } return s - 1; }), 1000);
    setShotRunning(true);
  }

  useEffect(() => () => { stopTimer(); stopShot(); }, [stopTimer, stopShot]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href === '/scoreboard') return;
      if (!confirm('Leave scoreboard? All data will be lost.')) { e.preventDefault(); e.stopPropagation(); }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  const mm = String(Math.floor(timerSecs / 60)).padStart(2, '0');
  const ss = String(timerSecs % 60).padStart(2, '0');
  const ms = String(timerMs).padStart(2, '0');
  const shotUrgent = shotClock <= 5;
  const qtrLabel = quarter <= 4 ? String(quarter) : `OT${quarter - 4 > 1 ? quarter - 4 : ''}`;

  function resetAll() {
    if (!confirm('Reset scoreboard?')) return;
    setHomeScore(0); setAwayScore(0); setQuarter(1); setPossession(null);
    stopTimer(); timerTotalMs.current = 10 * 60 * 1000; setTimerSecs(10 * 60); setTimerMs(0); stopShot(); setShotClock(24);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) boardRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  // Shared LED styles
  const ledAmber: React.CSSProperties = { fontFamily: 'monospace', fontWeight: 900, color: '#f5a623', textShadow: '0 0 10px #f5a623, 0 0 30px #f5a62399' };
  const ledRed: React.CSSProperties = { fontFamily: 'monospace', fontWeight: 900, color: '#e53e3e', textShadow: '0 0 12px #e53e3e, 0 0 35px #e53e3e88' };
  const ledGreen: React.CSSProperties = { fontFamily: 'monospace', fontWeight: 900, color: '#22c55e', textShadow: '0 0 10px #22c55e, 0 0 25px #22c55e88' };
  const dimBtn: React.CSSProperties = { color: '#555', border: '1px solid #2a2a2a', background: 'transparent' };
  
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center gap-4 py-6  justify-center">
      {/* ══ SCOREBOARD BOARD ══ */}
      <div ref={boardRef} className="w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col justify-center"
        style={{ background: '#0a0a0a', border: '6px solid #1c1c1c', boxShadow: '0 0 80px #000' }}>

        {/* ── TOP SECTION: POSS | game clock + shot clock | POSS ── */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-5 py-5"
          style={{ background: '#0d0d0d', borderBottom: '3px solid #1a1a1a' }}>

          {/* LEFT: POSS label + red triangle pointing LEFT ◀ */}
          <div className="flex flex-col items-start gap-1 pr-2">
            <span className="text-xs font-bold tracking-widest" style={{ color: '#888' }}>POSS</span>
            <button
              onClick={() => setPossession(p => p === 'home' ? null : 'home')}
              title="Home possession"
              style={{
                width: 0, height: 0,
                borderTop: '18px solid transparent', borderBottom: '18px solid transparent',
                borderRight: `32px solid ${possession === 'home' ? '#e53e3e' : '#2a2a2a'}`,
                filter: possession === 'home' ? 'drop-shadow(0 0 8px #e53e3e)' : 'none',
                cursor: 'pointer', background: 'none', outline: 'none', transition: 'all 0.2s',
              }} />
          </div>

          {/* CENTER: game clock (big) with shot clock + 24/14 stacked underneath */}
          <div className="flex flex-col items-center justify-center gap-1">
            {/* Game clock row */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  const inp = window.prompt('Set time (MM:SS)', `${mm}:${ss}`);
                  if (!inp) return;
                  const [m, s] = inp.split(':').map(Number);
                  if (!isNaN(m) && !isNaN(s)) { timerTotalMs.current = (m * 60 + s) * 1000; setTimerSecs(m * 60 + s); setTimerMs(0); }
                }}
                className="hover:brightness-150 transition tabular-nums"
                style={{ ...ledAmber, fontSize: '5rem', lineHeight: 1, ...(timerSecs === 0 ? { color: '#e53e3e', textShadow: '0 0 12px #e53e3e' } : {}) }}
                title="Click to set time"
              >{mm}:{ss}:{ms}</button>
              {/* Shot clock number */}
              <EditableNumber value={shotClock} onChange={setShotClock}
                style={{ ...ledAmber, fontSize: '5rem', ...(shotUrgent ? { color: '#e53e3e', textShadow: '0 0 12px #e53e3e' } : {}) }}
                min={0} max={24} />
            </div>
          </div>

          {/* RIGHT: POSS label + red triangle pointing RIGHT ▶ */}
          <div className="flex flex-col items-end gap-1 pl-2">
            <span className="text-xs font-bold tracking-widest" style={{ color: '#888' }}>POSS</span>
            <button
              onClick={() => setPossession(p => p === 'away' ? null : 'away')}
              title="Away possession"
              style={{
                width: 0, height: 0,
                borderTop: '18px solid transparent', borderBottom: '18px solid transparent',
                borderLeft: `32px solid ${possession === 'away' ? '#e53e3e' : '#2a2a2a'}`,
                filter: possession === 'away' ? 'drop-shadow(0 0 8px #e53e3e)' : 'none',
                cursor: 'pointer', background: 'none', outline: 'none', transition: 'all 0.2s',
              }} />
          </div>
        </div>

        {/* ── BOTTOM SECTION: HOME score | PERIOD | AWAY score ── */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-6 gap-4"
          style={{ background: '#111' }}>

          {/* HOME */}
          <div className="flex flex-col items-center gap-3">
            <EditableText value={homeTeam} onChange={setHomeTeam}
              style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: 'sans-serif', textShadow: '0 2px 8px #000' }} />
            <div className="flex items-center gap-3">
              <button onClick={() => setHomeScore(s => Math.max(0, s - 1))}
                className="w-10 h-10 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-white/10 transition" style={dimBtn}>−</button>
              <EditableNumber value={homeScore} onChange={setHomeScore}
                style={{ ...ledRed, fontSize: '7rem' }} max={999} />
              <button onClick={() => setHomeScore(s => s + 1)}
                className="w-10 h-10 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-white/10 transition" style={dimBtn}>+</button>
            </div>
            {/* <button onClick={() => setPossession(p => p === 'home' ? null : 'home')}
              className="px-5 py-1.5 rounded-full font-bold uppercase text-sm tracking-widest transition-all hover:brightness-110"
              style={{
                backgroundColor: possession === 'home' ? '#e53e3e' : '#1a1a1a',
                color: possession === 'home' ? '#fff' : '#444',
                border: `2px solid ${possession === 'home' ? '#e53e3e' : '#2a2a2a'}`,
                boxShadow: possession === 'home' ? '0 0 20px #e53e3e66' : 'none',
              }}>🏀 BALL</button> */}
          </div>

          {/* CENTER: PERIOD */}
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-1">
              <button onClick={() => setQuarter(q => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition font-bold text-sm" style={{ color: '#555' }}>−</button>
              <button
                onClick={() => {
                  const inp = window.prompt('Set quarter', String(quarter));
                  if (!inp) return;
                  const n = parseInt(inp, 10);
                  if (!isNaN(n) && n >= 1) setQuarter(n);
                }}
                className="hover:brightness-150 transition tabular-nums"
                style={{ ...ledGreen, fontSize: '3rem', lineHeight: 1 }}
                title="Click to edit"
              >{qtrLabel}</button>
              <button onClick={() => setQuarter(q => q + 1)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition font-bold text-sm" style={{ color: '#555' }}>+</button>
            </div>
            <span className="text-xs font-bold tracking-widest" style={{ color: '#666' }}>PERIOD</span>
          </div>

          {/* AWAY */}
          <div className="flex flex-col items-center gap-3">
            <EditableText value={awayTeam} onChange={setAwayTeam}
              style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: 'sans-serif', textShadow: '0 2px 8px #000' }} />
            <div className="flex items-center gap-3">
              <button onClick={() => setAwayScore(s => Math.max(0, s - 1))}
                className="w-10 h-10 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-white/10 transition" style={dimBtn}>−</button>
              <EditableNumber value={awayScore} onChange={setAwayScore}
                style={{ ...ledRed, fontSize: '7rem' }} max={999} />
              <button onClick={() => setAwayScore(s => s + 1)}
                className="w-10 h-10 rounded-lg text-2xl font-bold flex items-center justify-center hover:bg-white/10 transition" style={dimBtn}>+</button>
            </div>
            {/* <button onClick={() => setPossession(p => p === 'away' ? null : 'away')}
              className="px-5 py-1.5 rounded-full font-bold uppercase text-sm tracking-widest transition-all hover:brightness-110"
              style={{
                backgroundColor: possession === 'away' ? '#e53e3e' : '#1a1a1a',
                color: possession === 'away' ? '#fff' : '#444',
                border: `2px solid ${possession === 'away' ? '#e53e3e' : '#2a2a2a'}`,
                boxShadow: possession === 'away' ? '0 0 20px #e53e3e66' : 'none',
              }}>🏀 BALL</button> */}
          </div>
        </div>

        {/* ── CONTROLS BAR ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-6 py-3"
          style={{ background: '#0a0a0a', borderTop: '2px solid #1a1a1a' }}>

          {/* Clock */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest" style={{ color: '#555' }}>CLOCK</span>
            <button onClick={() => {
                if (timerRunning) {
                  stopTimer();
                  stopShot();       // pause shot clock when main clock pauses
                } else {
                  startTimer();
                  if (shotClock > 0) startShot();  // resume shot clock only if it has time left
                }
              }}
              className="px-4 py-1.5 rounded font-bold uppercase text-xs tracking-wide transition hover:brightness-110"
              style={{ background: timerRunning ? '#e53e3e' : '#16a34a', color: '#fff' }}>
              {timerRunning ? '⏸ Pause' : '▶ Start'}</button>
            <button onClick={() => { stopTimer(); timerTotalMs.current = 10 * 60 * 1000; setTimerSecs(10 * 60); setTimerMs(0); }}
              className="px-3 py-1 rounded text-xs font-bold border hover:bg-white/10 transition" style={{ borderColor: '#333', color: '#666' }}>Reset</button>
          </div>

          <div className="w-px h-5" style={{ background: '#222' }} />

          {/* Shot clock */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest" style={{ color: '#555' }}>SHOT</span>
            <button onClick={() => shotRunning ? stopShot() : startShot()}
              className="px-4 py-1.5 rounded font-bold uppercase text-xs tracking-wide transition hover:brightness-110"
              style={{ background: shotRunning ? '#e53e3e' : '#16a34a', color: '#fff' }}>
              {shotRunning ? '⏸' : '▶'}</button>
            <button onClick={() => { setShotClock(24); startShot(); }}
              className="px-3 py-1 rounded text-xs font-bold border hover:bg-white/10 transition" style={{ borderColor: '#333', color: '#666' }}>24</button>
            <button onClick={() => { setShotClock(14); startShot(); }}
              className="px-3 py-1 rounded text-xs font-bold border hover:bg-white/10 transition" style={{ borderColor: '#333', color: '#666' }}>14</button>
          </div>

          <div className="w-px h-5" style={{ background: '#222' }} />

          <button onClick={toggleFullscreen}
            className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide border hover:bg-white/10 transition"
            style={{ borderColor: '#333', color: '#aaa' }}>⛶ Fullscreen</button>

          <button onClick={resetAll}
            className="px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide border hover:bg-red-500/10 transition"
            style={{ borderColor: '#e53e3e44', color: '#e53e3e' }}>↺ Reset All</button>
        </div>
      </div>

      <p className="text-xs" style={{ color: '#555' }}>Click any number or name to edit</p>
    </div>
  );
}
