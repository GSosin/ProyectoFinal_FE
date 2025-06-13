"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
import useIsAdmin from "../../hooks/useIsAdmin";

// Paleta de colores consistente
const theme = {
  primary: {
    main: "#1565c0", // Azul francia principal
    light: "#1976d2", // Azul francia claro
    dark: "#0d47a1", // Azul francia oscuro
    contrastText: "#fff", // Texto en contraste (blanco)
  },
  text: {
    primary: "#212121", // Texto principal casi negro
    secondary: "#546e7a", // Texto secundario gris azulado
    light: "#ffffff", // Texto claro (blanco)
  },
};

// Configuración del menú
const menuItems = [
  { id: "home", label: "Inicio", path: "/" },
  { id: "about", label: "Sobre nosotros", path: "/#about" },
  { id: "history", label: "Historia", path: "/#history" },
  { id: "traditions", label: "Tradiciones", path: "/#traditions" },
  { id: "events", label: "Encuentros", path: "/#events" },
  { id: "activities", label: "Actividades", path: "/activities" },
];

export default function Header() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const isAdmin = useIsAdmin();
  const [currentHash, setCurrentHash] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    updateHash();
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  const handleMenuClick = (path) => {
    if (path.includes("#")) {
      const [basePath, hash] = path.split("#");
      if (pathname !== basePath) {
        router.push(path);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.location.hash = `#${hash}`;
        }
      }
    } else {
      router.push(path);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    router.push("/me/edit");
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    const authStore = useAuthStore.getState();
    await authStore.logout();
    router.push("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.background?.default || "#fff",
        color: theme.primary.main,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        borderBottom: `1px solid ${theme.primary.main}10`,
        position: "fixed",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <Box
            sx={{
              position: "relative",
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              border: `2px solid ${theme.primary.main}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              padding: "2px",
            }}
          >
            <Image
              src="/logo-hatzeira.png"
              alt="Logo Israel Hatzeira"
              width={isMobile ? 40 : 50}
              height={isMobile ? 40 : 50}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="div"
            color={theme.primary.main}
            fontWeight={700}
            sx={{
              display: { xs: "none", sm: "block" },
              ml: 1,
              letterSpacing: "0.5px",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "30%",
                height: "3px",
                backgroundColor: theme.primary.main,
                bottom: "-4px",
                left: "0",
                borderRadius: "2px",
              },
            }}
          >
            Israel Hatzeirá
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {menuItems.map((item) => {
              const [basePath, hash] = item.path.split("#");
              let isActive = false;
              if (item.id === "home") {
                isActive =
                  pathname === "/" && (!currentHash || currentHash === "#");
              } else if (hash) {
                isActive = pathname === basePath && currentHash === `#${hash}`;
              } else {
                isActive = pathname === item.path;
              }
              return (
                <Button
                  key={item.id}
                  color="inherit"
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? theme.primary.main : theme.text.secondary,
                    borderBottom: isActive
                      ? `2px solid ${theme.primary.main}`
                      : "none",
                    borderRadius: "4px 4px 0 0",
                    px: 2,
                    py: 1,
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: theme.primary.main,
                      backgroundColor: `${theme.primary.main}08`,
                      borderBottom: `2px solid ${theme.primary.main}40`,
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            {isAdmin && (
              <Button
                key="admin"
                color="inherit"
                onClick={() => handleMenuClick("/admin")}
                sx={{
                  fontWeight: pathname.startsWith("/admin") ? 600 : 400,
                  color: pathname.startsWith("/admin")
                    ? theme.primary.main
                    : theme.text.secondary,
                  borderBottom: pathname.startsWith("/admin")
                    ? `2px solid ${theme.primary.main}`
                    : "none",
                  borderRadius: "4px 4px 0 0",
                  px: 2,
                  py: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  "&:hover": {
                    color: theme.primary.main,
                    backgroundColor: `${theme.primary.main}08`,
                    borderBottom: `2px solid ${theme.primary.main}40`,
                  },
                }}
              >
                Admin
              </Button>
            )}
          </Box>

          {isLoggedIn ? (
            <Box>
              <Box
                onClick={handleProfileMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: `${theme.primary.main}10`,
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: `${theme.primary.main}15`,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.primary.main,
                    fontWeight: 500,
                  }}
                >
                  ¡Hola, {user?.firstName + " " + user?.lastName || "Usuario"}!
                </Typography>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                    mt: 1.5,
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Salir</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{
                bgcolor: theme.primary.main,
                color: "white",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  bgcolor: theme.primary.dark,
                },
              }}
            >
              Iniciar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
