'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button, 
    Grid,
    Chip,
    Divider,
    CircularProgress,
    ImageList,
    ImageListItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import styles from './ActivityDetail.module.css';
import { activityEndpoints } from '../../services/endpoints/activities';
import { apiService } from '../../services/api';

const ActivityDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadActivity = async () => {
            try {
                // Configurar token si existe
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    apiService.setToken(user.token);
                }

                const activityData = await activityEndpoints.getActivityById(params.id);
                setActivity(activityData);
            } catch (err) {
                setError('Error al cargar la actividad: ' + (err.message || 'Error desconocido'));
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            loadActivity();
        }
    }, [params.id]);

    if (loading) {
        return (
            <Box className={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" className={styles.errorContainer}>
                <Typography color="error">{error}</Typography>
                <Button 
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mt: 2 }}
                >
                    Volver
                </Button>
            </Container>
        );
    }

    if (!activity) {
        return null;
    }

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

    return (
        <Container maxWidth="md" className={styles.container}>
            <Button 
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 2 }}
            >
                Volver
            </Button>

            <Paper elevation={3} className={styles.paper}>
                <Box className={styles.header}>
                    <Typography variant="h4" component="h1" className={styles.title}>
                        {activity.title}
                    </Typography>
                    <Chip 
                        label={activity.status} 
                        color={getStatusColor(activity.status)}
                        sx={{ ml: 2 }}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Descripción
                        </Typography>
                        <Typography 
                            variant="body1" 
                            paragraph
                            dangerouslySetInnerHTML={{ __html: activity.description }}
                        />

                        {activity.images && activity.images.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                                <ImageList cols={2} gap={8}>
                                    {activity.images.map((image) => (
                                        <ImageListItem key={image.id}>
                                            <img
                                                src={image.url}
                                                alt={`Imagen de ${activity.title}`}
                                                loading="lazy"
                                                className={styles.activityImage}
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                        )}

                        <Box className={styles.details}>
                            <Box className={styles.detailItem}>
                                <CalendarTodayIcon />
                                <Typography variant="body1">
                                    {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Box className={styles.detailItem}>
                                <LocationOnIcon />
                                <Typography variant="body1">
                                    {activity.Location ? 
                                        `${activity.Location.name} - ${activity.Location.address}${activity.Location.city ? `, ${activity.Location.city}` : ''}` :
                                        'Ubicación no especificada'
                                    }
                                </Typography>
                            </Box>

                            <Box className={styles.detailItem}>
                                <PeopleIcon />
                                <Typography variant="body1">
                                    Capacidad máxima: {activity.maxCapacity} participantes
                                </Typography>
                            </Box>

                            <Box className={styles.detailItem}>
                                <AccessTimeIcon />
                                <Typography variant="body1">
                                    Estado: {activity.status}
                                </Typography>
                            </Box>

                            <Box className={styles.detailItem}>
                                <AttachMoneyIcon />
                                <Typography variant="body1">
                                    Precio: {activity.price ? `$${activity.price}` : 'Gratuito'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} className={styles.sidebar}>
                            <Typography variant="h6" gutterBottom>
                                Información
                            </Typography>
                            <Box className={styles.infoItem}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Categoría
                                </Typography>
                                <Typography variant="body1">
                                    {activity.Category ? activity.Category.name : 'Categoría no especificada'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {activity.Category ? activity.Category.description : ''}
                                </Typography>
                            </Box>

                            <Button 
                                variant="outlined" 
                                color="secondary" 
                                fullWidth
                                startIcon={<EditIcon />}
                                onClick={() => router.push(`/activities/${params.id}/edit`)}
                                sx={{ mb: 2 }}
                            >
                                Editar Actividad
                            </Button>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Inscribirse
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ActivityDetail; 