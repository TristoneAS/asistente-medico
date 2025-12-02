"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Box,
  Menu,
  Divider,
  MenuItem,
  ListItemButton,
  ListItemIcon,
  Badge,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";

const drawerWidth = 240;

const App = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cliente, setCliente] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificacionesSinLeer, setNotificacionesSinLeer] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // 🔹 Mostrar que estamos en el cliente (evita error SSR con localStorage)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🔹 Leer tipo de usuario del localStorage una vez que ya estamos en el cliente
  useEffect(() => {
    if (isClient) {
      const tipo_usuario = localStorage.getItem("tipo_usuario");
      if (tipo_usuario === "admin") setIsAdmin(true);
      if (tipo_usuario === "cliente") setCliente(true);
    }
  }, [isClient]);

  // 🔹 Verificar recordatorios de citas automáticamente
  useEffect(() => {
    const verificarRecordatorios = async () => {
      try {
        await axios.get("/api/verificar-recordatorios-citas");
      } catch (err) {
        console.error("Error al verificar recordatorios:", err);
      }
    };

    // Verificar al cargar la aplicación
    if (isClient) {
      verificarRecordatorios();
      // Verificar cada hora (3600000 ms)
      const interval = setInterval(verificarRecordatorios, 3600000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  // 🔹 Consultar notificaciones cuando el cliente está logueado
  useEffect(() => {
    const fetchNotificacionesSinLeer = async () => {
      if (!isClient || !cliente) return;

      try {
        const id_cliente = localStorage.getItem("id");
        if (id_cliente) {
          const { data } = await axios.get(
            `/api/notificacion/?id_cliente=${id_cliente}`
          );
          setNotificacionesSinLeer(data?.length || 0);
        }
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };

    if (isClient && cliente) {
      fetchNotificacionesSinLeer();
      // Consultar cada 30 segundos para mantener actualizado
      const interval = setInterval(fetchNotificacionesSinLeer, 30000);
      return () => clearInterval(interval);
    }
  }, [isClient, cliente]);

  // 🔹 Recargar notificaciones cuando cambia la ruta (por si marca alguna como leída)
  useEffect(() => {
    const fetchNotificacionesSinLeer = async () => {
      if (!isClient || !cliente) return;

      try {
        const id_cliente = localStorage.getItem("id");
        if (id_cliente) {
          const { data } = await axios.get(
            `/api/notificacion/?id_cliente=${id_cliente}`
          );
          setNotificacionesSinLeer(data?.length || 0);
        }
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };

    if (isClient && cliente) {
      fetchNotificacionesSinLeer();
    }
  }, [pathname, isClient, cliente]);

  // 🔹 Toggle del sidebar
  const handleToggleSidebar = () => setOpen(!open);

  // 🔹 Cerrar sesión
  const handleClickCerrarSesion = () => {
    localStorage.removeItem("apellido");
    localStorage.removeItem("estaAutenticado");
    localStorage.removeItem("fecha_nacimiento");
    localStorage.removeItem("direccion");
    localStorage.removeItem("id");
    localStorage.removeItem("nombre");
    localStorage.removeItem("telefono");
    localStorage.removeItem("tipo_usuario");

    setAnchorEl(null); // cierra el menú
    router.push("/");
  };

  // 🔹 Cierra el menú desplegable
  const handleCloseMenu = () => setAnchorEl(null);

  if (!isClient) return null;

  // 🔹 Opciones del menú lateral
  const menuItemsAdmin = [
    { label: "Horario Médico", path: "/administrador/horario_medico" },
    { label: "Consultar Citas", path: "/administrador/consultar_citas" },
    { label: "Tomarme el Día", path: "/administrador/tomarme_el_dia" },
  ];

  const menuItemsClientes = [
    { label: "Consultar citas", path: "/dashboard" },
    { label: "Notificaciones", path: "/Notificaciones" },
    { label: "Chatbot", path: "/chatbot" },
  ];
  const baseColor = "#f6ebe9"; // ← color del fondo que quieres (beige/rosado claro)

  return (
    <Box sx={{ display: "flex" }}>
      {/* NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: baseColor, // ← color personalizado
          color: "black", // texto oscuro para mejor contraste
          boxShadow: "none", // opcional: quita la sombra azul predeterminada
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            Asistente Médico Virtual
          </Typography>

          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ ml: "auto" }}
          >
            <LogoutIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{ style: { minWidth: "200px" } }}
          >
            <MenuItem onClick={handleClickCerrarSesion}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f6ebe9", // mismo color del AppBar
            color: "black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centra horizontalmente todo
            paddingTop: "1rem",
          },
        }}
      >
        <img
          src="/logo2.jpeg"
          alt="Logo Drawer"
          style={{
            width: "60%",
            marginBottom: "1.5rem",
            marginTop: "2cm",
          }}
        />

        {isAdmin && (
          <List sx={{ width: "100%", padding: 0 }}>
            {" "}
            {/* 🔹 quita padding del List */}
            {menuItemsAdmin.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  justifyContent: "center", // centra el texto con el logo
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{ textAlign: "center" }} // 🔹 texto centrado
                />
              </ListItemButton>
            ))}
          </List>
        )}

        {cliente && (
          <List sx={{ width: "100%", padding: 0 }}>
            {menuItemsClientes.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => router.push(item.path)}
                sx={{
                  justifyContent: "center",
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                <ListItemText
                  primary={
                    item.label === "Notificaciones" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <span>{item.label}</span>
                        <Badge
                          badgeContent={notificacionesSinLeer}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: "#d32f2f",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "0.7rem",
                            },
                          }}
                        >
                          <NotificationsIcon
                            sx={{
                              fontSize: "1.2rem",
                              color:
                                notificacionesSinLeer > 0
                                  ? "#d32f2f"
                                  : "inherit",
                            }}
                          />
                        </Badge>
                      </Box>
                    ) : (
                      item.label
                    )
                  }
                  sx={{ textAlign: "center" }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 1.3s ease",
          marginLeft: open ? `0px` : 0,
          backgroundColor: "white", // ← mantiene el fondo blanco del contenido
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default App;
