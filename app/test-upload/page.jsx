'use client';

import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { Box, Typography, Paper } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';

export default function TestUploadPage(props) {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImagesUploaded = (images) => {
        console.log('Imágenes subidas:', images);
        setUploadedImages(images);
    };

    return (
        <ProtectedRoute>
            <Box sx={{ padding: '2rem' }}>
                <Typography variant="h4" gutterBottom>
                    Prueba de Subida de Imágenes
                </Typography>

                <ImageUpload 
                    onImagesUploaded={handleImagesUploaded}
                    multiple={true}
                />
            </Box>
        </ProtectedRoute>
    );
} 