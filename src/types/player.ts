export interface CreatePlayerDTO {
  name: string;
  userId: string;
  teamId?: string;
  position?: string;
  number?: number;
  avatarUrl?: string;
}

export interface UpdatePlayerDTO {
  name?: string;
  teamId?: string;
  position?: string;
  number?: number;
  avatarUrl?: string;
}

export interface PlayerStats {
  totalGames: number;
  totalGoals: number;
  averageGoalsPerGame: number;
  mvpCount: number;
  rating: number;
}

export interface Player {
  id: string;
  userId: string;
  teamId?: string;
  name: string;
  position?: string;
  number?: number;
  avatarUrl?: string;
  totalGoals: number;
  totalGames: number;
  rating: number;
  stats?: PlayerStats;
  createdAt: string;
  updatedAt: string;
} 