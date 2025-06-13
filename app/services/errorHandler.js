export const handleApiError = (error) => {
    // Si viene de una respuesta de la API
    if (error.response) {
        const { status, data } = error.response;
        // Prioridad: data.error.message > data.message > mensaje por status
        let message =
            (data && data.error && data.error.message) ? data.error.message :
            (data && data.message) ? data.message :
            null;
        if (!message) {
            switch (status) {
                case 400: message = 'Datos inválidos'; break;
                case 401: message = 'No autorizado'; break;
                case 403: message = 'Sin permisos'; break;
                case 404: message = 'No encontrado'; break;
                case 409: message = 'Conflicto'; break;
                case 422: message = 'Error de validación'; break;
                case 500: message = 'Error interno del servidor'; break;
                default: message = 'Error desconocido';
            }
        }
        
        return {
            error: true,
            message,
            status,
            data: data || null
        };
    }
}; 