'use client';

import { useState } from 'react';
import { TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Alert, Button, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Form = ({ 
    fields, 
    onSubmit, 
    submitButtonText = 'Enviar',
    initialValues = {},
    validationSchema = {}
}) => {
    const [formData, setFormData] = useState(() => {
        const initialData = {};
        fields.forEach(field => {
            initialData[field.name] = initialValues[field.name] || '';
        });
        return initialData;
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        const fieldValidation = validationSchema[name];
        if (!fieldValidation) return '';

        if (fieldValidation.required && !value) {
            return 'Este campo es requerido';
        }

        if (fieldValidation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Email inválido';
        }

        if (fieldValidation.minLength && value.length < fieldValidation.minLength) {
            return `Mínimo ${fieldValidation.minLength} caracteres`;
        }

        if (fieldValidation.pattern && !fieldValidation.pattern.test(value)) {
            return fieldValidation.message || 'Formato inválido';
        }

        return '';
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        fields.forEach(field => {
            const error = validateField(field.name, formData[field.name]);
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validación en tiempo real
        if (errors[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                form: error.message || 'Error al procesar el formulario'
            }));
        } finally {
            setLoading(false);
        }
    };

    const renderField = (field) => {
        const error = errors[field.name];
        const commonProps = {
            name: field.name,
            value: formData[field.name],
            onChange: handleChange,
            error: !!error,
            helperText: error,
            fullWidth: true,
            required: field.required,
            ...field.props
        };

        switch (field.type) {
            case 'password':
                return (
                    <FormControl variant="outlined" fullWidth error={!!error}>
                        <InputLabel htmlFor={`outlined-adornment-${field.name}`}>
                            {field.label}
                        </InputLabel>
                        <OutlinedInput
                            {...commonProps}
                            id={`outlined-adornment-${field.name}`}
                            type={field.showPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => field.setShowPassword(!field.showPassword)}
                                        edge="end"
                                    >
                                        {field.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label={field.label}
                        />
                        {error && <FormHelperText error>{error}</FormHelperText>}
                    </FormControl>
                );
            case 'date':
                return (
                    <TextField
                        {...commonProps}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                );
            default:
                return (
                    <TextField
                        {...commonProps}
                        type={field.type || 'text'}
                        label={field.label}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.form && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.form}
                </Alert>
            )}
            
            {fields.map((field, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                    {renderField(field)}
                </div>
            ))}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>{submitButtonText}</Button>
        </form>
    );
};

export default Form; 