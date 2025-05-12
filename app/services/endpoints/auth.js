import {apiService} from '../api';
import {ApiError, handleApiError} from '../errorHandler';

export const authEndpoints = {
    async login(credentials) {
        try {
            return await apiService.post('/auth/login', credentials);
        } catch (error) {
            const handledError = handleApiError(error);
            throw new ApiError(handledError.message, handledError.status, handledError.data);
        }
    },

    async register(userData) {
        try {
            return await apiService.post('/auth/register', userData);
        } catch (error) {
            const handledError = handleApiError(error);
            console.log(handledError);
            throw new ApiError(handledError.message, handledError.status, handledError.data);
        }
    },

    async logout() {
        try {
            await apiService.post('/auth/logout');
            apiService.setToken(null);
        } catch (error) {
            apiService.setToken(null);
            const handledError = handleApiError(error);
            throw new ApiError(handledError.message, handledError.status, handledError.data);
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
            throw new ApiError(handledError.message, handledError.status, handledError.data);
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
            throw new ApiError(handledError.message, handledError.status, handledError.data);
        }
    }
};
