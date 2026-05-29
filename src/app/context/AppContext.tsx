import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for Aturin Tournament Management
export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  accessCode: string;
}

export interface Team {
  id: string;
  name: string;
  athlete1: string;
  athlete2?: string;
  matches: number;
  wins: number;
  losses: number;
  points: number;
}

export interface Match {
  id: string;
  code: string;
  team1Id: string;
  team2Id: string;
  date: string;
  time: string;
  status: "Belum Dimulai" | "Berlangsung" | "Selesai";
  scoreTeam1?: number;
  scoreTeam2?: number;
  violations?: Violation[];
  currentSet?: number;
}

export interface Violation {
  id: string;
  teamId: string;
  type: string;
  timestamp: string;
}

interface AppContextType {
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  addTournament: (tournament: Omit<Tournament, "id" | "createdAt" | "accessCode">) => Tournament;
  addTeam: (team: Omit<Team, "id" | "matches" | "wins" | "losses" | "points">) => void;
  addMatch: (match: Omit<Match, "id" | "code">) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  finishMatch: (id: string, scoreTeam1: number, scoreTeam2: number, violations: Violation[]) => void;
  getTeamById: (id: string) => Team | undefined;
  getMatchById: (id: string) => Match | undefined;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Load initial data from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save to localStorage
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    loadFromStorage("aturin_tournaments", [])
  );
  const [teams, setTeams] = useState<Team[]>(() =>
    loadFromStorage("aturin_teams", [])
  );
  const [matches, setMatches] = useState<Match[]>(() =>
    loadFromStorage("aturin_matches", [])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage("aturin_tournaments", tournaments);
  }, [tournaments]);

  useEffect(() => {
    saveToStorage("aturin_teams", teams);
  }, [teams]);

  useEffect(() => {
    saveToStorage("aturin_matches", matches);
  }, [matches]);

  // Generate unique access code
  const generateAccessCode = (): string => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const addTournament = (tournament: Omit<Tournament, "id" | "createdAt" | "accessCode">): Tournament => {
    const newTournament: Tournament = {
      ...tournament,
      id: `TURN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      accessCode: generateAccessCode(),
    };
    setTournaments((prev) => [...prev, newTournament]);
    return newTournament;
  };

  const addTeam = (team: Omit<Team, "id" | "matches" | "wins" | "losses" | "points">) => {
    const newTeam: Team = {
      ...team,
      id: `TEAM-${Date.now()}`,
      matches: 0,
      wins: 0,
      losses: 0,
      points: 0,
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const addMatch = (match: Omit<Match, "id" | "code">) => {
    const matchCount = matches.length + 1;
    const newMatch: Match = {
      ...match,
      id: `MATCH-${Date.now()}`,
      code: `MTH-${matchCount.toString().padStart(3, "0")}`,
    };
    setMatches((prev) => [...prev, newMatch]);
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    setMatches((prev) =>
      prev.map((match) => (match.id === id ? { ...match, ...updates } : match))
    );
  };

  const finishMatch = (
    id: string,
    scoreTeam1: number,
    scoreTeam2: number,
    violations: Violation[]
  ) => {
    const match = matches.find((m) => m.id === id);
    if (!match) return;

    // Update match status
    updateMatch(id, {
      status: "Selesai",
      scoreTeam1,
      scoreTeam2,
      violations,
    });

    // Update team stats
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === match.team1Id) {
          const won = scoreTeam1 > scoreTeam2;
          return {
            ...team,
            matches: team.matches + 1,
            wins: won ? team.wins + 1 : team.wins,
            losses: !won ? team.losses + 1 : team.losses,
            points: won ? team.points + 3 : team.points,
          };
        }
        if (team.id === match.team2Id) {
          const won = scoreTeam2 > scoreTeam1;
          return {
            ...team,
            matches: team.matches + 1,
            wins: won ? team.wins + 1 : team.wins,
            losses: !won ? team.losses + 1 : team.losses,
            points: won ? team.points + 3 : team.points,
          };
        }
        return team;
      })
    );
  };

  const getTeamById = (id: string): Team | undefined => {
    return teams.find((team) => team.id === id);
  };

  const getMatchById = (id: string): Match | undefined => {
    return matches.find((match) => match.id === id);
  };

  const clearAllData = () => {
    setTournaments([]);
    setTeams([]);
    setMatches([]);
    localStorage.removeItem("aturin_tournaments");
    localStorage.removeItem("aturin_teams");
    localStorage.removeItem("aturin_matches");
  };

  const value: AppContextType = {
    tournaments,
    teams,
    matches,
    addTournament,
    addTeam,
    addMatch,
    updateMatch,
    finishMatch,
    getTeamById,
    getMatchById,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
