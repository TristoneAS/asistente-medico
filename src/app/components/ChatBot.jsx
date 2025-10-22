"use client";

import React, { useState } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 ¡Hola! Soy tu asistente virtual. Puedes escribirme lo que quieras sobre tus citas.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleUserMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];

    // Detectar palabras clave
    const text = input.toLowerCase();
    let botReply = { sender: "bot", text: "" };

    // Intenciones principales
    if (text.includes("agendar")) {
      botReply.text =
        "Perfecto 👍 ¿Con qué especialidad deseas agendar? (Medicina General, Odontología, Pediatría)";
    } else if (text.includes("consultar")) {
      botReply.text =
        "Para consultar una cita, por favor proporciona tu número de paciente o correo electrónico.";
    } else if (text.includes("cancelar")) {
      botReply.text =
        "Entendido. ¿Podrías darme el número de cita que deseas cancelar?";
    }
    // Especialidades
    else if (
      ["medicina general", "odontología", "pediatría"].some((s) =>
        text.includes(s)
      )
    ) {
      botReply.text = `Has elegido ${text}. ¿Qué día deseas tu cita? (Hoy, Mañana, Otro día)`;
    }
    // Días
    else if (["hoy", "mañana", "otro día"].some((d) => text.includes(d))) {
      botReply.text = "Gracias. Tu solicitud de cita ha sido registrada ✅";
    }
    // Mensaje por defecto
    else {
      botReply.text =
        "No entendí eso 🤔. Por favor intenta mencionando palabras como 'agendar', 'consultar', 'cancelar', o una especialidad.";
    }

    setMessages([...newMessages, botReply]);
    setInput("");
  };

  return (
    <Paper
      sx={{
        width: 400,
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <img
          src="/logo.jpeg"
          alt="Logo"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        Asistente Médico
      </Typography>

      <Box
        sx={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 1,
          mb: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
              bgcolor: msg.sender === "user" ? "primary.main" : "grey.200",
              color: msg.sender === "user" ? "white" : "black",
              borderRadius: 2,
              p: 1.5,
              maxWidth: "75%",
            }}
          >
            <Typography variant="body2">{msg.text}</Typography>
          </Box>
        ))}
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Escribe algo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUserMessage()}
        helperText="Escribe tu mensaje y presiona Enter"
      />
    </Paper>
  );
}
