"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import { useRouter } from "next/navigation";

export default function ChatBot() {
  const router = useRouter();
  const messagesEndRef = useRef(null);

  // --- Datos del usuario ---
  const [userData, setUserData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    fecha_nacimiento: "",
    direccion: "",
  });

  // --- Estados principales ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState({
    step: "inicio",
    fecha: null,
    hora: null,
  });
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [motivoCita, setMotivoCita] = useState("");

  // --- Cargar datos del usuario ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id");
      const nombre = localStorage.getItem("nombre");
      const apellido = localStorage.getItem("apellido");
      const telefono = localStorage.getItem("telefono");
      const fecha_nacimiento = localStorage.getItem("fecha_nacimiento");
      const direccion = localStorage.getItem("direccion");

      setUserData({
        id,
        nombre,
        apellido,
        telefono,
        fecha_nacimiento,
        direccion,
      });
    }
  }, []);

  // --- Mensaje inicial cuando se cargan los datos ---
  useEffect(() => {
    if (userData.nombre) {
      setMessages([
        {
          sender: "bot",
          text: `👋 ¡Hola ${userData.nombre}! Soy tu asistente virtual.\n\nEscribe:\n• 'agendar' para reservar tu cita\n• 'consultar' para ver tus citas\n• 'notificaciones' para ver tus notificaciones\n• 'cancelar' para reiniciar el chat`,
        },
      ]);
    }
  }, [userData.nombre]);

  // --- Obtener fechas disponibles desde la API ---
  useEffect(() => {
    const obtenerFechasDisponibles = async () => {
      try {
        const res = await fetch("/api/dias-disponibles");
        const data = await res.json();
        setFechasDisponibles(data);
      } catch (error) {
        console.error("Error al cargar fechas disponibles:", error);
      }
    };
    obtenerFechasDisponibles();
  }, []);

  // --- Scroll automático al último mensaje ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Manejo del mensaje del usuario ---
  const handleUserMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    let botReply = { sender: "bot", text: "" };
    const text = input.trim().toLowerCase();

    // === Flujo conversacional ===
    if (context.step === "inicio") {
      if (text.includes("agendar")) {
        botReply.text = "📅 Selecciona un día en el calendario:";
        setContext((prev) => ({ ...prev, step: "elegirDia" }));
      } else if (text.includes("consultar")) {
        botReply.text = "Te llevaré a tus citas, espera un momento...";
        setTimeout(() => router.push("/dashboard"), 2000);
      } else if (
        text.includes("notificaciones") ||
        text.includes("notificacion")
      ) {
        botReply.text = "Te llevaré a tus notificaciones, espera un momento...";
        setTimeout(() => router.push("/Notificaciones"), 2000);
      } else if (text.includes("cancelar")) {
        botReply.text =
          "🔄 Chat reiniciado. Escribe 'agendar', 'consultar' o 'notificaciones' para continuar.";
        setContext({ step: "inicio", fecha: null, hora: null });
        setFechaSeleccionada(null);
        setHorasDisponibles([]);
        setMotivoCita("");
      } else {
        botReply.text =
          "No te entendí 🤔. Escribe 'agendar', 'consultar', 'notificaciones' o 'cancelar' para continuar.";
      }
    } else if (context.step === "elegirHora") {
      // Verificar si el usuario quiere cancelar
      if (text.includes("cancelar")) {
        botReply.text =
          "🔄 Chat reiniciado. Escribe 'agendar', 'consultar' o 'notificaciones' para continuar.";
        setContext({ step: "inicio", fecha: null, hora: null });
        setFechaSeleccionada(null);
        setHorasDisponibles([]);
        setMotivoCita("");
      } else {
        // Normalizar la hora ingresada
        const horaInput = input.trim();

        // Función para normalizar la hora
        const normalizarHora = (horaStr) => {
          // Remover espacios y convertir a string
          let hora = horaStr.replace(/\s/g, "");

          // Si solo tiene números sin ":", agregar ":00"
          if (/^\d+$/.test(hora)) {
            hora = hora.padStart(2, "0") + ":00";
          }

          // Si tiene formato H:MM o HH:MM, asegurar que tenga formato HH:MM
          if (/^\d{1,2}:\d{1,2}$/.test(hora)) {
            const [horas, minutos] = hora.split(":");
            const horasFormateadas = horas.padStart(2, "0");
            const minutosFormateados = minutos.padStart(2, "0");
            hora = `${horasFormateadas}:${minutosFormateados}`;
          }

          return hora;
        };

        const horaNormalizada = normalizarHora(horaInput);

        // Buscar la hora en las disponibles (comparando con formato normalizado)
        const horaEncontrada = horasDisponibles.find((h) => {
          const horaDisponible = h.hora;
          return (
            horaDisponible === horaNormalizada || horaDisponible === horaInput
          );
        });

        if (!horaEncontrada) {
          botReply.text = `❌ La hora "${horaInput}" no está disponible. Elige una de la lista:\n${horasDisponibles
            .map((h) => h.hora)
            .join("\n")}\n\nTambién puedes escribir 'cancelar' para reiniciar.`;
        } else {
          setContext((prev) => ({
            ...prev,
            step: "elegirMotivo",
            hora: horaEncontrada.hora, // Usar la hora del formato correcto
          }));
          botReply.text = "✍️ Por favor, escribe el motivo de tu cita:";
        }
      }
    } else if (
      context.step === "elegirDia" ||
      context.step === "elegirMotivo"
    ) {
      // Permitir cancelar en cualquier paso
      if (text.includes("cancelar")) {
        botReply.text =
          "🔄 Chat reiniciado. Escribe 'agendar', 'consultar' o 'notificaciones' para continuar.";
        setContext({ step: "inicio", fecha: null, hora: null });
        setFechaSeleccionada(null);
        setHorasDisponibles([]);
        setMotivoCita("");
      } else if (context.step === "elegirMotivo") {
        // Continuar con el flujo normal de motivo
        const motivo = input.trim();
        setMotivoCita(motivo);

        try {
          const res = await fetch("/api/registrar-cita", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fecha: context.fecha,
              hora: context.hora,
              id_paciente: userData.id,
              nombre_paciente: `${userData.nombre} ${userData.apellido}`,
              fecha_nacimiento: userData.fecha_nacimiento,
              motivo: motivo,
              telefono: userData.telefono,
              direccion: userData.direccion,
              status: "activa",
            }),
          });

          if (!res.ok) throw new Error("Error al registrar cita");

          botReply.text = `✅ Cita registrada para el ${context.fecha} a las ${context.hora}.\nMotivo: ${motivo}\n\nEscribe 'agendar' o 'consultar' para continuar.`;
        } catch (err) {
          botReply.text =
            "❌ Ocurrió un error al registrar tu cita. Intenta nuevamente.";
        }

        setContext({ step: "inicio", fecha: null, hora: null });
        setMotivoCita("");
      }
    } else if (context.step === "elegirMotivo") {
      const motivo = input.trim();
      setMotivoCita(motivo);

      try {
        const res = await fetch("/api/registrar-cita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha: context.fecha,
            hora: context.hora,
            id_paciente: userData.id,
            nombre_paciente: `${userData.nombre} ${userData.apellido}`,
            fecha_nacimiento: userData.fecha_nacimiento,
            motivo: motivo,
            telefono: userData.telefono,
            direccion: userData.direccion,
            status: "activa",
          }),
        });

        if (!res.ok) throw new Error("Error al registrar cita");

        botReply.text = `✅ Cita registrada para el ${context.fecha} a las ${context.hora}.\nMotivo: ${motivo}\n\nEscribe 'agendar' o 'consultar' para continuar.`;
      } catch (err) {
        botReply.text =
          "❌ Ocurrió un error al registrar tu cita. Intenta nuevamente.";
      }

      setContext({ step: "inicio", fecha: null, hora: null });
      setMotivoCita("");
    }

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  };

  // --- Manejo de selección de fecha ---
  const handleFechaChange = async (date) => {
    if (!date) return;
    const fechaStr = date.toISOString().slice(0, 10);
    setFechaSeleccionada(date);

    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const diaSemanal = dias[date.getDay()];

    try {
      const res = await fetch(
        `/api/horarios-disponibles?fecha=${fechaStr}&dia=${encodeURIComponent(
          diaSemanal
        )}`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "No hay horas disponibles ese día 😔" },
        ]);
        setContext({ step: "inicio", fecha: null });
        return;
      }

      setHorasDisponibles(data);
      setContext((prev) => ({ ...prev, step: "elegirHora", fecha: fechaStr }));
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "🕒 Horas disponibles:\n" +
            data.map((h) => h.hora).join("\n") +
            "\n\nEscribe la hora que prefieras (ej: 10:30, 9:00, 9 o 09:00)\nTambién puedes escribir 'cancelar' para reiniciar.",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6ebe9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 420,
          p: 3,
          borderRadius: 4,
          bgcolor: "white",
          boxShadow: "0px 6px 16px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: "#6d6875",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          <img
            src="/logo2.jpeg"
            alt="Logo"
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
          <br />
          Asistente Médico Virtual
        </Typography>

        {/* Mensajes del chat */}
        <Box
          sx={{
            height: 380,
            overflowY: "auto",
            border: "1px solid #e0d6d5",
            borderRadius: 2,
            p: 2,
            mb: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff8f8",
          }}
        >
          {messages.map((msg, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
                bgcolor: msg.sender === "user" ? "#b5838d" : "rgba(0,0,0,0.05)",
                color: msg.sender === "user" ? "white" : "black",
                borderRadius:
                  msg.sender === "user"
                    ? "16px 16px 0px 16px"
                    : "16px 16px 16px 0px",
                p: 1.5,
                maxWidth: "75%",
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Campo de entrada o selector de fecha */}
        {context.step === "elegirDia" ? (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={esLocale}
          >
            <DatePicker
              label="Selecciona un día"
              value={fechaSeleccionada}
              onChange={handleFechaChange}
              disablePast
              shouldDisableDate={(date) => {
                const fechaStr = date.toISOString().slice(0, 10);
                return !fechasDisponibles.includes(fechaStr);
              }}
              slotProps={{
                textField: { fullWidth: true, size: "small" },
              }}
            />
          </LocalizationProvider>
        ) : (
          <TextField
            fullWidth
            size="small"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUserMessage()}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}
