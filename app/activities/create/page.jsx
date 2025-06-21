'use client';

import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { activityEndpoints } from '../../services/endpoints/activities';
import { apiService } from '../../services/api';
import dynamic from 'next/dynamic';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import 'suneditor/dist/css/suneditor.min.css';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';

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

const  SunEditor  =  dynamic ( ( )  =>  import ( "suneditor-react" ) ,  { 
  ssr : false , 
} ) ;

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
export default function CreateActivityPage(props) {
  // Estados para controlar el formulario
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    startDate: null,
    endDate: null,
    maxCapacity: '',
    locationId: '',
    images: [],
    teacherId: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  // Clave para forzar reinicio de componentes después de enviar el formulario
  const [resetKey, setResetKey] = useState(0);

  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categoryError, setCategoryError] = useState(null);

  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: '', address: '' });
  const [locationError, setLocationError] = useState(null);

  const [openCategoryManager, setOpenCategoryManager] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({ name: '', description: '' });
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteCategoryError, setDeleteCategoryError] = useState(null);
  const [categoryManagerError, setCategoryManagerError] = useState(null);

  const [openLocationManager, setOpenLocationManager] = useState(false);
  const [editLocationId, setEditLocationId] = useState(null);
  const [editLocationData, setEditLocationData] = useState({ name: '', address: '' });
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [deleteLocationError, setDeleteLocationError] = useState(null);
  const [locationManagerError, setLocationManagerError] = useState(null);

  const [teachers, setTeachers] = useState([]);

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
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    if (!formData.teacherId) {
      setError('Debes seleccionar un docente para la actividad');
      setLoading(false);
      return;
    }
    
    try {
      const activityData = await activityEndpoints.createActivity(formData);
      setSuccess(true);
      
      setFormData({
        title: '',
        categoryId: '',
        startDate: null,
        endDate: null,
        maxCapacity: '',
        locationId: '',
        images: [],
        description: '',
        teacherId: ''
      });
      
      router.push(`/activities/${activityData.id}`);
    } catch (err) {
      setError(err.message || 'Error al crear la actividad');
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

  // Función para editar categoría
  const handleEditCategory = async (id) => {
    try {
      setCategoryManagerError(null);
      const response = await activityEndpoints.updateCategory(id, editCategoryData);
      setCategories(prev => prev.map(cat => cat.id === id ? response : cat));
      setEditCategoryId(null);
      setEditCategoryData({ name: '', description: '' });
    } catch (err) {
      setCategoryManagerError(err.message || 'Error al editar la categoría');
    }
  };

  // Función para eliminar categoría
  const handleDeleteCategory = async (id) => {
    try {
      setDeleteCategoryError(null);
      await activityEndpoints.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      if (formData.categoryId === id) {
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
      setDeleteCategoryId(null);
    } catch (err) {
      setDeleteCategoryError(err.message || 'Error al eliminar la categoría');
    }
  };

  // Función para editar ubicación
  const handleEditLocation = async (id) => {
    try {
      setLocationManagerError(null);
      const response = await activityEndpoints.updateLocation(id, editLocationData);
      setLocations(prev => prev.map(loc => loc.id === id ? response : loc));
      setEditLocationId(null);
      setEditLocationData({ name: '', address: '' });
    } catch (err) {
      setLocationManagerError(err.message || 'Error al editar la ubicación');
    }
  };

  // Función para eliminar ubicación
  const handleDeleteLocation = async (id) => {
    try {
      setDeleteLocationError(null);
      await activityEndpoints.deleteLocation(id);
      setLocations(prev => prev.filter(loc => loc.id !== id));
      if (formData.locationId === id) {
        setFormData(prev => ({ ...prev, locationId: '' }));
      }
      setDeleteLocationId(null);
    } catch (err) {
      setDeleteLocationError(err.message || 'Error al eliminar la ubicación');
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const {data: teachersList} = await apiService.get('/users/teachers');
        setTeachers(teachersList);
      } catch (err) {
        // Puedes mostrar un error si quieres
      }
    };
    fetchTeachers();
  }, []);

  return (
    <ProtectedRoute>
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
            <SunEditor
              onChange={(content) => handleEditorChange(content)}
              setContents={formData.description}
              setOptions={editorOptions}
            />
          </Box>

          {/* Fila: Categoría y Ubicación */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '200px', display: 'flex', gap: 1 }}>
              <TextField
                select
                label="Categoría *"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                fullWidth
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
              <IconButton 
                onClick={() => setOpenCategoryManager(true)}
                sx={{ 
                  alignSelf: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, minWidth: '200px', display: 'flex', gap: 1 }}>
              <TextField
                select
                label="Ubicación *"
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                required
                fullWidth
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
              <IconButton 
                onClick={() => setOpenLocationManager(true)}
                sx={{ 
                  alignSelf: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
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

            <FormControl fullWidth sx={{ mt: 2 }} required>
              <InputLabel id="teacher-label">Docente asignado</InputLabel>
              <Select
                labelId="teacher-label"
                id="teacher-select"
                value={formData.teacherId || ''}
                label="Docente asignado"
                onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={String(teacher.id)}>
                    {teacher.firstName} {teacher.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

      {/* Diálogo para crear nueva categoría */}
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
            {categoryError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {categoryError}
              </Alert>
            )}
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

      {/* Diálogo para crear nueva ubicación */}
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
            {locationError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {locationError}
              </Alert>
            )}
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

      {/* Modal de gestión de categorías */}
      <Dialog open={openCategoryManager} onClose={() => setOpenCategoryManager(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gestionar Categorías</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Agregar nueva categoría */}
            <Typography variant="subtitle1">Agregar nueva categoría</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Nombre"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                size="small"
                required
              />
              <TextField
                label="Descripción"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                size="small"
              />
              <Button
                onClick={handleCreateCategory}
                variant="contained"
                disabled={!newCategory.name.trim()}
              >
                Agregar
              </Button>
            </Box>
            {/* Lista de categorías */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Categorías existentes</Typography>
            {categoryManagerError && (
              <Alert severity="error">{categoryManagerError}</Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {categories.map((cat) => (
                <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {editCategoryId === cat.id ? (
                    <>
                      <TextField
                        value={editCategoryData.name}
                        onChange={e => setEditCategoryData(prev => ({ ...prev, name: e.target.value }))}
                        size="small"
                        required
                      />
                      <TextField
                        value={editCategoryData.description}
                        onChange={e => setEditCategoryData(prev => ({ ...prev, description: e.target.value }))}
                        size="small"
                      />
                      <Button onClick={() => handleEditCategory(cat.id)} variant="contained" size="small" disabled={!editCategoryData.name.trim()}>Guardar</Button>
                      <Button onClick={() => setEditCategoryId(null)} size="small">Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 1 }}>{cat.name}</Typography>
                      <Typography sx={{ flex: 2, color: 'text.secondary' }}>{cat.description}</Typography>
                      <IconButton onClick={() => { setEditCategoryId(cat.id); setEditCategoryData({ name: cat.name, description: cat.description || '' }); }} size="small"><EditIcon /></IconButton>
                      <IconButton onClick={() => setDeleteCategoryId(cat.id)} size="small" color="error"><DeleteIcon /></IconButton>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryManager(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de borrado */}
      <Dialog open={!!deleteCategoryId} onClose={() => setDeleteCategoryId(null)}>
        <DialogTitle>¿Eliminar categoría?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.</Typography>
          {deleteCategoryError && <Alert severity="error">{deleteCategoryError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCategoryId(null)}>Cancelar</Button>
          <Button onClick={() => handleDeleteCategory(deleteCategoryId)} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de gestión de ubicaciones */}
      <Dialog open={openLocationManager} onClose={() => setOpenLocationManager(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gestionar Ubicaciones</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Agregar nueva ubicación */}
            <Typography variant="subtitle1">Agregar nueva ubicación</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Nombre"
                value={newLocation.name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                size="small"
                required
              />
              <TextField
                label="Dirección"
                value={newLocation.address}
                onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                size="small"
                required
              />
              <Button
                onClick={handleCreateLocation}
                variant="contained"
                disabled={!newLocation.name.trim() || !newLocation.address.trim()}
              >
                Agregar
              </Button>
            </Box>
            {/* Lista de ubicaciones */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Ubicaciones existentes</Typography>
            {locationManagerError && (
              <Alert severity="error">{locationManagerError}</Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {locations.map((loc) => (
                <Box key={loc.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {editLocationId === loc.id ? (
                    <>
                      <TextField
                        value={editLocationData.name}
                        onChange={e => setEditLocationData(prev => ({ ...prev, name: e.target.value }))}
                        size="small"
                        required
                      />
                      <TextField
                        value={editLocationData.address}
                        onChange={e => setEditLocationData(prev => ({ ...prev, address: e.target.value }))}
                        size="small"
                        required
                      />
                      <Button onClick={() => handleEditLocation(loc.id)} variant="contained" size="small" disabled={!editLocationData.name.trim() || !editLocationData.address.trim()}>Guardar</Button>
                      <Button onClick={() => setEditLocationId(null)} size="small">Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 1 }}>{loc.name}</Typography>
                      <Typography sx={{ flex: 2, color: 'text.secondary' }}>{loc.address}</Typography>
                      <IconButton onClick={() => { setEditLocationId(loc.id); setEditLocationData({ name: loc.name, address: loc.address || '' }); }} size="small"><EditIcon /></IconButton>
                      <IconButton onClick={() => setDeleteLocationId(loc.id)} size="small" color="error"><DeleteIcon /></IconButton>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLocationManager(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmación de borrado de ubicación */}
      <Dialog open={!!deleteLocationId} onClose={() => setDeleteLocationId(null)}>
        <DialogTitle>¿Eliminar ubicación?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas eliminar esta ubicación? Esta acción no se puede deshacer.</Typography>
          {deleteLocationError && <Alert severity="error">{deleteLocationError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteLocationId(null)}>Cancelar</Button>
          <Button onClick={() => handleDeleteLocation(deleteLocationId)} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de carga */}
      <Dialog open={loading} PaperProps={{ sx: { textAlign: 'center', p: 4 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Creando actividad...</Typography>
        </Box>
      </Dialog>
    </Container>
    </ProtectedRoute>
  );
}