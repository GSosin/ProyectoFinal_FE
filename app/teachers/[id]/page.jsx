"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Card, Typography, Avatar, Chip, Divider, Grid, CircularProgress } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import { apiService } from '../../services/api';

export default function TeacherProfilePage() {
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      setLoading(true);
      try {
        const { data } = await apiService.get(`/users/${params.id}`);
        console.log(data);
        setTeacher(data);
      } catch (err) {
        setError('Error al cargar el perfil del docente');
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!teacher) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", py: 6 }}>
      <Card elevation={3} sx={{ borderRadius: 4, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar src={teacher.profilePicture || teacher.photo} alt={teacher.firstName + ' ' + teacher.lastName} sx={{ width: 96, height: 96, boxShadow: 2 }} />
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {teacher.firstName} {teacher.lastName}
            </Typography>
            <Chip icon={<BadgeIcon />} label={teacher.roleId === 2 ? "Profesor/a" : "Usuario"} color="primary" />
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {teacher.biography && (
          <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Biografía
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {teacher.biography}
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
        {teacher.certifications && teacher.certifications.length > 0 && (
          <>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Certificaciones
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {teacher.certifications.map((cert, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SchoolIcon color="success" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={500}>{cert.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{cert.institution}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mb: 3 }} />
          </>
        )}
      </Card>
    </Box>
  );
} 