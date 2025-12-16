import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center", 
      py: 5,
      gap: 2
    }}>
      <CircularProgress size={50} sx={{ color: "#FF6B9D" }} />
      <Typography variant="body1" sx={{ color: "#666" }}>
        {message}
      </Typography>
    </Box>
  );
}
