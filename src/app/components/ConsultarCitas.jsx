"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import axios from "axios";

export default function ConsultarCitas() {
  const [rowsCitas, setRowsCitas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickCancelar = async (row) => {
    try {
      if (confirm(`¿Cancelar la cita con id ${row.id_cita}?`)) {
        await axios.delete(`/api/citas/${row.id_cita}`);

        await fetch("/api/notificacion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_cliente: row.id_paciente,
            status: "sin leer",
            texto: `Su cita del día ${row.fecha.split("T")[0]} a las ${
              row.hora
            } ha sido cancelada.`,
          }),
        });

        // Recargar citas con el filtro actual
        fetchData(fechaFiltro);
      }
    } catch (err) {
      console.error("Error al cancelar cita:", err);
    }
  };

  const columns = [
    {
      field: "acciones",
      headerName: "Acción",
      flex: 0.8,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleClickCancelar(params.row)}
          sx={{
            minWidth: "36px",
            padding: "4px",
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          <CancelIcon fontSize="small" />
        </Button>
      ),
    },
    {
      field: "id_cita",
      headerName: "ID",
      flex: 0.4,
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
      flex: 0.9,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nombre_paciente",
      headerName: "Nombre",
      flex: 1.2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fecha_nacimiento",
      headerName: "Nacimiento",
      flex: 1.2,
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
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "direccion",
      headerName: "direccion",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 0.9,
      align: "center",
      headerAlign: "center",
    },
  ];

  const fetchData = async (fecha = null) => {
    setLoading(true);
    try {
      let url = "/api/citas";
      if (fecha) {
        const fechaFormateada = fecha.toISOString().split("T")[0];
        url = `/api/citas?fecha=${fechaFormateada}`;
      }
      const { data } = await axios.get(url);
      setRowsCitas(data || []);
    } catch (err) {
      console.error("Error al obtener citas:", err);
      setRowsCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(fechaFiltro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaFiltro]);

  const handleFechaChange = (nuevaFecha) => {
    setFechaFiltro(nuevaFecha);
  };

  const handleLimpiarFiltro = () => {
    setFechaFiltro(null);
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
        Consultar Citas 📋
      </Typography>

      {/* Contenedor principal */}
      <Paper
        elevation={8}
        sx={{
          width: "90%",
          maxWidth: 1400,
          borderRadius: 4,
          bgcolor: "white",
          p: 4,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Sección del Calendario y Filtros */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: baseColor,
            p: 3,
            borderRadius: 3,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              color: "#6d6875",
            }}
          >
            Filtrar citas por fecha
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={esLocale}
            >
              <DatePicker
                label="Selecciona una fecha"
                value={fechaFiltro}
                onChange={handleFechaChange}
                slotProps={{
                  textField: {
                    sx: {
                      backgroundColor: "white",
                      borderRadius: 2,
                      minWidth: 250,
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
            {fechaFiltro && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleLimpiarFiltro}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  borderColor: baseColor,
                  color: "#6d6875",
                  "&:hover": {
                    borderColor: "#e8ddd9",
                    backgroundColor: "#fafafa",
                  },
                }}
              >
                Limpiar filtro
              </Button>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
            {fechaFiltro
              ? `Mostrando citas del ${fechaFiltro.toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}`
              : "Mostrando todas las citas"}
          </Typography>
        </Box>

        {/* Información */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: baseColor,
            borderRadius: 2,
            p: 2,
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body1" sx={{ color: "#444", textAlign: "center" }}>
            A continuación se muestran las citas registradas. Puedes cancelar una
            cita haciendo clic en el icono rojo.
          </Typography>
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
            Lista de Citas ({rowsCitas.length})
          </Typography>
          <Box
            sx={{
              height: 500,
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
                rows={rowsCitas}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
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
      </Paper>
    </Box>
  );
}
