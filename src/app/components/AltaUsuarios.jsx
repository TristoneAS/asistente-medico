"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import Mensaje from "./Mensaje";
import { useRouter } from "next/navigation";

export default function AltaUsuarios() {
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error");
  const [datos, setDatos] = useState({
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmar_contraseña: "",
    tipo_usuario: "cliente",
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const Advertencia = (mensaje) => {
    setMensaje(mensaje);
    setEstado("warning");
    setOpenError(true);
  };

  const Success = (title) => {
    setMensaje(title + "guardado correctamente");
    setEstado("success");
    setOpenError(true);
  };

  const handleclickGuardar = async () => {
    try {
      if (
        datos.nombre === "" ||
        datos.apellido === "" ||
        datos.fecha_nacimiento === "" ||
        datos.direccion === "" ||
        datos.telefono === "" ||
        datos.contraseña === "" ||
        datos.confirmar_contraseña === ""
      ) {
        Advertencia("Debes llenar todos los datos");
      } else if (datos.contraseña !== datos.confirmar_contraseña) {
        Advertencia("Las contraseñas no coinciden");
      } else {
        const buscartelefono = await axios.get(
          `/api/usuarios/?telefono=${datos.telefono}`
        );

        if (buscartelefono.data.length > 0) {
          Advertencia("Este teléfono ya se encuentra registrado");
        } else {
          await axios.post("/api/usuarios/", datos);
          Success("Usuario ");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const irAlLogin = () => {
    router.push("/");
  };

  useEffect(() => {
    axios
      .get("/api/usuarios")
      .then((response) => {
        const nuevoId = response.data[0].nuevo_id;
        setDatos((prev) => ({
          ...prev,
          id: nuevoId,
        }));
      })
      .catch((error) => {
        console.error("Error al cargar los usuarios:", error);
      });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f6ebe9", // tono beige suave
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 450,
          borderRadius: "16px",
          backgroundColor: "white",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleclickGuardar();
            }
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#6d6875",
            }}
          >
            Registro de Usuario
          </Typography>

          <TextField
            name="id"
            label="ID Usuario"
            variant="outlined"
            value={datos.id}
            disabled
            fullWidth
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                color: "black",
                WebkitTextFillColor: "black",
              },
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
          />

          <TextField
            name="nombre"
            label="Nombre"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="apellido"
            label="Apellido"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="fecha_nacimiento"
            label="Fecha de Nacimiento"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              const value = e.target.value;
              if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                setDatos({ ...datos, fecha_nacimiento: value });
              }
            }}
            onClick={(e) => e.target.showPicker?.()}
            fullWidth
          />
          <FormControl fullWidth>
            <TextField
              name="direccion"
              label="Direccion"
              variant="outlined"
              onChange={handleChange}
              fullWidth
            />
          </FormControl>
          <TextField
            name="telefono"
            label="Teléfono"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="contraseña"
            label="Contraseña"
            type="password"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="confirmar_contraseña"
            label="Confirmar Contraseña"
            type="password"
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />

          <Button
            size="large"
            variant="contained"
            disableElevation
            fullWidth
            onClick={handleclickGuardar}
            sx={{
              mt: 2,
              backgroundColor: "#b5838d", // rosado oscuro elegante
              "&:hover": { backgroundColor: "#a06b75" },
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Confirmar
          </Button>

          <Link
            component="button"
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              irAlLogin();
            }}
            sx={{
              mt: 1,
              alignSelf: "center",
              color: "#b5838d",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Regresar
          </Link>
        </Box>
      </Paper>

      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />
    </div>
  );
}
