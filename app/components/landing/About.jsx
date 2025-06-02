import { Box, Typography, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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

export default function About() {
  return (
    <Box id="about" sx={{ py: { xs: 6, md: 10 }, bgcolor: theme.background.default }}>
      <Paper 
        elevation={0} 
        sx={{ 
          bgcolor: theme.background.paper, 
          p: { xs: 3, md: 6 }, 
          borderRadius: 4, 
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <InfoIcon sx={{ color: theme.primary.main, fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: theme.primary.main, 
              fontWeight: 700, 
              fontSize: { xs: '1.75rem', md: '2.5rem' } 
            }}
          >
            Sobre nosotros
          </Typography>
        </Box>
        <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 3 }} />
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.text.primary, 
            mb: 2,
            fontWeight: 400
          }}
          dangerouslySetInnerHTML={{ 
            __html: '<strong>Israel Hatzeirá</strong> (hebreo: ישראל הצעירה "Israel la Joven") es un movimiento juvenil creado en 1953 en México. Su ideología se basa en tres pilares: <strong>Sionismo general</strong>, <strong>Judaísmo tradicionalista liberal</strong> y <strong>Liberalismo social</strong>.' 
          }}
        />
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.text.secondary, 
            mb: 2 
          }}
        >
          Es primordial respetar la individualidad del judío y comprender el contacto íntimo, personal y único que puede tener cada persona con D's y la religión. La tnuá rescata las tradiciones básicas practicando las costumbres y transmitiendo valores humanos que se reflejan en ellas. La realización de los javerim de la tnuá es por medio de la Aliá ya que vemos que la vida plena judía se vive en el Estado de Israel.
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.text.secondary 
          }}
        >
          Actualmente, Israel Hatzeirá está afiliada a la familia Hanoar Hatzioni y comparte espacios educativos a lo largo del año, como el Majón Joref, Majón Continental y SBM. Los madrijim se capacitan en Israel durante 9 meses en Shnat Hajshará junto a comunidades de toda Latinoamérica.
        </Typography>
      </Paper>
    </Box>
  );
} 