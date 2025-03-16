export interface CreateTeamDTO {
  name: string;
  description?: string;
}

export interface UpdateTeamDTO {
  name?: string;
  description?: string;
}

export interface TeamStats {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  totalGoals: number;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  players?: {
    id: string;
    name: string;
    position?: string;
    number?: number;
  }[];
  stats?: TeamStats;
  createdAt: string;
  updatedAt: string;
} 