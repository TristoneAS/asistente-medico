"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function TomarDescanso() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  // Datos de ejemplo para la tabla (puedes reemplazarlos con datos reales)
  const [rows] = useState([
    {
      id: 1,
      hora: "09:00",
      paciente: "Juan Pérez",
      motivo: "Consulta general",
      estado: "Confirmada",
    },
    {
      id: 2,
      hora: "10:30",
      paciente: "María García",
      motivo: "Revisión",
      estado: "Pendiente",
    },
    {
      id: 3,
      hora: "14:00",
      paciente: "Carlos López",
      motivo: "Seguimiento",
      estado: "Confirmada",
    },
  ]);

  const columns = [
    {
      field: "hora",
      headerName: "Hora",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paciente",
      headerName: "Paciente",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "motivo",
      headerName: "Motivo",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleFechaChange = (nuevaFecha) => {
    setFechaSeleccionada(nuevaFecha);
    if (nuevaFecha) {
      console.log("Fecha seleccionada:", nuevaFecha);
    }
  };

  const handleConfirmar = () => {
    if (fechaSeleccionada) {
      console.log("Confirmando descanso para la fecha:", fechaSeleccionada);
      // Aquí puedes agregar la lógica para guardar el descanso
    } else {
      alert("Por favor selecciona una fecha primero");
    }
  };

  const baseColor = "#f6ebe9";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: baseColor,
        p: 4,
      }}
    >
      {/* Título */}
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#6d6875",
          textAlign: "center",
        }}
      >
        Tomar Descanso 📅
      </Typography>

      {/* Contenedor principal */}
      <Paper
        elevation={8}
        sx={{
          width: "90%",
          maxWidth: 1000,
          borderRadius: 4,
          bgcolor: "white",
          p: 4,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Sección del Calendario */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: baseColor,
            p: 3,
            borderRadius: 3,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "600",
              color: "#6d6875",
            }}
          >
            Selecciona la fecha de descanso
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={esLocale}
          >
            <DatePicker
              label="Fecha de descanso"
              value={fechaSeleccionada}
              onChange={handleFechaChange}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    backgroundColor: "white",
                    borderRadius: 2,
                    maxWidth: 400,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: baseColor,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: baseColor,
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        {/* Sección de la Tabla */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              color: "#6d6875",
              borderBottom: `2px solid ${baseColor}`,
              pb: 1,
            }}
          >
            Citas del día seleccionado
          </Typography>
          <Box
            sx={{
              height: 400,
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              disableSelectionOnClick
              sx={{
                borderRadius: 2,
                border: "none",
                backgroundColor: "#fff",
                fontSize: "0.9rem",
                color: "#000",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: baseColor,
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                },
                "& .MuiDataGrid-cell": {
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                  color: "#000",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#fafafa",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-columnSeparator": {
                  color: "#ccc",
                },
              }}
            />
          </Box>
        </Box>

        {/* Botón de Confirmar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 2,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleConfirmar}
            startIcon={<CheckCircleIcon />}
            sx={{
              backgroundColor: baseColor,
              color: "#000",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "#e8ddd9",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Confirmar Descanso
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default TomarDescanso;
