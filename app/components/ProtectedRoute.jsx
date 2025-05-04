'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { isLoggedIn, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        if (!isLoggedIn) {
            // Guardamos la ruta actual para redirigir después del login
            const currentPath = window.location.pathname;
            localStorage.setItem('redirectPath', currentPath);
            router.push('/');
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // o un loading spinner
    }

    return children;
};

export default ProtectedRoute; 