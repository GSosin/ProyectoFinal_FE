"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Button,
  CircularProgress,
  ImageListItem,
  ImageList,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { apiService } from "../services/api";
import styles from "./Activities.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReusableMenu from "../components/generics/menuOption/menuOption";
import { activityEndpoints } from "../services/endpoints/activities";
import ProtectedRoute from "../components/ProtectedRoute";
import { getStatusColor } from "../utils/activityUtils";
import ClientDate from "../components/ClientDate";
import AccessControl from "../components/AccessControl";

const ActivitiesPage = () => {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await apiService.get("/activities");
        setActivities(data);
      } catch (err) {
        setError("Error al cargar las actividades");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleViewActivity = (id) => {
    router.push(`/activities/${id}`);
  };
  const handleCreateActivity = () => {
    router.push("/activities/create");
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Container>
    );
  }

  //dropdown options
  const handleEdit = (id) => {
    showMessage("Función de editar ejecutada");
    console.log("Editando elemento...");
  };

  const handleDelete = async (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmDelete.id;
    if (!id) return;
    try {
      await activityEndpoints.deleteActivity(id);
      setActivities((prev) => ({
        ...prev,
        data: prev.data.filter((activity) => activity.id !== id),
      }));
    } catch (err) {
      console.error("Error al eliminar actividad:", err);
      setError("Error al eliminar la actividad");
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, id: null });
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" className={styles.container}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              backgroundImage:
                "linear-gradient(90deg, #1a237e 0%, #303f9f 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Actividades
          </Typography>
          <AccessControl permission="manage_activities">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateActivity}
              sx={{
                fontWeight: "medium",
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                },
              }}
            >
              Crear Actividad
            </Button>
          </AccessControl>
        </Box>

        {activities.length === 0 ? (
          <Box className={styles.noActivities}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay actividades disponibles
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateActivity}
              sx={{ mt: 2 }}
            >
              Crear la primera actividad
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {activities.data.map((activity) => {
              const mainImage = activity.images.find((image) => image.main);
              const simpleMenuItems = [
                {
                  id: "edit-simple",
                  label: "Editar",
                  icon: EditIcon,
                  onClick: handleEdit,
                  data: activity.id,
                },
                {
                  id: "delete-simple",
                  label: "Eliminar",
                  icon: DeleteIcon,
                  onClick: handleDelete,
                  data: activity.id,
                },
              ];

              return (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card
                    className={styles.card}
                    sx={{
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 420,
                      maxHeight: 480,
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleViewActivity(activity.id)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <ImageList
                        cols={4}
                        gap={10}
                        className={styles.image}
                        sx={{ minHeight: 200, maxHeight: 200, height: 200 }}
                      >
                        {mainImage && (
                          <ImageListItem key={mainImage.id}>
                            <img
                              src={mainImage.url}
                              alt={`Imagen de ${activity.title}`}
                              loading="lazy"
                              className={styles.activityImage}
                              style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </ImageListItem>
                        )}
                      </ImageList>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "16px",
                          right: "16px",
                          zIndex: 1,
                        }}
                      >
                        <Chip
                          label={activity.status}
                          color={getStatusColor(activity.status)}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                          }}
                        />
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={activity.Category?.name || "Sin categoría"}
                            size="small"
                            sx={{
                              backgroundColor: "rgba(0,0,0,0.06)",
                              fontWeight: "medium",
                            }}
                          />
                        </Box>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {activity.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 2,
                          }}
                        >
                          <div>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <CalendarTodayIcon
                                fontSize="small"
                                sx={{ color: "primary.main", opacity: 0.8 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                <ClientDate
                                  date={activity.startDate}
                                  formatStr="PPP"
                                />
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <LocationOnIcon
                                fontSize="small"
                                sx={{ color: "error.main", opacity: 0.8 }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {activity.Location?.name || "Sin ubicación"}
                              </Typography>
                            </Box>
                          </div>
                          <AccessControl permission="manage_activities">
                            <div className={styles.menuItems}>
                              <ReusableMenu
                                buttonText="Acciones"
                                menuItems={simpleMenuItems}
                                buttonVariant="outlined"
                                buttonColor="secondary"
                              />
                            </div>
                          </AccessControl>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog open={confirmDelete.open} onClose={handleCancelDelete}>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar esta actividad? Esta acción
              no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancelar</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
};

export default ActivitiesPage;
