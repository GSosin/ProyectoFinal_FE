'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';
import useAuthStore from '../store/authStore';

const AdminPanel = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  // Si el usuario no es administrador, mostramos acceso denegado
  if (user && user.role.name !== 'Administrador') {
    if (typeof window !== 'undefined') {
      router.replace('/unauthorized');
    }
    return null;
  }

  return (
    <ProtectedRoute>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          Panel de Administración
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/activities/create')}
            >
              Crear Actividad
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push('/admin/enrollments')}
            >
              Ver Inscripciones
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/activities')}
            >
              Ver Todas las Actividades
            </Button>
          </Stack>
        </Paper>
      </Box>
    </ProtectedRoute>
  );
}

export default AdminPanel;