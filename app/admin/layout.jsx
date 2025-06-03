'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';
import { Box, CircularProgress } from '@mui/material';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthHydrated) {
      hydrateAuth();
    }
  }, [hydrateAuth, isAuthHydrated]);

  if (!isAuthHydrated) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: 'background.paper'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isLoggedIn) {
    router.replace('/login');
    return null;
  }

  if (user?.role?.name !== 'Administrador') {
    router.replace('/unauthorized');
    return null;
  }

  return (
    <Box sx={{ pt: 8 }}>
      {children}
    </Box>
  );
} 