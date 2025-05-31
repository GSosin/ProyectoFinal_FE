'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  TextField,
  Button,
  Alert,
  Typography,
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress
} from '@mui/material';
import { activityEndpoints } from '../../../services/endpoints/activities';
import { apiService } from '../../../services/api';
import dynamic from 'next/dynamic';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomAlert from '../../../components/generics/Alert/CustomAlert';

// Importaciones completamente dinámicas para evitar SSR
const NoSSR = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient ? children : null;
};

// Todos los componentes que causan errores de hidratación se cargan dinámicamente
const DynamicActivityImageEditor = dynamic(() => import('../../../components/ActivityImageEditor'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const DynamicDatePickers = dynamic(() => import('../../create/DynamicDatePickers'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const DynamicEditor = dynamic(() => import('../../create/DynamicEditor'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

export default function EditActivity() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id;

  // Estados para controlar el formulario
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    startDate: null,
    endDate: null,
    maxCapacity: '',
    locationId: '',
    images: [],
    description: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Clave para forzar reinicio de componentes después de enviar el formulario
  const [resetKey, setResetKey] = useState(0);

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categoryError, setCategoryError] = useState(null);

  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });
  const [locationError, setLocationError] = useState(null);

  // Cargar datos solo en el cliente
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      apiService.setToken(user.token);
      fetchData();
      fetchActivity();
    }
  }, [activityId]);

  // Función para cargar la actividad a editar
  const fetchActivity = async () => {
    try {
      setLoadingActivity(true);
      const activity = await activityEndpoints.getActivityById(activityId);
      
      setFormData({
        title: activity.title || '',
        categoryId: activity.categoryId || '',
        startDate: activity.startDate ? new Date(activity.startDate) : null,
        endDate: activity.endDate ? new Date(activity.endDate) : null,
        maxCapacity: activity.maxCapacity || '',
        locationId: activity.locationId || '',
        images: activity.images || [],
        description: activity.description || ''
      });
    } catch (err) {
      setError(err.message || 'Error al cargar la actividad');
    } finally {
      setLoadingActivity(false);
    }
  };

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
    setFormData(prev => ({ ...prev, description: content }));
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await activityEndpoints.updateActivity(activityId, formData);
      setSuccess(true);
      
      // Redirigir a la página de detalle después de 2 segundos
      setTimeout(() => {
        router.push(`/activities/${activityId}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar la actividad');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar la creación de una nueva categoría
  const handleCreateCategory = async () => {
    try {
      setCategoryError(null);
      const response = await activityEndpoints.createCategory(newCategory);
      setCategories(prev => [...prev, response]);
      setFormData(prev => ({ ...prev, categoryId: response.id }));
      setNewCategory({ name: '', description: '' });
      setOpenCategoryDialog(false);
    } catch (err) {
      setCategoryError(err.message || 'Error al crear la categoría');
    }
  };

  // Función para manejar la creación de una nueva ubicación
  const handleCreateLocation = async () => {
    try {
      setLocationError(null);
      const response = await activityEndpoints.createLocation(newLocation);
      setLocations(prev => [...prev, response]);
      setFormData(prev => ({ ...prev, locationId: response.id }));
      setNewLocation({ name: '', address: '' });
      setOpenLocationDialog(false);
    } catch (err) {
      setLocationError(err.message || 'Error al crear la ubicación');
    }
  };

  if (loadingActivity) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Actividad
        </Typography>

        <CustomAlert 
            message={error}
            onClose={() => setError(null)}
            open={!!error}
        />

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Actividad actualizada correctamente! Redirigiendo...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Título */}
          <TextField
            fullWidth
            label="Título de la actividad"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            sx={{ mb: 3 }}
          />

          {/* Editor de descripción */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Descripción
            </Typography>
            <NoSSR>
              <DynamicEditor 
                key={`editor-${resetKey}`}
                initialContent={formData.description}
                onChange={handleEditorChange}
              />
            </NoSSR>
          </Box>

          {/* Categoría */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 3, mb: 3 }}>
            <TextField
              select
              fullWidth
              label="Categoría"
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </TextField>
            <IconButton 
              color="primary" 
              onClick={() => setOpenCategoryDialog(true)}
              title="Agregar nueva categoría"
              sx={{ minWidth: 48, height: 48 }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Fechas */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Fechas
            </Typography>
            <NoSSR>
              <DynamicDatePickers 
                key={`dates-${resetKey}`}
                startDate={formData.startDate}
                endDate={formData.endDate}
                onStartDateChange={(date) => handleDateChange('startDate', date)}
                onEndDateChange={(date) => handleDateChange('endDate', date)}
              />
            </NoSSR>
          </Box>

          {/* Capacidad máxima */}
          <TextField
            fullWidth
            type="number"
            label="Capacidad máxima"
            value={formData.maxCapacity}
            onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) || '' }))}
            required
            inputProps={{ min: 1 }}
            sx={{ mt: 3, mb: 3 }}
          />

          {/* Ubicación */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
            <TextField
              select
              fullWidth
              label="Ubicación"
              value={formData.locationId}
              onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Selecciona una ubicación</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} - {location.address}
                </option>
              ))}
            </TextField>
            <IconButton 
              color="primary" 
              onClick={() => setOpenLocationDialog(true)}
              title="Agregar nueva ubicación"
              sx={{ minWidth: 48, height: 48 }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Subida de imágenes */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Imágenes
            </Typography>
            <NoSSR>
              <DynamicActivityImageEditor 
                key={`images-${resetKey}`}
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
              />
            </NoSSR>
          </Box>

          {/* Botones */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? 'Actualizando...' : 'Actualizar Actividad'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
          </Box>
        </Box>

        {/* Loading overlay */}
        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6">Actualizando actividad...</Typography>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Diálogos para crear categoría */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Crear Nueva Categoría</DialogTitle>
        <DialogContent>
          <CustomAlert 
              message={categoryError}
              onClose={() => setCategoryError(null)}
              open={!!categoryError}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newCategory.description}
            onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateCategory} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogos para crear ubicación */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)}>
        <DialogTitle>Crear Nueva Ubicación</DialogTitle>
        <DialogContent>
          <CustomAlert 
              message={locationError}
              onClose={() => setLocationError(null)}
              open={!!locationError}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={newLocation.name}
            onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Dirección"
            fullWidth
            variant="outlined"
            value={newLocation.address}
            onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationDialog(false)}>Cancelar</Button>
          <Button onClick={handleCreateLocation} variant="contained">Crear</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 