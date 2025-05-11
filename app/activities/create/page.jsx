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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { es } from 'date-fns/locale';
import { activityEndpoints } from '../../services/endpoints/activities';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function CreateActivity() {
  // Estados para controlar el formulario
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    startDate: null,
    endDate: null,
    schedule: '',
    maxCapacity: '',
    locationId: '',
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Control de renderizado del lado del cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Editor de texto Tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
  });

  // Carga de datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          activityEndpoints.getCategories(),
          activityEndpoints.getLocations()
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (err) {
        setError('Error al cargar los datos iniciales');
      }
    };
    fetchData();
  }, []);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await activityEndpoints.createActivity({
        ...formData,
        description: editor ? editor.getHTML() : '',
      });
      setSuccess(true);
      // Resetear formulario
      setFormData({
        title: '',
        categoryId: '',
        startDate: null,
        endDate: null,
        schedule: '',
        maxCapacity: '',
        locationId: '',
        images: []
      });
      if (editor) editor.commands.setContent('');
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
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 1,
                minHeight: 150,
                mb: 2,
                background: 'white',
              }}
            >
              {isClient && editor && <EditorContent editor={editor} />}
            </Box>
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
                  {location.name}
                </option>
              ))}
            </TextField>
          </Box>

          {/* Fila: Fechas */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DateTimePicker
                label="Fecha de inicio *"
                value={formData.startDate}
                onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    required: true,
                    sx: { flex: 1, minWidth: '200px' }
                  } 
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DateTimePicker
                label="Fecha de fin *"
                value={formData.endDate}
                onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                slotProps={{ 
                  textField: { 
                    fullWidth: true, 
                    required: true,
                    sx: { flex: 1, minWidth: '200px' }
                  } 
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* Fila: Horario y Capacidad */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Horario *"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              required
              sx={{ flex: 1, minWidth: '200px' }}
            />

            <TextField
              type="number"
              label="Capacidad máxima *"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              required
              sx={{ flex: 1, minWidth: '200px' }}
            />
          </Box>

          {/* Imágenes */}
          <Box sx={{ mt: 1 }}>
            <Button
              component="label"
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Subir imágenes
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...files]
                  }));
                }}
              />
            </Button>
            {formData.images.length > 0 && (
              <Typography variant="body2" component="span">
                {formData.images.length} imagen(es) seleccionada(s)
              </Typography>
            )}
          </Box>

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