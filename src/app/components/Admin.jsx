"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Alert,
  Stack,
} from "@mui/material";

export default function AdminPage() {
  const [dia, setDia] = useState("lunes");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("14:00");
  const [duracion, setDuracion] = useState(30);
  const [mensaje, setMensaje] = useState("");

  const guardarHorario = async () => {
    const res = await fetch("/api/horarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_medico: 1,
        dia_semana: dia,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        duracion_cita: duracion,
      }),
    });
    const data = await res.json();
    setMensaje(data.message);
  };

  return (
    <div style={{ display: "flex", backgroundColor: "red" }}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 2 }}
      >
        <Card sx={{ width: 400, boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Configurar horario del médico
            </Typography>

            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Día de la semana</InputLabel>
                <Select
                  value={dia}
                  label="Día de la semana"
                  onChange={(e) => setDia(e.target.value)}
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
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Hora de inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Hora de fin"
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <TextField
                label="Duración (minutos)"
                type="number"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                fullWidth
                inputProps={{ min: 5, step: 5 }}
              />

              {mensaje && <Alert severity="success">{mensaje}</Alert>}
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={guardarHorario}
              sx={{ borderRadius: 2, px: 4 }}
            >
              Guardar horario
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </div>
  );
}
