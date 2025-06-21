"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { apiService } from "../../../services/api";

export default function RegisterParticipantsPage() {
  const { id } = useParams();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    fetchAttendances();
  }, [id]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.get(`/attendance/activity/${id}`);
      const safeData = Array.isArray(data) ? data : [];
      setAttendances(safeData);
      setError(null);
    } catch (err) {
      setError("Error al cargar las inscripciones");
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (enrollmentId) => {
    setSelectedIds((prev) =>
      prev.includes(enrollmentId)
        ? prev.filter((id) => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === attendances.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(attendances.map((e) => e.id));
    }
  };

  const handleAttendanceChange = async (attendanceId, status) => {
    try {
      setAttendances((prev) =>
        prev.map((a) => (a.id === attendanceId ? { ...a, status } : a))
      );
      // Llama al backend para actualizar
      const response = await apiService.put(`/attendance/${attendanceId}`, {
        status,
      });
      if (response && response.success) {
        setSuccessMsg("Asistencia actualizada correctamente");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setError("Error al actualizar la asistencia");
    }
  };

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

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={{ mb: 4 }}
      >
        Registrar Participantes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {attendances?.length ? (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedIds.length === attendances.length &&
                      attendances.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < attendances.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Asistencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(attendance.id)}
                      onChange={() => handleSelect(attendance.id)}
                    />
                  </TableCell>
                  <TableCell>{attendance.id}</TableCell>
                  <TableCell>{attendance.Enrollment.User.firstName}</TableCell>
                  <TableCell>{attendance.Enrollment.User.lastName}</TableCell>
                  <TableCell>
                    <Select
                      value={attendance.status}
                      onChange={(e) =>
                        handleAttendanceChange(attendance.id, e.target.value)
                      }
                    >
                      <MenuItem value="Presente">Presente</MenuItem>
                      <MenuItem value="Ausente">Ausente</MenuItem>
                      <MenuItem value="Justificado">Justificado</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" textAlign="center">
          No hay inscripciones para esta actividad
        </Typography>
      )}
    </Box>
  );
}
