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
    ImageListItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import styles from './ActivityDetail.module.css';
import { activityEndpoints } from '../../services/endpoints/activities';

const ActivitiesDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        id: null,
    });

    useEffect(() => {
        const loadActivities = async () => {
            setLoading(true);
            try {
                const data = await activityEndpoints.getAllActivities();
                setActivities(data);
            } catch (error) {
                setError(err.message || 'Error al obtener actividades');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);

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

    const handleDelete = async (id) => {
        if (!id) return;
        try {
            await activityEndpoints.deleteActivity(id);
            setActivities((prev) => prev.filter((activity) => activity.id !== id));
        } catch (err) {
            console.error('Error al eliminar actividad:', err);
            setError('Error al eliminar la actividad');
        } finally {
            setConfirmDelete({ open: false, id: null });
        }
    };

    const openDeleteDialog = (id) => {
        setConfirmDelete({ open: true, id });
    };

    const closeDeleteDialog = () => {
        setConfirmDelete({ open: false, id: null });
    };

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

    if (!activities || activities.length === 0) {
        return (
            <Container maxWidth="md" className={styles.errorContainer}>
                <Typography>No se encontraron actividades</Typography>
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

    return (
        <Container maxWidth="lg" className={styles.container}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Volver
            </Button>

            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
                Todas las Actividades
            </Typography>

            {activities.map((activity) => (
                <Paper
                    key={activity.id}
                    elevation={3}
                    className={styles.paper}
                    sx={{ mb: 4 }}
                >
                    <Box className={styles.header}>
                        <Typography variant="h4" component="h2" className={styles.title}>
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
                            <Typography variant="body1" className={styles.descripcion} paragraph>
                                {activity.description}
                            </Typography>

                            {activity.images && activity.images.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Imágenes
                                    </Typography>
                                    <ImageList cols={2} gap={8}>
                                        {activity.images.map((image) => (
                                            <ImageListItem key={image.id}>
                                                <img
                                                    src={image.url}
                                                    alt={`Imagen de ${activity.title}`}
                                                    loading="lazy"
                                                    className={styles.activityImage}
                                                    style={{
                                                        width: '100%',
                                                        height: '200px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box>
                            )}

                            <Box className={styles.details}>
                                <Box className={styles.detailItem}>
                                    <CalendarTodayIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        {new Date(activity.startDate).toLocaleDateString('es-ES')} -{' '}
                                        {new Date(activity.endDate).toLocaleDateString('es-ES')}
                                    </Typography>
                                </Box>

                                {activity.Location && (
                                    <Box className={styles.detailItem}>
                                        <LocationOnIcon sx={{ mr: 1 }} />
                                        <Typography variant="body1">
                                            {activity.Location.name} - {activity.Location.address},{' '}
                                            {activity.Location.city}
                                        </Typography>
                                    </Box>
                                )}

                                <Box className={styles.detailItem}>
                                    <PeopleIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">
                                        Capacidad máxima: {activity.maxCapacity} participantes
                                    </Typography>
                                </Box>

                                <Box className={styles.detailItem}>
                                    <AccessTimeIcon sx={{ mr: 1 }} />
                                    <Typography variant="body1">Estado: {activity.status}</Typography>
                                </Box>

                                {activity.price && (
                                    <Box className={styles.detailItem}>
                                        <AttachMoneyIcon sx={{ mr: 1 }} />
                                        <Typography variant="body1">Precio: ${activity.price}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} className={styles.sidebarContainer}>
                            <Paper elevation={2} className={styles.sidebar}>
                                <Typography variant="h6" gutterBottom>
                                    Información
                                </Typography>
                                {activity.Category && (
                                    <Box className={styles.infoItem}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Categoría
                                        </Typography>
                                        <Typography variant="body1">{activity.Category.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {activity.Category.description}
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    disabled={
                                        activity.status === 'Cancelada' ||
                                        activity.status === 'Completada'
                                    }
                                >
                                    {activity.status === 'Cancelada'
                                        ? 'Cancelada'
                                        : activity.status === 'Completada'
                                            ? 'Completada'
                                            : 'Inscribirse'}
                                </Button>
                            </Paper>
                        </Grid>



                    </Grid>
                    <Button
                        onClick={() => openDeleteDialog(activity.id)}
                        color="error"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Eliminar Actividad
                    </Button>
                </Paper>
            ))}

            <Dialog open={confirmDelete.open} onClose={closeDeleteDialog}>
                <DialogTitle>¿Eliminar actividad?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Esta acción no se puede deshacer. ¿Estás seguro que querés eliminar esta actividad?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancelar</Button>
                    <Button
                        onClick={() => handleDelete(confirmDelete.id)}
                        color="error"
                        variant="contained"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ActivitiesDetail;
