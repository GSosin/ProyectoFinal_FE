'use client';

import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function Unauthorized() {
    const router = useRouter();

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 3
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
                
                <Typography variant="h4" component="h1" gutterBottom>
                    Acceso No Autorizado
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    No tienes los permisos necesarios para acceder a esta página.
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => router.push('/')}
                    sx={{ 
                        px: 4,
                        py: 1.5,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    Volver al inicio
                </Button>
            </Box>
        </Container>
    );
} 