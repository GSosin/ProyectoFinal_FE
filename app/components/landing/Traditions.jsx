import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NightsStayIcon from '@mui/icons-material/NightsStay';

const theme = {
  primary: {
    main: '#1565c0',
    light: '#1976d2',
    dark: '#0d47a1',
    contrastText: '#fff'
  },
  background: {
    default: '#ffffff',
    paper: '#f5f8fa'
  },
  text: {
    primary: '#212121',
    secondary: '#546e7a'
  }
};

const tradiciones = [
  {
    nombre: 'Mifkad',
    descripcion: 'Reunión grupal para compartir novedades, valores y fortalecer la identidad del grupo.',
    icon: <Diversity3Icon sx={{ color: theme.primary.main, fontSize: 40 }} />
  },
  {
    nombre: 'Medurá',
    descripcion: 'Fogata tradicional donde se comparten canciones, historias y se refuerza el sentido de comunidad.',
    icon: <LocalFireDepartmentIcon sx={{ color: theme.primary.main, fontSize: 40 }} />
  },
  {
    nombre: 'Shabat',
    descripcion: 'Celebración semanal con rituales y actividades que conectan a los jóvenes con la tradición judía.',
    icon: <NightsStayIcon sx={{ color: theme.primary.main, fontSize: 40 }} />
  },
  {
    nombre: 'Reconocimientos',
    descripcion: 'Entrega de distinciones a quienes se destacan por su compromiso y valores.',
    icon: <StarIcon sx={{ color: theme.primary.main, fontSize: 40 }} />
  },
  {
    nombre: 'Juegos y dinámicas',
    descripcion: 'Actividades lúdicas que fomentan el trabajo en equipo, la creatividad y la diversión.',
    icon: <EmojiPeopleIcon sx={{ color: theme.primary.main, fontSize: 40 }} />
  }
];

export default function Traditions() {
  return (
    <Box id="traditions" sx={{ py: { xs: 6, md: 10 }, bgcolor: theme.background.paper }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <StarIcon sx={{ color: theme.primary.main, fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.primary.main, 
              fontWeight: 700, 
              fontSize: { xs: '1.75rem', md: '2.5rem' } 
            }}
          >
            Nuestras Tradiciones
          </Typography>
        </Box>
        <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
        <Grid container spacing={4}>
          {tradiciones.map((trad, idx) => (
            <Grid item xs={12} sm={6} md={4} key={trad.nombre}>
              <Card elevation={2} sx={{ borderRadius: 4, bgcolor: theme.background.default, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center', py: 5 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {trad.icon}
                  </Box>
                  <Typography variant="h6" color={theme.primary.dark} fontWeight={600} gutterBottom>
                    {trad.nombre}
                  </Typography>
                  <Typography variant="body2" color={theme.text.secondary}>
                    {trad.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 