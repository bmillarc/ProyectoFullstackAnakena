import { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  EmojiEvents,
  Groups,
  CalendarToday,
  SportsScore,
  School,
  Celebration
} from '@mui/icons-material';
import bannerImg from '../assets/banner.png';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  category: 'fundacion' | 'logro' | 'expansion' | 'evento' | 'hito';
  image?: string;
  highlights?: string[];
}

const timelineData: TimelineEvent[] = [
  {
    id: 1,
    year: '2021',
    title: 'Fundación del Club Anakena DCC',
    description: 'Un grupo de estudiantes apasionados por el deporte decide crear el club deportivo Anakena, con la misión de fomentar la actividad física y el espíritu de equipo en el Departamento de Ciencias de la Computación.',
    category: 'fundacion',
    image: bannerImg,
    highlights: [
      'Primer equipo de fútbol masculino',
      '15 miembros fundadores',
      'Primera participación en torneo interfacultades'
    ]
  },
  {
    id: 2,
    year: '2021',
    title: 'Primera Victoria Oficial',
    description: 'El equipo de fútbol masculino obtiene su primera victoria en el torneo interfacultades, venciendo 2-0 al equipo de Ingeniería Eléctrica. Este triunfo marca el inicio de una tradición ganadora.',
    category: 'logro',
    highlights: [
      'Primer partido oficial ganado',
      'Mejor defensa del torneo',
      'Reconocimiento del DCC'
    ]
  },
  {
    id: 3,
    year: '2022',
    title: 'Expansión a Nuevas Disciplinas',
    description: 'Anakena expande su alcance incorporando equipos de básquetbol femenino y vólibol mixto. La membresía del club crece a más de 50 deportistas activos.',
    category: 'expansion',
    image: bannerImg,
    highlights: [
      'Básquetbol femenino',
      'Vólibol mixto',
      '50+ miembros activos',
      'Primera mesa directiva elegida'
    ]
  },
  {
    id: 4,
    year: '2022',
    title: 'Campeonato de Básquetbol',
    description: 'El equipo femenino de básquetbol obtiene el segundo lugar en el torneo interuniversitario, destacando como una de las revelaciones del año.',
    category: 'logro',
    highlights: [
      'Subcampeonas universitarias',
      'MVP del torneo: María González',
      'Mejor ofensiva de la competencia'
    ]
  },
  {
    id: 5,
    year: '2023',
    title: 'Aniversario y Nuevas Disciplinas',
    description: 'Anakena celebra su segundo aniversario con más de 80 miembros. Se incorporan equipos de handball, tenis y atletismo, consolidando al club como uno de los más diversos del campus.',
    category: 'hito',
    image: bannerImg,
    highlights: [
      '80+ miembros activos',
      'Handball masculino',
      'Tenis mixto',
      'Atletismo',
      'Evento aniversario con 200+ asistentes'
    ]
  },
  {
    id: 6,
    year: '2023',
    title: 'Tricampeonato de Fútbol',
    description: 'El equipo de fútbol masculino logra su tercer campeonato consecutivo en el torneo interfacultades, estableciendo un récord histórico para el DCC.',
    category: 'logro',
    highlights: [
      '3 campeonatos consecutivos',
      'Récord de goles en una temporada',
      'Carlos Rodríguez: Máximo goleador histórico'
    ]
  },
  {
    id: 7,
    year: '2024',
    title: 'Reconocimiento Institucional',
    description: 'La Universidad de Chile reconoce oficialmente a Anakena DCC como uno de los clubes deportivos más destacados, otorgando financiamiento adicional y acceso prioritario a instalaciones.',
    category: 'hito',
    image: bannerImg,
    highlights: [
      'Reconocimiento oficial U. de Chile',
      'Financiamiento aumentado en 150%',
      'Acceso prioritario a instalaciones',
      'Convenio con DIGEDER'
    ]
  },
  {
    id: 8,
    year: '2024',
    title: 'Participación Internacional',
    description: 'Anakena representa a la Universidad de Chile en el torneo universitario sudamericano de vólibol en Buenos Aires, Argentina, obteniendo el cuarto lugar.',
    category: 'evento',
    highlights: [
      'Primera participación internacional',
      '4to lugar Sudamericano',
      'Mejor servicio del torneo',
      'Intercambio cultural con 8 países'
    ]
  },
  {
    id: 9,
    year: '2024',
    title: 'Actualidad: 100+ Miembros Activos',
    description: 'Anakena alcanza la cifra histórica de 100 miembros activos, consolidándose como el club deportivo más grande del DCC. Se planifica la incorporación de nuevas disciplinas para 2025.',
    category: 'hito',
    image: bannerImg,
    highlights: [
      '100+ deportistas activos',
      '8 disciplinas deportivas',
      '15+ torneos participados en 2024',
      'Proyectos para 2025: Futsal y Natación'
    ]
  }
];

const categoryConfig = {
  fundacion: {
    color: '#2f8549',
    icon: <Groups />,
    label: 'Fundación'
  },
  logro: {
    color: '#F6C500',
    icon: <EmojiEvents />,
    label: 'Logro Deportivo'
  },
  expansion: {
    color: '#1976d2',
    icon: <SportsScore />,
    label: 'Expansión'
  },
  evento: {
    color: '#9c27b0',
    icon: <Celebration />,
    label: 'Evento Especial'
  },
  hito: {
    color: '#d32f2f',
    icon: <School />,
    label: 'Hito Histórico'
  }
};

export default function History() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const years = Array.from(new Set(timelineData.map(e => e.year))).sort();

  const filteredEvents = selectedYear
    ? timelineData.filter(e => e.year === selectedYear)
    : timelineData;

  const getYearEvents = (year: string) => 
    timelineData.filter(e => e.year === year);

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: 'primary.light',
          color: 'white',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Historia de Anakena DCC
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto' }}>
            Un recorrido por los momentos más importantes de nuestro club deportivo
          </Typography>
        </Container>
      </Box>

      {/* Year Filter */}
      <Box sx={{ bgcolor: 'grey.100', py: 3, borderBottom: '1px solid', borderColor: 'grey.300' }}>
        <Container>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
              Filtrar por año:
            </Typography>
            <Button
              variant={selectedYear === null ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedYear(null)}
            >
              Todos
            </Button>
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setSelectedYear(year)}
                endIcon={
                  <Chip
                    label={getYearEvents(year).length}
                    size="small"
                    sx={{ 
                      height: 20,
                      bgcolor: selectedYear === year ? 'white' : 'primary.main',
                      color: selectedYear === year ? 'primary.main' : 'white'
                    }}
                  />
                }
              >
                {year}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Container sx={{ py: 6 }}>
        <Box sx={{ position: 'relative' }}>
          {/* Vertical Line (Desktop) */}
          {!isMobile && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 4,
                bgcolor: 'primary.main',
                transform: 'translateX(-50%)',
                zIndex: 0
              }}
            />
          )}

          {/* Timeline Events */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filteredEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              const config = categoryConfig[event.category];

              return (
                <Fade key={event.id} in timeout={500 + index * 100}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      justifyContent: isMobile ? 'flex-start' : isLeft ? 'flex-start' : 'flex-end',
                      position: 'relative'
                    }}
                  >
                    {/* Desktop: Left Side Content */}
                    {!isMobile && isLeft && (
                      <Box sx={{ width: 'calc(50% - 40px)', pr: 4 }}>
                        <EventCard event={event} config={config} />
                      </Box>
                    )}

                    {/* Center Icon */}
                    <Box
                      sx={{
                        position: isMobile ? 'relative' : 'absolute',
                        left: isMobile ? 0 : '50%',
                        transform: isMobile ? 'none' : 'translateX(-50%)',
                        zIndex: 1,
                        mb: isMobile ? 2 : 0
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: config.color,
                          border: '4px solid white',
                          boxShadow: 3
                        }}
                      >
                        {config.icon}
                      </Avatar>
                    </Box>

                    {/* Desktop: Right Side Content */}
                    {!isMobile && !isLeft && (
                      <Box sx={{ width: 'calc(50% - 40px)', pl: 4 }}>
                        <EventCard event={event} config={config} />
                      </Box>
                    )}

                    {/* Mobile: Content */}
                    {isMobile && (
                      <Box sx={{ width: '100%', pl: 2 }}>
                        <EventCard event={event} config={config} />
                      </Box>
                    )}
                  </Box>
                </Fade>
              );
            })}
          </Box>
        </Box>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: 'primary.light', color: 'white', py: 8 }}>
        <Container>
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ fontWeight: 700, mb: 6 }}>
            Anakena en Números
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              gap: 4
            }}
          >
            <Box sx={{ textAlign: 'center', minWidth: 150 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                4+
              </Typography>
              <Typography variant="h6">
                Años de Historia
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 150 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                100+
              </Typography>
              <Typography variant="h6">
                Miembros Activos
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 150 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                8
              </Typography>
              <Typography variant="h6">
                Disciplinas Deportivas
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 150 }}>
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                20+
              </Typography>
              <Typography variant="h6">
                Campeonatos Ganados
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Future Vision */}
      <Container sx={{ py: 8 }}>
        <Card sx={{ bgcolor: 'grey.50', boxShadow: 4 }}>
          <CardContent sx={{ p: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Mirando hacia el Futuro
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Anakena DCC continúa creciendo y evolucionando. Nuestro objetivo para los próximos años es consolidarnos como el club deportivo más inclusivo y exitoso de la Universidad de Chile, expandiendo nuestras disciplinas, mejorando nuestras instalaciones, y sobre todo, formando mejores personas a través del deporte.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              "No solo formamos campeones deportivos, formamos líderes para la vida" - Lema Anakena DCC
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" size="large" onClick={() => window.location.hash = '#equipos'}>
                Ver Nuestros Equipos
              </Button>
              <Button variant="outlined" size="large" onClick={() => window.location.hash = '#inicio'}>
                Conocer Más
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

// Componente auxiliar para las tarjetas de eventos
interface EventCardProps {
  event: TimelineEvent;
  config: {
    color: string;
    icon: React.ReactNode;
    label: string;
  };
}

function EventCard({ event, config }: EventCardProps) {
  return (
    <Card
      sx={{
        boxShadow: 4,
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8
        }
      }}
    >
      {event.image && (
        <Box
          component="img"
          src={event.image}
          alt={event.title}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover'
          }}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<CalendarToday />}
            label={event.year}
            sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
          />
          <Chip
            label={config.label}
            sx={{ bgcolor: config.color, color: 'white' }}
          />
        </Box>

        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {event.title}
        </Typography>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          {event.description}
        </Typography>

        {event.highlights && event.highlights.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              Momentos destacados:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {event.highlights.map((highlight, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: config.color,
                      flexShrink: 0
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {highlight}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}