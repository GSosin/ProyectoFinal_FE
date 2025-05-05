'use client';

import { useState } from 'react';
import { Card, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Form from '../../components/generics/form/Form';
import { authEndpoints } from '../../services/endpoints/auth';
import styles from '../Register.module.css';

const RegisterForm = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const fields = [
        {
            name: 'firstName',
            label: 'Nombre',
            type: 'text',
            required: true
        },
        {
            name: 'lastName',
            label: 'Apellido',
            type: 'text',
            required: true
        },
        {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true
        },
        {
            name: 'birthDate',
            label: 'Fecha de nacimiento',
            type: 'date',
            required: true
        },
        {
            name: 'phone',
            label: 'Teléfono',
            type: 'tel',
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
        firstName: {
            required: true,
            minLength: 2
        },
        lastName: {
            required: true,
            minLength: 2
        },
        email: {
            required: true,
            email: true
        },
        birthDate: {
            required: true
        },
        phone: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: 'El teléfono debe tener 10 dígitos'
        },
        password: {
            required: true,
            minLength: 6
        }
    };

    const handleSubmit = async (formData) => {
        const response = await authEndpoints.register(formData);
        
        localStorage.setItem('user', JSON.stringify({
            ...response.user,
            token: response.token
        }));

        router.push('/');
    };

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <Form
                    fields={fields}
                    onSubmit={handleSubmit}
                    submitButtonText="Registrarme"
                    validationSchema={validationSchema}
                />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Ya tienes una cuenta?{' '}
                    <Button 
                        variant="text" 
                        color="primary" 
                        onClick={() => router.push('/')}
                    >
                        Ingresa aqui
                    </Button>
                </Typography>
            </Card>
        </div>
    );
};

export default RegisterForm; 