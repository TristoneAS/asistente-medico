"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

function Tomardia() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const columns = [
    {
      field: "id_cita",
      headerName: "ID Cita",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "hora",
      headerName: "Hora",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "id_paciente",
      headerName: "ID Paciente",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nombre_paciente",
      headerName: "Nombre Paciente",
      flex: 1.2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "motivo",
      headerName: "Motivo",
      flex: 1.2,
      align: "center",
      headerAlign: "center",
    },
  ];

  const fetchCitasPorFecha = async (fecha) => {
    if (!fecha) {
      setRows([]);
      return;
    }

    setLoading(true);
    try {
      // Formatear la fecha a YYYY-MM-DD
      const fechaFormateada = fecha.toISOString().split("T")[0];
      const { data } = await axios.get(`/api/citas?fecha=${fechaFormateada}`);
      console.log(data);
      
      setRows(data || []);
    } catch (err) {
      console.error("Error al obtener citas:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFechaChange = (nuevaFecha) => {
    setFechaSeleccionada(nuevaFecha);
    fetchCitasPorFecha(nuevaFecha);
  };

  const handleConfirmar = () => {
    if (!fechaSeleccionada) {
      alert("Por favor selecciona una fecha primero");
      return;
    }

    if (rows.length === 0) {
      alert("No hay citas para cancelar en esta fecha");
      return;
    }

    setOpenDialog(true);
  };

  const handleCancelarDialog = () => {
    setOpenDialog(false);
  };

  const handleAceptarCancelacion = async () => {
    setOpenDialog(false);
    setProcesando(true);

    try {
      // Formatear la fecha para el mensaje y para la API
      const fechaFormateada = fechaSeleccionada.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const fechaAPI = fechaSeleccionada.toISOString().split("T")[0];

      // 1. Actualizar el status de todas las citas de esta fecha a "cancelada"
      await axios.put("/api/citas", {
        fecha: fechaAPI,
        status: "cancelada",
      });

      // 2. Crear una notificación por cada cita cancelada
      const promesas = rows.map((cita) => {
        // Formatear la hora (solo HH:mm si viene con segundos)
        const horaFormateada = cita.hora ? String(cita.hora).slice(0, 5) : "";
        const texto = `Su cita del día ${fechaFormateada} a las ${horaFormateada} ha sido cancelada`;
        return axios.post("/api/notificacion", {
          id_cliente: cita.id_paciente,
          status: "sin leer",
          texto: texto,
        });
      });

      await Promise.all(promesas);

      alert(
        `Se han cancelado ${rows.length} citas y se han enviado las notificaciones correspondientes.`
      );

      // Limpiar las filas después de cancelar
      setRows([]);
      setFechaSeleccionada(null);
    } catch (err) {
      console.error("Error al cancelar citas:", err);
      alert("Error al cancelar las citas. Por favor intenta de nuevo.");
    } finally {
      setProcesando(false);
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
        Tomar Dia 📅
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
            Selecciona la fecha para tomar el día
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            locale={esLocale}
          >
            <DatePicker
              label="Fecha para tomar el día"
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
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ color: baseColor }} />
              </Box>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                getRowId={(row) => row.id_cita}
                disableSelectionOnClick
                sx={{
                  borderRadius: 2,
                  border: "none",
                  backgroundColor: "#fff",
                  fontSize: "0.85rem",
                  color: "#000",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: baseColor,
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
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
            )}
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
            disabled={procesando || rows.length === 0}
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
              "&:disabled": {
                backgroundColor: "#e0e0e0",
                color: "#9e9e9e",
              },
              transition: "all 0.3s ease",
            }}
          >
            {procesando ? "Procesando..." : "Confirmar Tomar el Día"}
          </Button>
        </Box>
      </Paper>

      {/* Dialog de Confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCancelarDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#6d6875",
            borderBottom: `2px solid ${baseColor}`,
            pb: 2,
          }}
        >
          ⚠️ Confirmar Cancelación
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: "#333",
              mt: 2,
            }}
          >
            ¿Estás seguro? Todas las citas de este día serán canceladas.
            <br />
            <br />
            <strong>
              Se cancelarán {rows.length} cita{rows.length !== 1 ? "s" : ""} y se
              enviarán notificaciones a los pacientes.
            </strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelarDialog}
            variant="outlined"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            No, cancelar
          </Button>
          <Button
            onClick={handleAceptarCancelacion}
            variant="contained"
            sx={{
              backgroundColor: baseColor,
              color: "#000",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                backgroundColor: "#e8ddd9",
              },
            }}
          >
            Sí, confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Tomardia;
