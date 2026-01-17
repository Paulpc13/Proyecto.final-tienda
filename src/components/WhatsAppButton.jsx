import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function WhatsAppButton() {
  const phoneNumber = '593981362088'; // Número de WhatsApp (formato internacional sin +)
  const message = '¡Hola! Quiero información sobre los servicios de Burbujitas de Colores 🎈';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Tooltip title="Chatea con nosotros" placement="left">
      <Fab
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#25D366',
          color: 'white',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#128C7E',
            transform: 'scale(1.1)',
            boxShadow: '0 8px 20px rgba(37, 211, 102, 0.4)',
          },
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Tooltip>
  );
}
