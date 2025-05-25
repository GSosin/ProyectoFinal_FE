'use client';

import { useState, useEffect } from 'react';
import { Button, Box, Typography, IconButton, Grid, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { uploadImage } from '../services/firebase/storage';

const ActivityImageEditor = ({ images = [], onImagesChange }) => {
    const [currentImages, setCurrentImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Inicializar con las imágenes existentes
    useEffect(() => {
        if (images && Array.isArray(images)) {
            setCurrentImages(images);
        }
    }, [images]);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
            setError(null);
        }
    };

    const handleRemoveExisting = (index) => {
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setCurrentImages(updatedImages);
        if (onImagesChange) {
            onImagesChange(updatedImages);
        }
    };

    const handleRemoveSelected = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadNew = async () => {
        if (selectedFiles.length === 0) {
            setError('Por favor selecciona al menos una imagen');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const uploadPromises = selectedFiles.map(async (file) => {
                const path = `activities/${Date.now()}_${file.name}`;
                const url = await uploadImage(file, path);
                return {
                    url,
                    path,
                    name: file.name
                };
            });

            const uploadedImages = await Promise.all(uploadPromises);
            const updatedImages = [...currentImages, ...uploadedImages];
            
            setCurrentImages(updatedImages);
            setSelectedFiles([]);
            
            if (onImagesChange) {
                onImagesChange(updatedImages);
            }
            
        } catch (err) {
            setError('Error al subir las imágenes: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Imágenes existentes */}
            {currentImages.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Imágenes actuales:
                    </Typography>
                    <Grid container spacing={2}>
                        {currentImages.map((image, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 2
                                    }}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Imagen ${index + 1}`}
                                        style={{ 
                                            width: '100%', 
                                            height: 200, 
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveExisting(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            color: 'error.main',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,1)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    {image.main && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                left: 8,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Principal
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Archivos seleccionados para subir */}
            {selectedFiles.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Nuevas imágenes seleccionadas:
                    </Typography>
                    <Grid container spacing={2}>
                        {selectedFiles.map((file, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper 
                                    elevation={2}
                                    sx={{ 
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 2
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Nueva imagen ${index + 1}`}
                                        style={{ 
                                            width: '100%', 
                                            height: 200, 
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveSelected(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            color: 'error.main',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,1)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Controles para agregar nuevas imágenes */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="activity-image-upload"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                />
                <label htmlFor="activity-image-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<AddPhotoAlternateIcon />}
                        disabled={loading}
                    >
                        Seleccionar Imágenes
                    </Button>
                </label>

                {selectedFiles.length > 0 && (
                    <Button
                        variant="contained"
                        onClick={handleUploadNew}
                        disabled={loading}
                    >
                        {loading ? 'Subiendo...' : `Subir ${selectedFiles.length} imagen${selectedFiles.length > 1 ? 'es' : ''}`}
                    </Button>
                )}
            </Box>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {currentImages.length === 0 && selectedFiles.length === 0 && (
                <Box 
                    sx={{ 
                        border: '2px dashed #ddd',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        mt: 2
                    }}
                >
                    <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                        No hay imágenes. Selecciona algunas para agregar.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ActivityImageEditor; 