"use client";

import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

export default function ConsultarCitas() {
  const [rowsCitas, setRowsCitas] = useState([]);

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

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`/api/citas`);
      setRowsCitas(data);
    } catch (err) {
      console.error("Error al obtener citas:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        width: "85vw",
        height: "90vh",
        background: "#ffffff",
        borderRadius: 3,
        p: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#333",
          borderBottom: "2px solid #f6ebe9",
          pb: 1,
        }}
      >
        Consultar Citas
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          backgroundColor: "#f6ebe9",
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

      <Box
        sx={{
          height: "75vh",
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <DataGrid
          rows={rowsCitas}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id_cita}
          disableSelectionOnClick
          sx={{
            fontSize: "0.8rem",
            backgroundColor: "#fff",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f6ebe9",
              fontWeight: "bold",
              fontSize: "0.85rem",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#faf6f5",
            },
          }}
        />
      </Box>
    </Box>
  );
}
