"use client";

import { useState, useEffect } from "react";
import { Box, Card, Typography, Avatar, Chip, Divider, Grid, Button, TextField, IconButton, CircularProgress } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthStore from '../../store/authStore';
import { apiService } from '../../services/api';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { authEndpoints } from '../../services/endpoints/auth';
import { uploadImage } from '../../services/firebase/storage';

export default function EditMyProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [biography, setBiography] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [newCred, setNewCred] = useState({ title: "", institution: "" });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const {data} = await authEndpoints.getCurrentUser();
        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setBirthDate(data.birthDate ? new Date(data.birthDate) : null);
        setPhone(data.phone || "");
        setProfilePicture(data.profilePicture || data.photo || "");
        setBiography(data.biography || "");
        setCertifications(data.certifications || []);
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al cargar el usuario', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleCredChange = (idx, field, value) => {
    setCertifications((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const handleAddCred = () => {
    if (!newCred.title.trim() || !newCred.institution.trim()) return;
    setCertifications((prev) => [...prev, { ...newCred, id: Date.now() }]);
    setNewCred({ title: "", institution: "" });
  };

  const handleRemoveCred = (id) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const path = `profilePictures/${user.id}_${Date.now()}_${file.name}`;
        const url = await uploadImage(file, path);
        setProfilePicture(url);
        setSnackbar({ open: true, message: 'Imagen subida correctamente', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: 'Error al subir la imagen', severity: 'error' });
      } finally {
        setUploading(false);
      }
    }
  };

  // Simulate save
  const handleSave = async () => {
    setSaving(true);
    const payload = {
      firstName,
      lastName,
      email,
      birthDate: birthDate ? birthDate.toISOString().substring(0, 10) : null,
      phone,
      profilePicture,
    };
    if (user && user.roleId === 2) {
      payload.biography = biography;
      payload.certifications = certifications.map(({ title, institution }) => ({ title, institution }));
    }
    try {
      await apiService.put(`/users/${user.id}`, payload);
      setSnackbar({ open: true, message: 'Perfil guardado correctamente', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar el perfil', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", py: 6 }}>
      <Card elevation={3} sx={{ borderRadius: 4, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={profilePicture} alt={firstName + ' ' + lastName} sx={{ width: 96, height: 96, boxShadow: 2 }} />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureChange}
              disabled={uploading}
            />
            <label htmlFor="profile-picture-upload">
              <Button
                variant="contained"
                component="span"
                size="small"
                sx={{ position: 'absolute', bottom: 0, left: 0, minWidth: 0, px: 1, py: 0.5 }}
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : 'Cambiar'}
              </Button>
            </label>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  type="email"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  fullWidth
                  type="tel"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de nacimiento"
                  type="date"
                  value={birthDate ? birthDate.toISOString().substring(0, 10) : ''}
                  onChange={e => setBirthDate(e.target.value ? new Date(e.target.value) : null)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {user.roleId === 2 && (
          <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Biografía
            </Typography>
            <TextField
              multiline
              minRows={3}
              fullWidth
              value={biography}
              onChange={e => setBiography(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Certificaciones
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {certifications.map((cred, idx) => (
                <Grid item xs={12} sm={6} key={cred.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SchoolIcon color="success" />
                    <TextField
                      label="Título"
                      value={cred.title}
                      onChange={e => handleCredChange(idx, "title", e.target.value)}
                      size="small"
                      sx={{ flex: 1, mr: 1 }}
                    />
                    <TextField
                      label="Institución"
                      value={cred.institution}
                      onChange={e => handleCredChange(idx, "institution", e.target.value)}
                      size="small"
                      sx={{ flex: 1, mr: 1 }}
                    />
                    <IconButton onClick={() => handleRemoveCred(cred.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <TextField
                label="Título"
                value={newCred.title}
                onChange={e => setNewCred(c => ({ ...c, title: e.target.value }))}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Institución"
                value={newCred.institution}
                onChange={e => setNewCred(c => ({ ...c, institution: e.target.value }))}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddCred} variant="contained" color="primary" startIcon={<AddIcon />}>
                Agregar
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined">Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
} 