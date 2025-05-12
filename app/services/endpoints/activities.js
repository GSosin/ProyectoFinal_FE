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
    }
};
