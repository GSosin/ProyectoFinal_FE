'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Typography, Alert } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Form from '../../components/generics/form/Form';
import { authEndpoints } from '../../services/endpoints/auth';
import styles from '../../login/Login.module.css';

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        }
    }, [token, router]);

    const fields = [
        {
            name: 'newPassword',
            label: 'Nueva Contraseña',
            type: 'password',
            required: true,
            showPassword,
            setShowPassword
        },
        {
            name: 'confirmPassword',
            label: 'Confirmar Contraseña',
            type: 'password',
            required: true,
            showPassword: showConfirmPassword,
            setShowPassword: setShowConfirmPassword
        }
    ];

    const validationSchema = {
        newPassword: {
            required: true,
            minLength: 6
        },
        confirmPassword: {
            required: true,
            minLength: 6,
            match: 'newPassword'
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const response = await authEndpoints.resetPassword(token, formData.newPassword);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error?.message || 'Ocurrió un error al intentar restablecer la contraseña');
            }
        } catch (error) {
            setError(error.message || 'Ocurrió un error al intentar restablecer la contraseña');
        }
    };

    if (!token) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Restablecer Contraseña
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success ? (
                    <>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Tu contraseña ha sido restablecida exitosamente.
                        </Alert>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={() => router.push('/login')}
                        >
                            Ir al inicio de sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Ingresa tu nueva contraseña.
                        </Typography>
                        <Form
                            fields={fields}
                            onSubmit={handleSubmit}
                            submitButtonText="Restablecer contraseña"
                            validationSchema={validationSchema}
                        />
                    </>
                )}
            </Card>
        </div>
    );
};

export default ResetPasswordForm; 