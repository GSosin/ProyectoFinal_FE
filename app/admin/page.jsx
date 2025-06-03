'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import { useState, useEffect } from 'react';

const Admin = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Panel de Administración
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleNavigation('/activities/create')}
            fullWidth
          >
            Crear Actividad
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleNavigation('/admin/enrollments')}
            fullWidth
          >
            Ver Inscripciones
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleNavigation('/activities')}
            fullWidth
          >
            Ver Todas las Actividades
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Admin;