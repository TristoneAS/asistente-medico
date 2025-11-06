"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Link, Paper } from "@mui/material";
import Mensaje from "./Mensaje";
import axios from "axios";

export default function Login() {
  return (
    <>
      <div
        className="card"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6ebe9", // ← mismo tono beige del resto
        }}
      >
        <div className="card-body">
          <Formulario />
        </div>
      </div>
    </>
  );
}

export function Formulario() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error"); // success, error, warning, info

  const [user, setUser] = useState({
    telefono: "",
    contraseña: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const irARegistrarse = () => {
    router.push("/registrarse");
  };

  const handleClickIniciar = async () => {
    if (user.telefono === "" || user.contraseña === "") {
      Advertencia("Debes llenar todos los campos");
      return;
    } else {
      try {
        setLoading(true);
        const buscartelefono = await axios.get(
          `/api/usuarios/?telefono=${user.telefono}`
        );

        if (buscartelefono.data.length > 0) {
          if (user.contraseña !== buscartelefono.data[0].contraseña) {
            Error("La contraseña es incorrecta");
          } else {
            Success("Iniciando sesión...");
            localStorage.setItem("id", buscartelefono.data[0].id);
            localStorage.setItem("nombre", buscartelefono.data[0].nombre);
            localStorage.setItem("apellido", buscartelefono.data[0].apellido);
            localStorage.setItem("telefono", buscartelefono.data[0].telefono);
            localStorage.setItem(
              "tipo_usuario",
              buscartelefono.data[0].tipo_usuario
            );
            localStorage.setItem(
              "fecha_nacimiento",
              buscartelefono.data[0].fecha_nacimiento
            );
            localStorage.setItem("direccion", buscartelefono.data[0].direccion);
            localStorage.setItem("estaAutenticado", "true");
            if (buscartelefono.data[0].tipo_usuario === "cliente") {
              setTimeout(() => {
                router.push("/chatbot");
              }, 2000);
            } else {
              setTimeout(() => {
                router.push("/administrador");
              }, 2000);
            }
          }
        } else {
          Advertencia("El usuario no existe");
        }
      } catch (err) {
        Error("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    }
  };

  const Advertencia = (mensaje) => {
    setMensaje(mensaje);
    setEstado("warning");
    setOpenError(true);
  };

  const Error = (mensaje) => {
    setMensaje(mensaje);
    setEstado("error");
    setOpenError(true);
  };

  const Success = (mensaje) => {
    setMensaje(mensaje);
    setEstado("success");
    setOpenError(true);
  };

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          p: 5,
          mx: "auto",
          mt: 1,
          width: "400px",
          backgroundColor: "white",
          borderRadius: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/logo2.jpeg"
            alt="Logo"
            style={{ width: 250, marginBottom: 20 }}
          />

          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#6d6875", fontWeight: "bold" }} // tono neutro oscuro
          >
            Iniciar Sesión
          </Typography>

          {/* 🔹 AQUÍ EL CAMBIO IMPORTANTE: el form maneja Enter */}
          <Box
            component="form"
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            noValidate
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault(); // evita refresco
              handleClickIniciar(); // ejecuta el login
            }}
          >
            <TextField
              name="telefono"
              label="Teléfono"
              variant="standard"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="contraseña"
              type="password"
              label="Contraseña"
              variant="standard"
              onChange={handleChange}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disableElevation
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#b5838d", // ← color rosado oscuro elegante
                "&:hover": { backgroundColor: "#a06b75" }, // tono más oscuro al pasar el mouse
                color: "white",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
            >
              Iniciar Sesión
            </Button>

            <Link
              component="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                irARegistrarse();
              }}
              sx={{
                mt: 1,
                alignSelf: "center",
                color: "#b5838d",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Regístrate
            </Link>
          </Box>
        </Box>
      </Paper>

      {/* Snackbar / Mensaje */}
      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />

      {/* Cargando */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
