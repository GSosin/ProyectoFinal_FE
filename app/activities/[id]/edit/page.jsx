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
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { activityEndpoints } from '../../../services/endpoints/activities';
import { apiService } from '../../../services/api';
import { storage } from '../../../config/firebase';
import { ref, deleteObject } from 'firebase/storage';
import dynamic from 'next/dynamic';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '../../../components/ProtectedRoute';
import 'suneditor/dist/css/suneditor.min.css';
import DeleteIcon from '@mui/icons-material/Delete';

const NoSSR = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  return isClient ? children : null;
};

const DynamicImageUpload = dynamic(() => import('../../../components/ImageUpload'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const DynamicDatePickers = dynamic(() => import('../../create/DynamicDatePickers'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando...</Box>
});

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

const editorOptions = {
  buttonList: [
    ['undo', 'redo'],
    ['font', 'fontSize', 'formatBlock'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['fontColor', 'hiliteColor'],
    ['removeFormat'],
    ['outdent', 'indent'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image'],
    ['fullScreen', 'showBlocks', 'codeView'],
    ['preview']
  ],
  height: '400px',
  placeholder: 'Escribe el contenido de la noticia aquí...',
  defaultStyle: 'font-family: Arial, sans-serif; font-size: 14px;'
};

export default function EditActivity() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id;

  // Estados
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
  const [resetKey, setResetKey] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Estados para diálogos
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });
  const [categoryError, setCategoryError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const initializeData = async () => {
      try {
    const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/login');
          return;
        }

      const user = JSON.parse(userStr);
      apiService.setToken(user.token);

        // Cargar datos en paralelo
        const [activity, categoriesData, locationsData] = await Promise.all([
          activityEndpoints.getActivityById(activityId),
        activityEndpoints.getCategories(),
        activityEndpoints.getLocations()
      ]);
      
        // Actualizar estados
        setFormData({
          title: activity.title,
          categoryId: activity.categoryId,
          startDate: new Date(activity.startDate),
          endDate: new Date(activity.endDate),
          maxCapacity: activity.maxCapacity,
          locationId: activity.locationId,
          images: activity.images || [],
          description: activity.description || ''
        });

        setCategories(categoriesData);
        setLocations(locationsData);
    } catch (err) {
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoadingActivity(false);
    }
  };

    initializeData();
  }, [activityId, router]);

  // Manejadores de eventos
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setImageError(null);

    if (formData.images.length === 0) {
      setImageError('Debes subir al menos una imagen.');
      setLoading(false);
      return;
    }

    try {
      // Eliminar de Firebase todas las imágenes marcadas para eliminar
      for (const image of imagesToDelete) {
        const storagePath = image.url.split('/o/')[1]?.split('?')[0];
        if (storagePath) {
          const decodedPath = decodeURIComponent(storagePath);
          const imageRef = ref(storage, decodedPath);
          await deleteObject(imageRef);
        }
      }
      setImagesToDelete([]);
      await activityEndpoints.updateActivity(activityId, formData);
      setSuccess(true);
      setTimeout(() => router.push(`/activities/${activityId}`), 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      setCategoryError(null);
      const response = await activityEndpoints.createCategory(newCategory);
      setCategories(prev => [...prev, response]);
      handleInputChange('categoryId', response.id);
      setNewCategory({ name: '', description: '' });
      setOpenCategoryDialog(false);
    } catch (err) {
      setCategoryError(err.message || 'Error al crear la categoría');
    }
  };

  const handleCreateLocation = async () => {
    try {
      setLocationError(null);
      const response = await activityEndpoints.createLocation(newLocation);
      setLocations(prev => [...prev, response]);
      handleInputChange('locationId', response.id);
      setNewLocation({ name: '', address: '' });
      setOpenLocationDialog(false);
    } catch (err) {
      setLocationError(err.message || 'Error al crear la ubicación');
    }
  };

  const handleDeleteImage = (imageId) => {
    const imageToDelete = formData.images.find(img => img.id === imageId);
    if (imageToDelete) {
      setImagesToDelete(prev => [...prev, imageToDelete]);
      let newImages = formData.images.filter(img => img.id !== imageId);
      // Si la imagen eliminada era la principal y quedan otras, la primera pasa a ser principal
      if (imageToDelete.main && newImages.length > 0) {
        newImages = newImages.map((img, idx) => ({ ...img, main: idx === 0 }));
      }
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
      setOpenImageDialog(false);
      setSelectedImage(null);
    }
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setOpenImageDialog(true);
  };

  if (loadingActivity) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ProtectedRoute>
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Editar Actividad
        </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>¡Actividad actualizada correctamente!</Alert>}
          {imageError && <Alert severity="error" sx={{ mb: 2 }}>{imageError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
              label="Título *"
            value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            required
              fullWidth
              variant="outlined"
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>Descripción</Typography>
              <SunEditor
                onChange={(content) => handleInputChange('description', content)}
                setContents={formData.description}
                setOptions={editorOptions}
              />
          </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: '200px', display: 'flex', gap: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
              label="Categoría"
                  >
              {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                  {category.name}
                      </MenuItem>
              ))}
                  </Select>
                </FormControl>
            <IconButton 
              onClick={() => setOpenCategoryDialog(true)}
                  sx={{ 
                    alignSelf: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
            >
                  <SettingsIcon />
            </IconButton>
          </Box>

              <Box sx={{ flex: 1, minWidth: '200px', display: 'flex', gap: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Ubicación</InputLabel>
                  <Select
                    value={formData.locationId}
                    onChange={(e) => handleInputChange('locationId', e.target.value)}
                    label="Ubicación"
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.name} | {location.address}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton 
                  onClick={() => setOpenLocationDialog(true)}
                  sx={{ 
                    alignSelf: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Box>

            <NoSSR>
              <DynamicDatePickers 
                key={`dates-${resetKey}`}
                startDate={formData.startDate}
                endDate={formData.endDate}
                onStartDateChange={(date) => handleInputChange('startDate', date)}
                onEndDateChange={(date) => handleInputChange('endDate', date)}
              />
            </NoSSR>

            <TextField
              type="number"
              label="Capacidad máxima *"
              value={formData.maxCapacity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                  handleInputChange('maxCapacity', value);
                }
              }}
              required
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />

            <NoSSR>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="subtitle1">Imágenes</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {formData.images.map((image) => (
                    <Box
                      key={image.id}
                      sx={{
                        position: 'relative',
                        width: 150,
                        height: 150,
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid #ddd'
                      }}
                    >
                      <img
                        src={image.url}
                        alt="Imagen de actividad"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
            <IconButton 
                        onClick={() => handleDeleteImage(image.id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          '&:hover': {
                            bgcolor: 'error.main',
                            color: 'white'
                          }
                        }}
                        size="small"
            >
                        <DeleteIcon />
            </IconButton>
                      {image.main && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            p: 0.5,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="caption">Imagen Principal</Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
          </Box>
                <DynamicImageUpload 
                  key={`upload-${resetKey}`}
                  onImagesUploaded={(images) => handleInputChange('images', images)}
                  initialImages={formData.images}
                />
              </Box>
            </NoSSR>

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
              {loading ? 'Actualizando...' : 'Actualizar Actividad'}
            </Button>
          </Box>
        </Paper>

        {/* Diálogo para ver/eliminar imagen */}
        <Dialog 
          open={openImageDialog} 
          onClose={() => {
            setOpenImageDialog(false);
            setSelectedImage(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedImage?.main ? 'Imagen Principal' : 'Imagen de Actividad'}
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <img
                  src={selectedImage.url}
                  alt="Imagen de actividad"
                  style={{
                    width: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain'
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedImage.main ? 'Esta es la imagen principal de la actividad' : 'Puedes eliminar esta imagen si lo deseas'}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenImageDialog(false);
                setSelectedImage(null);
              }}
            >
              Cerrar
            </Button>
            {!selectedImage?.main && (
              <Button 
                onClick={() => handleDeleteImage(selectedImage.id)}
                color="error"
                variant="contained"
              >
                Eliminar Imagen
              </Button>
        )}
          </DialogActions>
        </Dialog>

        {/* Diálogo para crear categoría */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Crear Nueva Categoría</DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
                label="Nombre de la categoría"
            value={newCategory.name}
            onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
          />
          <TextField
            label="Descripción"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
              {categoryError && <Alert severity="error" sx={{ mt: 1 }}>{categoryError}</Alert>}
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleCreateCategory}
              variant="contained"
              disabled={!newCategory.name.trim()}
            >
              Crear
            </Button>
        </DialogActions>
      </Dialog>

        {/* Diálogo para crear ubicación */}
      <Dialog open={openLocationDialog} onClose={() => setOpenLocationDialog(false)}>
        <DialogTitle>Crear Nueva Ubicación</DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
                label="Nombre de la ubicación"
            value={newLocation.name}
            onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
          />
          <TextField
            label="Dirección"
            value={newLocation.address}
            onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                fullWidth
                multiline
                rows={3}
          />
              {locationError && <Alert severity="error" sx={{ mt: 1 }}>{locationError}</Alert>}
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleCreateLocation}
              variant="contained"
              disabled={!newLocation.name.trim() || !newLocation.address.trim()}
            >
              Crear
            </Button>
        </DialogActions>
      </Dialog>

        {/* Modal de carga */}
        <Dialog open={loading} PaperProps={{ sx: { textAlign: 'center', p: 4 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Actualizando actividad...</Typography>
          </Box>
        </Dialog>
    </Container>
    </ProtectedRoute>
  );
} 