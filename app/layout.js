'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { usePathname } from 'next/navigation';
import ProtectedRoute from './components/generics/ProtectedRoute';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 