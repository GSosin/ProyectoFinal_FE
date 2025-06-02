export const getStatusColor = (status) => {
    switch (status) {
        case 'Programada':
            return 'info';
        case 'En curso':
            return 'info';
        case 'Completada':
            return 'success';
        case 'Cancelada':
            return 'error';
        default:
            return 'default';
    }
};

export const isActivityInProgress = (activity) => activity && activity.status === 'En curso';
export const isActivityCompleted = (activity) => activity && activity.status === 'Completada';
export const isActivityCancelled = (activity) => activity && activity.status === 'Cancelada';

export const getActivityStatusMessage = (activity) => {
    if (isActivityInProgress(activity)) return "No es posible inscribirse: la actividad está en curso";
    if (isActivityCompleted(activity)) return "No es posible inscribirse: la actividad ya ha finalizado";
    if (isActivityCancelled(activity)) return "No es posible inscribirse: la actividad ha sido cancelada";
    return "";
};

export const isRegistrationDisabled = (activity) => {
    return isActivityInProgress(activity) || 
           isActivityCompleted(activity) || 
           isActivityCancelled(activity);
}; 