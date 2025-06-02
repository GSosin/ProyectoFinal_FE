"use client";
import { Suspense } from 'react';
import Header from './Header/Header';

export default function ClientLayout({ children }) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      {children}
    </>
  );
} 