import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const encuentros = [
  {
    nombre: 'Majón Joref',
    descripcion: 'Seminario de invierno para madrijim que ofrece herramientas metodológicas y de liderazgo. Israel Hatzeirá participó por primera vez en 2011 en este encuentro de la familia Hanoar Hatzioni.',
    fecha: 'Invierno'
  },
  {
    nombre: 'Majané Kaitz',
    descripcion: 'Campamento de verano que es la actividad más importante del año, donde se realizan diversas actividades tradicionales como el Mifkadesh, Medurá y Caminata.',
    fecha: 'Verano'
  },
  {
    nombre: 'Majon Continental',
    descripcion: 'Encuentro destinado a que los javerim reciban capacitación en hadrajá, liderazgo y formación de kvutzá para futuros Shnatim. Participan javerim de diversos países de América como Argentina, Brasil, Costa Rica, Paraguay, Perú, Uruguay y Chile.',
    fecha: 'Verano'
  },
  {
    nombre: 'SBM (Seminar Bogrim Maniguim)',
    descripcion: 'Encuentro de algunos días para bogrim de toda Latinoamérica, donde se brinda un espacio de interacción con las tnuot pertenecientes a la familia Hanoar y capacitación para futuros Maniguim (líderes) de la tnuá.',
    fecha: 'Anual'
  }
];

export default function Events() {
  return (
    <Box id="events" sx={{ py: { xs: 6, md: 10 }, bgcolor: theme.background.paper }}>
      <Box sx={{ maxWidth: 'md', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <EventIcon sx={{ color: theme.primary.main, fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.primary.main, 
              fontWeight: 700, 
              fontSize: { xs: '1.75rem', md: '2.5rem' } 
            }}
          >
            Encuentros
          </Typography>
        </Box>
        <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
        
        {encuentros.map((item, index) => (
          <Accordion 
            key={index} 
            sx={{ 
              mb: 2, 
              borderRadius: '10px !important', 
              overflow: 'hidden',
              '&:before': { display: 'none' },
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              bgcolor: index % 2 === 0 ? theme.background.default : theme.background.paper,
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: theme.primary.main }} />}
              sx={{ 
                '&:hover': { backgroundColor: `${theme.primary.main}08` }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  bgcolor: `${theme.primary.main}15`,
                  p: 1,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CalendarMonthIcon sx={{ color: theme.primary.main }} />
                </Box>
                <Typography variant="h6" fontWeight={500} color={theme.text.primary}>
                  {item.nombre}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph color={theme.text.secondary}>
                {item.descripcion}
              </Typography>
              <Box sx={{ 
                display: 'inline-block', 
                bgcolor: `${theme.primary.main}15`, 
                color: theme.primary.dark,
                px: 2,
                py: 0.5,
                borderRadius: 2
              }}>
                <Typography variant="body2" fontWeight={500}>
                  Temporada: {item.fecha}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
} 