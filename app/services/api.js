import { handleApiError } from './errorHandler';
import useAuthStore from '../store/authStore';
import {ApiError } from '../assets/ApiErrorTemplate';

//const BASE_URL = 'https://israel-hatzeira.onrender.com/api';
export const BASE_URL = 'http://localhost:4455/api';

class ApiService {
    constructor() {
        this.baseURL = BASE_URL;
    }

    getToken() {
        const { token } = useAuthStore.getState();

        return token;
    }

    setToken(token) {
        this.token = token;
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        try {

            const headers = this.getHeaders();

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
                credentials: 'include',
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Handle 403 Forbidden response
                if (response.status === 403) {
                    // Clear token and trigger logout
                    this.setToken(null);
                    const authStore = useAuthStore.getState();
                    authStore.logout();
                    // Redirect to login page
                    window.location.href = '/login';
                }

                throw new ApiError(
                    errorData.message || 'Error en la petición',
                    response.status,
                    errorData
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(
                'Error de conexión',
                error.status || -1,
                error.data || null
            );
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'GET',
        });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService(); 