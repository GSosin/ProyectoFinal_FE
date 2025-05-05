import { apiService } from '../api';

export const authEndpoints = {
    async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);
            return response;
        } catch (error) {
            if (error.status === 401) {
                throw new Error('Email o contraseña incorrectos');
            }
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await apiService.post('/auth/register', userData);
            return response;
        } catch (error) {
            if (error.status === 409) {
                throw new Error('El email ya está registrado');
            }
            if (error.status === 422) {
                throw new Error('Datos de registro inválidos');
            }
            throw error;
        }
    },

    async logout() {
        try {
            await apiService.post('/auth/logout');
            apiService.setToken(null);
        } catch (error) {
            // Si hay un error en el logout, igual limpiamos el token
            apiService.setToken(null);
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await apiService.get('/auth/me');
            return response;
        } catch (error) {
            if (error.status === 401) {
                apiService.setToken(null);
            }
            throw error;
        }
    },

    async refreshToken() {
        try {
            const response = await apiService.post('/auth/refresh-token');
            return response;
        } catch (error) {
            if (error.status === 401) {
                apiService.setToken(null);
            }
            throw error;
        }
    }
}; 