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
    Alert,
    CircularProgress,
    TextField
} from '@mui/material';
import { apiService } from '../../../services/api';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../../store/authStore';

const ActivityRegistrationForm = ({ activity, open, onClose, onSuccess }) => {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState('');

    console.log(user);

    const handleActivityRegistration = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiService.post(`/activities/${activity.id}/register`, { comments });
            onSuccess?.();
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Error al inscribirse en la actividad');
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToRegister = () => {
        onClose();
        router.push('/register');
    };

    if (!user) {
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
                        ¿{user.firstName}, deseas confirmar tu asistencia a la actividad "{activity.title}"?
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

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
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