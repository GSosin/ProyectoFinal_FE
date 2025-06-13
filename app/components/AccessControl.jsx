"use client";

import useHasPermission from '../hooks/useHasPermission';

export default function AccessControl({ permission, children, fallback = null }) {
  
  const hasPermission = useHasPermission(permission);
  if (!hasPermission) return fallback;
  return <>{children}</>;
} 