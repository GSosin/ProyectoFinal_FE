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
  CardActionArea,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableSortLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
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
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    category: '',
    location: '',
    status: ''
  });
  const [orderBy, setOrderBy] = useState('startDate');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await apiService.get("/activities");
        setActivities(data);
        setFilteredActivities(data);
      } catch (err) {
        setError("Error al cargar las actividades");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    // Filtrar actividades cuando cambian los filtros
    const filtered = activities.data?.filter(activity => {
      const searchTermLower = (term) => term.toLowerCase();
      return (
        activity.title.toLowerCase().includes(searchTermLower(searchFilters.title)) &&
        (activity.Category?.name || '').toLowerCase().includes(searchTermLower(searchFilters.category)) &&
        (activity.Location?.name || '').toLowerCase().includes(searchTermLower(searchFilters.location)) &&
        activity.status.toLowerCase().includes(searchTermLower(searchFilters.status))
      );
    });

    // Aplicar ordenamiento
    const sorted = [...(filtered || [])].sort((a, b) => {
      const isAsc = order === 'asc';
      let comparison = 0;

      switch (orderBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'startDate':
          comparison = new Date(a.startDate) - new Date(b.startDate);
          break;
        case 'category':
          comparison = (a.Category?.name || '').localeCompare(b.Category?.name || '');
          break;
        case 'location':
          comparison = (a.Location?.name || '').localeCompare(b.Location?.name || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }

      return isAsc ? comparison : -comparison;
    });

    setFilteredActivities({ ...activities, data: sorted });
  }, [searchFilters, activities, orderBy, order]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (field) => (event) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleViewActivity = (id) => {
    router.push(`/activities/${id}`);
  };

  const handleCreateActivity = () => {
    router.push("/activities/create");
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

  const handleEdit = (id) => {
    router.push(`/activities/${id}/edit`);
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
      <Container maxWidth={false} disableGutters className={styles.container}>
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

        {/* Filtros de búsqueda */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por título..."
                value={searchFilters.title}
                onChange={handleSearchChange('title')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por categoría..."
                value={searchFilters.category}
                onChange={handleSearchChange('category')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por ubicación..."
                value={searchFilters.location}
                onChange={handleSearchChange('location')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por estado..."
                value={searchFilters.status}
                onChange={handleSearchChange('status')}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Opciones de ordenamiento */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item>
              <TableSortLabel
                active={orderBy === 'title'}
                direction={orderBy === 'title' ? order : 'asc'}
                onClick={() => handleRequestSort('title')}
              >
                Título
              </TableSortLabel>
            </Grid>
            <Grid item>
              <TableSortLabel
                active={orderBy === 'startDate'}
                direction={orderBy === 'startDate' ? order : 'asc'}
                onClick={() => handleRequestSort('startDate')}
              >
                Fecha
              </TableSortLabel>
            </Grid>
            <Grid item>
              <TableSortLabel
                active={orderBy === 'category'}
                direction={orderBy === 'category' ? order : 'asc'}
                onClick={() => handleRequestSort('category')}
              >
                Categoría
              </TableSortLabel>
            </Grid>
            <Grid item>
              <TableSortLabel
                active={orderBy === 'location'}
                direction={orderBy === 'location' ? order : 'asc'}
                onClick={() => handleRequestSort('location')}
              >
                Ubicación
              </TableSortLabel>
            </Grid>
            <Grid item>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleRequestSort('status')}
              >
                Estado
              </TableSortLabel>
            </Grid>
          </Grid>
        </Box>

        {filteredActivities.data?.length === 0 ? (
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
            {filteredActivities.data?.map((activity) => {
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
                <Grid item xs={12} sm={6} md={4} key={activity.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card
                    className={styles.card}
                    sx={{
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      height: "400px",
                      width: { xs: '100%', sm: '360px', md: '400px' },
                      maxWidth: '100%',
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                      }
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
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 160,
                          overflow: "hidden",
                        }}
                      >
                        {mainImage ? (
                          <img
                            src={mainImage.url}
                            alt={`Imagen de ${activity.title}`}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              bgcolor: "grey.200",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography color="text.secondary">
                              Sin imagen
                            </Typography>
                          </Box>
                        )}
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
                      </Box>
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          p: 2,
                          minHeight: 0,
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
                            minHeight: "3.6em",
                            mb: 2,
                          }}
                        >
                          {activity.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: "auto",
                          }}
                        >
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
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
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
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {activity.Location?.name || "Sin ubicación"}
                            </Typography>
                          </Box>
                          <AccessControl permission="manage_activities">
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <ReusableMenu
                                buttonText="Acciones"
                                menuItems={simpleMenuItems}
                                buttonVariant="outlined"
                                buttonColor="secondary"
                                fullWidth
                              />
                            </Box>
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
