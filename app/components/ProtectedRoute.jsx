import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, requiredRole, requiredPermissions = [] }) => {
    const router = useRouter();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const isHydrated = useAuthStore((state) => state.isHydrated);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        if (!isLoggedIn) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('redirectPath', window.location.pathname);
            }
            router.replace('/login');
            return;
        }

        if (requiredRole && user?.role?.name !== requiredRole) {
            router.replace('/unauthorized');
            return;
        }

        if (
            requiredPermissions.length > 0 &&
            !requiredPermissions.some(permission => {
                return user?.role.permissions.some(p => p === permission)
            })
        ) {
            router.replace('/unauthorized');
        }
    }, [isHydrated, isLoggedIn, user, requiredRole, requiredPermissions, router]);


    if (!isHydrated) {
        return <div>Verificando sesión...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    if (requiredRole && user?.role?.name !== requiredRole) {
        return null;
    }
    if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.some(permission => {
            return user?.role.permissions.some(p => p === permission)
        })
    ) {
        return null;
    }

    return children;
};

export default ProtectedRoute; 