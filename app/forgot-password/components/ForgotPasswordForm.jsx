'use client';

import { useState } from 'react';
import { Card, Button, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import Form from '../../components/generics/form/Form';
import { authEndpoints } from '../../services/endpoints/auth';
import styles from '../../login/Login.module.css';

const ForgotPasswordForm = () => {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const fields = [
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true
        }
    ];

    const validationSchema = {
        email: {
            required: true,
            email: true
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const response = await authEndpoints.requestPasswordReset(formData.email);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error?.message || 'Ocurrió un error al intentar recuperar la contraseña');
            }
        } catch (error) {
            setError(error.message || 'Ocurrió un error al intentar recuperar la contraseña');
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Recuperar Contraseña
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success ? (
                    <>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Se ha enviado un correo electrónico con las instrucciones para recuperar tu contraseña.
                        </Alert>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth
                            onClick={() => router.push('/login')}
                        >
                            Volver al inicio de sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
                        </Typography>
                        <Form
                            fields={fields}
                            onSubmit={handleSubmit}
                            submitButtonText="Enviar instrucciones"
                            validationSchema={validationSchema}
                        />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <Button 
                                variant="text" 
                                color="primary" 
                                onClick={() => router.push('/login')}
                            >
                                Volver al inicio de sesión
                            </Button>
                        </Typography>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordForm; 