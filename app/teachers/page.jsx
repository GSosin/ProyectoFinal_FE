'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import { apiService } from '../services/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useAuthStore from '../store/authStore';

export default function TeachersPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

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
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  };

  const getRecentActivities = () => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.endDate) < now)
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(0, 3);
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
  const recentActivities = getRecentActivities();

  return (
    <ProtectedRoute>
      <Box>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#1565c0',
                mr: 2,
                boxShadow: '0 4px 20px rgba(21, 101, 192, 0.3)'
              }}
            >
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1565c0',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                Panel de Docente
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ fontWeight: 400 }}
              >
                ¡Bienvenido, {user?.firstName} {user?.lastName}!
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Gestiona tus actividades, revisa tu calendario y mantén un seguimiento de tus responsabilidades como docente.
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(21, 101, 192, 0.3)'
                }
              }}
              onClick={() => router.push('/teachers/calendar')}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h2" fontWeight={600}>
                    Mi Calendario
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Visualiza todas tus actividades en un calendario interactivo. Organiza tu tiempo y mantén un seguimiento de tus responsabilidades.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#1565c0',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Ver Calendario
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(46, 125, 50, 0.3)'
                }
              }}
              onClick={() => router.push('/me/edit')}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" component="h2" fontWeight={600}>
                    Mi Perfil
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Actualiza tu información personal, biografía y certificaciones. Mantén tu perfil actualizado para los estudiantes.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#2e7d32',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Editar Perfil
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="primary" fontWeight={700}>
                {activities.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Actividades Totales
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="warning.main" fontWeight={700}>
                {activities.filter(a => a.status === 'Pendiente').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pendientes
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="info.main" fontWeight={700}>
                {activities.filter(a => a.status === 'En curso').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                En Curso
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h3" color="success.main" fontWeight={700}>
                {activities.filter(a => a.status === 'Completada').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Completadas
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Upcoming Activities */}
        {upcomingActivities.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1565c0', mb: 3 }}>
              Próximas Actividades
            </Typography>
            <Grid container spacing={3}>
              {upcomingActivities.map((activity) => (
                <Grid item xs={12} md={4} key={activity.id}>
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
                    onClick={() => router.push(`/activities/${activity.id}`)}
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
              ))}
            </Grid>
          </Box>
        )}

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1565c0', mb: 3 }}>
              Actividades Recientes
            </Typography>
            <Grid container spacing={3}>
              {recentActivities.map((activity) => (
                <Grid item xs={12} md={4} key={activity.id}>
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
                    onClick={() => router.push(`/activities/${activity.id}`)}
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
              ))}
            </Grid>
          </Box>
        )}

        {/* Empty State */}
        {activities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EventIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tienes actividades asignadas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Cuando te asignen actividades, aparecerán aquí en tu panel de docente.
            </Typography>
          </Box>
        )}

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