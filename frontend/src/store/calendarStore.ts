import { create } from 'zustand';
import type { Event } from '../types/calendar';

interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  expandedEventId: number | null;
  events: Event[];
  setMonthOffset: (offset: number) => void;
  selectDate: (date: Date) => void;
  toggleExpandEvent: (eventId: number) => void;
  setEvents: (events: Event[]) => void;
  getEventsForDate: (date: Date) => Event[];
  isSameDay: (a: Date, b: Date) => boolean;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentDate: new Date(),
  selectedDate: new Date(),
  expandedEventId: null,
  events: [],
  setMonthOffset: (offset) => {
    const { currentDate } = get();
    set({ currentDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1) });
  },
  selectDate: (date) => set({ selectedDate: date }),
  toggleExpandEvent: (eventId) => {
    const { expandedEventId } = get();
    set({ expandedEventId: expandedEventId === eventId ? null : eventId });
  },
  setEvents: (events) => set({ events }),
  isSameDay: (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear(),
  getEventsForDate: (date) => get().events.filter(e => get().isSameDay(e.start, date))
}));

// Inicialización con mocks (podría reemplazarse por carga API)
const mockEvents: Event[] = [
  {
    id: 1,
    start: new Date(2025, 9, 20, 15, 0),
    end: new Date(2025, 9, 20, 17, 0),
    title: 'Partido de Fútbol ALumnos vs Profesores',
    category: 'Partido',
    location: 'Cancha 850',
    description: 'Partido amistoso entre alumnos y profesores de la DCC. ¡Ven a apoyar a tu equipo favorito!'
  },
  {
    id: 2,
    start: new Date(2025, 9, 20, 18, 30),
    end: new Date(2025, 9, 20, 20, 0),
    title: 'Entrenamiento Básquetbol Femenino',
    category: 'Entrenamiento',
    location: 'Cancha 851, -3er piso',
    description: 'Entrenamiento táctico enfocado en defensa y contraataque. Todas las jugadoras deben asistir.'
  },
  {
    id: 3,
    start: new Date(2025, 9, 22, 16, 0),
    end: new Date(2025, 9, 22, 18, 0),
    title: 'Torneo Interuniversitario Vóleibol',
    category: 'Torneo',
    location: 'Casa central Universidad de Chile',
    description: 'Primera fase del torneo interuniversitario. Enfrentaremos a los equipos de Medicina y Derecho.'
  },
  {
    id: 4,
    start: new Date(2025, 9, 25, 14, 0),
    end: new Date(2025, 9, 25, 16, 0),
    title: 'Práctica de Tenis de mesa',
    category: 'Practica',
    location: 'Gimnasio casino',
    description: 'Sesión de práctica abierta. Todos los niveles son bienvenidos.'
  },
  {
    id: 5,
    start: new Date(2025, 9, 25, 17, 0),
    end: new Date(2025, 9, 25, 19, 0),
    title: 'Bingo benefico Anakena DCC',
    category: 'Evento Social',
    location: 'Araña 851',
    description: 'Evento social para recaudar fondos para el club. Habrá premios y sorpresas para los asistentes. Carton a 2000 CLP.'
  }
];

useCalendarStore.setState({ events: mockEvents });
