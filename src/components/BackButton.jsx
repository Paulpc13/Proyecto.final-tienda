import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to = '/', label = 'Volver' }) {
  const navigate = useNavigate();

  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(to)}
      sx={{
        background: "linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)",
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "15px",
        textTransform: "none",
        padding: "10px 25px",
        marginBottom: "20px",
        "&:hover": {
          background: "linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)",
        },
      }}
    >
      {label}
    </Button>
  );
}
