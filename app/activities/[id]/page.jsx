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
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Tooltip,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import styles from './ActivityDetail.module.css';
import { apiService } from '../../services/api';
import parse from 'html-react-parser';
import ActivityRegistrationForm from './components/ActivityRegistrationForm';
import useAuthStore from '../../store/authStore';
import { 
    getStatusColor,
} from '../../utils/activityUtils';
import ClientDate from '../../components/ClientDate';
import AccessControl from '../../components/AccessControl';
import Link from 'next/link';

const ActivityDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [isEnrolled, setIsEnrolled] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const [editCapacityDialogOpen, setEditCapacityDialogOpen] = useState(false);
    const [newCapacity, setNewCapacity] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const isActivityInProgress = activity && activity.status === 'En curso';
    const isActivityCompleted = activity && activity.status === 'Completada';
    const isActivityCancelled = activity && activity.status === 'Cancelada';

    const getActivityStatusMessage = () => {
        if (isActivityInProgress) return "No es posible inscribirse: la actividad está en curso";
        if (isActivityCompleted) return "No es posible inscribirse: la actividad ya ha finalizado";
        if (isActivityCancelled) return "No es posible inscribirse: la actividad ha sido cancelada";
        return "";
    };

    const isRegistrationDisabled = isActivityInProgress || isActivityCompleted || isActivityCancelled;

    useEffect(() => {
        const loadActivity = async () => {
            try {
                const data = await apiService.get(`/activities/${params.id}`);
                setActivity(data);
                
                if (isLoggedIn && user) {
                    try {
                        const ownEnrollment = await apiService.get(`/activities/${params.id}/enrollments/own`);
                        const isEnrolled = ownEnrollment.data.filter(enrollment => enrollment.status.toLowerCase() === 'activa').length;
                        setIsEnrolled(!!isEnrolled);
                    } catch (err) {
                        console.error('Error checking enrollment:', err);
                    }
                }
            } catch (err) {
                setError('Error al cargar la actividad: ' + (err.message || 'Error desconocido'));
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
    }, [params.id, isLoggedIn, user]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const {data: teachersList} = await apiService.get('/users/teachers');
                setTeachers(teachersList);
            } catch (err) {
                // Puedes mostrar un error si quieres
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (activity && activity.teacherId) {
            setSelectedTeacher(activity.teacherId);
        }
    }, [activity]);

    const handleCancelEnrollment = async () => {
        try {
            await apiService.delete(`/activities/${params.id}/enrollments/unsubscribe`);
            setIsEnrolled(false);
            setCancelDialogOpen(false);
            setSnackbar({
                open: true,
                message: 'Has cancelado tu inscripción exitosamente',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al cancelar la inscripción: ' + (error.message || 'Error desconocido'),
                severity: 'error'
            });
        }
    };

    const handleUpdateCapacity = async () => {
        if (!newCapacity || newCapacity < 1) {
            setSnackbar({
                open: true,
                message: 'La capacidad debe ser un número mayor a 0',
                severity: 'error'
            });
            return;
        }

        setEditLoading(true);
        try {
            const updatedActivity = {
                ...activity,
                maxCapacity: parseInt(newCapacity),
                teacherId: selectedTeacher
            };
            await apiService.put(`/activities/${activity.id}`, updatedActivity);
            setActivity(updatedActivity);
            setEditCapacityDialogOpen(false);
            setSnackbar({
                open: true,
                message: 'Capacidad actualizada exitosamente',
                severity: 'success'
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al actualizar la capacidad: ' + (error.message || 'Error desconocido'),
                severity: 'error'
            });
        } finally {
            setEditLoading(false);
        }
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

    if (!activity) {
        return null;
    }

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
                                <ClientDate date={activity.startDate} formatStr="PPPp" />{' - '}<ClientDate date={activity.endDate} formatStr="PPPp" />
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
                                        <ClientDate date={activity.startDate} formatStr="PPPp" />{' - '}<ClientDate date={activity.endDate} formatStr="PPPp" />
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
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Participantes
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            Capacidad máxima: {activity.maxCapacity} personas
                                        </Typography>
                                        <AccessControl permission="manage_activities">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => {
                                                    setNewCapacity(activity.maxCapacity.toString());
                                                    setEditCapacityDialogOpen(true);
                                                }}
                                                sx={{ 
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light',
                                                        color: 'primary.dark'
                                                    }
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </AccessControl>
                                    </Box>
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
                                    <PersonIcon sx={{ color: 'info.dark' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Docente asignado
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {(() => {
                                            const teacher = teachers.find(t => String(t.id) === String(activity?.teacherId));
                                            return teacher ? (
                                                <Link href={`/teachers/${teacher.id}`} passHref legacyBehavior>
                                                    <Box
                                                        component="a"
                                                        sx={{
                                                            color: 'primary.main',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            fontWeight: 600,
                                                            transition: 'color 0.2s',
                                                            '&:hover': { color: 'primary.dark' }
                                                        }}
                                                    >
                                                        {teacher.firstName} {teacher.lastName}
                                                    </Box>
                                                </Link>
                                            ) : (
                                                <span style={{ color: '#888' }}>Sin docente asignado</span>
                                            );
                                        })()}
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

                            {isLoggedIn ? (
                                isEnrolled ? (
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        fullWidth
                                        onClick={() => setCancelDialogOpen(true)}
                                        disabled={isRegistrationDisabled}
                                        sx={{ 
                                            mt: 2,
                                            py: 1.5,
                                            borderRadius: '10px',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            boxShadow: '0 4px 14px rgba(211, 47, 47, 0.15)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                                                transform: 'translateY(-2px)'
                                            }
                                        }}
                                    >
                                        Cancelar inscripción
                                    </Button>
                                ) : (
                                    <Tooltip 
                                        title={getActivityStatusMessage(activity)}
                                        placement="top"
                                        arrow
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                fullWidth
                                                onClick={() => setRegistrationDialogOpen(true)}
                                                disabled={isRegistrationDisabled}
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
                                                    },
                                                    '&.Mui-disabled': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                                        color: 'rgba(0, 0, 0, 0.26)'
                                                    }
                                                }}
                                            >
                                                Inscribirse a la actividad
                                            </Button>
                                        </Box>
                                    </Tooltip>
                                )
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth
                                    onClick={() => router.push('/login')}
                                    disabled={isRegistrationDisabled}
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
                                    Iniciar sesión para inscribirse
                                </Button>
                            )}
                            
                            <Box sx={{ 
                                mt: 3, 
                                p: 2,
                                border: '1px dashed rgba(0,0,0,0.1)',
                                borderRadius: '10px',
                                backgroundColor: isEnrolled ? 'rgba(211, 47, 47, 0.05)' : 'rgba(25, 118, 210, 0.05)',
                            }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                    {isEnrolled 
                                        ? 'Ya estás inscrito en esta actividad. Puedes cancelar tu inscripción si lo deseas.'
                                        : 'Inscríbete para participar en esta increíble actividad y forma parte de nuestra comunidad.'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                aria-labelledby="cancel-dialog-title"
                aria-describedby="cancel-dialog-description"
            >
                <DialogTitle id="cancel-dialog-title" sx={{ 
                    color: 'error.main',
                    fontWeight: 'bold'
                }}>
                    ¿Estás seguro de que deseas cancelar tu inscripción?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="cancel-dialog-description" sx={{ mb: 2 }}>
                        Al cancelar tu inscripción, perderás tu lugar en esta actividad. Ten en cuenta que si deseas volver a inscribirte más adelante, es posible que ya no haya cupos disponibles.
                    </DialogContentText>
                    <DialogContentText sx={{ 
                        color: 'error.main',
                        fontWeight: 'medium',
                        fontSize: '0.9rem'
                    }}>
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                        onClick={() => setCancelDialogOpen(false)}
                        variant="outlined"
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 'medium'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCancelEnrollment}
                        variant="contained"
                        color="error"
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 'medium'
                        }}
                    >
                        Sí, cancelar inscripción
                    </Button>
                </DialogActions>
            </Dialog>

            <ActivityRegistrationForm
                activity={activity}
                open={registrationDialogOpen}
                onClose={() => setRegistrationDialogOpen(false)}
                onSuccess={() => {
                    setRegistrationDialogOpen(false);
                    setIsEnrolled(true);
                    setSnackbar({
                        open: true,
                        message: '¡Inscripción exitosa! Te enviaremos un correo con los detalles.',
                        severity: 'success'
                    });
                }}
            />

            <Dialog
                open={editCapacityDialogOpen}
                onClose={() => setEditCapacityDialogOpen(false)}
                aria-labelledby="edit-capacity-dialog-title"
            >
                <DialogTitle id="edit-capacity-dialog-title">
                    Editar Capacidad Máxima
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Capacidad máxima"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        inputProps={{ min: 1 }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                        onClick={() => setEditCapacityDialogOpen(false)}
                        variant="outlined"
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 'medium'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleUpdateCapacity}
                        variant="contained"
                        color="primary"
                        disabled={editLoading}
                        sx={{ 
                            textTransform: 'none',
                            fontWeight: 'medium'
                        }}
                    >
                        {editLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ActivityDetail; 