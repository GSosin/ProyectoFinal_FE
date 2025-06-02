import useAuthStore, { isAdminSelector } from '../store/authStore';

export default function useIsAdmin() {
  return useAuthStore(isAdminSelector);
} 