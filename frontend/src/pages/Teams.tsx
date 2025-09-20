import { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Card, CardContent, CardMedia, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Avatar, Alert
} from '@mui/material';
import { 
  SportsSoccer, SportsBasketball, SportsVolleyball, SportsHandball,
  SportsTennis, DirectionsRun, FitnessCenter
} from '@mui/icons-material';
import { apiService, type Team, type Player } from '../services/api';
import bannerImg from '../assets/banner.png';

// Extender la interfaz Team para incluir la propiedad icon
interface TeamWithIcon extends Team {
  icon: React.ReactNode;
}

export default function Teams() {
  const [teams, setTeams] = useState<TeamWithIcon[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithIcon | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playersLoading, setPlayersLoading] = useState(false);

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

  // Función para navegar al calendario (ComingSoon)
  const handleNavigateToCalendar = () => {
    // Cerrar el dialog primero
    handleCloseDialog();
    // Navegar a la página de calendario (que mostrará ComingSoon)
    window.location.hash = '#calendario';
  };

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const teamsData = await apiService.getTeams();
        // Agregar iconos y imágenes a los equipos
        const teamsWithIcons = teamsData.map(team => ({
          ...team,
          icon: getSportIcon(team.sport),
          image: team.image || bannerImg // Fallback a imagen por defecto
        }));
        setTeams(teamsWithIcons);
        
      } catch (err) {
        console.error('Error loading teams from API:', err);
        setError('Error al cargar los equipos desde el servidor');
        
        // Fallback a datos mock si falla la API - Nueva lógica sin béisbol
        const mockTeams: TeamWithIcon[] = [
          {
            id: 1,
            sport: 'Fútbol',
            name: 'Anakena FC Masculino',
            category: 'Masculino' as const,
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
            category: 'Femenino' as const,
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
            category: 'Mixto' as const,
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
          },
          {
            id: 4,
            sport: 'Handball',
            name: 'Anakena Handball Masculino',
            category: 'Masculino' as const,
            description: 'Equipo de handball con técnica europea y pasión sudamericana.',
            founded: '2015',
            captain: 'Diego Morales',
            playersCount: 14,
            achievements: [
              'Subcampeón Regional 2023',
              'Mejor portero del torneo 2022'
            ],
            nextMatch: {
              id: 4,
              date: '2024-10-02',
              opponent: 'Derecho Lawyers',
              location: 'Cancha Norte',
              time: '16:00'
            },
            image: bannerImg,
            icon: getSportIcon('Handball')
          },
          {
            id: 5,
            sport: 'Tenis',
            name: 'Anakena Tennis Club',
            category: 'Mixto' as const,
            description: 'Club de tenis con modalidades individuales y dobles, tanto masculino como femenino.',
            founded: '2008',
            captain: 'Javiera Pérez',
            playersCount: 8,
            achievements: [
              'Campeón dobles mixtos 2023',
              'Finalista individual femenino 2023'
            ],
            nextMatch: {
              id: 5,
              date: '2024-10-05',
              opponent: 'Arquitectura Racquets',
              location: 'Canchas de Tenis',
              time: '14:00'
            },
            image: bannerImg,
            icon: getSportIcon('Tenis')
          },
          {
            id: 6,
            sport: 'Atletismo',
            name: 'Anakena Runners',
            category: 'Mixto' as const,
            description: 'Grupo de atletismo especializado en carreras de medio fondo y fondo.',
            founded: '2020',
            captain: 'Pedro Contreras',
            playersCount: 20,
            achievements: [
              'Mejor tiempo 10K universitario 2023',
              'Equipo más numeroso en Maratón de Santiago 2024'
            ],
            nextMatch: {
              id: 6,
              date: '2024-10-07',
              opponent: 'Universidad de Chile',
              location: 'Estadio Nacional',
              time: '09:00'
            },
            image: bannerImg,
            icon: getSportIcon('Atletismo')
          }
        ];
        
        setTeams(mockTeams);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleTeamClick = async (team: TeamWithIcon) => {
    setSelectedTeam(team);
    setPlayersLoading(true);
    
    try {
      const playersData = await apiService.getPlayersByTeam(team.id);
      setPlayers(playersData);
    } catch (err) {
      console.error('Error loading players:', err);
      // Fallback a datos mock para jugadores
      const mockPlayers: Player[] = [
        { id: 1, name: 'Juan Pérez', teamId: team.id, position: 'Delantero', number: 9, age: 21, carrera: 'Ciencias de la Computación', isCaptain: false },
        { id: 2, name: 'Mario Silva', teamId: team.id, position: 'Mediocampista', number: 10, age: 22, carrera: 'Ingeniería Civil en Computación', isCaptain: false },
        { id: 3, name: 'Carlos López', teamId: team.id, position: 'Defensor', number: 4, age: 23, carrera: 'Ciencias de la Computación', isCaptain: false },
        { id: 4, name: 'Luis González', teamId: team.id, position: 'Arquero', number: 1, age: 24, carrera: 'Magíster en Ciencias', isCaptain: false },
        { id: 5, name: team.captain, teamId: team.id, position: 'Capitán', number: 5, age: 22, carrera: 'Ingeniería Civil en Computación', isCaptain: true },
      ];
      setPlayers(mockPlayers);
    } finally {
      setPlayersLoading(false);
    }
    
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
        {error && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            {error} (Mostrando datos de ejemplo)
          </Alert>
        )}
        
        {loading ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="text.secondary">
              Cargando equipos...
            </Typography>
          </Box>
        ) : (
          // Usando CSS Grid como en la nueva lógica
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
                        {new Date(team.nextMatch.date).toLocaleDateString('es-CL')} - {team.nextMatch.time}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {team.nextMatch.location}
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
              
              {/* Usando CSS Grid como en la nueva lógica */}
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
                            primary="Fecha y Hora" 
                            secondary={`${new Date(selectedTeam.nextMatch.date).toLocaleDateString('es-CL')} - ${selectedTeam.nextMatch.time}`} 
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
                    Plantel {playersLoading && '(Cargando...)'}
                  </Typography>
                  <List dense>
                    {players.slice(0, 5).map((player) => (
                      <ListItem key={player.id}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {player.number || player.name.charAt(0)}
                        </Avatar>
                        <ListItemText 
                          primary={`${player.name} ${player.isCaptain ? '(C)' : ''}`}
                          secondary={`${player.position} - ${player.carrera}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                    {players.length > 5 && (
                      <ListItem>
                        <ListItemText 
                          primary={`... y ${players.length - 5} jugadores más`}
                          primaryTypographyProps={{ variant: 'body2', style: { fontStyle: 'italic', opacity: 0.7 } }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              <Button variant="contained" onClick={handleNavigateToCalendar}>
                Ver Calendario
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}