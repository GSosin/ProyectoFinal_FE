'use client';

import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    CircularProgress,
    TextField
} from '@mui/material';
import { apiService } from '../../../services/api';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../store/authStore';
import CustomAlert from '../../../components/generics/Alert/CustomAlert';

const ActivityRegistrationForm = ({ activity, open, onClose, onSuccess }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState('');
    const { isLoggedIn, user, checkAuth } = useAuthStore();

    useEffect(() => {
        if (open) {
            checkAuth();
            // Obtener el token del localStorage y establecerlo en el apiService
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const { token } = JSON.parse(storedUser);
                apiService.setToken(token);
            }
        }
    }, [open, checkAuth]);

    const handleActivityRegistration = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiService.post(`/activities/${activity.id}/register`, { comments });
            onSuccess?.();
            onClose();
        } catch (error) {
            setError(error.message || 'Error al inscribirse en la actividad');
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToRegister = () => {
        onClose();
        router.push('/register');
    };

    if (!isLoggedIn) {
        return (
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        Registro requerido
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            Para inscribirte en esta actividad, primero debes registrarte en nuestra plataforma.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRedirectToRegister}
                            sx={{ 
                                py: 1.5,
                                px: 4,
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
                            Ir a registrarme
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Confirmar asistencia
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        ¿{user.firstName} {user.lastName}, deseas confirmar tu asistencia a la actividad "{activity.title}"?
                    </Typography>
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Observaciones (opcional)"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        sx={{ 
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '10px',
                                backgroundColor: 'rgba(0,0,0,0.02)'
                            }
                        }}
                    />

                    <CustomAlert 
                        message={error}
                        onClose={() => setError(null)}
                        open={!!error}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleActivityRegistration}
                        disabled={loading}
                        sx={{ 
                            py: 1.5,
                            px: 4,
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
                        {loading ? <CircularProgress size={24} /> : 'Confirmar asistencia'}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActivityRegistrationForm; 