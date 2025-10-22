import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Mensaje({ mensaje, estado, open, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={estado}
        sx={{ width: "100%" }}
      >
        {mensaje}
      </MuiAlert>
    </Snackbar>
  );
}
