export const initialData = {
  league: "Tolits Basketball League",
  division: "Senior Division",
  game_no: "12",
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
      name: "Sharks",
      players: [
        { id: 101, jersey_no: 7, name: "John Cruz", points: 24, fouls: 2 },
        { id: 102, jersey_no: 11, name: "Mark Lopez", points: 18, fouls: 1 },
        { id: 103, jersey_no: 9, name: "Kyle Santos", points: 12, fouls: 0 },
        { id: 104, jersey_no: 4, name: "Evan Reyes", points: 8, fouls: 3 },
        { id: 105, jersey_no: 15, name: "Miguel Dizon", points: 16, fouls: 2 },
      ],
      fouls_per_quarter: [2, 5, 3, 4],
    },

    team_b: {
      id: 2,
      name: "Dragons",
      players: [
        { id: 201, jersey_no: 10, name: "Alex Reyes", points: 30, fouls: 3 },
        { id: 202, jersey_no: 6, name: "Miguel Torres", points: 16, fouls: 2 },
        { id: 203, jersey_no: 14, name: "Danilo Cruz", points: 10, fouls: 1 },
        { id: 204, jersey_no: 8, name: "Paul Mendoza", points: 7, fouls: 2 },
        { id: 205, jersey_no: 12, name: "Jomar Villanueva", points: 9, fouls: 1 },
      ],
      fouls_per_quarter: [3, 2, 5, 4],
    },
  },
};