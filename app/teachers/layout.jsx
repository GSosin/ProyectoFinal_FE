'use client';

import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SchoolIcon from '@mui/icons-material/School';

export default function TeachersLayout({ children }) {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Inicio', href: '/' },
      { label: 'Docentes', href: '/teachers' }
    ];

    if (pathname.includes('/calendar')) {
      items.push({ label: 'Mi Calendario', href: '/teachers/calendar' });
    } else if (pathname.includes('/edit')) {
      items.push({ label: 'Editar Perfil', href: pathname });
    }

    return items;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f8fa', pt: 8 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 3,
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center'
            }
          }}
        >
          {getBreadcrumbItems().map((item, index) => (
            <Link
              key={index}
              href={item.href}
              style={{
                textDecoration: 'none',
                color: index === getBreadcrumbItems().length - 1 ? '#1565c0' : '#546e7a',
                fontWeight: index === getBreadcrumbItems().length - 1 ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {index === 0 && <SchoolIcon sx={{ fontSize: 16 }} />}
              {item.label}
            </Link>
          ))}
        </Breadcrumbs>

        {/* Content */}
        {children}
      </Container>
    </Box>
  );
} 