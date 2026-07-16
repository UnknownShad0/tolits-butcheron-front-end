'use client'
import { useState } from "react";
import type { CSSProperties, FC, Dispatch, SetStateAction } from "react";
// import { initialData } from "./data/initialData";
import { initialData } from "./data/initialDataFull";
// ─── Types ───────────────────────────────────────────────────────────────────

interface Player {
  id: number;
  jersey_no: number;
  name: string;
  points: number;
  fouls: number;
}

interface Team {
  id: number;
  name: string;
  players: Player[];
  fouls_per_quarter?: number[];
}

interface Teams {
  team_a: Team;
  team_b: Team;
}

type TeamKey = keyof Teams;
type QuarterFouls = Record<TeamKey, number[]>;

interface NewPlayerEntry {
  jersey_no: string;
  name: string;
}

interface NewPlayerState {
  team_a: NewPlayerEntry;
  team_b: NewPlayerEntry;
}

interface Meta {
  league: string;
  division: string;
  game_no: string | number;
  venue: string;
  game_date: string;
  game_time: string;
  referee: string;
  umpire_1: string;
  umpire_2: string;
}

let nextId = 10;

// ─── Palette ──────────────────────────────────────────────────────────────────
// "under the gym lights" — near-black hardwood surfaces, chalk-white type,
// a single scoreboard-amber accent, and a signal red reserved for fouls/removal.

const C = {
  page: "#111316",
  card: "#191c20",
  panel: "#1e2126",
  panelAlt: "#202429",
  border: "#2d3137",
  borderStrong: "#3d424a",
  text: "#eceae5",
  textDim: "#9a9fa6",
  textFaint: "#6b7076",
  amber: "#f2a63d",
  amberDim: "#c78730",
  red: "#e5544f",
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const tdS: CSSProperties = { border: `0.5px solid ${C.border}`, padding: "4px 4px", textAlign: "center", fontSize: 11, color: C.text };
const thS: CSSProperties = { background: C.panelAlt, border: `0.5px solid ${C.border}`, padding: "5px 4px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", textAlign: "center", color: C.textDim, letterSpacing: 0.5 };
const btnRow: CSSProperties = { display: "flex", gap: 3, alignItems: "center", justifyContent: "center" };
const valS: CSSProperties = { minWidth: 22, textAlign: "center", fontSize: 12, fontWeight: 700, color: C.text };
const foulBoxS: CSSProperties = { width: 15, height: 15, margin: 0, accentColor: C.amber, cursor: "pointer" };

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  small?: boolean;
}

const Field: FC<FieldProps> = ({ label, value, onChange, type = "text", small }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textFaint }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        border: "none", borderBottom: `1.5px solid ${C.borderStrong}`, padding: "2px 0",
        fontSize: small ? 11 : 12, fontFamily: "inherit", background: "transparent",
        outline: "none", width: "100%", color: C.text,
      }}
    />
  </div>
);

interface BtnProps {
  children: React.ReactNode;
  onClick: () => void;
  red?: boolean;
}

const Btn: FC<BtnProps> = ({ children, onClick, red }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${red ? C.red : C.borderStrong}`,
        background: hov ? (red ? C.red : C.text) : "transparent",
        color: hov ? (red ? "#1a1a1a" : "#111316") : (red ? C.red : C.text),
        cursor: "pointer", fontSize: 10, fontWeight: 700,
        padding: "2px 6px", borderRadius: 2, lineHeight: 1.5,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
};

interface PlayerRowProps {
  player: Player;
  onPts: (delta: number) => void;
  onFoul: (delta: number) => void;
  onRemove: () => void;
}

const PlayerRow: FC<PlayerRowProps> = ({ player, onPts, onFoul, onRemove }) => (
  <tr>
    <td style={tdS}>{player.jersey_no}</td>
    <td style={{ ...tdS, textAlign: "left", fontWeight: 700, paddingLeft: 8 }}>{player.name}</td>
    <td style={tdS}>
      <div style={btnRow}>
        <Btn red onClick={() => onPts(-1)}>−1</Btn>
        <span style={valS}>{player.points}</span>
        <Btn onClick={() => onPts(1)}>+1</Btn>
        <Btn onClick={() => onPts(2)}>+2</Btn>
        <Btn onClick={() => onPts(3)}>+3</Btn>
      </div>
    </td>
    <td style={tdS}>
      <div style={btnRow}>
        <Btn red onClick={() => onFoul(-1)}>−</Btn>
        <span style={{ ...valS, color: player.fouls >= 5 ? C.red : C.text, fontWeight: 700 }}>
          {player.fouls}
        </span>
        <Btn onClick={() => onFoul(1)}>+1</Btn>
      </div>
    </td>
    <td style={tdS}>
      <button
        onClick={onRemove}
        style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontWeight: 700, fontSize: 13 }}
      >
        ✕
      </button>
    </td>
  </tr>
);

function SectionHeader({ label, sub }: { label: string; sub: string }) {
  return (
    <div style={{ background: "#0a0b0d", color: C.amber, padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 10, color: C.textFaint }}>{sub}</span>
    </div>
  );
}

interface QuarterFoulsRowProps {
  teamKey: TeamKey;
  quarterFouls: number[];
  updateQuarterFouls: (team: TeamKey, quarter: number, count: number) => void;
}

const QuarterFoulsRow: FC<QuarterFoulsRowProps> = ({ teamKey, quarterFouls, updateQuarterFouls }) => (
  <div style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}` }}>
    <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textFaint, marginBottom: 5 }}>
      Fouls Per Quarter
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {quarterFouls.map((count, quarter) => (
        <div key={quarter} style={{ border: `1px solid ${C.border}`, background: C.panel, padding: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, minWidth: 18, color: C.text }}>Q{quarter + 1}</span>
          <div style={{ display: "flex", gap: 3 }}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <input
                key={idx}
                type="checkbox"
                checked={count > idx}
                onChange={() => updateQuarterFouls(teamKey, quarter, count > idx ? idx : idx + 1)}
                style={foulBoxS}
                aria-label={`Q${quarter + 1} foul ${idx + 1}`}
              />
            ))}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: count >= 5 ? C.red : C.textFaint, minWidth: 42, textAlign: "right" }}>
            {count >= 5 ? "Penalty" : `${count}/5`}
          </span>
        </div>
      ))}
    </div>
  </div>
);

interface TeamSectionProps {
  teamKey: TeamKey;
  label: string;
  team: Team;
  np: NewPlayerEntry;
  setTeams: Dispatch<SetStateAction<Teams>>;
  setNewPlayer: Dispatch<SetStateAction<NewPlayerState>>;
  updatePlayer: (team: TeamKey, id: number, field: "points" | "fouls", delta: number) => void;
  removePlayer: (team: TeamKey, id: number) => void;
  addPlayer: (team: TeamKey) => void;
  totalPts: (team: TeamKey) => number;
  quarterFouls: number[];
  updateQuarterFouls: (team: TeamKey, quarter: number, count: number) => void;
}

const TeamSection: FC<TeamSectionProps> = ({
  teamKey, label, team, np, setTeams, setNewPlayer,
  updatePlayer, removePlayer, addPlayer,
  totalPts, quarterFouls, updateQuarterFouls,
}) => (
  <div style={{ border: `1.5px solid ${C.borderStrong}`, marginBottom: 8, background: C.card }}>
    <SectionHeader label={team.name} sub={label} />
    <div style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
      <Field
        label="Team Name"
        value={team.name}
        onChange={(v) => setTeams((p) => ({ ...p, [teamKey]: { ...p[teamKey], name: v } }))}
      />
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ ...thS, width: 36 }}>#</th>
          <th style={{ ...thS, textAlign: "left", paddingLeft: 8 }}>Player</th>
          <th style={{ ...thS, width: 160 }}>Points</th>
          <th style={{ ...thS, width: 100 }}>Fouls</th>
          <th style={{ ...thS, width: 30 }}></th>
        </tr>
      </thead>
      <tbody>
        {team.players.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            onPts={(d) => updatePlayer(teamKey, p.id, "points", d)}
            onFoul={(d) => updatePlayer(teamKey, p.id, "fouls", d)}
            onRemove={() => removePlayer(teamKey, p.id)}
          />
        ))}
        <tr style={{ background: C.panel }}>
          <td style={tdS}>
            <input
              type="number"
              placeholder="#"
              value={np.jersey_no}
              onChange={(e) =>
                setNewPlayer((prev) => ({ ...prev, [teamKey]: { ...prev[teamKey], jersey_no: e.target.value } }))
              }
              style={{ width: 32, border: `1px solid ${C.border}`, background: C.card, color: C.text, textAlign: "center", fontSize: 11, padding: 2, fontFamily: "inherit" }}
            />
          </td>
          <td style={{ ...tdS, textAlign: "left" }}>
            <input
              type="text"
              placeholder="Player last name..."
              value={np.name}
              onChange={(e) =>
                setNewPlayer((prev) => ({ ...prev, [teamKey]: { ...prev[teamKey], name: e.target.value } }))
              }
              onKeyDown={(e) => e.key === "Enter" && addPlayer(teamKey)}
              style={{ width: "100%", border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11, padding: "2px 4px", fontFamily: "inherit" }}
            />
          </td>
          <td colSpan={3} style={tdS}>
            <button
              onClick={() => addPlayer(teamKey)}
              style={{ background: C.amber, color: "#1a1206", border: "none", padding: "3px 14px", fontWeight: 700, fontSize: 11, cursor: "pointer", borderRadius: 2, fontFamily: "inherit" }}
            >
              + Add Player
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr style={{ background: C.panelAlt }}>
          <td colSpan={2} style={{ ...tdS, textAlign: "left", paddingLeft: 8, fontWeight: 700, borderTop: `1.5px solid ${C.borderStrong}` }}>TOTAL POINTS</td>
          <td style={{ ...tdS, fontWeight: 700, color: C.amber, borderTop: `1.5px solid ${C.borderStrong}` }}>{totalPts(teamKey)}</td>
          <td style={{ ...tdS, borderTop: `1.5px solid ${C.borderStrong}` }}></td>
          <td style={{ ...tdS, borderTop: `1.5px solid ${C.borderStrong}` }}></td>
        </tr>
      </tfoot>
    </table>
    <QuarterFoulsRow teamKey={teamKey} quarterFouls={quarterFouls} updateQuarterFouls={updateQuarterFouls} />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function Scoresheet() {
  const [meta, setMeta] = useState<Meta>({
    league: initialData.league,
    division: initialData.division,
    game_no: initialData.game_no,
    venue: initialData.venue,
    game_date: initialData.game_date,
    game_time: initialData.game_time,
    referee: initialData.officials.referee,
    umpire_1: initialData.officials.umpire_1,
    umpire_2: initialData.officials.umpire_2,
  });

  const [teams, setTeams] = useState<Teams>(initialData.teams);
  const [newPlayer, setNewPlayer] = useState<NewPlayerState>({
    team_a: { jersey_no: "", name: "" },
    team_b: { jersey_no: "", name: "" },
  });
  const [quarterFouls, setQuarterFouls] = useState<QuarterFouls>({
    team_a: initialData.teams.team_a.fouls_per_quarter,
    team_b: initialData.teams.team_b.fouls_per_quarter,
  });
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);

  // Total score is now derived entirely from player points
  const totalPts = (team: TeamKey) => teams[team].players.reduce((s, p) => s + p.points, 0);

  const updatePlayer = (team: TeamKey, id: number, field: "points" | "fouls", delta: number) => {
    setTeams((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map((p) =>
          p.id === id ? { ...p, [field]: Math.max(0, p[field] + delta) } : p
        ),
      },
    }));
  };

  const removePlayer = (team: TeamKey, id: number) => {
    setTeams((prev) => ({
      ...prev,
      [team]: { ...prev[team], players: prev[team].players.filter((p) => p.id !== id) },
    }));
  };

  const addPlayer = (team: TeamKey) => {
    const np = newPlayer[team];
    if (!np.name.trim()) return;
    const player: Player = {
      id: nextId++,
      jersey_no: parseInt(np.jersey_no) || 0,
      name: np.name.trim(),
      points: 0,
      fouls: 0,
    };
    setTeams((prev) => ({
      ...prev,
      [team]: { ...prev[team], players: [...prev[team].players, player] },
    }));
    setNewPlayer((prev) => ({ ...prev, [team]: { jersey_no: "", name: "" } }));
  };

  const updateQuarterFouls = (team: TeamKey, quarter: number, count: number) => {
    setQuarterFouls((prev) => ({
      ...prev,
      [team]: prev[team].map((value, idx) => (idx === quarter ? Math.max(0, Math.min(5, count)) : value)),
    }));
  };

  const getWinner = (): TeamKey | null => {
    const a = totalPts("team_a"), b = totalPts("team_b");
    if (a === b) return null;
    return a > b ? "team_a" : "team_b";
  };

  const getBpog = (): Player | null => {
    const winner = getWinner();
    if (!winner) return null;
    const players = teams[winner].players;
    if (!players.length) return null;
    return players.reduce((best, p) => (p.points > best.points ? p : best), players[0]);
  };

  const buildJSON = () => {
    const winner = getWinner();
    const bpog = getBpog();
    const topScorers = (team: TeamKey): Record<string, number> => {
      const obj: Record<string, number> = {};
      teams[team].players.forEach((p) => { obj[p.name] = p.points; });
      return obj;
    };
    return {
      league: meta.league, division: meta.division, game_no: meta.game_no,
      venue: meta.venue, game_date: meta.game_date, game_time: meta.game_time,
      officials: { referee: meta.referee, umpire_1: meta.umpire_1, umpire_2: meta.umpire_2 },
      teams: {
        team_a: {
          id: teams.team_a.id, name: teams.team_a.name,
          total_score: totalPts("team_a"),
          top_scorers: topScorers("team_a"),
          fouls_per_quarter: quarterFouls.team_a,
          players: teams.team_a.players,
        },
        team_b: {
          id: teams.team_b.id, name: teams.team_b.name,
          total_score: totalPts("team_b"),
          top_scorers: topScorers("team_b"),
          fouls_per_quarter: quarterFouls.team_b,
          players: teams.team_b.players,
        },
      },
      game_winner: winner ? teams[winner].name : "TIE",
      bpog: bpog && winner
        ? {
            bpog_rule: "Highest scorer from the winning team only",
            player_id: bpog.id, jersey_no: bpog.jersey_no,
            name: bpog.name, team: teams[winner].name, points: bpog.points,
          }
        : null,
    };
  };

  const winner = getWinner();
  const bpog = getBpog();

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: C.page, minHeight: "100vh", padding: 16 }}>
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } }`}</style>

      <div className="no-print" style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 12 }}>
        <button
          onClick={() => window.print()}
          style={{ padding: "7px 18px", fontWeight: 700, fontSize: 12, border: `2px solid ${C.borderStrong}`, background: "transparent", color: C.text, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "inherit" }}
        >
          🖨 Print / Save PDF
        </button>
        <button
          onClick={() => setJsonOutput(JSON.stringify(buildJSON(), null, 2))}
          style={{ padding: "7px 18px", fontWeight: 700, fontSize: 12, border: `2px solid ${C.amber}`, background: C.amber, color: "#1a1206", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "inherit" }}
        >
          📋 Record Match
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", background: C.card, padding: 20, border: `1px solid ${C.border}`, boxShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div style={{ border: `2px solid ${C.borderStrong}`, padding: "10px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: 2 }}>
            <input
              value={meta.league}
              onChange={(e) => setMeta({ ...meta, league: e.target.value })}
              style={{ border: "none", textAlign: "center", fontWeight: 700, fontSize: 20, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: 2, width: "100%", outline: "none", background: "transparent", color: C.amber }}
            />
          </div>
          <div style={{ fontSize: 12, textAlign: "center", marginTop: 2 }}>
            <input
              value={meta.division}
              onChange={(e) => setMeta({ ...meta, division: e.target.value })}
              style={{ border: "none", textAlign: "center", fontSize: 12, fontFamily: "inherit", width: "100%", outline: "none", background: "transparent", color: C.textDim }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
            <Field label="Game No." value={meta.game_no} onChange={(v) => setMeta({ ...meta, game_no: v })} small />
            <Field label="Venue" value={meta.venue} onChange={(v) => setMeta({ ...meta, venue: v })} small />
            <Field label="Date" value={meta.game_date} onChange={(v) => setMeta({ ...meta, game_date: v })} small />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
            <Field label="Referee" value={meta.referee} onChange={(v) => setMeta({ ...meta, referee: v })} small />
            <Field label="Umpire 1" value={meta.umpire_1} onChange={(v) => setMeta({ ...meta, umpire_1: v })} small />
            <Field label="Umpire 2" value={meta.umpire_2} onChange={(v) => setMeta({ ...meta, umpire_2: v })} small />
          </div>
        </div>

        <TeamSection
          teamKey="team_a" label="Team A"
          team={teams.team_a} np={newPlayer.team_a}
          setTeams={setTeams} setNewPlayer={setNewPlayer}
          updatePlayer={updatePlayer} removePlayer={removePlayer}
          addPlayer={addPlayer}
          totalPts={totalPts}
          quarterFouls={quarterFouls.team_a}
          updateQuarterFouls={updateQuarterFouls}
        />
        <TeamSection
          teamKey="team_b" label="Team B"
          team={teams.team_b} np={newPlayer.team_b}
          setTeams={setTeams} setNewPlayer={setNewPlayer}
          updatePlayer={updatePlayer} removePlayer={removePlayer}
          addPlayer={addPlayer}
          totalPts={totalPts}
          quarterFouls={quarterFouls.team_b}
          updateQuarterFouls={updateQuarterFouls}
        />

        {/* Winner & BPOG */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div style={{ border: `2px solid ${C.borderStrong}`, padding: "8px 12px", background: C.panel }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: C.textFaint, letterSpacing: 1 }}>Game Winner</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, color: C.text }}>
              {winner ? teams[winner].name : <span style={{ color: C.textDim }}>TIE</span>}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 2, letterSpacing: 2, color: C.amber, fontVariantNumeric: "tabular-nums" }}>
              {totalPts("team_a")} – {totalPts("team_b")}
            </div>
          </div>
          <div style={{ border: `2px solid ${C.borderStrong}`, padding: "8px 12px", background: C.panel }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: C.textFaint, letterSpacing: 1 }}>Best Player of the Game (BPOG)</div>
            <div style={{ fontSize: 9, color: C.textFaint, marginTop: 1 }}>Highest scorer from winning team only</div>
            {bpog && winner ? (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.amber }}>#{bpog.jersey_no} {bpog.name}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>{teams[winner].name} · {bpog.points} pts</div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: C.textFaint, marginTop: 4 }}>—</div>
            )}
          </div>
        </div>
      </div>

      {/* JSON Output Modal */}
      {jsonOutput && (
        <div
          className="no-print"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}
        >
          <div style={{ background: "#0a0b0d", color: "#e8e8e8", borderRadius: 6, padding: 20, maxWidth: 700, width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: C.amber }}>Match JSON</span>
              <button onClick={() => setJsonOutput(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <pre style={{ overflow: "auto", fontSize: 11, lineHeight: 1.6, flex: 1, fontFamily: "monospace" }}>{jsonOutput}</pre>
            <button
              onClick={() => { navigator.clipboard.writeText(jsonOutput); }}
              style={{ marginTop: 10, padding: "6px 16px", background: C.amber, color: "#1a1206", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 12, borderRadius: 2, fontFamily: "inherit" }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}