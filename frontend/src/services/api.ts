const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api');

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

export interface Event {
  id: number;
  start: string;
  end: string;
  title: string;
  category: string;
  location: string;
  description: string;
}

// Helper function to get CSRF token from localStorage
function getCsrfToken(): string | null {
  return localStorage.getItem('csrfToken');
}

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const csrfToken = getCsrfToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> || {}),
      };

      // Add CSRF token for protected endpoints
      if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
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

  async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
    return this.fetchApi<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: number, team: Partial<Team>): Promise<Team> {
    return this.fetchApi<Team>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  }

  async deleteTeam(id: number): Promise<void> {
    return this.fetchApi<void>(`/teams/${id}`, {
      method: 'DELETE',
    });
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

  async createPlayer(player: Omit<Player, 'id'>): Promise<Player> {
    return this.fetchApi<Player>('/players', {
      method: 'POST',
      body: JSON.stringify(player),
    });
  }

  async updatePlayer(id: number, player: Partial<Player>): Promise<Player> {
    return this.fetchApi<Player>(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(player),
    });
  }

  async deletePlayer(id: number): Promise<void> {
    return this.fetchApi<void>(`/players/${id}`, {
      method: 'DELETE',
    });
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

  // Eventos
  async getEvents(): Promise<Event[]> {
    return this.fetchApi<Event[]>('/events');
  }

  async getEvent(id: number): Promise<Event> {
    return this.fetchApi<Event>(`/events/${id}`);
  }

  async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
    return this.fetchApi<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    return this.fetchApi<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  async deleteEvent(id: number): Promise<void> {
    return this.fetchApi<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;