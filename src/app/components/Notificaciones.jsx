"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Snackbar,
  Alert,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import PropTypes from "prop-types";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

// 🔹 Panel personalizado para pestañas
function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

// 🔹 Propiedades accesibles para pestañas
function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function Notificaciones() {
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsLeidos, setRowsLeidos] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const id_cliente =
    typeof window !== "undefined" ? localStorage.getItem("id") : null;

  const handleChange = (_, newValue) => setValue(newValue);
  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // 🔁 Cargar datos
  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        axios.get(`/api/notificacion/?id_cliente=${id_cliente}`),
        axios.get(`/api/notificacion/?id_cliente=${id_cliente}&leido=true`),
      ]);
      setRows(res1.data);
      setRowsLeidos(res2.data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error al cargar notificaciones",
        severity: "error",
      });
    }
  };

  // ✅ Marcar como leído
  const handleClickMarcarLeido = async (row) => {
    try {
      if (confirm(`¿Deseas marcar como leído el id: ${row.id}?`)) {
        await axios.put(`/api/notificacion/${row.id}`);
        setSnackbar({
          open: true,
          message: "Notificación marcada como leída",
          severity: "success",
        });
        fetchData();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error al marcar como leído",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Columnas
  const columns = [
    {
      field: "acciones",
      headerName: "Acción",
      flex: 1,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleClickMarcarLeido(params.row)}
          startIcon={<MarkEmailReadIcon />}
        >
          Leer
        </Button>
      ),
    },
    {
      field: "id",
      headerName: "Id",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "id_cliente",
      headerName: "Cliente",
      flex: 1,
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
    {
      field: "texto",
      headerName: "Mensaje",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
  ];

  const columnsLeidas = [
    {
      field: "id",
      headerName: "Id",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "id_cliente",
      headerName: "Cliente",
      flex: 1,
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
    {
      field: "texto",
      headerName: "Mensaje",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        backgroundColor: "#f7f3f2",
        minHeight: "100vh",
        borderRadius: "8px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: "16px",
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "#4b2e2b",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <NotificationsActiveIcon color="secondary" /> Centro de Notificaciones
        </Typography>

        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tabs notificaciones"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Sin leer" {...a11yProps(0)} sx={{ fontSize: "13px" }} />
          <Tab label="Leídas" {...a11yProps(1)} sx={{ fontSize: "13px" }} />
        </Tabs>

        <CustomTabPanel value={value} index={0}>
          <Box sx={StyleContainer}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              disableSelectionOnClick
              sx={StyleDataGrid}
            />
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Box sx={StyleContainer}>
            <DataGrid
              rows={rowsLeidos}
              columns={columnsLeidas}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              disableSelectionOnClick
              sx={StyleDataGrid}
            />
          </Box>
        </CustomTabPanel>
      </Paper>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// 🎨 Estilos base
const StyleContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
  width: "100%",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const StyleDataGrid = {
  fontSize: "0.85rem",
  border: "none",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f3e9e7",
    color: "#4b2e2b",
    fontWeight: 600,
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f7f3f2",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid #f0e0de",
  },
};
