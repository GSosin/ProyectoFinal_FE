'use client';

import { Alert, Snackbar } from '@mui/material';

const CustomAlert = ({ message, onClose, severity = 'error', duration = 3000, open }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert 
                severity={severity}
                onClose={handleClose}
                sx={{ 
                    width: '100%',
                    minWidth: '300px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 'medium'
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert; 