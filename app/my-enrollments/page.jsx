'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { apiService } from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/enrollments/own');
      setEnrollments(response.data || []);
    } catch (err) {
      setError('Error al cargar tus inscripciones');
      console.error('Error fetching enrollments:', err);
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

  const handleCancelEnrollment = async (activityId) => {
    try {
      await apiService.delete(`/activities/${activityId}/enrollments/unsubscribe`);
      showAlert('Inscripción cancelada exitosamente');
      fetchEnrollments(); // Recargar la lista
    } catch (err) {
      showAlert(err.message || 'Error al cancelar la inscripción', 'error');
    }
  };

  const getEnrollmentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'activa':
        return 'success';
      case 'cancelada':
        return 'error';
      case 'pendiente':
        return 'warning';
      default:
        return 'default';
    }
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          {error}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={fetchEnrollments}>
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fa' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
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
              Mis Inscripciones
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Gestiona todas tus inscripciones a actividades de Israel Hatzeirá
            </Typography>
          </Box>

          {/* Enrollments List */}
          {enrollments.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes inscripciones activas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Explora nuestras actividades y únete a la comunidad de Israel Hatzeirá.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => router.push('/activities')}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Ver Actividades
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {enrollments.map((enrollment) => (
                <Grid item xs={12} key={enrollment.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Activity Title and Status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#1565c0',
                            lineHeight: 1.3,
                            flex: 1,
                            mr: 2
                          }}
                        >
                          {enrollment.Activity?.title}
                        </Typography>
                        <Chip 
                          label={enrollment.status}
                          color={getEnrollmentStatusColor(enrollment.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            minWidth: '80px'
                          }}
                        />
                      </Box>

                      {/* Activity Details */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarTodayIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(enrollment.Activity?.startDate)} - {formatDate(enrollment.Activity?.endDate)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOnIcon sx={{ color: 'error.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            {enrollment.Activity?.Location?.name}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PeopleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Capacidad: {enrollment.Activity?.maxCapacity} personas
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ color: 'info.main', fontSize: 20 }} />
                          <Typography variant="body2" color="text.secondary">
                            Estado de la actividad: {enrollment.Activity?.status}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Enrollment Details */}
                      <Box sx={{ 
                        backgroundColor: 'rgba(0,0,0,0.02)',
                        p: 2,
                        borderRadius: '8px',
                        mb: 2
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Detalles de la inscripción:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fecha de inscripción: {formatDate(enrollment.createdAt)}
                        </Typography>
                        {enrollment.updatedAt && enrollment.updatedAt !== enrollment.createdAt && (
                          <Typography variant="body2" color="text.secondary">
                            Última actualización: {formatDate(enrollment.updatedAt)}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => router.push(`/activities/${enrollment.Activity?.id}`)}
                        sx={{ fontWeight: 600 }}
                        startIcon={<ArrowForwardIcon />}
                      >
                        Ver Actividad
                      </Button>

                      {/* Cancel Enrollment Button - Only for active enrollments */}
                      {enrollment.status.toLowerCase() === 'activa' && 
                       enrollment.Activity?.status !== 'En curso' && 
                       enrollment.Activity?.status !== 'Completada' && 
                       enrollment.Activity?.status !== 'Cancelada' && (
                        <Button 
                          size="small" 
                          color="error"
                          variant="outlined"
                          onClick={() => handleCancelEnrollment(enrollment.Activity?.id)}
                          sx={{ fontWeight: 600 }}
                        >
                          Cancelar Inscripción
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
        </Container>
      </Box>
    </ProtectedRoute>
  );
} 