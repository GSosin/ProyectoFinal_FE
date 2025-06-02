"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { enrollmentEndpoints } from "../../services/endpoints/enrollments";
import ProtectedRoute from "../../components/ProtectedRoute";

const EnrollmentsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const responseData = await enrollmentEndpoints.getAllEnrollments();
      const data = responseData.map((enrollment) => ({
        id: enrollment.id,
        actividad: enrollment.Activity?.title || "",
        usuario: enrollment.User
          ? `${enrollment.User.firstName} ${enrollment.User.lastName}`
          : "",
        email: enrollment.User?.email || "",
        estadoInscripcion: enrollment.status,
        fechaInscripcion: enrollment.enrollmentDate,
        estadoActividad: enrollment.Activity?.status || "",
        fechaActividad: enrollment.Activity?.startDate,
        comentarios: enrollment.comments,
      }));
      setEnrollments(data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar las inscripciones: " +
          (err.message || "Error desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedEnrollment || !status) return;

    try {
      setUpdateLoading(true);
      setStatusError(null);
      await enrollmentEndpoints.updateEnrollmentStatus(
        selectedEnrollment.id,
        status
      );
      await fetchEnrollments();
      setOpenDialog(false);
    } catch (err) {
      setStatusError(err.message || "Error al actualizar el estado");
    } finally {
      setUpdateLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "actividad", headerName: "Actividad", width: 220 },
    { field: "usuario", headerName: "Usuario", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "estadoInscripcion",
      headerName: "Estado Inscripción",
      width: 150,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Activa" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "fechaInscripcion",
      headerName: "Fecha de Inscripción",
      width: 180,
      valueFormatter: (value) => {
        return value
          ? format(new Date(value), "yyyy-MM-dd HH:mm")
          : "No disponible";
      },
    },
    { field: "estadoActividad", headerName: "Estado Actividad", width: 150 },
    {
      field: "fechaActividad",
      headerName: "Fecha Actividad",
      width: 180,
      valueFormatter: (value) =>
        value ? format(new Date(value), "yyyy-MM-dd HH:mm") : "No disponible",
    },
    {
      field: "comentarios",
      headerName: "Comentarios",
      width: 220,
      renderCell: (params) => {
        const comments = params.value || "No hay comentarios";
        return (
          <Tooltip title={comments}>
            <span>{comments}</span>
          </Tooltip>
        );
      },
    },
  ];

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchEnrollments} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Inscripciones
        </Typography>
      </Box>

      <Paper sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={enrollments}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cambiar Estado de Inscripción</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </TextField>
            {statusError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {statusError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnrollmentsPage;
