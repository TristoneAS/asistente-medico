"use client";
import React, { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Dashboard() {
  const id_cliente = localStorage.getItem("id");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/citas/?id_cliente=${id_cliente}`);
      setRows(res.data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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

        // Recargar citas
        fetchData();
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
      flex: 1,
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
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6ebe9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#6d6875",
          textAlign: "center",
        }}
      >
        Panel del Paciente 🩺
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "67%",
          backgroundColor: "#ffffffff",
          borderRadius: 2,
          p: 2,
          mb: 3,
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="body1" sx={{ color: "#444" }}>
          A continuación se muestran todas las citas registradas. Puedes
          cancelar una cita haciendo clic en el icono rojo.
        </Typography>
      </Box>
      <Paper
        elevation={8}
        sx={{
          width: "90%",
          maxWidth: 1200,
          borderRadius: 4,
          bgcolor: "white",
          p: 3,
          boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tabs para cambiar entre Citas y Chat */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          centered
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: "bold" },
          }}
        >
          <Tab label="Mis Citas" />
          <Tab label="Chat Asistente" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {tab === 0 ? (
          // 📋 Tabla de citas
          <Box sx={{ height: 450, width: "100%" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.id_cita}
                disableSelectionOnClick
                sx={{
                  borderRadius: 3,
                  border: "none",
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                  color: "#000", // texto negro en celdas

                  // 🔹 Encabezados
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f0f0f0", // gris claro de fondo
                    color: "#000", // texto negro
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                  },

                  // 🔹 Celdas
                  "& .MuiDataGrid-cell": {
                    textAlign: "center",
                    borderBottom: "1px solid #e0e0e0",
                    color: "#000", // texto negro en filas
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
        ) : (
          // 🤖 ChatBot integrado
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <ChatBot />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
