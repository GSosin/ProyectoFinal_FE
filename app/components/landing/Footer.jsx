import { Box, Container, Grid, Typography, List, ListItem, Divider } from '@mui/material';
import Image from 'next/image';

const theme = {
  primary: {
    main: '#1565c0',
    light: '#1976d2',
    dark: '#0d47a1',
    contrastText: '#fff'
  },
  text: {
    light: '#ffffff'
  }
};

export default function Footer() {
  return (
    <Box sx={{ bgcolor: theme.primary.dark, color: theme.text.light, py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  border: `2px solid ${theme.primary.main}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  padding: '2px',
                  mr: 2
                }}
              >
                <Image 
                  src="/logo-hatzeira.png" 
                  alt="Logo Israel Hatzeira" 
                  width={40} 
                  height={40} 
                  style={{ 
                    objectFit: 'contain',
                  }} 
                />
              </Box>
              <Typography variant="h6" fontWeight={700}>Israel Hatzeirá</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Movimiento Juvenil Jalutziano Sionista General fundado en 1953 en México.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Enlaces de interés</Typography>
            <List disablePadding>
              {['Sionismo general', 'Hanoar Hatzioni', 'Judaísmo'].map((item, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    cursor: 'pointer',
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    {item}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Contacto</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Email: info@israelhatzeira.org
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Teléfono: +123 456 7890
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Typography variant="body2" align="center" sx={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} Israel Hatzeirá. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
} 