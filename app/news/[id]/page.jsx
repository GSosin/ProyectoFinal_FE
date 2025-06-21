'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  CircularProgress,
  Chip,
  Divider,
  Breadcrumbs,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import parse from 'html-react-parser';
import { newsEndpoints } from '../../services/endpoints/news';
import ProtectedRoute from '../../components/ProtectedRoute';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchNewsDetail();
    }
  }, [params.id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await newsEndpoints.getNewsById(params.id);
      setNews(response);
    } catch (err) {
      setError('Error al cargar la noticia');
      console.error('Error fetching news detail:', err);
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

  if (error || !news) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" textAlign="center">
          {error || 'Noticia no encontrada'}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => router.push('/news')}>
            Volver a Noticias
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fa', pt: 2 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Inicio
            </Link>
            <Link
              color="inherit"
              href="/news"
              onClick={(e) => {
                e.preventDefault();
                router.push('/news');
              }}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Noticias
            </Link>
            <Typography color="text.primary">{news.title}</Typography>
          </Breadcrumbs>

          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/news')}
            sx={{ mb: 3 }}
          >
            Volver a Noticias
          </Button>

          {/* Article Content */}
          <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  color: '#1565c0',
                  fontSize: { xs: '1.75rem', md: '2.5rem' },
                  lineHeight: 1.2
                }}
              >
                {news.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip 
                  label={formatDate(news.createdAt || news.updatedAt)}
                  size="medium"
                  sx={{ 
                    bgcolor: '#e3f2fd',
                    color: '#1565c0',
                    fontWeight: 500
                  }}
                />
                {news.User && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ fontStyle: 'italic' }}
                  >
                    Por: {news.User.firstName} {news.User.lastName}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ mb: 3 }} />
            </Box>

            {/* Content */}
            <Box sx={{ 
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: '#1565c0',
                fontWeight: 600,
                mb: 2,
                mt: 3
              },
              '& p': {
                lineHeight: 1.8,
                mb: 2,
                fontSize: '1.1rem'
              },
              '& ul, & ol': {
                pl: 3,
                mb: 2
              },
              '& li': {
                mb: 1,
                lineHeight: 1.6
              },
              '& blockquote': {
                borderLeft: '4px solid #1565c0',
                pl: 3,
                ml: 0,
                fontStyle: 'italic',
                bgcolor: '#f5f8fa',
                p: 2,
                borderRadius: 1
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 2
              },
              '& a': {
                color: '#1565c0',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }
            }}>
              {parse(news.description)}
            </Box>

            {/* Footer */}
            <Box sx={{ mt: 6, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Publicado el {formatDate(news.createdAt || news.updatedAt)}
                {news.updatedAt && news.updatedAt !== news.createdAt && 
                  ` • Actualizado el ${formatDate(news.updatedAt)}`
                }
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  );
} 