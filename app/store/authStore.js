import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  isHydrated: false, // Estado para rastrear si la carga desde localStorage se ha intentado

  hydrate: () => {
    // Asegurarse de que solo se ejecute una vez y en el cliente
    if (get().isHydrated || typeof window === 'undefined') {
      if (typeof window === 'undefined') set({ isHydrated: true }); // Marcar como hidratado en SSR
      return;
    }
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const { token, ...userData } = JSON.parse(storedUser);
        set({ isLoggedIn: true, user: userData, token, isHydrated: true });
      } else {
        set({ isLoggedIn: false, user: null, token: null, isHydrated: true });
      }
    } catch (error) {
      console.error("Error hydrating authStore:", error);
      localStorage.removeItem('user'); // Limpiar si está corrupto
      set({ isLoggedIn: false, user: null, token: null, isHydrated: true });
    }
  },

  login: (userData, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify({ ...userData, token }));
    }
    // Asegurar que isHydrated sea true después del login, aunque ya debería estarlo.
    set({ isLoggedIn: true, user: userData, token, isHydrated: true }); 
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    set({ isLoggedIn: false, user: null, token: null });
  },
}));

// Hidratar el store automáticamente al inicializarse en el cliente
if (typeof window !== 'undefined') {
  // Intentar hidratar inmediatamente
  useAuthStore.getState().hydrate();
  
  // También hidratar cuando la ventana obtiene el foco
  window.addEventListener('focus', () => {
    useAuthStore.getState().hydrate();
  });
}

export default useAuthStore;

export const selectUserPermissions = (state) => {
  if (state.user?.role?.permissions) return state.user.role.permissions;
  return state.user?.permissions || [];
};

export const isAdminSelector = (state) => state.user?.role?.name === 'Administrador'; 