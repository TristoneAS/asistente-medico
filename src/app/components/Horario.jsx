"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function HorarioMedico() {
  const [dia, setDia] = useState("lunes");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("14:00");
  const [duracion, setDuracion] = useState(30);
  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Modal de edición
  const [openEdit, setOpenEdit] = useState(false);
  const [editHorario, setEditHorario] = useState(null);

  const cargarHorarios = async () => {
    try {
      const res = await fetch("/api/horarios-medico");
      const data = await res.json();
      setHorarios(data);
    } catch (error) {
      console.error("Error al cargar horarios:", error);
    }
  };

  useEffect(() => {
    cargarHorarios();
  }, []);

  const guardarHorario = async () => {
    if (!horaInicio || !horaFin || duracion <= 0) {
      setMensaje("Por favor completa todos los campos correctamente");
      return;
    }

    try {
      const res = await fetch("/api/horarios-medico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dia_semana: dia,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          duracion_cita: duracion,
        }),
      });
      const data = await res.json();
      setMensaje(data.message);
      cargarHorarios();
    } catch (error) {
      console.error("Error al guardar horario:", error);
      setMensaje("Error al guardar horario");
    }
  };

  const handleEdit = (horario) => {
    setEditHorario(horario);
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch("/api/horarios-medico", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_horario: editHorario.id_horario,
          dia_semana: editHorario.dia_semana,
          hora_inicio: editHorario.hora_inicio,
          hora_fin: editHorario.hora_fin,
          duracion_cita: editHorario.duracion_cita,
        }),
      });
      setOpenEdit(false);
      cargarHorarios();
      setMensaje("Horario actualizado correctamente ✅");
    } catch (error) {
      console.error("Error al actualizar horario:", error);
      setMensaje("Error al actualizar horario");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este horario?")) return;

    try {
      await fetch("/api/horarios-medico", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_horario: id }),
      });
      cargarHorarios();
      setMensaje("Horario eliminado ✅");
    } catch (error) {
      console.error("Error al eliminar horario:", error);
      setMensaje("Error al eliminar horario");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 4,
        width: "85vw",
        height: "90vh",
        background: "#ffffff",
        borderRadius: 3,
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
        Configuración de Horarios
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f6ebe9",
          p: 2,
          borderRadius: 2,
          width: "100%",
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          select
          label="Día"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          sx={{ minWidth: 140, backgroundColor: "#fff", borderRadius: 1 }}
        >
          {[
            "lunes",
            "martes",
            "miércoles",
            "jueves",
            "viernes",
            "sábado",
            "domingo",
          ].map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Hora inicio"
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
          sx={{ minWidth: 120, backgroundColor: "#fff", borderRadius: 1 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Hora fin"
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
          sx={{ minWidth: 120, backgroundColor: "#fff", borderRadius: 1 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Duración (min)"
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          sx={{ minWidth: 120, backgroundColor: "#fff", borderRadius: 1 }}
        />

        <Button
          variant="contained"
          onClick={guardarHorario}
          sx={{
            bgcolor: "#f6ebe9",
            color: "#333",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#e0d5d3" },
          }}
        >
          Guardar
        </Button>
      </Box>

      {mensaje && (
        <Typography sx={{ mb: 2, color: "#333", fontSize: "0.9rem" }}>
          {mensaje}
        </Typography>
      )}

      <Paper
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f6ebe9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Día</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hora Inicio</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hora Fin</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Duración</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {horarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay horarios configurados
                </TableCell>
              </TableRow>
            ) : (
              horarios.map((h) => (
                <TableRow
                  key={h.id_horario}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#faf6f5" },
                    transition: "0.2s ease",
                  }}
                >
                  <TableCell>{h.dia_semana}</TableCell>
                  <TableCell>{h.hora_inicio}</TableCell>
                  <TableCell>{h.hora_fin}</TableCell>
                  <TableCell>{h.duracion_cita} min</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(h)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(h.id_horario)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Modal de edición */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Horario</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            select
            label="Día de la semana"
            value={editHorario?.dia_semana || ""}
            onChange={(e) =>
              setEditHorario({ ...editHorario, dia_semana: e.target.value })
            }
          >
            {[
              "lunes",
              "martes",
              "miércoles",
              "jueves",
              "viernes",
              "sábado",
              "domingo",
            ].map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Hora inicio"
            type="time"
            value={editHorario?.hora_inicio || ""}
            onChange={(e) =>
              setEditHorario({ ...editHorario, hora_inicio: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Hora fin"
            type="time"
            value={editHorario?.hora_fin || ""}
            onChange={(e) =>
              setEditHorario({ ...editHorario, hora_fin: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Duración (min)"
            type="number"
            value={editHorario?.duracion_cita || ""}
            onChange={(e) =>
              setEditHorario({ ...editHorario, duracion_cita: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#f6ebe9",
              color: "#333",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#e0d5d3" },
            }}
            onClick={handleSaveEdit}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
