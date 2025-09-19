import { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Card, CardContent, CardMedia, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Avatar
} from '@mui/material';
import { 
  SportsSoccer, SportsBasketball, SportsVolleyball, SportsHandball,
  SportsTennis, DirectionsRun, FitnessCenter
} from '@mui/icons-material';
import bannerImg from '../assets/banner.png';

interface Team {
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
    date: string;
    opponent: string;
    location: string;
  };
  image: string;
  icon: React.ReactNode;
}

interface Player {
  id: number;
  name: string;
  position: string;
  number?: number;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getSportIcon = (sport: string) => {
    const iconProps = { sx: { fontSize: 40 } };
    switch (sport.toLowerCase()) {
      case 'fútbol': return <SportsSoccer {...iconProps} />;
      case 'básquetbol': return <SportsBasketball {...iconProps} />;
      case 'vóleibol': return <SportsVolleyball {...iconProps} />;
      case 'handball': return <SportsHandball {...iconProps} />;
      case 'tenis': return <SportsTennis {...iconProps} />;
      case 'atletismo': return <DirectionsRun {...iconProps} />;
      default: return <FitnessCenter {...iconProps} />;
    }
  };

  // Simular carga de equipos desde API (mock)
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockTeams: Team[] = [
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
            date: '2024-09-25',
            opponent: 'Ingeniería FC',
            location: 'Cancha Sur Campus'
          },
          image: bannerImg,
          icon: getSportIcon('fútbol')
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
            date: '2024-09-28',
            opponent: 'Medicina Panthers',
            location: 'Gimnasio Central'
          },
          image: bannerImg,
          icon: getSportIcon('básquetbol')
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
          image: bannerImg,
          icon: getSportIcon('vóleibol')
        },
        {
          id: 4,
          sport: 'Handball',
          name: 'Anakena Handball Masculino',
          category: 'Masculino',
          description: 'Equipo de handball con técnica europea y pasión sudamericana.',
          founded: '2015',
          captain: 'Diego Morales',
          playersCount: 14,
          achievements: [
            'Subcampeón Regional 2023',
            'Mejor portero del torneo 2022'
          ],
          nextMatch: {
            date: '2024-10-02',
            opponent: 'Derecho Lawyers',
            location: 'Cancha Norte'
          },
          image: bannerImg,
          icon: getSportIcon('handball')
        },
        {
          id: 5,
          sport: 'Tenis',
          name: 'Anakena Tennis Club',
          category: 'Mixto',
          description: 'Club de tenis con modalidades individuales y dobles, tanto masculino como femenino.',
          founded: '2008',
          captain: 'Javiera Pérez',
          playersCount: 8,
          achievements: [
            'Campeón dobles mixtos 2023',
            'Finalista individual femenino 2023'
          ],
          image: bannerImg,
          icon: getSportIcon('tenis')
        },
        {
          id: 6,
          sport: 'Atletismo',
          name: 'Anakena Runners',
          category: 'Mixto',
          description: 'Grupo de atletismo especializado en carreras de medio fondo y fondo.',
          founded: '2020',
          captain: 'Pedro Contreras',
          playersCount: 20,
          achievements: [
            'Mejor tiempo 10K universitario 2023',
            'Equipo más numeroso en Maratón de Santiago 2024'
          ],
          image: bannerImg,
          icon: getSportIcon('atletismo')
        }
      ];
      
      setTeams(mockTeams);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    
    // Simular carga de jugadores para el equipo seleccionado
    const mockPlayers: Player[] = [
      { id: 1, name: 'Juan Pérez', position: 'Delantero', number: 9 },
      { id: 2, name: 'Mario Silva', position: 'Mediocampista', number: 10 },
      { id: 3, name: 'Carlos López', position: 'Defensor', number: 4 },
      { id: 4, name: 'Luis González', position: 'Arquero', number: 1 },
      { id: 5, name: 'Pedro Morales', position: 'Delantero', number: 11 },
    ];
    
    setPlayers(mockPlayers);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTeam(null);
    setPlayers([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Masculino': return 'primary';
      case 'Femenino': return 'secondary';
      case 'Mixto': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Nuestros Equipos
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            Conoce todos los deportes y disciplinas que forman parte de Anakena
          </Typography>
        </Container>
      </Box>

      {/* Teams Grid */}
      <Container sx={{ py: 6 }}>
        {teams.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">
              Cargando equipos...
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 4
            }}
          >
            {teams.map((team) => (
              <Card 
                key={team.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleTeamClick(team)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={team.image}
                  alt={team.name}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: 'primary.main', mr: 2 }}>
                      {team.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3">
                        {team.name}
                      </Typography>
                      <Chip 
                        label={team.category} 
                        size="small" 
                        color={getCategoryColor(team.category) as any}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1 }}>
                    {team.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {team.playersCount} jugadores
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      Desde {team.founded}
                    </Typography>
                  </Box>
                  
                  {team.nextMatch && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="primary.main" fontWeight="bold">
                        PRÓXIMO PARTIDO
                      </Typography>
                      <Typography variant="body2">
                        vs {team.nextMatch.opponent}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(team.nextMatch.date).toLocaleDateString('es-CL')} - {team.nextMatch.location}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      {/* Team Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTeam && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'primary.main' }}>
                  {selectedTeam.icon}
                </Box>
                <Box>
                  <Typography variant="h5" component="div">
                    {selectedTeam.name}
                  </Typography>
                  <Chip 
                    label={selectedTeam.category} 
                    size="small" 
                    color={getCategoryColor(selectedTeam.category) as any}
                  />
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedTeam.description}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)'
                  },
                  gap: 3
                }}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Información del Equipo
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Capitán" 
                        secondary={selectedTeam.captain} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Fundado en" 
                        secondary={selectedTeam.founded} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Jugadores activos" 
                        secondary={`${selectedTeam.playersCount} miembros`} 
                      />
                    </ListItem>
                  </List>
                  
                  {selectedTeam.nextMatch && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Próximo Partido
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Rival" 
                            secondary={selectedTeam.nextMatch.opponent} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Fecha" 
                            secondary={new Date(selectedTeam.nextMatch.date).toLocaleDateString('es-CL')} 
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Lugar" 
                            secondary={selectedTeam.nextMatch.location} 
                          />
                        </ListItem>
                      </List>
                    </>
                  )}
                </Box>
                
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Logros Destacados
                  </Typography>
                  <List dense>
                    {selectedTeam.achievements.map((achievement, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={achievement}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Plantel (Muestra)
                  </Typography>
                  <List dense>
                    {players.slice(0, 5).map((player) => (
                      <ListItem key={player.id}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {player.number || player.name.charAt(0)}
                        </Avatar>
                        <ListItemText 
                          primary={player.name}
                          secondary={player.position}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              <Button variant="contained" onClick={handleCloseDialog}>
                Ver Calendario
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}