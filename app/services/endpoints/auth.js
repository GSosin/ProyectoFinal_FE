import {apiService} from '../api';
import {handleApiError} from '../errorHandler';

export const authEndpoints = {
    async login(credentials) {
        try {
            return await apiService.post('/auth/login', credentials);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async register(userData) {
        try {
            return await apiService.post('/auth/register', userData);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async logout() {
        try {
            await apiService.post('/auth/logout');
            apiService.setToken(null);
        } catch (error) {
            apiService.setToken(null);
            throw handleApiError(error);
        }
    },

    async getCurrentUser() {
        try {
            return await apiService.get('/auth/me');
        } catch (error) {
            const handledError = handleApiError(error);
            if (handledError.status === 401) {
                apiService.setToken(null);
            }
            throw handledError;
        }
    },

    async refreshToken() {
        try {
            return await apiService.post('/auth/refresh-token');
        } catch (error) {
            const handledError = handleApiError(error);
            if (handledError.status === 401) {
                apiService.setToken(null);
            }
            throw handledError;
        }
    },
    async requestPasswordReset(email) {
        try {
            return await apiService.post('/auth/forgot-password', { email });
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async resetPassword(token, newPassword) {
        try {
            return await apiService.post('/auth/reset-password', { token, newPassword });
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
