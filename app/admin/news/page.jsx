'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProtectedRoute from '../../components/ProtectedRoute';
import { newsEndpoints } from '../../services/endpoints/news';
import useAuthStore from '../../store/authStore';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
  loading: () => <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 1 }}>Cargando editor...</Box>
});

export default function CreateNewsPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

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

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.title.trim()) {
      showAlert('El título es obligatorio', 'error');
      setLoading(false);
      return;
    }
    
    if (!formData.description.trim()) {
      showAlert('La descripción es obligatoria', 'error');
      setLoading(false);
      return;
    }
    
    try {
      const newsData = {
        title: formData.title,
        description: formData.description,
        userId: user.id
      };
      
      const response = await newsEndpoints.createNews(newsData);
      showAlert('Noticia creada exitosamente');
      
      setFormData({
        title: '',
        description: ''
      });
      
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (err) {
      showAlert(err.message || 'Error al crear la noticia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleTitleChange = (e) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
  };

  return (
    <ProtectedRoute requiredPermissions={['manage_news']}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Crear Nueva Noticia
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Título de la Noticia
              </Typography>
              <TextField
                fullWidth
                label="Título"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Ingresa el título de la noticia"
                variant="outlined"
                required
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contenido de la Noticia
              </Typography>
              <SunEditor
                setContents={formData.description}
                onChange={handleEditorChange}
                setOptions={editorOptions}
                onLoad={(sunEditor) => {
                  // El editor está listo
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push('/admin')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.title.trim() || !formData.description.trim()}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Crear Noticia'
                )}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Snackbar para alertas */}
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alert.severity} 
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </ProtectedRoute>
  );
} 