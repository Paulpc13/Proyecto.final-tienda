import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventIcon from '@mui/icons-material/Event';
import { getCarrito, deleteItemCarrito, confirmarCarrito } from '../api';
import { theme } from '../theme/theme';
import PageContainer from '../components/layout/PageContainer';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function PaginaCarrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fechaReserva, setFechaReserva] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    fetchCarrito();
  }, []);

  const fetchCarrito = async () => {
    try {
      const res = await getCarrito();
      if (res.data && res.data.length > 0) {
        setItems(res.data[0].items);
      } else {
        setItems([]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el carrito. Intenta iniciar sesión nuevamente.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este item del carrito?')) return;
    try {
      await deleteItemCarrito(id);
      fetchCarrito();
    } catch (err) {
      alert('Error eliminando item');
    }
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => {
      return total + parseFloat(item.subtotal);
    }, 0);
  };

  const handleConfirmar = async () => {
    if (!fechaReserva || !direccion) {
      alert('Por favor completa la fecha y la dirección');
      return;
    }

    try {
      const response = await confirmarCarrito({
        fecha_evento: fechaReserva,
        direccion_evento: direccion,
      });
      
      alert(`¡Reserva confirmada! Tu código es: ${response.data.codigo}`);
      setOpenDialog(false);
      navigate('/reservas');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al confirmar la reserva';
      alert('⚠️ ' + msg);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <BackButton />
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, mt: 2 }}>
            <Typography variant="h3" sx={{
              color: '#FF6B9D',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <ShoppingCartIcon fontSize="large" />
              Mi Carrito
            </Typography>
            {items.length > 0 && (
              <Chip 
                label={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                color="primary"
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              />
            )}
          </Box>

          {loading && <LoadingSpinner message="Cargando carrito..." />}
          {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

          {!loading && items.length === 0 && (
            <>
              <EmptyState
                icon="🛒"
                message="Tu carrito está vacío"
                subtitle="Agrega servicios, combos o promociones para empezar"
              />
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                  }}
                >
                  Ver Servicios
                </Button>
              </Box>
            </>
          )}

          {!loading && items.length > 0 && (
            <Box>
              {items.map((item) => (
                <Card key={item.id} sx={{
                  mb: 2,
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.01)' }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 0.5 }}>
                          {item.nombre_producto}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, color: '#666', fontSize: '0.9rem' }}>
                          <span>Precio unitario: ${parseFloat(item.precio_unitario).toFixed(2)}</span>
                          <span>Cantidad: x{item.cantidad}</span>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Typography variant="h5" sx={{ color: '#FFC74F', fontWeight: 'bold' }}>
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </Typography>
                        <IconButton 
                          onClick={() => handleDelete(item.id)}
                          sx={{ 
                            color: '#FF6348',
                            background: 'rgba(255, 99, 72, 0.1)',
                            '&:hover': { background: 'rgba(255, 99, 72, 0.2)' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ 
                background: 'linear-gradient(135deg, #FFE6F0 0%, #FFF9E6 100%)',
                borderRadius: '15px',
                p: 3,
                mb: 3,
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF6B9D', mb: 2 }}>
                  Resumen del Carrito
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Items totales:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{items.length}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Total a Pagar:</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFC74F' }}>
                    ${calcularTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={<EventIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  py: 2,
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(255, 107, 157, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF8C94 0%, #FF6B9D 100%)',
                  },
                }}
              >
                Confirmar Reserva
              </Button>
            </Box>
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', color: '#FF6B9D', textAlign: 'center', fontSize: '1.5rem' }}>
              Confirmar Evento
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 3, color: '#666', textAlign: 'center' }}>
                Estás a un paso de tener la mejor fiesta. <br/> Por favor dinos cuándo y dónde.
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  fullWidth
                  label="Fecha del Evento"
                  type="date"
                  value={fechaReserva}
                  onChange={(e) => setFechaReserva(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <TextField
                  fullWidth
                  label="Dirección completa del Evento"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Calle, número, referencia..."
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
              <Button onClick={() => setOpenDialog(false)} color="inherit">
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmar}
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                ¡Finalizar Reserva!
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </PageContainer>
    </ThemeProvider>
  );
}

export default PaginaCarrito;
