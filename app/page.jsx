'use client';

import { useEffect, useState, useRef } from 'react';
import Login from './login/page';
import Welcome from './welcome/page';
import useAuthStore from './store/authStore';
import { Box, Typography, AppBar, Toolbar, Container, Paper, TextField, Button, Grid, Card, CardMedia, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, Modal, IconButton } from '@mui/material';
import Image from 'next/image';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import CampfireIcon from '@mui/icons-material/Fireplace';
import HikingIcon from '@mui/icons-material/Hiking';
import SecurityIcon from '@mui/icons-material/Security';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import MailIcon from '@mui/icons-material/Mail';
import HistoryIcon from '@mui/icons-material/History';
import ProtectedRoute from '../app/components/ProtectedRoute'
import { useRouter } from 'next/navigation';

// Paleta de colores consistente
const theme = {
  primary: {
    main: '#1565c0',     // Azul francia principal
    light: '#1976d2',    // Azul francia claro
    dark: '#0d47a1',     // Azul francia oscuro
    contrastText: '#fff' // Texto en contraste (blanco)
  },
  secondary: {
    light: '#e3f2fd',    // Azul muy claro (casi blanco)
    main: '#bbdefb',     // Azul muy claro
    dark: '#90caf9'      // Azul claro
  },
  background: {
    default: '#ffffff',  // Fondo blanco
    paper: '#f5f8fa'     // Papel con toque azulado
  },
  text: {
    primary: '#212121',    // Texto principal casi negro
    secondary: '#546e7a',  // Texto secundario gris azulado
    light: '#ffffff'       // Texto claro (blanco)
  }
};

// Configuración del menú
const menuItems = [
  { id: 'home', label: 'Hogar', active: true },
  { id: 'about', label: 'Sobre nosotros', active: false },
  { id: 'history', label: 'Historia', active: false },
  { id: 'traditions', label: 'Tradiciones', active: false },
  { id: 'events', label: 'Encuentros', active: false },
  { id: 'gallery', label: 'Galería', active: false },
  { id: 'contact', label: 'Contacto', active: false },
    { id: 'activities', label: 'Actividades', active: false , external : true},

];


// Imágenes del carrusel principal
const carouselImages = [
  {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
    alt: 'Grupo de jóvenes reunidos alrededor de una fogata',
    title: 'Construyendo Comunidad',
    subtitle: 'Experiencias que marcan la vida'
  },
  {
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1',
    alt: 'Jóvenes en actividad de grupo al aire libre',
    title: 'Espíritu de Equipo',
    subtitle: 'Aprendiendo a trabajar juntos'
  },
  {
    url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b',
    alt: 'Jóvenes en encuentro educativo',
    title: 'Valores Compartidos',
    subtitle: 'Tradición y modernidad en equilibrio'
  }
];

// Imágenes de la galería
const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
    alt: 'Actividad grupal 1',
    title: 'Encuentro anual 2023'
  },
  {
    url: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b',
    alt: 'Actividad educativa',
    title: 'Seminario de liderazgo'
  },
  {
    url: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6',
    alt: 'Reunión de grupo',
    title: 'Debate comunitario'
  },
  {
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
    alt: 'Actividad al aire libre',
    title: 'Majané Kaitz 2022'
  },
  {
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a',
    alt: 'Grupo alegre',
    title: 'Festejo de Janucá'
  },
  {
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1',
    alt: 'Actividad deportiva',
    title: 'Competencias anuales'
  }
];

// Tradiciones desde Wikipedia
const tradiciones = [
  {
    nombre: 'Mifkad',
    descripcion: 'Constituye uno de los momentos de mayor importancia dentro de las actividades cotidianas de todo movimiento. Su origen tiene como base la conmemoración de los muertos en el holocausto judío y en las guerras de Israel. El mifkad es donde la tnuá en pleno se reúne para rendir honor a sus símbolos y donde se encuentran las diversas edades que conforman las kvutzot.',
    icono: <GroupsIcon />
  },
  {
    nombre: 'Ruaj',
    descripcion: 'Dentro del mifkad deben combinarse diversas situaciones, para que dentro de su solemnidad no se convierta en algo abrumador para los janijim. Al principio de cada mifkad debe haber un momento de esparcimiento, en el que cada kvutzá pueda alentarse a sí misma o a la tnuá.',
    icono: <HistoryEduIcon />
  },
  {
    nombre: 'Mifkadesh',
    descripcion: 'Mifkad especial que se realiza en el Majané Kaitz, en este las distintas kvutzot van avanzando de Shijvá. Los madrijim eligen a los janijim de su kvutzá a que pasen a encender (con fuego) una letra del Mifkadesh (Israel Y Hatzeirá).',
    icono: <SchoolIcon />
  },
  {
    nombre: 'Medurá',
    descripcion: 'Esta es la fogata del Majané en la cual las Kvutzot hacen una presentación y donde luego todos dormirán toda la noche. Se realizará en la última noche. Los nuevos tzofim (Janijim más grandes) son los encargados de armarla.',
    icono: <CampfireIcon />
  },
  {
    nombre: 'Caminata',
    descripcion: 'En cada Majané antes del Mifkadesh se realiza una caminata la cual principalmente significa el último esfuerzo para pasar de Shijvá.',
    icono: <HikingIcon />
  },
  {
    nombre: 'Shmirá',
    descripcion: 'Guardia que se realiza en los Majanot. De esta participan: dos Ajraím (responsable o encargados de la shmirá) y más personas de cada kvutzá (generalmente dos por kvutzá) que se encargaran de la seguridad del campamento durante la noche.',
    icono: <SecurityIcon />
  },
  {
    nombre: 'Jodesh',
    descripcion: 'Es una competencia cultural y deportiva entre las kvutzot de cada ken de la tnuá. El jodesh está dividido en aspectos como Jidón (competencia con cuadernillo), IomSport (competencias deportivas), y Kishut (espacio creativo).',
    icono: <EmojiEventsIcon />
  }
];

// Encuentros desde Wikipedia
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

// Sistema de secciones configurables
const pageSections = [
  {
    id: 'about',
    type: 'text',
    title: 'Sobre nosotros',
    icon: <InfoIcon />,
    content: {
      heading: 'Sobre nosotros',
      paragraphs: [
        '<strong>Israel Hatzeirá</strong> (hebreo: ישראל הצעירה "Israel la Joven") es un movimiento juvenil creado en 1953 en México. Su ideología se basa en tres pilares: <strong>Sionismo general</strong>, <strong>Judaísmo tradicionalista liberal</strong> y <strong>Liberalismo social</strong>.',
        'Es primordial respetar la individualidad del judío y comprender el contacto íntimo, personal y único que puede tener cada persona con D\'s y la religión. La tnuá rescata las tradiciones básicas practicando las costumbres y transmitiendo valores humanos que se reflejan en ellas. La realización de los javerim de la tnuá es por medio de la Aliá ya que vemos que la vida plena judía se vive en el Estado de Israel.',
        'Actualmente, Israel Hatzeirá está afiliada a la familia Hanoar Hatzioni y comparte espacios educativos a lo largo del año, como el Majón Joref, Majón Continental y SBM. Los madrijim se capacitan en Israel durante 9 meses en Shnat Hajshará junto a comunidades de toda Latinoamérica.'
      ]
    },
    styles: {
      backgroundColor: theme.background.default,
      textColor: theme.text.primary,
    }
  },
  {
    id: 'history',
    type: 'multi-card',
    title: 'Historia',
    icon: <HistoryIcon />,
    content: {
      heading: 'Historia',
      intro: 'Hacia 1928 entra en escena Ariéh León Dulzin, quien adhería a la postura de la Unión Mundial de los Sionistas Generales y fue crucial para la creación y desarrollo de la tnuá. En ese año Dulzin emigró de Bielorrusia a México, en donde fue, entre otras cosas, Presidente de la Unión de los Sionistas generales local y posteriormente, de la Federación Sionista de México.',
      cards: [
        {
          title: 'Los inicios',
          content: 'Estaba profundamente convencido de la idea sionista General Liberal y, viendo que entre la juventud sionista entonces no existían otras opciones que las tnuot de Izquierda o Derecha, contempló la necesidad de crear un marco juvenil sionista con ideología de Centro, en el que la realización personal (aliá) fuera el máximo principal objetivo.'
        },
        {
          title: 'Fundación',
          content: 'Hacia 1950 la Unión de los Sionistas Generales de México creó la Jativá Universitaria Sionista (un movimiento para jóvenes-adultos en edad universitaria). Casi de inmediato, las uniones de los Sionistas Generales de la Argentina y Uruguay hicieron lo propio en sus países, expandiendo la JUS hacia el sur.',
          footer: '29 de noviembre de 1953 - Fecha de fundación oficial'
        },
        {
          title: 'Expansión',
          content: 'Hasta el año 1953 la JUS siguió funcionando solo en el ámbito universitario. En ese año llegó a JUS de Argentina el Sheliaj Abraham Katz. Los esfuerzos de Katz y la dedicación de los integrantes de las diversas JUS, posibilitaron la creación de un movimiento juvenil sionista. Israel Hatzeirá se expandió por diversos países de Latinoamérica, creando una comunidad juvenil con valores compartidos.'
        }
      ]
    },
    styles: {
      backgroundColor: theme.secondary.light,
      cardBackgroundColor: theme.background.default,
      textColor: theme.text.secondary,
      titleColor: theme.primary.dark
    }
  },
  {
    id: 'traditions',
    type: 'icon-cards',
    title: 'Tradiciones',
    icon: <HistoryEduIcon />,
    content: {
      heading: 'Nuestras Tradiciones',
      items: tradiciones
    },
    styles: {
      backgroundColor: theme.background.default,
      cardColor: theme.background.default,
      iconColor: theme.primary.main,
      iconBgColor: `${theme.primary.main}15`
    }
  },
  {
    id: 'events',
    type: 'accordion',
    title: 'Encuentros',
    icon: <EventIcon />,
    content: {
      heading: 'Encuentros',
      items: encuentros
    },
    styles: {
      backgroundColor: theme.secondary.light,
      itemBgColor: theme.background.default,
      itemAltBgColor: theme.background.paper,
      accentColor: theme.primary.main
    }
  },
  {
    id: 'gallery',
    type: 'gallery',
    title: 'Galería',
    icon: <PhotoLibraryIcon />,
    content: {
      heading: 'Galería de fotos',
      images: galleryImages
    },
    styles: {
      backgroundColor: theme.background.default
    }
  },
  {
    id: 'contact',
    type: 'form',
    title: 'Contacto',
    icon: <MailIcon />,
    content: {
      heading: 'Contacto',
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, rows: 4 }
      ],
      submitText: 'Enviar mensaje',
      successMessage: '¡Mensaje enviado con éxito!'
    },
    styles: {
      backgroundColor: theme.secondary.light,
      formBgColor: theme.background.default,
      buttonColor: theme.primary.main,
      buttonHoverColor: theme.primary.dark
    }
  }
];

// Componente de carrusel
function Carousel({ images }) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)),
      6000
    );

    return () => {
      resetTimeout();
    };
  }, [current, images.length]);

  const goToNext = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: '50vh', md: '70vh' }, overflow: 'hidden' }}>
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            backgroundImage: `url(${image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: index === current ? 1 : 0,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 0
            }
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '10%', md: '25%' },
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 2,
          width: '80%',
          maxWidth: '800px'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: theme.text.light,
            fontWeight: 800,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }
          }}
        >
          {images[current].title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: theme.text.light,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.5rem', md: '1.75rem' }
          }}
        >
          {images[current].subtitle}
        </Typography>
      </Box>

      {/* Controles del carrusel */}
      <IconButton
        onClick={goToPrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: { xs: '10px', md: '30px' },
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.2)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.4)' }
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton
        onClick={goToNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: { xs: '10px', md: '30px' },
          transform: 'translateY(-50%)',
          zIndex: 2,
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.2)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.4)' }
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Indicadores de posición */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 2
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            onClick={() => {
              resetTimeout();
              setCurrent(index);
            }}
            sx={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: index === current ? theme.primary.main : theme.text.light,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

// Componente de Galería con Lightbox
function Gallery({ images, styles = {} }) {
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setOpenLightbox(true);
  };

  const handleClose = () => {
    setOpenLightbox(false);
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <Grid container spacing={3}>
        {images.map((img, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                }
              }}
              onClick={() => handleImageClick(i)}
            >
              <CardMedia
                component="img"
                height="240"
                image={img.url}
                alt={img.alt}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ backgroundColor: theme.background.paper, p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={500} color={theme.text.primary}>
                  {img.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lightbox Modal */}
      <Modal open={openLightbox} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '70%' },
            maxWidth: '1000px',
            maxHeight: '90vh',
            backgroundColor: 'black',
            boxShadow: 24,
            p: 0,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt}
              style={{
                display: 'block',
                width: '100%',
                maxHeight: isMobile ? '60vh' : '70vh',
                objectFit: 'contain'
              }}
            />
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                p: 2,
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" fontWeight={500}>
                {images[selectedImage].title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {images[selectedImage].alt}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// Componente de sección de texto
function TextSection({ content, styles = {} }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        bgcolor: styles.backgroundColor || theme.background.paper, 
        p: { xs: 3, md: 6 }, 
        borderRadius: 4, 
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.05)'
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          color: theme.primary.main, 
          fontWeight: 700, 
          mb: 1, 
          fontSize: { xs: '1.75rem', md: '2.5rem' } 
        }}
      >
        {content.heading}
      </Typography>
      <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 3 }} />
      
      {content.paragraphs.map((paragraph, index) => (
        <Typography 
          key={index} 
          variant={index === 0 ? "h6" : "body1"} 
          sx={{ 
            color: index === 0 ? styles.textColor || theme.text.primary : theme.text.secondary, 
            mb: index === content.paragraphs.length - 1 ? 0 : 2,
            fontWeight: index === 0 ? 400 : 'normal'
          }}
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      ))}
    </Paper>
  );
}

// Componente de sección de múltiples tarjetas
function MultiCardSection({ content, styles = {} }) {
  return (
    <>
      <Typography 
        variant="h3" 
        sx={{ 
          color: theme.primary.main, 
          fontWeight: 700, 
          mb: 1, 
          textAlign: 'center', 
          fontSize: { xs: '1.75rem', md: '2.5rem' } 
        }}
      >
        {content.heading}
      </Typography>
      <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
      
      {content.intro && (
        <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 4, bgcolor: styles.cardBackgroundColor || theme.background.default }}>
          <Typography paragraph color={styles.textColor || theme.text.secondary}>
            {content.intro}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        {content.cards.map((card, index) => (
          <Grid item xs={12} md={content.cards.length === 3 ? 4 : 6} key={index}>
            <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: '100%', bgcolor: styles.cardBackgroundColor || theme.background.default }}>
              <Typography variant="h5" color={styles.titleColor || theme.primary.dark} gutterBottom fontWeight={600}>
                {card.title}
              </Typography>
              <Typography paragraph color={styles.textColor || theme.text.secondary}>
                {card.content}
              </Typography>
              {card.footer && (
                <Typography variant="subtitle1" fontWeight={500} color={theme.primary.main}>
                  {card.footer}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

// Componente de sección de tarjetas con iconos
function IconCardSection({ content, styles = {} }) {
  return (
    <>
      <Typography 
        variant="h3" 
        sx={{ 
          color: theme.primary.main, 
          fontWeight: 700, 
          mb: 1, 
          textAlign: 'center', 
          fontSize: { xs: '1.75rem', md: '2.5rem' } 
        }}
      >
        {content.heading}
      </Typography>
      <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
      
      <Grid container spacing={3}>
        {content.items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 4, 
                transition: 'transform 0.3s, box-shadow 0.3s', 
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                bgcolor: styles.cardColor || theme.background.default,
                '&:hover': { 
                  transform: 'translateY(-5px)', 
                  boxShadow: '0 12px 24px rgba(0,0,0,0.09)' 
                } 
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    color: styles.iconColor || theme.primary.main, 
                    mr: 2,
                    bgcolor: styles.iconBgColor || `${theme.primary.main}15`,
                    p: 1.5,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icono}
                  </Box>
                  <Typography variant="h6" fontWeight={600} color={theme.primary.dark}>
                    {item.nombre}
                  </Typography>
                </Box>
                <Typography variant="body2" color={theme.text.secondary}>
                  {item.descripcion}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

// Componente de sección acordeón
function AccordionSection({ content, styles = {} }) {
  return (
    <>
      <Typography 
        variant="h3" 
        sx={{ 
          color: theme.primary.main, 
          fontWeight: 700, 
          mb: 1, 
          textAlign: 'center', 
          fontSize: { xs: '1.75rem', md: '2.5rem' } 
        }}
      >
        {content.heading}
      </Typography>
      <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
      
      {content.items.map((item, index) => (
        <Accordion 
          key={index} 
          sx={{ 
            mb: 2, 
            borderRadius: '10px !important', 
            overflow: 'hidden',
            '&:before': { display: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            bgcolor: index % 2 === 0 ? styles.itemBgColor : styles.itemAltBgColor,
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon sx={{ color: styles.accentColor }} />}
            sx={{ 
              '&:hover': { backgroundColor: `${styles.accentColor}08` }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                bgcolor: `${styles.accentColor}15`,
                p: 1,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarMonthIcon sx={{ color: styles.accentColor }} />
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
              bgcolor: `${styles.accentColor}15`, 
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
    </>
  );
}

// Componente de sección de formulario de contacto
function FormSection({ content, styles = {} }) {
  const [form, setForm] = useState(content.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
  const [enviado, setEnviado] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          borderRadius: 3,
          bgcolor: styles.formBgColor || theme.background.default,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            color: theme.primary.main, 
            fontWeight: 700, 
            mb: 1, 
            textAlign: 'center', 
            fontSize: { xs: '1.75rem', md: '2.5rem' } 
          }}
        >
          {content.heading}
        </Typography>
        <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 3 }} />
        <form onSubmit={handleSubmit}>
          {content.fields.map(field => (
            <TextField
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type === 'textarea' ? 'text' : field.type}
              value={form[field.name]}
              onChange={handleChange}
              fullWidth
              required={field.required}
              multiline={field.type === 'textarea'}
              minRows={field.rows || 1}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.primary.light,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary.main,
                  },
                }
              }}
            />
          ))}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ 
              py: 1.5, 
              fontWeight: 600, 
              borderRadius: 2,
              bgcolor: styles.buttonColor || theme.primary.main,
              color: theme.text.light,
              textTransform: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                bgcolor: styles.buttonHoverColor || theme.primary.dark,
                boxShadow: `0 6px 20px ${theme.primary.main}40`
              }
            }}
          >
            {content.submitText}
          </Button>
          {enviado && (
            <Typography color="success.main" sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>
              {content.successMessage}
            </Typography>
          )}
        </form>
      </Paper>
    </>
  );
}

// Renderizador dinámico de secciones
function SectionRenderer({ section }) {
  const { type, content, styles } = section;
  
  return (
    <Box 
      sx={{ 
        bgcolor: styles.backgroundColor, 
        py: { xs: 6, md: 10 } 
      }} 
      id={section.id}
    >
      <Container maxWidth={type === 'icon-cards' || type === 'gallery' ? 'lg' : 'md'}>
        {type === 'text' && <TextSection content={content} styles={styles} />}
        {type === 'multi-card' && <MultiCardSection content={content} styles={styles} />}
        {type === 'icon-cards' && <IconCardSection content={content} styles={styles} />}
        {type === 'accordion' && <AccordionSection content={content} styles={styles} />}
        {type === 'gallery' && (
          <>
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.primary.main, 
                fontWeight: 700, 
                mb: 1, 
                textAlign: 'center', 
                fontSize: { xs: '1.75rem', md: '2.5rem' } 
              }}
            >
              {content.heading}
            </Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: theme.primary.main, mx: 'auto', borderRadius: 2, mb: 4 }} />
            <Gallery images={content.images} styles={styles} />
          </>
        )}
        {type === 'form' && <FormSection content={content} styles={styles} />}
      </Container>
    </Box>
  );
}

// Componente de Header mejorado
function Header({ menuItems, logo }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        bgcolor: theme.background.default, 
        color: theme.primary.main, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)', 
        borderBottom: `1px solid ${theme.primary.main}10` 
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box 
            sx={{ 
              position: 'relative',
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: `2px solid ${theme.primary.main}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              padding: '2px'
            }}
          >
            <Image 
              src="/logo-hatzeira.png" 
              alt="Logo Israel Hatzeira" 
              width={isMobile ? 40 : 50} 
              height={isMobile ? 40 : 50} 
              style={{ 
                objectFit: 'contain',
              }} 
            />
          </Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div"
            color={theme.primary.main}
            fontWeight={700}
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              ml: 1,
              letterSpacing: '0.5px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '30%',
                height: '3px',
                backgroundColor: theme.primary.main,
                bottom: '-4px',
                left: '0',
                borderRadius: '2px'
              }
            }}
          >
            Israel Hatzeira
          </Typography>
        </Box>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          {menuItems.map((item, i) => (
            <Button
              key={i}
              color="inherit"
              href={!item.external ? `#${item.id}` : item.id}
              sx={{ 
                fontWeight: item.active ? 600 : 400, 
                color: item.active ? theme.primary.main : theme.text.secondary,
                borderBottom: item.active ? `2px solid ${theme.primary.main}` : 'none',
                borderRadius: '4px 4px 0 0',
                px: 2,
                py: 1,
                textTransform: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s',
                '&:hover': {
                  color: theme.primary.main,
                  backgroundColor: `${theme.primary.main}08`,
                  borderBottom: `2px solid ${theme.primary.main}40`
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Componente de Footer mejorado
function Footer() {
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
              <Typography variant="h6" fontWeight={700}>Israel Hatzeira</Typography>
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
          © {new Date().getFullYear()} Israel Hatzeira. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default function Home() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
<ProtectedRoute>


    <Box sx={{ minHeight: '100vh', bgcolor: theme.background.default }}>
      {/* Header mejorado */}
      <Header menuItems={menuItems} />

      {/* Carrusel principal */}
      <Carousel images={carouselImages} />

      {/* Secciones dinámicas */}
      {pageSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {/* Footer */}
      <Footer />
    </Box>

</ProtectedRoute>);
} 