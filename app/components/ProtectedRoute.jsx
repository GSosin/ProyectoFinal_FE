import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { isLoggedIn, checkAuth } = useAuthStore();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        checkAuth();
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !isLoggedIn) {
            const currentPath = window.location.pathname;
            localStorage.setItem('redirectPath', currentPath);
            router.push('/login');
        }
    }, [hydrated, isLoggedIn]);

    if (!hydrated) {
        return null; // o un loading spinner
    }

    if (!isLoggedIn) {
        return null; // o un loading spinner
    }

    return children;
};

export default ProtectedRoute;