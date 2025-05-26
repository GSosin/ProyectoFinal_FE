'use client';

import { useRouter } from 'next/navigation';
import { Typography, Box, Container, Paper, Button } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ProtectedRoute from '../components/ProtectedRoute';
import styles from './Welcome.module.css';

const WelcomeContent = () => {
    const router = useRouter();

    const handleStart = () => {
        router.push('/activities/viewAll');
    };

    return (
        <Container maxWidth="md" className={styles.container}>
            <Paper elevation={3} className={styles.paper}>
                <Box className={styles.content}>
                    <CelebrationIcon className={styles.icon} />
                    
                    <Typography variant="h3" component="h1" className={styles.title}>
                        ¡Bienvenido a las Actividades de Israel Hatzeira!
                    </Typography>

                    <Typography variant="h5" component="h2" className={styles.subtitle}>
                        Estamos emocionados de tenerte con nosotros
                    </Typography>

                    <Typography variant="body1" className={styles.description}>
                        Ahora puedes explorar todas las actividades disponibles, 
                        inscribirte en las que más te interesen y ser parte de 
                        nuestra comunidad activa.
                    </Typography>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleStart}
                        className={styles.button}
                    >
                        Ver Actividades
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default function Welcome() {
    return (
        <ProtectedRoute>
            <WelcomeContent />
        </ProtectedRoute>
    );
} 