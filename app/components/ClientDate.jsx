"use client";
import { Typography } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ClientDate({ date, formatStr = "PPPp", ...props }) {
  if (!date) return null;
  return (
    <Typography component="span" {...props}>
      {format(new Date(date), formatStr, { locale: es })}
    </Typography>
  );
} 