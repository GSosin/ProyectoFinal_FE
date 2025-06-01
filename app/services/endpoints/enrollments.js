import { apiService } from '../api';

export const enrollmentEndpoints = {
    // Obtener todas las inscripciones
    getAllEnrollments: async () => {
        try {
            const response = await apiService.get('/enrollments');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener las inscripciones');
        }
    },
/*
    // Obtener una inscripción por ID
    getEnrollmentById: async (id) => {
        try {
            const response = await apiService.get(`/enrollments/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener la inscripción');
        }
    },

    // Crear una nueva inscripción
    createEnrollment: async (enrollmentData) => {
        try {
            const response = await apiService.post('/enrollments', enrollmentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al crear la inscripción');
        }
    },

    // Actualizar el estado de una inscripción
    updateEnrollmentStatus: async (id, status) => {
        try {
            const response = await apiService.patch(`/enrollments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar el estado de la inscripción');
        }
    },

    // Actualizar una inscripción
    updateEnrollment: async (id, enrollmentData) => {
        try {
            const response = await apiService.put(`/enrollments/${id}`, enrollmentData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al actualizar la inscripción');
        }
    },

    // Eliminar una inscripción
    deleteEnrollment: async (id) => {
        try {
            const response = await apiService.delete(`/enrollments/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al eliminar la inscripción');
        }
    },

    // Obtener inscripciones por actividad
    getEnrollmentsByActivity: async (activityId) => {
        try {
            const response = await apiService.get(`/activities/${activityId}/enrollments`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener las inscripciones de la actividad');
        }
    },

    // Obtener inscripciones por usuario
    getEnrollmentsByUser: async (userId) => {
        try {
            const response = await apiService.get(`/users/${userId}/enrollments`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Error al obtener las inscripciones del usuario');
        }
    },
    */
}; 