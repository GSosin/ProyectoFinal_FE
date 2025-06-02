'use client';

import { Box } from '@mui/material';
import Carousel from './components/landing/Carousel';
import About from './components/landing/About';
import History from './components/landing/History';
import Traditions from './components/landing/Traditions';
import Events from './components/landing/Events';
import Footer from './components/landing/Footer';
import ProtectedRoute from './components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
        <Carousel />
        <About />
        <History />
        <Traditions />
        <Events />
        <Footer />
      </Box>
    </ProtectedRoute>
  );
} 