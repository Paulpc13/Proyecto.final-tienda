import React, { useRef } from 'react';
import { Container, Typography, Box, CircularProgress, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProductCard from './ProductCard';

export default function ProductSection({ 
  id, 
  title, 
  color, 
  items, 
  tipo, 
  loading, 
  emptyIcon,
  emptyMessage,
  onReservar, 
  onAddToCarrito 
}) {

  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4, marginBottom: "40px" }} id={id}>
      <Typography variant="h3" sx={{
        textAlign: "center",
        color: color,
        fontWeight: "bold",
        marginBottom: "30px",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
      }}>
        {title}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={50} />
        </Box>
      )}
{items.length > 0 && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          {/* Flecha Izquierda */}
          <IconButton 
            onClick={() => handleScroll('left')}
            sx={{ 
              position: 'absolute', left: -20, zIndex: 2, 
              backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' },
              boxShadow: 3, display: { xs: 'none', md: 'flex' } 
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Box 
            ref={scrollRef} // Referencia para el movimiento
            sx={{ 
              display: 'flex', // Pone los productos uno al lado del otro
              overflowX: 'auto', // Permite deslizar
              gap: 3,
              paddingX: 1,
              paddingY: 2,
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': { display: 'none' }, // Esconde la barra de scroll
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {items.map((item, index) => (
              <Box 
                key={item.id} 
                sx={{ 
                  minWidth: { xs: '280px', sm: '320px' }, // Ancho fijo para cada tarjeta
                  flexShrink: 0 // Evita que las tarjetas se aplasten
                }}
              >
                <ProductCard
                  item={item}
                  tipo={tipo}
                  index={index}
                  onReservar={onReservar}
                  onAddToCarrito={onAddToCarrito}
                />
              </Box>
            ))}
          </Box>

          {/* Flecha Derecha */}
          <IconButton 
            onClick={() => handleScroll('right')}
            sx={{ 
              position: 'absolute', right: -20, zIndex: 2, 
              backgroundColor: 'white', '&:hover': { backgroundColor: '#f0f0f0' },
              boxShadow: 3, display: { xs: 'none', md: 'flex' } 
            }}
          >
            <ChevronRight />
          </IconButton>

        </Box>
      )}

      {items.length === 0 && !loading && (
        <Box sx={{
          textAlign: "center",
          py: 5,
          background: `${color}1A`, // 10% opacity
          borderRadius: "15px",
          padding: "40px",
        }}>
          <Typography variant="h5" sx={{ color: color, fontWeight: "bold" }}>
            {emptyIcon} {emptyMessage}
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
            Vuelve pronto para ver nuestras ofertas
          </Typography>
        </Box>
      )}
    </Container>
  );
}
