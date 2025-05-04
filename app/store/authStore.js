import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    user: null,
    token: null,
    
    login: (userData, token) => {
        localStorage.setItem('user', JSON.stringify({ ...userData, token }));
        set({ isLoggedIn: true, user: userData, token });
    },
    
    logout: () => {
        localStorage.removeItem('user');
        set({ isLoggedIn: false, user: null, token: null });
    },
    
    checkAuth: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { token, ...userData } = JSON.parse(storedUser);
            set({ isLoggedIn: true, user: userData, token });
        } else {
            set({ isLoggedIn: false, user: null, token: null });
        }
    }
}));

export default useAuthStore; 