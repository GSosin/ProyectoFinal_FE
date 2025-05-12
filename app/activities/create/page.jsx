'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
  Container
} from '@mui/material';
import { activityEndpoints } from '../../services/endpoints/activities';
import { apiService } from '../../services/api';
import dynamic from 'next/dynamic';

// Importaciones completamente dinámicas para evitar SSR
const NoSSR = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient ? children : null;
};

// Todos los componentes que causan errores de hidratación se cargan dinámicamente
const DynamicImageUpload = dynamic(() => import('../../components/ImageUpload'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const DynamicDatePickers = dynamic(() => import('./DynamicDatePickers'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const DynamicEditor = dynamic(() => import('./DynamicEditor'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

export default function CreateActivity() {
  // Estados para controlar el formulario
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    startDate: null,
    endDate: null,
    maxCapacity: '',
    locationId: '',
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Clave para forzar reinicio de componentes después de enviar el formulario
  const [resetKey, setResetKey] = useState(0);

  // Cargar datos solo en el cliente
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      apiService.setToken(user.token);
      fetchData();
    }
  }, []);

  // Función para cargar categorías y ubicaciones
  const fetchData = async () => {
    try {
      const [categoriesData, locationsData] = await Promise.all([
        activityEndpoints.getCategories(),
        activityEndpoints.getLocations()
      ]);
      
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      }
      
      if (Array.isArray(locationsData)) {
        setLocations(locationsData);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos iniciales');
    }
  };

  // Actualizar fechas
  const handleDateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Actualizar descripción
  const handleEditorChange = (content) => {
    // Solo guardamos la referencia al HTML, no el editor completo
    formData.description = content;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await activityEndpoints.createActivity(formData);
      setSuccess(true);
      
      // Resetear formulario
      setFormData({
        title: '',
        categoryId: '',
        startDate: null,
        endDate: null,
        maxCapacity: '',
        locationId: '',
        images: [],
        description: ''
      });
      
      // Forzar reinicio de componentes dinámicos
      setResetKey(prev => prev + 1);
      
      // Ocultar mensaje de éxito después de 4 segundos
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message || 'Error al crear la actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Crear Nueva Actividad
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Actividad creada correctamente!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Título */}
          <TextField
            label="Título *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
            variant="outlined"
          />

          {/* Descripción */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Descripción
            </Typography>
            <NoSSR>
              <DynamicEditor 
                key={`editor-${resetKey}`}
                onChange={handleEditorChange}
              />
            </NoSSR>
          </Box>

          {/* Fila: Categoría y Ubicación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Categoría *"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              sx={{ flex: 1, minWidth: '200px' }}
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </TextField>

            <TextField
              select
              label="Ubicación *"
              value={formData.locationId}
              onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
              required
              sx={{ flex: 1, minWidth: '200px' }}
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.address} | {location.name}
                </option>
              ))}
            </TextField>
          </Box>

          {/* Fila: Fechas */}
          <NoSSR>
            <DynamicDatePickers 
              key={`dates-${resetKey}`}
              startDate={formData.startDate}
              endDate={formData.endDate}
              onStartDateChange={(date) => handleDateChange('startDate', date)}
              onEndDateChange={(date) => handleDateChange('endDate', date)}
            />
          </NoSSR>

          {/* Fila: Capacidad */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              type="number"
              label="Capacidad máxima *"
              value={formData.maxCapacity}
              onChange={(e) => {
                const value = e.target.value;
                // Solo permitir números enteros positivos
                if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                  setFormData({ ...formData, maxCapacity: value });
                }
              }}
              required
              fullWidth
              inputProps={{
                min: 1,
                step: 1
              }}
            />
          </Box>

          <NoSSR>
            <DynamicImageUpload 
              key={`upload-${resetKey}`}
              onImagesUploaded={(images) => {
                setFormData(prev => ({ ...prev, images }));
              }}
            />
          </NoSSR>

          {/* Botón de envío */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 2, 
              py: 1.5,
              textTransform: 'uppercase',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creando...' : 'Crear Actividad'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}