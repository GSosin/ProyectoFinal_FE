import { apiService } from '../api';

export const activityEndpoints = {
    async createActivity(activityData) {
        try {
            const response = await apiService.post('/activities', activityData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getCategories() {
        try {
            const timestamp = new Date().getTime();
            const response = await apiService.get(`/categories?_=${timestamp}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getLocations() {
        try {
            const response = await apiService.get('/locations');
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createCategory(categoryData) {
        try {
            const response = await apiService.post('/categories', categoryData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async createLocation(locationData) {
        try {
            const response = await apiService.post('/locations', locationData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateCategory(id, data) {
        try {
            const response = await apiService.put(`/categories/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteCategory(id) {
        try {
            const response = await apiService.delete(`/categories/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateLocation(id, data) {
        try {
            const response = await apiService.put(`/locations/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async deleteLocation(id) {
        try {
            const response = await apiService.delete(`/locations/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};
