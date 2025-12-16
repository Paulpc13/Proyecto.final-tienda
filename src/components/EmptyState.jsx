import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EmptyState({ icon = "🎪", message, subtitle }) {
  return (
    <Box sx={{
      textAlign: "center",
      py: 5,
      background: "rgba(255, 107, 157, 0.1)",
      borderRadius: "15px",
      padding: "40px",
    }}>
      <Typography variant="h1" sx={{ fontSize: "80px", mb: 2 }}>
        {icon}
      </Typography>
      <Typography variant="h5" sx={{ color: "#FF6B9D", fontWeight: "bold", mb: 1 }}>
        {message}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
