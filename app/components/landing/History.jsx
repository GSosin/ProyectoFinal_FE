import { Box, Typography, Paper, Grid } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

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

export default function History() {
  return (
    <Box id="history" sx={{ py: { xs: 6, md: 10 }, bgcolor: theme.background.paper }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <HistoryIcon sx={{ color: theme.primary.main, fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.primary.main, 
              fontWeight: 700, 
              fontSize: { xs: '1.75rem', md: '2.5rem' } 
            }}
          >
            Historia
          </Typography>
        </Box>
        <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />

        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, bgcolor: theme.background.default }}>
          <Typography paragraph color={theme.text.secondary}>
            Hacia 1928 entra en escena Ariéh León Dulzin, quien adhería a la postura de la Unión Mundial de los Sionistas Generales y fue crucial para la creación y desarrollo de la tnuá. En ese año Dulzin emigró de Bielorrusia a México, en donde fue, entre otras cosas, Presidente de la Unión de los Sionistas generales local y posteriormente, de la Federación Sionista de México.
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%', bgcolor: theme.background.default }}>
              <Typography variant="h5" color={theme.primary.dark} gutterBottom fontWeight={600}>
                Los inicios
              </Typography>
              <Typography paragraph color={theme.text.secondary}>
                Estaba profundamente convencido de la idea sionista General Liberal y, viendo que entre la juventud sionista entonces no existían otras opciones que las tnuot de Izquierda o Derecha, contempló la necesidad de crear un marco juvenil sionista con ideología de Centro, en el que la realización personal (aliá) fuera el máximo principal objetivo.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%', bgcolor: theme.background.default }}>
              <Typography variant="h5" color={theme.primary.dark} gutterBottom fontWeight={600}>
                Fundación
              </Typography>
              <Typography paragraph color={theme.text.secondary}>
                Hacia 1950 la Unión de los Sionistas Generales de México creó la Jativá Universitaria Sionista (un movimiento para jóvenes-adultos en edad universitaria). Casi de inmediato, las uniones de los Sionistas Generales de la Argentina y Uruguay hicieron lo propio en sus países, expandiendo la JUS hacia el sur.
              </Typography>
              <Typography variant="subtitle1" fontWeight={500} color={theme.primary.main}>
                29 de noviembre de 1953 - Fecha de fundación oficial
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%', bgcolor: theme.background.default }}>
              <Typography variant="h5" color={theme.primary.dark} gutterBottom fontWeight={600}>
                Expansión
              </Typography>
              <Typography paragraph color={theme.text.secondary}>
                Hasta el año 1953 la JUS siguió funcionando solo en el ámbito universitario. En ese año llegó a JUS de Argentina el Sheliaj Abraham Katz. Los esfuerzos de Katz y la dedicación de los integrantes de las diversas JUS, posibilitaron la creación de un movimiento juvenil sionista. Israel Hatzeirá se expandió por diversos países de Latinoamérica, creando una comunidad juvenil con valores compartidos.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
} 