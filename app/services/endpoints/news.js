import { apiService } from '../api';

export const newsEndpoints = {
    // Obtener todas las noticias
    getAllNews: async () => {
        try {
            const response = await apiService.get('/news');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener las noticias');
        }
    },

    // Obtener una noticia por ID
    getNewsById: async (id) => {
        try {
            const response = await apiService.get(`/news/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener la noticia');
        }
    },

    // Crear una nueva noticia
    createNews: async (newsData) => {
        try {
            const response = await apiService.post('/news', newsData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear la noticia');
        }
    },

    // Actualizar una noticia
    updateNews: async (id, newsData) => {
        try {
            const response = await apiService.put(`/news/${id}`, newsData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar la noticia');
        }
    },

    // Eliminar una noticia
    deleteNews: async (id) => {
        try {
            const response = await apiService.delete(`/news/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al eliminar la noticia');
        }
    }
}; 