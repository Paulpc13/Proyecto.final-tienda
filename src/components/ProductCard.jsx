import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductCard({ item, tipo, index, onReservar, onAddToCarrito }) {
  
  // 1. FORZAMOS EL COLOR SEGÚN EL TIPO
  const getColor = () => {
    switch (tipo) {
      case 'servicio': return '#FF6B9D';
      case 'combo': return '#FFC74F';
      case 'promocion': return '#4ECDC4';
      default: return '#FF6B9D';
    }
  };

  const precio = item.precio_base || item.precio_combo || item.precio_total || 0;

  return (
    <Card
      sx={{
        // === CLAVE: DIMENSIONES FIJAS TOTALES ===
        width: '320px',      // Ancho exacto para todas
        height: '520px',     // Alto exacto para todas
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        mx: 'auto',          // Centra la tarjeta en su espacio
        transition: "transform 0.3s ease",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-10px)",
        },
      }}
    >
      {/* SECCIÓN DE IMAGEN: El "Marco" profesional */}
      <Box
        sx={{
          width: '100%',
          height: '220px',     // Altura fija del área de imagen
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Box
          component="img"
          src={item.imagen || '/img/placeholder.jpg'}
          alt={item.nombre}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Recorta la imagen para llenar el cuadro sin deformar
            objectPosition: 'center',
          }}
        />
        
        {tipo === 'promocion' && item.descuento_porcentaje && (
          <Chip
            label={`${item.descuento_porcentaje}% OFF`}
            sx={{
              position: "absolute", top: 10, right: 10,
              background: "#FF6348", color: "#fff", fontWeight: "bold"
            }}
          />
        )}
      </Box>

      {/* CUERPO: Alineación de textos */}
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 2 
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: getColor(),
            height: '64px',      // Reserva espacio para 2 líneas de título
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {item.nombre}
        </Typography>

        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            height: '40px',      // Reserva espacio para 2 líneas de descripción
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {item.descripcion || `Especial para tu fiesta de colores`}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            ${precio}
          </Typography>
        </Box>
      </CardContent>

      {/* BOTONES: Siempre al fondo */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onReservar(item, tipo)}
          sx={{ 
            bgcolor: getColor(), 
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { bgcolor: getColor(), filter: 'brightness(0.9)' }
          }}
        >
          Reservar
        </Button>
        <Button
          variant="outlined"
          onClick={() => onAddToCarrito(item, tipo)}
          sx={{ 
            minWidth: '50px', 
            borderRadius: '10px', 
            color: getColor(), 
            borderColor: getColor() 
          }}
        >
          <AddShoppingCartIcon fontSize="small" />
        </Button>
      </CardActions>
    </Card>
  );
}