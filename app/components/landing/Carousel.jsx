import { Box, Typography, IconButton, useMediaQuery } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrent((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1)),
      6000
    );

    return () => {
      resetTimeout();
    };
  }, [current]);

  const goToNext = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1));
  };

  const goToPrev = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: '50vh', md: '70vh' }, overflow: 'hidden' }}>
      {carouselImages.map((image, index) => (
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
          {carouselImages[current].title}
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
          {carouselImages[current].subtitle}
        </Typography>
      </Box>

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
        {carouselImages.map((_, index) => (
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