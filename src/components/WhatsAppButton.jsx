import React, { useState } from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = '593981362088'; // Número de WhatsApp (formato internacional sin +)
  const message = '¡Hola! Quiero información sobre los servicios de Burbujitas de Colores 🎈';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Tooltip title="Chatea con nosotros" placement="left" arrow>
      <Fab
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          backgroundColor: '#25D366',
          color: 'white',
          zIndex: 1000,
          width: isHovered ? 140 : 60,
          height: 60,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: isHovered 
            ? '0 12px 32px rgba(37, 211, 102, 0.6)' 
            : '0 4px 12px rgba(37, 211, 102, 0.3)',
          '&:hover': {
            backgroundColor: '#20BA5E',
            transform: 'translateY(-8px)',
          },
          '@media (max-width: 600px)': {
            bottom: 20,
            right: 20,
            width: 56,
            height: 56,
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 28 }} />
        {isHovered && (
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            animation: 'fadeIn 0.3s ease-in',
          }}>
            ¡Chatea!
          </span>
        )}
      </Fab>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Tooltip>
  );
}
