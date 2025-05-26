import { apiService } from '../api';

export const activityEndpoints = {


    async getAllActivities() {
        try {
            const response = await apiService.get('/activities');
            return response;
        } catch (error) {
            console.error('Error al obtener actividades:', error);
            throw new Error(error || 'Error desconocido al obtener actividades');        }
    },

    async deleteActivity(id){
        try {
            const response = await apiService.delete(`/activities/${id}`);
            return response;
        } catch (error) {
            console.error('Error al eliminar la actividad:', error);
            throw new Error(
                error?.message || 'Error desconocido al eliminar la actividad'
            );
        }
    },

    async createActivity(activityData) {
        try {
            const response = await apiService.post('/activities', activityData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async getActivityById(id) {
        try {
            const response = await apiService.get(`/activities/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async updateActivity(id, activityData) {
        try {
            // Crear FormData para enviar datos con imágenes
            const formData = new FormData();
            
            // Agregar todos los campos básicos
            Object.keys(activityData).forEach(key => {
                if (key !== 'images' && activityData[key] !== null && activityData[key] !== undefined) {
                    if (key === 'startDate' || key === 'endDate') {
                        // Convertir fechas a ISO string
                        formData.append(key, activityData[key].toISOString());
                    } else {
                        formData.append(key, activityData[key]);
                    }
                }
            });

            // Agregar imágenes como JSON string
            if (activityData.images && Array.isArray(activityData.images)) {
                formData.append('images', JSON.stringify(activityData.images));
            }

            // Usar fetch directamente para enviar FormData
            const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${apiService.baseURL}/activities/${id}`, {
                method: 'PUT',
                headers,
                body: formData,
                credentials: 'include',
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al actualizar la actividad');
            }

            return await response.json();
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
