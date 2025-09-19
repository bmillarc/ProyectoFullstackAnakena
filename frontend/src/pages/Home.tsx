import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Container } from '@mui/material';
import { CalendarToday, EmojiEvents, Groups, Timeline } from '@mui/icons-material';
import Slider from '../components/Slider';
import type { SliderData } from '../types/slider';
import bannerImg from '../assets/banner.png';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: string;
}

interface Stat {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
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
      value: '25+',
      description: 'Años de tradición'
    }
  ]);

  // Simular carga de noticias desde API (mock)
  useEffect(() => {
    // Simulamos un delay de carga
    const timer = setTimeout(() => {
      setNews([
        {
          id: 1,
          title: 'Victoria histórica en el torneo de fútbol',
          summary: 'El equipo de fútbol masculino de Anakena logró una victoria decisiva 3-1 contra el equipo de Ingeniería.',
          date: '2024-09-15',
          image: bannerImg,
          category: 'Fútbol'
        },
        {
          id: 2,
          title: 'Nuevas incorporaciones en básquetbol femenino',
          summary: 'Se suman 4 nuevas jugadoras al plantel de básquetbol femenino para la temporada 2024.',
          date: '2024-09-12',
          image: bannerImg,
          category: 'Básquetbol'
        },
        {
          id: 3,
          title: 'Torneo interuniversitario de vóleibol',
          summary: 'Anakena participa en el torneo interuniversitario con grandes expectativas.',
          date: '2024-09-10',
          image: bannerImg,
          category: 'Vóleibol'
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const slides: SliderData[] = [
    {
      id: 'slide1',
      title: 'Bienvenido a Anakena DCC',
      subtitle: 'El corazón deportivo del Departamento de Ciencias de la Computación',
      image: bannerImg, 
    },
    {
      id: 'slide2',
      title: 'Tradición y Excelencia',
      subtitle: 'Más de 25 años formando deportistas y construyendo comunidad',
      image: bannerImg, 
    },
    {
      id: 'slide3',
      title: 'Únete a Nosotros',
      subtitle: '8 disciplinas esperan por ti. ¡Sé parte de la familia Anakena!',
      image: bannerImg, 
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
          
          {news.length === 0 ? (
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
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Button variant="outlined" size="large">
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
          Únete a nuestra comunidad deportiva y forma parte de la tradición más importante del DCC.
          ¡Te esperamos en los entrenamientos!
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" size="large">
            Ver Equipos
          </Button>
          <Button variant="outlined" size="large">
            Calendario
          </Button>
        </Box>
      </Container>
    </Box>
  );
}