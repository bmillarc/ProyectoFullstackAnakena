import { useState } from 'react';
import { Box, Typography, Container, Card, IconButton, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarToday, AccessTime } from '@mui/icons-material';
import type { Event } from '../types/calendar';

// Datos de ejemplo - reemplaza con tu llamada a la API
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

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [events] = useState<Event[]>(mockEvents);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  // isSameDay y getEventsForDate vienen del store

  const hasEvents = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getEventsForDate(date).length > 0;
  };

  const previousMonth = () => setMonthOffset(-1);
  const nextMonth = () => setMonthOffset(1);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const selectedEvents = useMemo(() => selectedDate ? getEventsForDate(selectedDate) : [], [selectedDate, getEventsForDate]);

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Calendario de Eventos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Próximos partidos, entrenamientos y actividades de Anakena DCC
          </Typography>
        </Box>
        {userIsAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
          >
            Crear Evento
          </Button>
        )}
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 4,
        mt: 4
      }}>
        {/* Calendar */}
        <Card sx={{ p: 3 }}>
          {/* Calendar Header */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <IconButton onClick={previousMonth} color="primary">
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" component="h2" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
              {monthName}
            </Typography>
            <IconButton onClick={nextMonth} color="primary">
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Days of Week */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            mb: 2
          }}>
            {daysOfWeek.map(day => (
              <Box key={day} sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                <Typography variant="body2">{day}</Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Days */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1
          }}>
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <Box key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isToday = isSameDay(date, new Date());
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const hasEvent = hasEvents(day);

              return (
                <Box
                  key={day}
                  onClick={() => selectDate(date)}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 1,
                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                    color: isSelected ? 'white' : 'text.primary',
                    border: isToday ? '2px solid' : 'none',
                    borderColor: isToday ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isSelected ? 'primary.dark' : 'grey.100',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Typography variant="body1" fontWeight={isToday ? 'bold' : 'normal'}>
                    {day}
                  </Typography>
                  {hasEvent && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: isSelected ? 'white' : 'primary.main'
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Card>

        {/* Events List */}
        <Box>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <CalendarToday color="primary" />
              <Typography variant="h6" component="h3" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                {selectedDate ? selectedDate.toLocaleDateString('es-CL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                }) : 'Selecciona un día'}
              </Typography>
            </Box>

            {loading ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">Cargando eventos...</Typography>
              </Box>
            ) : selectedEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CalendarToday sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography color="text.secondary">
                  No hay eventos programados para este día
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedEvents.map((event: Event) => {
                  const isExpanded = expandedEventId === event.id;

                  return (
                    <Card
                      key={event.id}
                      variant="outlined"
                      sx={{
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        position: 'relative',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box 
                        onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'grey.50'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {event.category && (
                            <Chip
                              label={event.category}
                              size="small"
                              color="primary"
                              sx={{ alignSelf: 'flex-start' }}
                            />
                          )}
                          <Typography variant="subtitle1" fontWeight="bold">
                            {event.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </Typography>
                          </Box>
                          {event.location && (
                            <Typography variant="body2" color="text.secondary">
                              📍 {event.location}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {isExpanded && event.description && (
                        <Box sx={{
                          px: 2,
                          pb: 2,
                          pt: 0,
                          borderTop: '1px solid',
                          borderColor: 'grey.200',
                          bgcolor: 'grey.50'
                        }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.6 }}>
                            {event.description}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  );
                })}
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Edit/Create Event Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvent?.id ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Título"
              value={editingEvent?.title || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
            <TextField
              select
              label="Categoría"
              value={editingEvent?.category || 'Partido'}
              onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true }
              }}
            >
              <MenuItem value="Partido">Partido</MenuItem>
              <MenuItem value="Torneo">Torneo</MenuItem>
              <MenuItem value="Entrenamiento">Entrenamiento</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
            <TextField
              label="Ubicación"
              value={editingEvent?.location || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
            <TextField
              label="Fecha y Hora de Inicio"
              type="datetime-local"
              value={editingEvent?.start ? new Date(editingEvent.start).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                const startDate = new Date(e.target.value);

                // Auto-calculate end time based on current duration or default 2 hours
                if (editingEvent?.end && editingEvent?.start) {
                  const currentDuration = (new Date(editingEvent.end).getTime() - new Date(editingEvent.start).getTime()) / (1000 * 60 * 60);
                  const endDate = new Date(startDate.getTime() + currentDuration * 60 * 60 * 1000);
                  setEditingEvent((prev) => ({ ...prev, start: startDate.toISOString(), end: endDate.toISOString() }));
                } else {
                  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
                  setEditingEvent((prev) => ({ ...prev, start: startDate.toISOString(), end: endDate.toISOString() }));
                }
              }}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: new Date().toISOString().slice(0, 16)
                }
              }}
            />
            <TextField
              label="Duración (horas)"
              type="number"
              value={editingEvent?.start && editingEvent?.end
                ? Math.round((new Date(editingEvent.end).getTime() - new Date(editingEvent.start).getTime()) / (1000 * 60 * 60))
                : 2}
              onChange={(e) => {
                const duration = parseFloat(e.target.value) || 1;
                if (editingEvent?.start) {
                  const startDate = new Date(editingEvent.start);
                  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
                  setEditingEvent({ ...editingEvent, end: endDate.toISOString() });
                }
              }}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: 0.5,
                  max: 24,
                  step: 0.5
                }
              }}
            />
            <TextField
              label="Descripción"
              value={editingEvent?.description || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
              required
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEvent}>
            {editingEvent?.id ? 'Guardar Cambios' : 'Crear Evento'}
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
    </Container>
  );
}
