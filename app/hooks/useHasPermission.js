import { useMemo } from 'react';
import useAuthStore from '../store/authStore';
import { useShallow } from 'zustand/react/shallow';

// Create a stable selector outside the hook
const selectPermissions = (state) => {
  if (state.user?.role?.permissions) return state.user.role.permissions;
  return state.user?.permissions || [];
};

export default function useHasPermission(permission) {
  // Get permissions using shallow comparison
  const permissions = useAuthStore(
    useShallow(selectPermissions)
  );

  // Check if user has the required permission
  return useMemo(() => {
    if (!permission) return false;
    return permissions.includes(permission);
  }, [permission, permissions]);
} 