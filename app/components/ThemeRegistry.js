"use client";
import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    background: {
      default: '#fff',
    },
  },
});

export default function ThemeRegistry({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

ThemeRegistry.propTypes = {
  children: PropTypes.node,
}; 