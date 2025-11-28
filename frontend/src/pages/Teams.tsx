import { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Card, CardContent, CardMedia, 
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Avatar, Alert, IconButton,
  TextField, MenuItem, Snackbar
} from '@mui/material';
import { 
  SportsSoccer, SportsBasketball, SportsVolleyball, SportsHandball,
  SportsTennis, DirectionsRun, FitnessCenter
} from '@mui/icons-material';
import { apiService, type Team, type Player } from '../services/api';
import bannerImg from '../assets/banner.png';
import { resolveTeamImage } from '../utils/imagenes';


// Extensión de la interfaz 'Team' para incluir la propiedad 'icon'
// TeamWithIcon ahora proviene del store (TeamWithExtras)

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

  const handleEditTeam = (team: TeamWithIcon) => {
    setEditingTeam(team);
    setEditDialogOpen(true);
  };

  const handleDeleteTeam = async (teamId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      return;
    }

    try {
      await apiService.deleteTeam(teamId);
      setTeams(teams.filter(t => t.id !== teamId));
      setSnackbarMessage('Equipo eliminado correctamente');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error deleting team:', err);
      setSnackbarMessage('Error al eliminar el equipo');
      setSnackbarOpen(true);
    }
  };

  const handleSaveTeam = async () => {
    if (!editingTeam) return;

    try {
      if (editingTeam.id) {
        // Update existing team
        const updated = await apiService.updateTeam(editingTeam.id, editingTeam);
        const updatedWithIcon = {
          ...updated,
          icon: getSportIcon(updated.sport),
          image: resolveTeamImage(updated.image) || bannerImg
        };
        setTeams(teams.map(t => t.id === updated.id ? updatedWithIcon : t));
        setSnackbarMessage('Equipo actualizado correctamente');
      } else {
        // Create new team - don't send id, let backend handle it
        const { id, ...teamData } = editingTeam as Team;
        const newTeam = await apiService.createTeam(teamData);
        const newTeamWithIcon = {
          ...newTeam,
          icon: getSportIcon(newTeam.sport),
          image: resolveTeamImage(newTeam.image) || bannerImg
        };
        setTeams([...teams, newTeamWithIcon]);
        setSnackbarMessage('Equipo creado correctamente');
      }
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      setEditingTeam(null);
    } catch (err: any) {
      console.error('Error saving team:', err);
      setSnackbarMessage(err.message || 'Error al guardar el equipo');
      setSnackbarOpen(true);
    }
  };

  const handleCreateTeam = () => {
    setEditingTeam({
      sport: '',
      name: '',
      category: 'Masculino',
      description: '',
      founded: new Date().getFullYear().toString(),
      captain: '',
      playersCount: 0,
      achievements: [],
      nextMatch: {
        id: 1,
        date: '',
        opponent: '',
        location: '',
        time: ''
      },
      image: 'default.jpg'
    });
    setEditDialogOpen(true);
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
        {userIsAdmin && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTeam}
            >
              Crear Nuevo Equipo
            </Button>
          </Box>
        )}

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
                  },
                  position: 'relative'
                }}
                onClick={() => handleTeamClick(team)}
              >
                {userIsAdmin && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      display: 'flex',
                      gap: 1
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'primary.light', color: 'white' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTeam(team);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'error.main', color: 'white' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
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

      {/* Edit/Create Team Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTeam?.id ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Deporte"
              value={editingTeam?.sport || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, sport: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Nombre del Equipo"
              value={editingTeam?.name || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Categoría"
              select
              value={editingTeam?.category || 'Masculino'}
              onChange={(e) => setEditingTeam({ ...editingTeam, category: e.target.value as 'Masculino' | 'Femenino' | 'Mixto' })}
              fullWidth
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Mixto">Mixto</MenuItem>
            </TextField>
            <TextField
              label="Descripción"
              value={editingTeam?.description || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              label="Año de Fundación"
              value={editingTeam?.founded || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, founded: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Capitán"
              value={editingTeam?.captain || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, captain: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Número de Jugadores"
              type="number"
              value={editingTeam?.playersCount || 0}
              onChange={(e) => setEditingTeam({ ...editingTeam, playersCount: parseInt(e.target.value) || 0 })}
              fullWidth
              required
            />
            <TextField
              label="Imagen (nombre del archivo)"
              value={editingTeam?.image || ''}
              onChange={(e) => setEditingTeam({ ...editingTeam, image: e.target.value })}
              fullWidth
              helperText="Ej: futbol-masculino.jpg"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveTeam}>
            {editingTeam?.id ? 'Guardar Cambios' : 'Crear Equipo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}