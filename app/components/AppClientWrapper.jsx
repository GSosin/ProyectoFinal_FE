"use client";

import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { CircularProgress } from '@mui/material';
import styles from '../styles/layout.module.css';

export default function AppClientWrapper({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const { hydrate } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    hydrate();
    setLoading(false);
  }, [hydrate]);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return <>{children}</>;
} 