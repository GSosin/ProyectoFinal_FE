'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiService } from '../../services/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import parse from 'html-react-parser';
export default function TeacherCalendarPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchActivities();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/activities/my');
      setActivities(response.data || []);
    } catch (err) {
      setError('Error al cargar las actividades');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: es });
    } catch (error) {
      return 'Hora no disponible';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'warning';
      case 'En curso':
        return 'info';
      case 'Completada':
        return 'success';
      case 'Cancelada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getUpcomingActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  const getCurrentActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => {
        const startDate = new Date(activity.startDate);
        const endDate = new Date(activity.endDate);
        return startDate <= now && endDate >= now;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  const getCompletedActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.endDate) < now)
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
  };

  const handleEventClick = (activity) => {
    setSelectedEvent(activity);
    setEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleViewActivity = () => {
    if (selectedEvent) {
      router.push(`/activities/${selectedEvent.id}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          {error}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={fetchActivities}>
            Reintentar
          </Button>
        </Box>
      </Box>
    );
  }

  const upcomingActivities = getUpcomingActivities();
  const currentActivities = getCurrentActivities();
  const completedActivities = getCompletedActivities();

  return (
    <ProtectedRoute>
      <Box>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              color: '#1565c0',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Mi Calendario de Actividades
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Gestiona y visualiza todas tus actividades asignadas
          </Typography>
        </Box>

        {/* Calendar View */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes actividades asignadas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cuando te asignen actividades, aparecerán aquí en tu calendario.
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }
                  }}
                >
                  <Tab 
                    label={`Próximas (${upcomingActivities.length})`} 
                    icon={<CalendarTodayIcon />}
                    iconPosition="start"
                  />
                  <Tab 
                    label={`En Curso (${currentActivities.length})`} 
                    icon={<AccessTimeIcon />}
                    iconPosition="start"
                  />
                  <Tab 
                    label={`Completadas (${completedActivities.length})`} 
                    icon={<EventIcon />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Content based on tab */}
              <Box sx={{ minHeight: '400px' }}>
                {currentTab === 0 && (
                  <Grid container spacing={3}>
                    {upcomingActivities.length > 0 ? (
                      upcomingActivities.map((activity) => (
                        <Grid item xs={12} md={6} lg={4} key={activity.id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            }}
                            onClick={() => handleEventClick(activity)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" component="h3" fontWeight={600} sx={{ flex: 1 }}>
                                  {activity.title}
                                </Typography>
                                <Chip 
                                  label={activity.status}
                                  color={getStatusColor(activity.status)}
                                  size="small"
                                />
                              </Box>
                              
                              <List dense>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CalendarTodayIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={formatDate(activity.startDate)}
                                    secondary={formatTime(activity.startDate)}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <LocationOnIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={activity.Location?.name || 'No especificada'}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <PeopleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={`${activity.maxCapacity} personas`}
                                  />
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No tienes actividades próximas
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}

                {currentTab === 1 && (
                  <Grid container spacing={3}>
                    {currentActivities.length > 0 ? (
                      currentActivities.map((activity) => (
                        <Grid item xs={12} md={6} lg={4} key={activity.id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            }}
                            onClick={() => handleEventClick(activity)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" component="h3" fontWeight={600} sx={{ flex: 1 }}>
                                  {activity.title}
                                </Typography>
                                <Chip 
                                  label={activity.status}
                                  color={getStatusColor(activity.status)}
                                  size="small"
                                />
                              </Box>
                              
                              <List dense>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CalendarTodayIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={formatDate(activity.startDate)}
                                    secondary={formatTime(activity.startDate)}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <LocationOnIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={activity.Location?.name || 'No especificada'}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <PeopleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={`${activity.maxCapacity} personas`}
                                  />
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No tienes actividades en curso
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}

                {currentTab === 2 && (
                  <Grid container spacing={3}>
                    {completedActivities.length > 0 ? (
                      completedActivities.map((activity) => (
                        <Grid item xs={12} md={6} lg={4} key={activity.id}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                              }
                            }}
                            onClick={() => handleEventClick(activity)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Typography variant="h6" component="h3" fontWeight={600} sx={{ flex: 1 }}>
                                  {activity.title}
                                </Typography>
                                <Chip 
                                  label={activity.status}
                                  color={getStatusColor(activity.status)}
                                  size="small"
                                />
                              </Box>
                              
                              <List dense>
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <CalendarTodayIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={formatDate(activity.endDate)}
                                    secondary={formatTime(activity.endDate)}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <LocationOnIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={activity.Location?.name || 'No especificada'}
                                  />
                                </ListItem>
                                
                                <ListItem sx={{ px: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 32 }}>
                                    <PeopleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={`${activity.maxCapacity} personas`}
                                  />
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="h6" color="text.secondary">
                            No tienes actividades completadas
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Event Details Dialog */}
        <Dialog
          open={eventDialogOpen}
          onClose={handleCloseEventDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <EventIcon color="primary" />
            Detalles de la Actividad
          </DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1565c0' }}>
                  {selectedEvent.title}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={selectedEvent.status}
                    color={getStatusColor(selectedEvent.status)}
                    sx={{ fontWeight: 500 }}
                  />
                </Box>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Fechas"
                      secondary={`${formatDate(selectedEvent.startDate)} - ${formatDate(selectedEvent.endDate)}`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Horarios"
                      secondary={`${formatTime(selectedEvent.startDate)} - ${formatTime(selectedEvent.endDate)}`}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ubicación"
                      secondary={selectedEvent.Location?.name || 'No especificada'}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Capacidad"
                      secondary={`${selectedEvent.maxCapacity} personas`}
                    />
                  </ListItem>
                </List>

                {selectedEvent.description && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>
                      Descripción:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {parse(selectedEvent.description)}
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseEventDialog} variant="outlined">
              Cerrar
            </Button>
            <Button 
              onClick={handleViewActivity} 
              variant="contained" 
              color="primary"
              startIcon={<EventIcon />}
            >
              Ver Actividad Completa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para alertas */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alert.severity} 
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
} 