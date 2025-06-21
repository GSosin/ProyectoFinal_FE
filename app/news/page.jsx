'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser';
import { newsEndpoints } from '../services/endpoints/news';
import ProtectedRoute from '../components/ProtectedRoute';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthStore from '../store/authStore';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, newsId: null, newsTitle: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Verificar si el usuario tiene permiso para gestionar noticias
  const hasManageNewsPermission = user?.role?.permissions?.some(p => p === 'manage_news');

  useEffect(() => {
    fetchNews();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsEndpoints.getAllNews();
      setNews(response || []);
    } catch (err) {
      setError('Error al cargar las noticias');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const truncateText = (htmlContent, maxLength = 150) => {
    // Remover etiquetas HTML para obtener texto plano
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.length <= maxLength) {
      return textContent;
    }
    
    return textContent.substring(0, maxLength) + '...';
  };

  const handleEdit = (newsId) => {
    router.push(`/news/${newsId}/edit`);
  };

  const handleDelete = (newsId, newsTitle) => {
    setDeleteDialog({ open: true, newsId, newsTitle });
  };

  const handleDeleteConfirm = async () => {
    try {
      await newsEndpoints.deleteNews(deleteDialog.newsId);
      showAlert('Noticia eliminada exitosamente');
      setDeleteDialog({ open: false, newsId: null, newsTitle: '' });
      fetchNews(); // Recargar la lista
    } catch (err) {
      showAlert(err.message || 'Error al eliminar la noticia', 'error');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, newsId: null, newsTitle: '' });
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          {error}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={fetchNews}>
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fa' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: '#1565c0',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Noticias
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Mantente informado sobre las últimas novedades y eventos de Israel Hatzeirá
            </Typography>
          </Box>

          {/* News Grid */}
          {news.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay noticias disponibles
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pronto publicaremos nuevas noticias y actualizaciones.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {news.map((article, index) => (
                <Grid item xs={12} md={6} lg={4} key={article.id || index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Title */}
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 600,
                          color: '#1565c0',
                          mb: 2,
                          lineHeight: 1.3
                        }}
                      >
                        {article.title}
                      </Typography>

                      {/* Date */}
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={formatDate(article.createdAt || article.updatedAt)}
                          size="small"
                          sx={{ 
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                            fontWeight: 500
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Content Preview */}
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          lineHeight: 1.6,
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {truncateText(article.description)}
                      </Typography>

                      {/* Author */}
                      {article.User && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontStyle: 'italic', mb: 2 }}
                        >
                          Por: {article.User.firstName} {article.User.lastName}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => router.push(`/news/${article.id}`)}
                        sx={{ fontWeight: 600 }}
                      >
                        Leer más
                      </Button>

                      {/* Admin Actions - Solo visibles para usuarios con permiso */}
                      {hasManageNewsPermission && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Editar noticia">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(article.id)}
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar noticia">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(article.id, article.title)}
                              sx={{ 
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'error.dark',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialog.open}
            onClose={handleDeleteCancel}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Confirmar eliminación
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                ¿Estás seguro de que quieres eliminar la noticia "{deleteDialog.newsTitle}"? 
                Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

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
      </Box>
    </ProtectedRoute>
  );
} 