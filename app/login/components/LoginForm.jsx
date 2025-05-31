'use client';

import { useState } from 'react';
import { Card, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Form from '../../components/generics/form/Form';
import { authEndpoints } from '../../services/endpoints/auth';
import useAuthStore from '../../store/authStore';
import CustomAlert from '../../components/generics/Alert/CustomAlert';
import styles from '../Login.module.css';

const LoginForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const login = useAuthStore(state => state.login);

    const fields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true
        },
        {
            name: 'password',
            label: 'Contraseña',
            type: 'password',
            required: true,
            showPassword,
            setShowPassword
        }
    ];

    const validationSchema = {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minLength: 6
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const response = await authEndpoints.login(formData);
            
            // Usamos el store para manejar el login
            login(response.user, response.token);

            // Obtenemos la ruta de redirección guardada
            const redirectPath = localStorage.getItem('redirectPath') || '/welcome';
            localStorage.removeItem('redirectPath'); // Limpiamos la ruta guardada
            
            // Redirigimos al usuario
            router.push(redirectPath);
        } catch (error) {
            setError(error.message || 'Ocurrió un error al intentar iniciar sesión');
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CustomAlert 
                    message={error}
                    onClose={() => setError(null)}
                    open={!!error}
                />
                <Form
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText="Ingresar"
                    validationSchema={validationSchema}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Todavía no tienes una cuenta?{' '}
                    <Button 
                        variant="text" 
                        color="primary" 
                        onClick={() => router.push('/register')}
                    >
                        Registrate aqui
                    </Button>
                </Typography>
            </Card>
        </div>
    );
};

export default LoginForm; 