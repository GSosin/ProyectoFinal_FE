'use client';

import { useEffect } from 'react';
import Login from './login/page';
import Welcome from './welcome/page';
import useAuthStore from './store/authStore';

export default function Home() {
    const { isLoggedIn, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return isLoggedIn ? <Welcome /> : <Login />;
} 