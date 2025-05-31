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
    Snackbar,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './ActivityDetail.module.css';
import { apiService } from '../../services/api';
import parse from 'html-react-parser';
import ActivityRegistrationForm from './components/ActivityRegistrationForm';
import CustomAlert from '../../components/generics/Alert/CustomAlert';

const ActivityDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', vertical: 'top', horizontal: 'center' });

    useEffect(() => {
        const loadActivity = async () => {
            try {
                const data = await apiService.get(`/activities/${params.id}`);
                setActivity(data);
            } catch (err) {
                setError('Error al cargar la actividad: ' + (err.message || 'Error desconocido'));
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
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
        <Container maxWidth="md" className={styles.container} sx={{ py: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ 
                    mb: 3, 
                    fontWeight: 'medium',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    px: 3,
                    py: 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transform: 'translateY(-2px)'
                    }
                }}
            >
                Volver
            </Button>

            {/* Header con imagen de fondo si está disponible (fuera del Paper) */}
            {activity.images && activity.images.length > 0 && (
                <Box 
                    sx={{
                        height: '220px',
                        width: '100%',
                        position: 'relative',
                        mb: 4,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${activity.images[0].url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '100%',
                            filter: 'brightness(0.85)',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '100px',
                                backgroundImage: 'linear-gradient(to top, rgba(245,247,250,1), rgba(245,247,250,0))'
                            }
                        }}
                    />
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            bottom: '20px', 
                            left: '24px',
                            zIndex: 2,
                        }}
                    >
                        <Chip 
                            label={activity.status} 
                            color={getStatusColor(activity.status)}
                            sx={{ 
                                fontWeight: 'bold',
                                '& .MuiChip-label': {
                                    px: 2
                                }
                            }}
                        />
                    </Box>
                </Box>
            )}

            <Paper 
                elevation={0} 
                sx={{ 
                    p: { xs: 2, sm: 4 }, 
                    borderRadius: '16px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #fbfcff 100%)'
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 700,
                            backgroundImage: 'linear-gradient(90deg, #1a237e 0%, #303f9f 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {activity.title}
                    </Typography>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            flexWrap: 'wrap',
                            alignItems: 'center' 
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarTodayIcon 
                                sx={{ 
                                    color: 'primary.main',
                                    opacity: 0.8
                                }} 
                            />
                            <Typography variant="subtitle1" color="text.secondary">
                                {new Date(activity.startDate).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                                {' - '}
                                {new Date(activity.endDate).toLocaleString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon 
                                sx={{ 
                                    color: 'error.main',
                                    opacity: 0.8
                                }} 
                            />
                            <Typography variant="subtitle1" color="text.secondary">
                                {activity.Location?.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 3, opacity: 0.6 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography 
                            variant="h5" 
                            gutterBottom
                            sx={{ 
                                fontWeight: 600,
                                position: 'relative',
                                pb: 1,
                                mb: 2,
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '40px',
                                    height: '4px',
                                    backgroundColor: 'primary.main',
                                    borderRadius: '2px'
                                }
                            }}
                        >
                            Descripción
                        </Typography>
                        <Box 
                            sx={{
                                fontSize: '1rem',
                                lineHeight: 1.7,
                                color: 'text.primary',
                                '& img': {
                                    maxWidth: '100%',
                                    height: 'auto',
                                    margin: '1rem 0',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                },
                                '& table': {
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    margin: '1rem 0',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                },
                                '& thead': {
                                    backgroundColor: 'rgba(0,0,0,0.03)'
                                },
                                '& td, & th': {
                                    border: '1px solid #eee',
                                    padding: '12px 16px'
                                },
                                '& tr:nth-of-type(even)': {
                                    backgroundColor: 'rgba(0,0,0,0.01)'
                                },
                                '& p': {
                                    margin: '1rem 0',
                                    lineHeight: 1.7,
                                    color: 'text.primary',
                                    fontSize: '1rem'
                                },
                                '& h1, & h2, & h3, & h4, & h5, & h6': {
                                    margin: '1.5rem 0 1rem',
                                    fontWeight: 600,
                                    color: 'text.primary'
                                },
                                '& h1': { fontSize: '2rem' },
                                '& h2': { fontSize: '1.75rem' },
                                '& h3': { fontSize: '1.5rem' },
                                '& h4': { fontSize: '1.25rem' },
                                '& h5': { fontSize: '1.1rem' },
                                '& h6': { fontSize: '1rem' },
                                '& ul, & ol': {
                                    margin: '1rem 0',
                                    paddingLeft: '2rem'
                                },
                                '& li': {
                                    margin: '0.5rem 0'
                                },
                                '& a': {
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                },
                                '& blockquote': {
                                    borderLeft: '4px solid primary.main',
                                    padding: '1rem 2rem',
                                    margin: '1rem 0',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                    borderRadius: '4px'
                                }
                            }}
                        >
                            {activity.description ? parse(activity.description) : 'No hay descripción disponible'}
                        </Box>

                        {activity.images && activity.images.length > 1 && (
                            <Box sx={{ mt: 4, mb: 3 }}>
                                <Typography 
                                    variant="h5" 
                                    gutterBottom
                                    sx={{ 
                                        fontWeight: 600,
                                        position: 'relative',
                                        pb: 1,
                                        mb: 2,
                                        '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '40px',
                                            height: '4px',
                                            backgroundColor: 'primary.main',
                                            borderRadius: '2px'
                                        }
                                    }}
                                >
                                    Imágenes
                                </Typography>
                                <ImageList 
                                    sx={{ 
                                        overflow: 'hidden',
                                        borderRadius: '12px',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
                                    }} 
                                    cols={2} 
                                    gap={12}
                                >
                                    {activity.images.slice(1).map((image) => (
                                        <ImageListItem key={image.id}>
                                            <img
                                                src={image.url}
                                                alt={`Imagen de ${activity.title}`}
                                                loading="lazy"
                                                style={{ 
                                                    borderRadius: '8px',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                                className={styles.activityImage}
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                        )}

                        <Box sx={{ 
                            mt: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2.5,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            p: 3,
                            borderRadius: '12px'
                        }}>
                            <Typography 
                                variant="h5" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 600,
                                    position: 'relative',
                                    pb: 1,
                                    mb: 1,
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '40px',
                                        height: '4px',
                                        backgroundColor: 'primary.main',
                                        borderRadius: '2px'
                                    }
                                }}
                            >
                                Detalles
                            </Typography>

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                backgroundColor: 'white',
                                p: 2,
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                            }}>
                                <Box sx={{ 
                                    backgroundColor: 'primary.light', 
                                    p: 1.5, 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CalendarTodayIcon sx={{ color: 'primary.dark' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Fechas
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {new Date(activity.startDate).toLocaleString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        {' - '}
                                        {new Date(activity.endDate).toLocaleString('es-ES', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                backgroundColor: 'white',
                                p: 2,
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                            }}>
                                <Box sx={{ 
                                    backgroundColor: 'error.light', 
                                    p: 1.5, 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <LocationOnIcon sx={{ color: 'error.dark' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Ubicación
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {activity.Location?.name} - {activity.Location?.address}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                backgroundColor: 'white',
                                p: 2,
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                            }}>
                                <Box sx={{ 
                                    backgroundColor: 'success.light', 
                                    p: 1.5, 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <PeopleIcon sx={{ color: 'success.dark' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Participantes
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        Capacidad máxima: {activity.maxCapacity} personas
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                backgroundColor: 'white',
                                p: 2,
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                            }}>
                                <Box sx={{ 
                                    backgroundColor: 'info.light', 
                                    p: 1.5, 
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <AccessTimeIcon sx={{ color: 'info.dark' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Estado
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {activity.status}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 3, 
                                borderRadius: '16px',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fb 100%)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                position: 'sticky',
                                top: '24px'
                            }}
                        >
                            <Typography 
                                variant="h5" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 600,
                                    position: 'relative',
                                    pb: 1,
                                    mb: 2,
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '40px',
                                        height: '4px',
                                        backgroundColor: 'primary.main',
                                        borderRadius: '2px'
                                    }
                                }}
                            >
                                Categoría
                            </Typography>
                            
                            <Box 
                                sx={{ 
                                    backgroundColor: 'white',
                                    p: 2,
                                    borderRadius: '12px',
                                    mb: 3,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}
                            >
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Categoría
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.025)',
                                    borderRadius: '8px',
                                    p: 1.5,
                                    gap: 1.5
                                }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        {activity.Category?.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                    {activity.Category?.description}
                                </Typography>
                            </Box>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                onClick={() => setRegistrationDialogOpen(true)}
                                sx={{ 
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                Inscribirse a la actividad
                            </Button>
                            
                            <Box sx={{ 
                                mt: 3, 
                                p: 2,
                                border: '1px dashed rgba(0,0,0,0.1)',
                                borderRadius: '10px',
                                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                            }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                    Inscríbete para participar en esta increíble actividad y forma parte de nuestra comunidad.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            <ActivityRegistrationForm
                activity={activity}
                open={registrationDialogOpen}
                onClose={() => setRegistrationDialogOpen(false)}
                onSuccess={() => {
                    setError(null);
                    setSnackbar({
                        open: true,
                        message: '¡Inscripción exitosa! Te enviaremos un correo con los detalles.',
                        severity: 'success'
                    });
                }}
            />

            <CustomAlert 
                message={snackbar.message}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                open={snackbar.open}
                severity={snackbar.severity}
            />
        </Container>
    );
};

export default ActivityDetail; 