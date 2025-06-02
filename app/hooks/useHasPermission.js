import { useCallback } from 'react';
import useAuthStore, { selectUserPermissions } from '../store/authStore';

export default function useHasPermission(permission) {
  const permissions = useAuthStore(selectUserPermissions);

  const hasPermission = useCallback(() => {
    if (!permission) return false;
    return permissions.includes(permission);
  }, [permissions, permission]);

  return hasPermission();
} 