"use client";
import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, MenuItem, Button } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import axios from "axios";
import Mensaje from "./Mensaje";
import { useRouter } from "next/navigation";
import { Typography, Link } from "@mui/material";

export default function AltaUsuarios() {
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [openError, setOpenError] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("error"); // success, error, warning, info
  const [datos, setDatos] = useState({
    id: "",
    nombre: "",
    apellido: "",
    correo: "",
    fecha_nacimiento: "",
    genero: "",
    contraseña: "",
    confirmar_contraseña: "",
  });

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    console.log(datos);
  };
  const handleChangeGenero = (e) => {
    const selectedValue = e.target.value;
    setValor(selectedValue);
    setDatos((prev) => ({
      ...prev,
      genero: selectedValue,
    }));
    console.log(datos);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
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
        datos.genero === "" ||
        datos.correo === "" ||
        datos.contraseña === "" ||
        datos.confirmar_contraseña === ""
      ) {
        Advertencia("Debes llenar todos los datos");
      } else if (datos.contraseña !== datos.confirmar_contraseña) {
        console.log(datos.contraseña);
        console.log(datos.confirmar_contraseña);

        Advertencia("Las contraseñas no coinciden");
      } else {
        const buscarCorreo = await axios.get(
          `/api/usuarios/?correo=${datos.correo}`
        );

        if (buscarCorreo.data.length > 0) {
          Advertencia("Este correo ya se encuentra registrado");
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
        display: "flex",

        height: "100vh",
        width: "800px",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2.5, // Espacio uniforme entre campos
        }}
      >
        <h5 style={{ textAlign: "center", marginBottom: "16px" }}>
          Ingresa todos los datos
        </h5>

        {/* Estilo unificado para todos los TextField */}
        {/** Puedes incluso sacarlo a una variable `const textFieldStyles = { ... }` **/}
        <FormControl fullWidth>
          <TextField
            name="id"
            label="Id Usuario"
            variant="outlined"
            value={datos.id}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                color: "black",
                WebkitTextFillColor: "black",
              },
              backgroundColor: "#f5f5f5",
              borderRadius: 1,
            }}
            fullWidth
          />
          <TextField
            name="nombre"
            label="Nombre"
            variant="outlined"
            onChange={handleChange}
            inputProps={{ maxLength: 30 }}
            fullWidth
          />
          <TextField
            name="apellido"
            label="Apellido"
            variant="outlined"
            onChange={handleChange}
            inputProps={{ maxLength: 30 }}
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
              // Validamos que sea una fecha válida o lo dejamos vacío
              if (!value || /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                setDatos({ ...datos, fecha_nacimiento: value });
              }
            }}
            onClick={(e) => e.target.showPicker?.()}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="genero-label">Género</InputLabel>
            <Select
              labelId="genero-label"
              label="Género"
              value={valor}
              onChange={handleChangeGenero}
            >
              <MenuItem value="Masculino">Masculino</MenuItem>
              <MenuItem value="Femenino">Femenino</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="correo"
            label="Correo"
            variant="outlined"
            type="email"
            value={datos.correo}
            onChange={handleChange}
            inputProps={{ maxLength: 99 }}
            fullWidth
          />
          <TextField
            name="contraseña"
            label="Contraseña"
            variant="outlined"
            type="password"
            onChange={handleChange}
            inputProps={{ maxLength: 99 }}
            fullWidth
          />
          <TextField
            name="confirmar_contraseña"
            label="Confirmar Contraseña"
            variant="outlined"
            type="password"
            onChange={handleChange}
            inputProps={{ maxLength: 99 }}
            fullWidth
          />{" "}
          <Link
            component="button"
            variant="body2"
            onClick={(e) => {
              e.preventDefault();
              irAlLogin();
            }}
            sx={{ mt: 1, alignSelf: "center" }}
          >
            Regresar
          </Link>
        </FormControl>

        <Button
          size="large"
          variant="contained"
          disableElevation
          fullWidth
          onClick={handleclickGuardar}
          sx={{ mt: 2 }}
        >
          Confirmar
        </Button>
      </Box>
      <Mensaje
        mensaje={mensaje}
        estado={estado}
        open={openError}
        onClose={() => setOpenError(false)}
      />
    </div>
  );
}
const textFieldStyles = {
  "& .MuiInputBase-input": {
    color: "black", // Texto en negro
  },
  /*  "& .MuiInputLabel-root": {
    color: "black", // Label en negro
  }, */
  /* "& .MuiInput-underline:before": {
    borderBottomColor: "black", // Línea inferior en negro
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "black",
  }, */
};
