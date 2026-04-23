export type Team = { id: number; name: string; players?: Player[] };

export type Player = {
  id: number;
  name: string;
  team_id: number;
  position: string | null;
  jersey_number: string | null;
  team?: Team;
};

export type Match = {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  played_at: string;
  home_team?: Team;
  away_team?: Team;
};

export type GameStat = {
  id: number;
  player_id: number;
  match_id: number;
  points: number;
  assists: number;
  rebounds: number;
  player?: Player;
};

export type LeaderboardEntry = {
  player_id: number;
  total_points: number;
  total_assists: number;
  total_rebounds: number;
  games_played: number;
  ppg: number;
  player?: Player;
};
