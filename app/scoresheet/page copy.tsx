'use client'
import { useState } from "react";

const initialData = {
  league: "Tolits Basketball League",
  division: "Senior Division",
  game_no: 12,
  venue: "Tolits Gymnasium",
  game_date: "2026-06-05",
  game_time: "19:00",
  officials: {
    referee: "Juan Dela Cruz",
    umpire_1: "Pedro Santos",
    umpire_2: "Mark Reyes",
  },
  teams: {
    team_a: {
      id: 1,
      name: "Tolits Warriors",
      players: [
        { id: 1, jersey_no: 4, name: "Macaraeg", points: 0, fouls: 0 },
        { id: 2, jersey_no: 5, name: "Villanueva", points: 0, fouls: 0 },
      ],
      quarter_scores: { q1: 0, q2: 0, q3: 0, q4: 0, ot: 0 },
    },
    team_b: {
      id: 2,
      name: "Tolits Titans",
      players: [
        { id: 3, jersey_no: 4, name: "Buenaventura", points: 0, fouls: 0 },
        { id: 4, jersey_no: 5, name: "Cruz", points: 0, fouls: 0 },
      ],
      quarter_scores: { q1: 0, q2: 0, q3: 0, q4: 0, ot: 0 },
    },
  },
};

let nextId = 10;

function Field({ label, value, onChange, type = "text", small }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none", borderBottom: "1.5px solid #000", padding: "2px 0",
          fontSize: small ? 11 : 12, fontFamily: "inherit", background: "transparent",
          outline: "none", width: "100%",
        }}
      />
    </div>
  );
}

function PlayerRow({ player, onPts, onFoul, onRemove }) {
  return (
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
          <span style={{ ...valS, color: player.fouls >= 5 ? "#c00" : "#000", fontWeight: 700 }}>{player.fouls}</span>
          <Btn onClick={() => onFoul(1)}>+1</Btn>
        </div>
      </td>
      <td style={tdS}>
        <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#c00", fontWeight: 700, fontSize: 13 }}>✕</button>
      </td>
    </tr>
  );
}

function Btn({ children, onClick, red }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${red ? "#c00" : "#000"}`,
        background: hov ? (red ? "#c00" : "#000") : "#fff",
        color: hov ? "#fff" : (red ? "#c00" : "#000"),
        cursor: "pointer", fontSize: 10, fontWeight: 700,
        padding: "2px 6px", borderRadius: 2, lineHeight: 1.5,
        fontFamily: "inherit",
      }}
    >{children}</button>
  );
}

const tdS = { border: "0.5px solid #bbb", padding: "4px 4px", textAlign: "center", fontSize: 11 };
const thS = { background: "#e8e8e8", border: "0.5px solid #999", padding: "5px 4px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", textAlign: "center" };
const btnRow = { display: "flex", gap: 3, alignItems: "center", justifyContent: "center" };
const valS = { minWidth: 22, textAlign: "center", fontSize: 12, fontWeight: 700 };

function sectionHeader(label, sub) {
  return (
    <div style={{ background: "#111", color: "#fff", padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 10, color: "#aaa" }}>{sub}</span>
    </div>
  );
}

function TeamSection({ teamKey, label, team, np, setTeams, setNewPlayer, updatePlayer, removePlayer, addPlayer, updateQ, totalPts, totalFouls, qTotal }) {
  return (
    <div style={{ border: "1.5px solid #000", marginBottom: 8 }}>
      {sectionHeader(team.name, label)}
      <div style={{ padding: "6px 8px", borderBottom: "1px solid #ddd", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <Field label="Team Name" value={team.name}
          onChange={(v) => setTeams((p) => ({ ...p, [teamKey]: { ...p[teamKey], name: v } }))} />
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
            <PlayerRow key={p.id} player={p}
              onPts={(d) => updatePlayer(teamKey, p.id, "points", d)}
              onFoul={(d) => updatePlayer(teamKey, p.id, "fouls", d)}
              onRemove={() => removePlayer(teamKey, p.id)}
            />
          ))}
          <tr style={{ background: "#f9f9f9" }}>
            <td style={tdS}>
              <input type="number" placeholder="#" value={np.jersey_no}
                onChange={(e) => setNewPlayer((prev) => ({ ...prev, [teamKey]: { ...prev[teamKey], jersey_no: e.target.value } }))}
                style={{ width: 32, border: "1px solid #ccc", textAlign: "center", fontSize: 11, padding: 2, fontFamily: "inherit" }} />
            </td>
            <td style={{ ...tdS, textAlign: "left" }}>
              <input type="text" placeholder="Player last name..."
                value={np.name}
                onChange={(e) => setNewPlayer((prev) => ({ ...prev, [teamKey]: { ...prev[teamKey], name: e.target.value } }))}
                onKeyDown={(e) => e.key === "Enter" && addPlayer(teamKey)}
                style={{ width: "100%", border: "1px solid #ccc", fontSize: 11, padding: "2px 4px", fontFamily: "inherit" }} />
            </td>
            <td colSpan={3} style={tdS}>
              <button onClick={() => addPlayer(teamKey)}
                style={{ background: "#111", color: "#fff", border: "none", padding: "3px 14px", fontWeight: 700, fontSize: 11, cursor: "pointer", borderRadius: 2, fontFamily: "inherit" }}>
                + Add Player
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr style={{ background: "#efefef" }}>
            <td colSpan={2} style={{ ...tdS, textAlign: "left", paddingLeft: 8, fontWeight: 700, borderTop: "1.5px solid #000" }}>TOTAL</td>
            <td style={{ ...tdS, fontWeight: 700, borderTop: "1.5px solid #000" }}>{totalPts(teamKey)}</td>
            <td style={{ ...tdS, fontWeight: 700, borderTop: "1.5px solid #000" }}>{totalFouls(teamKey)}</td>
            <td style={{ ...tdS, borderTop: "1.5px solid #000" }}></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ padding: "6px 8px", borderTop: "1px solid #ddd" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#666", marginBottom: 4 }}>Quarter Scores</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Q1", "Q2", "Q3", "Q4", "OT", "Total"].map((h) => (
                <th key={h} style={{ ...thS, width: h === "Total" ? 50 : 40 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {["q1", "q2", "q3", "q4", "ot"].map((q) => (
                <td key={q} style={tdS}>
                  <input type="number" value={team.quarter_scores[q]}
                    onChange={(e) => updateQ(teamKey, q, e.target.value)}
                    style={{ width: 36, textAlign: "center", border: "none", fontWeight: 700, fontSize: 12, fontFamily: "inherit", background: "transparent", outline: "none" }} />
                </td>
              ))}
              <td style={{ ...tdS, fontWeight: 700 }}>{qTotal(teamKey)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Scoresheet() {
  const [meta, setMeta] = useState({
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

  const [teams, setTeams] = useState(initialData.teams);
  const [newPlayer, setNewPlayer] = useState({ team_a: { jersey_no: "", name: "" }, team_b: { jersey_no: "", name: "" } });
  const [jsonOutput, setJsonOutput] = useState(null);

  const totalPts = (team) => teams[team].players.reduce((s, p) => s + p.points, 0);
  const totalFouls = (team) => teams[team].players.reduce((s, p) => s + p.fouls, 0);
  const qTotal = (team) => Object.values(teams[team].quarter_scores).reduce((s, v) => s + v, 0);

  const updatePlayer = (team, id, field, delta) => {
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

  const removePlayer = (team, id) => {
    setTeams((prev) => ({
      ...prev,
      [team]: { ...prev[team], players: prev[team].players.filter((p) => p.id !== id) },
    }));
  };

  const addPlayer = (team) => {
    const np = newPlayer[team];
    if (!np.name.trim()) return;
    const player = { id: nextId++, jersey_no: parseInt(np.jersey_no) || 0, name: np.name.trim(), points: 0, fouls: 0 };
    setTeams((prev) => ({ ...prev, [team]: { ...prev[team], players: [...prev[team].players, player] } }));
    setNewPlayer((prev) => ({ ...prev, [team]: { jersey_no: "", name: "" } }));
  };

  const updateQ = (team, q, val) => {
    setTeams((prev) => ({
      ...prev,
      [team]: { ...prev[team], quarter_scores: { ...prev[team].quarter_scores, [q]: parseInt(val) || 0 } },
    }));
  };

  const getWinner = () => {
    const a = qTotal("team_a"), b = qTotal("team_b");
    if (a === b) return null;
    return a > b ? "team_a" : "team_b";
  };

  const getBpog = () => {
    const winner = getWinner();
    if (!winner) return null;
    const players = teams[winner].players;
    if (!players.length) return null;
    return players.reduce((best, p) => (p.points > best.points ? p : best), players[0]);
  };

  const buildJSON = () => {
    const winner = getWinner();
    const bpog = getBpog();
    const topScorers = (team) => {
      const obj = {};
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
          total_score: qTotal("team_a"),
          quarter_scores: teams.team_a.quarter_scores,
          top_scorers: topScorers("team_a"),
          total_team_fouls: totalFouls("team_a"),
          players: teams.team_a.players,
        },
        team_b: {
          id: teams.team_b.id, name: teams.team_b.name,
          total_score: qTotal("team_b"),
          quarter_scores: teams.team_b.quarter_scores,
          top_scorers: topScorers("team_b"),
          total_team_fouls: totalFouls("team_b"),
          players: teams.team_b.players,
        },
      },
      game_winner: winner ? teams[winner].name : "TIE",
      bpog: bpog
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
    <div style={{ fontFamily: "'Georgia', serif", background: "#f4f4f0", minHeight: "100vh", padding: 16 }}>
      <style>{`@media print { .no-print { display: none !important; } body { background: #fff; } }`}</style>

      <div className="no-print" style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginBottom: 12 }}>
        <button onClick={() => window.print()}
          style={{ padding: "7px 18px", fontWeight: 700, fontSize: 12, border: "2px solid #000", background: "#fff", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "inherit" }}>
          🖨 Print / Save PDF
        </button>
        <button onClick={() => setJsonOutput(JSON.stringify(buildJSON(), null, 2))}
          style={{ padding: "7px 18px", fontWeight: 700, fontSize: 12, border: "2px solid #000", background: "#111", color: "#fff", cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "inherit" }}>
          📋 Record Match
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

        {/* Header */}
        <div style={{ border: "2px solid #000", padding: "10px 14px", marginBottom: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 700, textAlign: "center", textTransform: "uppercase", letterSpacing: 2 }}>
            <input value={meta.league} onChange={(e) => setMeta({ ...meta, league: e.target.value })}
              style={{ border: "none", textAlign: "center", fontWeight: 700, fontSize: 20, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: 2, width: "100%", outline: "none", background: "transparent" }} />
          </div>
          <div style={{ fontSize: 12, textAlign: "center", marginTop: 2 }}>
            <input value={meta.division} onChange={(e) => setMeta({ ...meta, division: e.target.value })}
              style={{ border: "none", textAlign: "center", fontSize: 12, fontFamily: "inherit", width: "100%", outline: "none", background: "transparent" }} />
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

        <TeamSection teamKey="team_a" label="Team A"
          team={teams.team_a} np={newPlayer.team_a}
          setTeams={setTeams} setNewPlayer={setNewPlayer}
          updatePlayer={updatePlayer} removePlayer={removePlayer}
          addPlayer={addPlayer} updateQ={updateQ}
          totalPts={totalPts} totalFouls={totalFouls} qTotal={qTotal}
        />
        <TeamSection teamKey="team_b" label="Team B"
          team={teams.team_b} np={newPlayer.team_b}
          setTeams={setTeams} setNewPlayer={setNewPlayer}
          updatePlayer={updatePlayer} removePlayer={removePlayer}
          addPlayer={addPlayer} updateQ={updateQ}
          totalPts={totalPts} totalFouls={totalFouls} qTotal={qTotal}
        />

        {/* Winner & BPOG */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div style={{ border: "2px solid #000", padding: "8px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#666", letterSpacing: 1 }}>Game Winner</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
              {winner ? teams[winner].name : <span style={{ color: "#888" }}>TIE</span>}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2, letterSpacing: 2 }}>
              {qTotal("team_a")} – {qTotal("team_b")}
            </div>
          </div>
          <div style={{ border: "2px solid #000", padding: "8px 12px" }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#666", letterSpacing: 1 }}>Best Player of the Game (BPOG)</div>
            <div style={{ fontSize: 9, color: "#999", marginTop: 1 }}>Highest scorer from winning team only</div>
            {bpog ? (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>#{bpog.jersey_no} {bpog.name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{teams[winner].name} · {bpog.points} pts</div>
              </div>
            ) : <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>—</div>}
          </div>
        </div>

        {/* Signatures */}
        <div style={{ border: "1.5px solid #000", padding: "8px 12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 4 }}>
            {["Referee", "Scorekeeper", "Timer"].map((role) => (
              <div key={role} style={{ textAlign: "center" }}>
                <div style={{ borderBottom: "1px solid #000", height: 28 }}></div>
                <div style={{ fontSize: 10, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.5, color: "#666" }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JSON Output Modal */}
      {jsonOutput && (
        <div className="no-print" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#111", color: "#e8e8e8", borderRadius: 6, padding: 20, maxWidth: 700, width: "90%", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: "#fff" }}>Match JSON</span>
              <button onClick={() => setJsonOutput(null)}
                style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>
            <pre style={{ overflow: "auto", fontSize: 11, lineHeight: 1.6, flex: 1, fontFamily: "monospace" }}>{jsonOutput}</pre>
            <button onClick={() => { navigator.clipboard.writeText(jsonOutput); }}
              style={{ marginTop: 10, padding: "6px 16px", background: "#fff", color: "#111", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 12, borderRadius: 2, fontFamily: "inherit" }}>
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}