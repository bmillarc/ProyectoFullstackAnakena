const API_BASE_URL = 'http://localhost:3001';

export interface Team {
  id: number;
  sport: string;
  name: string;
  category: 'Masculino' | 'Femenino' | 'Mixto';
  description: string;
  founded: string;
  captain: string;
  playersCount: number;
  achievements: string[];
  nextMatch?: {
    id: number;
    date: string;
    opponent: string;
    location: string;
    time: string;
  };
  image: string;
}

export interface Player {
  id: number;
  name: string;
  teamId: number;
  position: string;
  number?: number;
  age: number;
  carrera: string;
  isCaptain: boolean;
}

export interface Match {
  id: number;
  teamId: number;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: 'local' | 'visitante';
  status: 'scheduled' | 'finished' | 'cancelled';
  result?: {
    anakena: number;
    opponent: number;
  };
  tournament: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  teamId?: number;
  featured: boolean;
}

export interface Tournament {
  id: number;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  teams: number;
  status: 'active' | 'finished' | 'upcoming';
}

class ApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // Equipos
  async getTeams(): Promise<Team[]> {
    return this.fetchApi<Team[]>('/teams');
  }

  async getTeam(id: number): Promise<Team> {
    return this.fetchApi<Team>(`/teams/${id}`);
  }

  async getTeamsBySport(sport: string): Promise<Team[]> {
    return this.fetchApi<Team[]>(`/teams?sport=${sport}`);
  }

  // Jugadores
  async getPlayers(): Promise<Player[]> {
    return this.fetchApi<Player[]>('/players');
  }

  async getPlayersByTeam(teamId: number): Promise<Player[]> {
    return this.fetchApi<Player[]>(`/players?teamId=${teamId}`);
  }

  async getPlayer(id: number): Promise<Player> {
    return this.fetchApi<Player>(`/players/${id}`);
  }

  // Partidos
  async getMatches(): Promise<Match[]> {
    return this.fetchApi<Match[]>('/matches');
  }

  async getMatchesByTeam(teamId: number): Promise<Match[]> {
    return this.fetchApi<Match[]>(`/matches?teamId=${teamId}`);
  }

  async getUpcomingMatches(): Promise<Match[]> {
    return this.fetchApi<Match[]>('/matches?status=scheduled');
  }

  async getFinishedMatches(): Promise<Match[]> {
    return this.fetchApi<Match[]>('/matches?status=finished');
  }

  // Noticias
  async getNews(): Promise<NewsItem[]> {
    return this.fetchApi<NewsItem[]>('/news');
  }

  async getFeaturedNews(): Promise<NewsItem[]> {
    return this.fetchApi<NewsItem[]>('/news?featured=true');
  }

  async getNewsByCategory(category: string): Promise<NewsItem[]> {
    return this.fetchApi<NewsItem[]>(`/news?category=${category}`);
  }

  async getNewsItem(id: number): Promise<NewsItem> {
    return this.fetchApi<NewsItem>(`/news/${id}`);
  }

  // Torneos
  async getTournaments(): Promise<Tournament[]> {
    return this.fetchApi<Tournament[]>('/tournaments');
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    return this.fetchApi<Tournament[]>('/tournaments?status=active');
  }
}

export const apiService = new ApiService();
export default apiService;