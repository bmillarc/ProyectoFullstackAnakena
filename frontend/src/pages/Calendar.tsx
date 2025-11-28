import { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Card, IconButton, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, MenuItem
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, CalendarToday, AccessTime,
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';
import { apiService, type Event } from '../services/api';
import { isAdmin } from '../services/authService';

// Interfaz local para manejar eventos con Date
interface EventWithDate extends Omit<Event, 'start' | 'end'> {
  start: Date;
  end: Date;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<EventWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userIsAdmin = isAdmin();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await apiService.getEvents();
      // Convertir strings a Date
      const eventsWithDates: EventWithDate[] = eventsData.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(eventsWithDates);
    } catch (err) {
      console.error('Error loading events:', err);
      setSnackbarMessage('Error al cargar eventos');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0); // Round to next hour

    setEditingEvent({
      title: '',
      category: 'Partido',
      location: '',
      description: '',
      start: now.toISOString(),
      end: now.toISOString() // Will be calculated from duration
    });
    setEditDialogOpen(true);
  };

  const handleEditEvent = (event: EventWithDate) => {
    setEditingEvent({
      id: event.id,
      title: event.title,
      category: event.category,
      location: event.location,
      description: event.description,
      start: event.start.toISOString(),
      end: event.end.toISOString()
    });
    setEditDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      await apiService.deleteEvent(eventId);
      setEvents(events.filter(e => e.id !== eventId));
      setSnackbarMessage('Evento eliminado correctamente');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error deleting event:', err);
      setSnackbarMessage('Error al eliminar el evento');
      setSnackbarOpen(true);
    }
  };

  const handleSaveEvent = async () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.start) return;

    try {
      // Ensure end date is set (should be calculated from duration in the form)
      const eventToSave = { ...editingEvent };

      if (editingEvent.id) {
        // Update existing event
        const updated = await apiService.updateEvent(editingEvent.id, eventToSave);
        const updatedWithDate: EventWithDate = {
          ...updated,
          start: new Date(updated.start),
          end: new Date(updated.end)
        };
        setEvents(events.map(e => e.id === updated.id ? updatedWithDate : e));
        setSnackbarMessage('Evento actualizado correctamente');
      } else {
        // Create new event
        const { id, ...eventData } = eventToSave as Event;
        const newEvent = await apiService.createEvent(eventData);
        const newEventWithDate: EventWithDate = {
          ...newEvent,
          start: new Date(newEvent.start),
          end: new Date(newEvent.end)
        };
        setEvents([...events, newEventWithDate]);
        setSnackbarMessage('Evento creado correctamente');
      }
      setSnackbarOpen(true);
      setEditDialogOpen(false);
      setEditingEvent(null);
    } catch (err: any) {
      console.error('Error saving event:', err);
      setSnackbarMessage(err.message || 'Error al guardar el evento');
      setSnackbarOpen(true);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const hasEvents = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getEventsForDate(date).length > 0;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
                  onClick={() => setSelectedDate(date)}
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
                {selectedEvents.map(event => {
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
                      {userIsAdmin && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            display: 'flex',
                            gap: 0.5
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
                              handleEditEvent(event);
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
                              handleDeleteEvent(event.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
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
              label="Fecha de Inicio"
              type="date"
              value={editingEvent?.start ? new Date(editingEvent.start).toISOString().slice(0, 10) : ''}
              onChange={(e) => {
                if (!e.target.value) return;

                // Maintain current time or use default
                const currentStart = editingEvent?.start ? new Date(editingEvent.start) : new Date();
                const hours = currentStart.getHours();
                const minutes = currentStart.getMinutes();

                const [year, month, day] = e.target.value.split('-').map(Number);
                const newStart = new Date(year, month - 1, day, hours, minutes);

                // Auto-calculate end time based on current duration or default 2 hours
                if (editingEvent?.end && editingEvent?.start) {
                  const currentDuration = (new Date(editingEvent.end).getTime() - new Date(editingEvent.start).getTime()) / (1000 * 60 * 60);
                  const endDate = new Date(newStart.getTime() + currentDuration * 60 * 60 * 1000);
                  setEditingEvent({ ...editingEvent, start: newStart.toISOString(), end: endDate.toISOString() });
                } else {
                  const endDate = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
                  setEditingEvent({ ...editingEvent, start: newStart.toISOString(), end: endDate.toISOString() });
                }
              }}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  min: new Date().toISOString().slice(0, 10)
                }
              }}
            />
            <TextField
              label="Hora de Inicio"
              type="time"
              value={editingEvent?.start ? new Date(editingEvent.start).toTimeString().slice(0, 5) : ''}
              onChange={(e) => {
                if (!e.target.value || !editingEvent?.start) return;

                const currentStart = new Date(editingEvent.start);
                const [hours, minutes] = e.target.value.split(':').map(Number);

                const newStart = new Date(
                  currentStart.getFullYear(),
                  currentStart.getMonth(),
                  currentStart.getDate(),
                  hours,
                  minutes
                );

                // Auto-calculate end time based on current duration or default 2 hours
                if (editingEvent?.end) {
                  const currentDuration = (new Date(editingEvent.end).getTime() - new Date(editingEvent.start).getTime()) / (1000 * 60 * 60);
                  const endDate = new Date(newStart.getTime() + currentDuration * 60 * 60 * 1000);
                  setEditingEvent({ ...editingEvent, start: newStart.toISOString(), end: endDate.toISOString() });
                } else {
                  const endDate = new Date(newStart.getTime() + 2 * 60 * 60 * 1000);
                  setEditingEvent({ ...editingEvent, start: newStart.toISOString(), end: endDate.toISOString() });
                }
              }}
              fullWidth
              required
              slotProps={{
                inputLabel: { shrink: true }
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
