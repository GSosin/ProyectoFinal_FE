'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Card, 
    CardContent, 
    CardMedia, 
    CardActionArea,
    Chip,
    Button,
    CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { apiService } from '../services/api';
import styles from './Activities.module.css';

const ActivitiesPage = () => {
    const router = useRouter();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await apiService.get('/activities');
                setActivities(data);
            } catch (err) {
                setError('Error al cargar las actividades');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const handleViewActivity = (id) => {
        router.push(`/activities/${id}`);
    };

    const handleCreateActivity = () => {
        router.push('/activities/create');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Programada':
                return 'info';
            case 'En curso':
                return 'success';
            case 'Completada':
                return 'default';
            case 'Cancelada':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                    sx={{ mt: 2 }}
                >
                    Reintentar
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className={styles.container}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 4
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700,
                        backgroundImage: 'linear-gradient(90deg, #1a237e 0%, #303f9f 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Actividades
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleCreateActivity}
                    sx={{
                        fontWeight: 'medium',
                        textTransform: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
                        }
                    }}
                >
                    Crear Actividad
                </Button>
            </Box>

            {activities.length === 0 ? (
                <Box className={styles.noActivities}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No hay actividades disponibles
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={handleCreateActivity}
                        sx={{ mt: 2 }}
                    >
                        Crear la primera actividad
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {activities.map((activity) => (
                        <Grid item xs={12} sm={6} md={4} key={activity.id}>
                            <Card className={styles.card}
                                sx={{ 
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                                }}
                            >
                                <CardActionArea onClick={() => handleViewActivity(activity.id)}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={activity.ActivityImages && activity.ActivityImages.length > 0 
                                            ? activity.ActivityImages[0].url 
                                            : 'https://via.placeholder.com/300x180?text=Sin+imagen'}
                                        alt={activity.title}
                                    />
                                    <Box 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: '16px', 
                                            right: '16px',
                                            zIndex: 1
                                        }}
                                    >
                                        <Chip 
                                            label={activity.status} 
                                            color={getStatusColor(activity.status)}
                                            size="small"
                                            sx={{ 
                                                fontWeight: 'bold',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                                            }}
                                        />
                                    </Box>
                                    <CardContent>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                gap: 1,
                                                mb: 1
                                            }}
                                        >
                                            <Chip 
                                                label={activity.Category?.name || 'Sin categoría'} 
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: 'rgba(0,0,0,0.06)',
                                                    fontWeight: 'medium',
                                                }}
                                            />
                                        </Box>
                                        <Typography 
                                            gutterBottom 
                                            variant="h6" 
                                            component="div"
                                            sx={{ 
                                                fontWeight: 600,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {activity.title}
                                        </Typography>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                gap: 1,
                                                mt: 2
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarTodayIcon 
                                                    fontSize="small" 
                                                    sx={{ color: 'primary.main', opacity: 0.8 }} 
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(activity.startDate)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOnIcon 
                                                    fontSize="small" 
                                                    sx={{ color: 'error.main', opacity: 0.8 }} 
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {activity.Location?.name || 'Sin ubicación'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ActivitiesPage; 