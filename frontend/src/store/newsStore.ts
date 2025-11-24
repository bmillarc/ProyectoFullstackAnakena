import { create } from 'zustand';
import apiService, { type NewsItem } from '../services/api';
import bannerImg from '../assets/banner.png';
import { resolveNewsImage } from '../utils/imagenes';

export interface NewsStoreState {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  loadNews: () => Promise<void>;
}

export const useNewsStore = create<NewsStoreState>((set) => ({
  news: [],
  loading: false,
  error: null,
  loadNews: async () => {
    try {
      set({ loading: true, error: null });
      const newsData = await apiService.getNews();
      const withImages = newsData.map(n => ({
        ...n,
        image: resolveNewsImage(n.image) || bannerImg
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ news: withImages });
    } catch (err) {
      console.error('Error cargando noticias desde API:', err);
      set({ error: 'Error al cargar las noticias desde el servidor' });
      const mockNews: NewsItem[] = [
        {
          id: 1,
          title: 'Victoria histórica en el torneo de fútbol',
          summary: 'El equipo de fútbol masculino de Anakena logró una victoria decisiva 3-1 contra el equipo de Ingeniería.',
          content: 'En un partido emocionante disputado en la Cancha Sur del Campus, el equipo de fútbol masculino de Anakena DCC demostró su calidad y determinación al vencer 3-1 al equipo de Ingeniería. Los goles fueron anotados por Carlos Rodríguez (2) y Mario Silva (1), consolidando la posición del equipo en el torneo interfacultades.',
          date: '2024-11-20',
          author: 'Comunicaciones Anakena',
          category: 'Fútbol',
          image: bannerImg,
          teamId: 1,
          featured: true,
        },
        {
          id: 2,
          title: 'Nuevas incorporaciones en básquetbol femenino',
          summary: 'Se suman 4 nuevas jugadoras al plantel de básquetbol femenino para la temporada 2024.',
          content: 'El equipo de básquetbol femenino de Anakena DCC se refuerza con cuatro nuevas jugadoras de gran calidad. Las incorporaciones traen experiencia de torneos universitarios previos y están listas para aportar al equipo en la próxima temporada.',
          date: '2024-11-18',
          author: 'Staff Técnico',
          category: 'Básquetbol',
          image: bannerImg,
          teamId: 2,
          featured: false,
        },
        {
          id: 3,
          title: 'Torneo interuniversitario de vólibol',
          summary: 'Anakena participa en el torneo interuniversitario con grandes expectativas.',
          content: 'El equipo mixto de vólibol de Anakena DCC se prepara para enfrentar a los mejores equipos universitarios del país en el torneo interuniversitario que se realizará durante el próximo mes.',
          date: '2024-11-15',
          author: 'Prensa Anakena',
          category: 'Vólibol',
          image: bannerImg,
          teamId: 3,
          featured: true,
        }
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      set({ news: mockNews });
    } finally {
      set({ loading: false });
    }
  }
}));
