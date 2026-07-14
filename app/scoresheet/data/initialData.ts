export const initialData = {
  league: "",
  division: "",
  game_no: "",
  venue: "",
  game_date: "",
  game_time: "",
  officials: {
    referee: "",
    umpire_1: "",
    umpire_2: "",
  },
  teams: {
    team_a: {
      id: null,
      name: "",
      players: [],
      fouls_per_quarter: [0, 0, 0, 0],
    },
    team_b: {
      id: null,
      name: "",
      players: [],
      fouls_per_quarter: [0, 0, 0, 0],
    },
  },
} as const;