import { create } from 'zustand';
import { apiService, type Team, type Player } from '../services/api';
import bannerImg from '../assets/banner.png';
import { resolveTeamImage } from '../utils/imagenes';
import {
  SportsSoccer, SportsBasketball, SportsVolleyball, SportsHandball,
  SportsTennis, DirectionsRun, FitnessCenter
} from '@mui/icons-material';
import React, { type ReactNode } from 'react';

export interface TeamWithExtras extends Team {
  icon: ReactNode;
  image: string;
}

export interface TeamsStoreState {
  teams: TeamWithExtras[];
  loading: boolean;
  error: string | null;
  selectedTeam: TeamWithExtras | null;
  players: Player[];
  playersLoading: boolean;
  loadTeams: () => Promise<void>;
  selectTeam: (team: TeamWithExtras) => Promise<void>;
  clearSelection: () => void;
}

function getSportIcon(sport?: string) {
  const iconProps = { sx: { fontSize: 40 } } as const;
  const key = (sport || '').toLowerCase();
  switch (key) {
    case 'fútbol': return React.createElement(SportsSoccer, iconProps);
    case 'básquetbol': return React.createElement(SportsBasketball, iconProps);
    case 'vóleibol': return React.createElement(SportsVolleyball, iconProps);
    case 'handball': return React.createElement(SportsHandball, iconProps);
    case 'tenis': return React.createElement(SportsTennis, iconProps);
    case 'atletismo': return React.createElement(DirectionsRun, iconProps);
    default: return React.createElement(FitnessCenter, iconProps);
  }
}

export const useTeamsStore = create<TeamsStoreState>((set) => ({
  teams: [],
  loading: false,
  error: null,
  selectedTeam: null,
  players: [],
  playersLoading: false,
  loadTeams: async () => {
    try {
      set({ loading: true, error: null });
      const teamsData = await apiService.getTeams();
      const teamsWithExtras: TeamWithExtras[] = teamsData.map(t => ({
        ...t,
        icon: getSportIcon(t.sport),
        image: resolveTeamImage(t.image) || bannerImg
      }));
      set({ teams: teamsWithExtras });
    } catch (err) {
      console.error('Error cargando equipos desde API:', err);
      set({ error: 'Error al cargar los equipos desde el servidor' });
      // Fallback mocks
      const mockTeams: TeamWithExtras[] = [
        {
          id: 1,
          sport: 'Fútbol',
          name: 'Anakena FC Masculino',
          category: 'Masculino',
          description: 'El equipo más tradicional del club, con participación en el torneo interfacultades desde 1999.',
          founded: '1999',
          captain: 'Carlos Rodríguez',
          playersCount: 22,
          achievements: [
            'Campeón Torneo Interfacultades 2022',
            'Subcampeón Copa Universidad 2023',
            'Mejor defensa temporada 2023'
          ],
          nextMatch: {
            id: 1,
            date: '2024-09-25',
            opponent: 'Ingeniería FC',
            location: 'Cancha Sur Campus',
            time: '15:30'
          },
          image: bannerImg,
          icon: getSportIcon('Fútbol')
        },
        {
          id: 2,
          sport: 'Básquetbol',
          name: 'Anakena Basquet Femenino',
          category: 'Femenino',
          description: 'Equipo de básquetbol femenino con gran proyección y talento joven.',
          founded: '2005',
          captain: 'María González',
          playersCount: 12,
          achievements: [
            'Tercer lugar Liga Universitaria 2023',
            'Mejor anotadora individual 2022',
            'Equipo revelación 2021'
          ],
          nextMatch: {
            id: 2,
            date: '2024-09-28',
            opponent: 'Medicina Panthers',
            location: 'Gimnasio Central',
            time: '18:00'
          },
          image: bannerImg,
          icon: getSportIcon('Básquetbol')
        },
        {
          id: 3,
          sport: 'Vóleibol',
          name: 'Anakena Volley Mixto',
          category: 'Mixto',
          description: 'Equipo mixto de vóleibol que representa la diversidad y el compañerismo del club.',
          founded: '2010',
          captain: 'Andrea Silva',
          playersCount: 16,
          achievements: [
            'Campeón Torneo Mixto 2023',
            'Mejor equipo en fair play 2022',
            'Finalista Copa de Verano 2024'
          ],
          nextMatch: {
            id: 3,
            date: '2024-09-30',
            opponent: 'Psicología Spikers',
            location: 'Cancha Techada',
            time: '19:30'
          },
          image: bannerImg,
          icon: getSportIcon('Vóleibol')
        }
      ];
      set({ teams: mockTeams });
    } finally {
      set({ loading: false });
    }
  },
  selectTeam: async (team: TeamWithExtras) => {
    set({ selectedTeam: team, playersLoading: true, players: [] });
    try {
      const playersData = await apiService.getPlayersByTeam(team.id);
      set({ players: playersData });
    } catch (err) {
      console.error('Error loading players:', err);
      const mockPlayers: Player[] = [
        { id: 1, name: 'Juan Pérez', teamId: team.id, position: 'Delantero', number: 9, age: 21, carrera: 'Ciencias de la Computación', isCaptain: false },
        { id: 2, name: 'Mario Silva', teamId: team.id, position: 'Mediocampista', number: 10, age: 22, carrera: 'Ingeniería Civil en Computación', isCaptain: false },
        { id: 3, name: 'Carlos López', teamId: team.id, position: 'Defensor', number: 4, age: 23, carrera: 'Ciencias de la Computación', isCaptain: false },
        { id: 4, name: 'Luis González', teamId: team.id, position: 'Arquero', number: 1, age: 24, carrera: 'Magíster en Ciencias', isCaptain: false },
        { id: 5, name: team.captain, teamId: team.id, position: 'Capitán', number: 5, age: 22, carrera: 'Ingeniería Civil en Computación', isCaptain: true },
      ];
      set({ players: mockPlayers });
    } finally {
      set({ playersLoading: false });
    }
  },
  clearSelection: () => set({ selectedTeam: null, players: [] })
}));
