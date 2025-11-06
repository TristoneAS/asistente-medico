import React from "react";
import LayoutComponent from "@/app/components/LayoutComponent";
import { Box, Typography, Button } from "@mui/material";

function page() {
  return (
    <LayoutComponent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <img
          src="/logo2.jpeg"
          alt="Logo Drawer"
          style={{
            width: "90%",
            maxWidth: "150px",
          }}
        />
      </Box>
    </LayoutComponent>
  );
}

export default page;
