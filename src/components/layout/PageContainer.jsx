import React from 'react';
import { Box } from '@mui/material';

export default function PageContainer({ children }) {
  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(180deg, #fff9e6 0%, #ffe6f0 100%)",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      overflow: "auto",
    }}>
      {children}
    </Box>
  );
}
