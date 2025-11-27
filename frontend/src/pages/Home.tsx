import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardMedia, Button, Container } from '@mui/material';
import { CalendarToday, EmojiEvents, Groups, Timeline } from '@mui/icons-material';
import Slider from '../components/Slider';
import type { SliderData } from '../types/slider';
import bannerImg from '../assets/banner.png';
import apiService, { type NewsItem } from '../services/api';
import { resolveNewsImage } from '../utils/imagenes';

import imagen2 from '../assets/banner2.jpg';
import imagen3 from '../assets/banner3.jpg';


interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [stats] = useState<Stat[]>([
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      label: 'Deportes',
      value: '8',
      description: 'Disciplinas activas'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      label: 'Torneos',
      value: '12',
      description: 'Participaciones este año'
    },
    {
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      label: 'Próximos',
      value: '5',
      description: 'Partidos esta semana'
    },
    {
      icon: <Timeline sx={{ fontSize: 40 }} />,
      label: 'Historia',
      value: '3+',
      description: 'Años de tradición'
    }
  ]);

  // Función de navegacion
  const handleNavigation = (page: string) => {
    navigate(`/${page}`);
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Se intenta cargar noticias desde la API
        const newsData = await apiService.getNews();

        // Si la API manda "/assets/news/blabla.jpg" o "blabla.jpg", se traduce a la URL real
        const newsWithImg = newsData.slice(0, 3).map(n => ({
          ...n,
          image: resolveNewsImage(n.image) || bannerImg, // fallback
        }));
        setNews(newsWithImg);

      } catch (err) {
        console.error('Error loading news from API:', err);
        setError('Error al cargar las noticias desde el servidor');
        
        // Fallback a datos mock si falla la API
        const mockNews: NewsItem[] = [
          {
            id: 1,
            title: 'Victoria histórica en el torneo de fútbol',
            summary: 'El equipo de fútbol masculino de Anakena logró una victoria decisiva 3-1 contra el equipo de Ingeniería.',
            content: 'Contenido completo...',
            date: '2024-09-18',
            author: 'Comunicaciones Anakena',
            category: 'Fútbol',
            image: bannerImg,
            teamId: 1,
            featured: true
          },
          {
            id: 2,
            title: 'Nuevas incorporaciones en básquetbol femenino',
            summary: 'Se suman 4 nuevas jugadoras al plantel de básquetbol femenino para la temporada 2024.',
            content: 'Contenido completo...',
            date: '2024-09-15',
            author: 'Staff Técnico',
            category: 'Básquetbol',
            image: bannerImg,
            teamId: 2,
            featured: false
          },
          {
            id: 3,
            title: 'Torneo interuniversitario de vóleibol',
            summary: 'Anakena participa en el torneo interuniversitario con grandes expectativas.',
            content: 'Contenido completo...',
            date: '2024-09-12',
            author: 'Prensa Anakena',
            category: 'Vóleibol',
            image: bannerImg,
            teamId: 3,
            featured: true
          }
        ];
        setNews(mockNews);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const slides: SliderData[] = [
    {
      id: 'slide1',
      title: 'Bienvenido a Anakena DCC',
      subtitle: 'El corazón deportivo del Departamento de Ciencias de la Computación de la Universidad de Chile',
      image: bannerImg, 
    },
    {
      id: 'slide2',
      title: 'Tradición y Excelencia',
      subtitle: 'Más de 3 años formando deportistas y construyendo comunidad',
      image: imagen2, 
    },
    {
      id: 'slide3',
      title: 'Únete a Nosotros',
      subtitle: 'Conoce nuestras 8 disciplinas y sé parte de la familia Anakena',
      image: imagen3, 
    },
  ];

  return (
    <Box>
      {/* Hero Slider */}
      <Slider slides={slides} autoPlay={true} autoPlayInterval={5000} />
      
      {/* Stats Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Anakena en Números
        </Typography>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 4,
            mt: 2
          }}
        >
          {stats.map((stat, index) => (
            <Card 
              key={index}
              sx={{ 
                textAlign: 'center', 
                p: 3,
                height: '100%',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <Box sx={{ color: 'primary.main', mb: 2 }}>
                {stat.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stat.value}
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                {stat.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.description}
              </Typography>
            </Card>
          ))}
        </Box>
      </Container>

      {/* News Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Últimas Noticias
          </Typography>
          
          {error && (
            <Typography color="warning.main" textAlign="center" sx={{ mt: 2, mb: 2 }}>
              {error} (Mostrando datos de ejemplo)
            </Typography>
          )}
          
          {loading ? (
            <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
              Cargando noticias...
            </Typography>
          ) : (
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, 1fr)'
                },
                gap: 4,
                mt: 2
              }}
            >
              {news.map((item) => (
                <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="overline" 
                      component="div" 
                      color="primary.main"
                      fontWeight="bold"
                    >
                      {item.category}
                    </Typography>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.date).toLocaleDateString('es-CL')}
                      {item.author && ` - ${item.author}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => handleNavigation('noticias')}
            >
              Ver Todas las Noticias
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          ¿Listo para Ser Parte de Anakena?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
          Únete a nuestra comunidad deportiva y sé parte de una de las tradiciones más queridas del DCC.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          ¡Te esperamos en los entrenamientos!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => handleNavigation('equipos')}
          >
            Ver Equipos
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => handleNavigation('calendario')}
          >
            Calendario
          </Button>
        </Box>
      </Container>
    </Box>
  );
}