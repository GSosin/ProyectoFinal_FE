'use client';

import { Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { es } from 'date-fns/locale';

export default function DynamicDatePickers({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DateTimePicker
          label="Fecha de inicio *"
          value={startDate}
          onChange={onStartDateChange}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              required: true,
              sx: { flex: 1, minWidth: '200px' }
            } 
          }}
          disablePast
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DateTimePicker
          label="Fecha de fin *"
          value={endDate}
          onChange={onEndDateChange}
          slotProps={{ 
            textField: { 
              fullWidth: true, 
              required: true,
              sx: { flex: 1, minWidth: '200px' }
            } 
          }}
          disablePast
          minDateTime={startDate}
        />
      </LocalizationProvider>
    </Box>
  );
}