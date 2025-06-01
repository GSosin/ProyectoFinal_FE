'use client';

import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AdminLayout({ children }) {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const isAuthHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthHydrated) {
      hydrateAuth();
    }
  }, [hydrateAuth, isAuthHydrated]);

  if (!isAuthHydrated) {
    return <div>Cargando sesión...</div>;
  }

  return (
    <ProtectedRoute requiredRole="Administrador">
      {children}
    </ProtectedRoute>
  );
} 