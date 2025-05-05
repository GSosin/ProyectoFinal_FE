export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export const handleApiError = (error) => {
    if (error instanceof ApiError) {
        return {
            error: true,
            message: error.message,
            status: error.status,
            data: error.data
        };
    }

    if (error.response) {
        // Error de la API con respuesta
        const { status, data } = error.response;
        let message = 'Ocurrió un error en la solicitud';

        switch (status) {
            case 400:
                message = data.message || 'Datos inválidos';
                break;
            case 401:
                message = 'No autorizado. Por favor, inicia sesión nuevamente';
                break;
            case 403:
                message = 'No tienes permisos para realizar esta acción';
                break;
            case 404:
                message = 'Recurso no encontrado';
                break;
            case 409:
                message = 'Conflicto con el estado actual del recurso';
                break;
            case 422:
                message = 'Error de validación';
                break;
            case 500:
                message = 'Error interno del servidor';
                break;
            default:
                message = 'Error desconocido';
        }

        return {
            error: true,
            message,
            status,
            data: data || null
        };
    }

    if (error.request) {
        // Error de red o timeout
        return {
            error: true,
            message: 'Error de conexión. Por favor, verifica tu conexión a internet',
            status: 0,
            data: null
        };
    }

    // Error inesperado
    return {
        error: true,
        message: 'Ocurrió un error inesperado',
        status: -1,
        data: null
    };
}; 