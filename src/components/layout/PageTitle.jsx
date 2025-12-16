import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageTitle({ title, subtitle, gradient = "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)" }) {
  return (
    <Box sx={{
      background: gradient,
      padding: "40px 20px",
      textAlign: "center",
      color: "#fff",
      marginBottom: "30px",
      boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    }}>
      <Typography variant="h3" sx={{ 
        marginBottom: subtitle ? "15px" : "0", 
        textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
        fontWeight: "bold"
      }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: "600px", margin: "0 auto" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
