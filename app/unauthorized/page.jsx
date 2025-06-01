'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h3" color="error" gutterBottom>
        Acceso denegado
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        No tienes permisos para acceder a esta sección.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/')}>Ir al inicio</Button>
    </Box>
  );
} 