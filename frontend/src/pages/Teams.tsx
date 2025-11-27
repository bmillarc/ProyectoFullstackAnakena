import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Container, Card, CardContent, CardMedia, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Avatar, Alert
} from '@mui/material';
import { useTeamsStore, type TeamWithExtras } from '../store/teamsStore';
import type { Player } from '../services/api';


// Extensión de la interfaz 'Team' para incluir la propiedad 'icon'
// TeamWithIcon ahora proviene del store (TeamWithExtras)

export default function Teams() {
  const navigate = useNavigate();
  const {
    teams,
    selectedTeam,
    players,
    loading,
    error,
    playersLoading,
    loadTeams,
    selectTeam,
    clearSelection
  } = useTeamsStore();
  const dialogOpen = selectedTeam !== null;

  // Icon resolution movida al store

  // Función para navegar al calendario (ComingSoon)
  const handleNavigateToCalendar = () => {
    // Cerrar el dialog primero
    handleCloseDialog();
    // Navegar a la página de calendario (que mostrará ComingSoon)
    navigate('/calendario');
  };

  useEffect(() => { loadTeams(); }, [loadTeams]);

  const handleTeamClick = async (team: TeamWithExtras) => { await selectTeam(team); };

  const handleCloseDialog = () => { clearSelection(); };

  const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Masculino': 
      return '#000000'; 
    case 'Femenino': 
      return '#dd5415ff'; 
    case 'Mixto': 
      return '#2f8549'; 
    default: 
      return '#9e9e9e';
  }
};



  return (
    <Box>
      {/* Header Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.light',
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
                      sx={{ 
                        mt: 0.5, 
                        backgroundColor: getCategoryColor(team.category),  
                        color: 'white',
                      }}
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
                  sx={{ 
                    mt: 0.5, 
                    backgroundColor: getCategoryColor(selectedTeam.category),  
                    color: 'white',
                  }}
                />
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedTeam.description}
              </Typography>
              
              {/* CSS Grid */}
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
                    {selectedTeam.achievements.map((achievement: string, index: number) => (
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
                    {players.slice(0, 5).map((player: Player) => (
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