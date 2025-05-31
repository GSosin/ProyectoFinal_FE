'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthStore from '../../store/authStore';
import { Box, CircularProgress } from '@mui/material';
import CustomAlert from './Alert/CustomAlert';

const ROUTE_PERMISSIONS = {
    '/activities/create': ['manage_activities'],
    '/activities/[id]/edit': ['manage_activities'],
};

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoggedIn,  } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState('');
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            setIsChecking(true);
            const routePermissions = ROUTE_PERMISSIONS[pathname] || [];

            
            if (!isLoggedIn) {
                setErrorMessage('Debes iniciar sesión para acceder a esta página');
                localStorage.setItem('redirectPath', pathname);
                setShowLoginAlert(true);
                setIsChecking(false);
                return;
            }

            if (routePermissions.length > 0) {
                const userPermissions = user?.role?.permissions || [];
                const hasRequiredPermissions = routePermissions.every(permission => 
                    userPermissions.includes(permission)
                );

                if (!hasRequiredPermissions) {
                    router.replace('/unauthorized');
                    return;
                }
            }
            setIsChecking(false);
        };

        checkAccess();
    }, [isLoggedIn, user, pathname]);

    const handleCloseLoginAlert = () => {
        setShowLoginAlert(false);
        router.replace('/login');
    };

    if (isChecking) {
        return (
            <Box 
                sx={{ 
                    height: '100vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'background.default'
                }}
            >
                <CircularProgress size={60} thickness={4} />
            </Box>
        );
    }

    if (!isLoggedIn) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CustomAlert
                    message="Debes iniciar sesión para acceder a esta página"
                    onClose={handleCloseLoginAlert}
                    open={showLoginAlert}
                />
            </Box>
        );
    }

    return (
        <>
            <CustomAlert 
                message={errorMessage}
                onClose={() => setErrorMessage('')}
                open={!!errorMessage}
            />
            {children}
        </>
    );
};

export default ProtectedRoute; 