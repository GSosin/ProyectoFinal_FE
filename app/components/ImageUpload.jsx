'use client';

import { useState } from 'react';
import { Button, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { uploadImage, deleteImage } from '../services/firebase/storage';

const ImageUpload = ({ onImagesUploaded, multiple = false }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setSelectedFiles(prev => [...prev, ...files]);
            setError(null);
        }
    };

    const handleRemoveSelected = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveUploaded = async (index) => {
        try {
            const imageToRemove = imageUrls[index];
            // Eliminar de Firebase Storage
            await deleteImage(imageToRemove.path);
            // Actualizar estado local
            setImageUrls(prev => prev.filter((_, i) => i !== index));
            // Notificar al componente padre
            if (onImagesUploaded) {
                onImagesUploaded(imageUrls.filter((_, i) => i !== index));
            }
        } catch (err) {
            setError('Error al eliminar la imagen: ' + err.message);
            console.error('Error:', err);
        }
    };

    const handleUpload = async () => {
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
            setImageUrls(prev => [...prev, ...uploadedImages]);
            
            // Llamar al callback con todas las URLs de las imágenes
            if (onImagesUploaded) {
                onImagesUploaded([...imageUrls, ...uploadedImages]);
            }

            // Limpiar archivos seleccionados después de subir
            setSelectedFiles([]);
            
            console.log('Imágenes subidas exitosamente:', uploadedImages);
        } catch (err) {
            setError('Error al subir las imágenes: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                {multiple ? 'Subir Imágenes' : 'Subir Imagen'}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    multiple={multiple}
                    onChange={handleFileSelect}
                />
                <label htmlFor="image-upload">
                    <Button
                        variant="contained"
                        component="span"
                        disabled={loading}
                    >
                        Seleccionar {multiple ? 'Imágenes' : 'Imagen'}
                    </Button>
                </label>
                {selectedFiles.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                            {selectedFiles.length} {selectedFiles.length === 1 ? 'archivo' : 'archivos'} seleccionado{selectedFiles.length === 1 ? '' : 's'}:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedFiles.map((file, index) => (
                                <Box 
                                    key={index} 
                                    sx={{ 
                                        position: 'relative',
                                        width: 100,
                                        height: 100,
                                        border: '1px solid #ddd',
                                        borderRadius: 1,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveSelected(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(255,255,255,0.8)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || loading}
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Subir'}
            </Button>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {imageUrls.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Imágenes subidas:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {imageUrls.map((image, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    position: 'relative',
                                    width: '100%',
                                    maxWidth: 300
                                }}
                            >
                                <img
                                    src={image.url}
                                    alt={`Uploaded ${index + 1}`}
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto', 
                                        maxHeight: 200, 
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveUploaded(index)}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default ImageUpload; 