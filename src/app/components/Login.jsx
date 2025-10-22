"use client";
import React, { useState } from "react"; // Importa useEffect y useState
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Link } from "@mui/material";
import Mensaje from "./Mensaje";
import axios from "axios";

import { Paper } from "@mui/material";
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
          backgroundColor: "#f0f0f0",
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
    correo: "",
    contraseña: "",
  });
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const irARegistrarse = () => {
    router.push("/registrarse");
  };
  const handleClickIniciar = async () => {
    if (user.correo === "" || user.contraseña === "") {
      Advertencia("Debes llenar todos los campos");
      return;
    } else {
      const buscarCorreo = await axios.get(
        `/api/usuarios/?correo=${user.correo}`
      );

      if (buscarCorreo.data.length > 0) {
        if (user.contraseña !== buscarCorreo.data[0].contraseña) {
          Error("La contraseña es incorrecta");
        } else {
          Success("Iniciando sesion");
          localStorage.setItem("id", buscarCorreo.data[0].id);
          localStorage.setItem("nombre", buscarCorreo.data[0].nombre);
          localStorage.setItem("apellido", buscarCorreo.data[0].apellido);
          localStorage.setItem("correo", buscarCorreo.data[0].correo);
          localStorage.setItem(
            "fecha_nacimiento",
            buscarCorreo.data[0].fecha_nacimiento
          );
          localStorage.setItem("genero", buscarCorreo.data[0].genero);
          localStorage.setItem("estaAutenticado", "true");

          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } else {
        Advertencia("El usuario no existe");
      }
    }
  };
  /*  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (user.user === "" || user.password === "") {
        setSnackbarMessage("Favor de llenar todos los campos");
        setSnackbarSeverity("warning");
        setOpenSnackbar(true);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/MATERIAL_FLOW_AD/AUTHENTICATE`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.user.trim(),
              password: user.password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.authorization !== "Unauthorized") {
          setSnackbarMessage("Iniciando Sesion");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);

          localStorage.setItem("user", JSON.stringify(data));
          localStorage.setItem("isAuthenticated", "true");

          setTimeout(() => {
            router.push("/dashboard/nuevofolio");
            localStorage.setItem("titulo", "Nuevo Folio");
          }, 500);
        } else {
          setSnackbarMessage(
            "Error en autenticación: " +
              (data.message || "Credenciales inválidas")
          );
          setLoading(false);

          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage(
          "Error al conectar con el servidor, contacte a soporte"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        setLoading(false);
      }
    }
  }; */
  /*  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.user === "" || user.password === "") {
      setSnackbarMessage("Favor de llenar todos los campos");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/MATERIAL_FLOW_AD/AUTHENTICATE`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.user.trim(),
            password: user.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.authorization !== "Unauthorized") {
        setSnackbarMessage("Iniciando Sesion");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("isAuthenticated", "true");

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setSnackbarMessage(
          "Error en autenticación: " +
            (data.message || "Credenciales inválidas")
        );
        setLoading(false);

        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage(
        "Error al conectar con el servidor, contacte a soporte"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  }; */
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
      <Paper elevation={24} sx={{ p: 5, mx: "auto", mt: 1, width: "500px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Logo"
            style={{ width: 250, marginBottom: 20 }}
          />

          <Typography variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>

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
          >
            <TextField
              name="correo"
              label="Correo"
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
              variant="contained"
              size="large"
              disableElevation
              sx={{ mt: 2 }}
              fullWidth
              onClick={handleClickIniciar}
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
              sx={{ mt: 1, alignSelf: "center" }}
            >
              Regístrate
            </Link>
          </Box>
        </Box>
      </Paper>

      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
