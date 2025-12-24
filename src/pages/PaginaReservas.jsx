import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getReservas, deleteReserva } from '../api';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { theme } from '../theme/theme';
import PageContainer from '../components/layout/PageContainer';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

function PaginaReservas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clienteId = localStorage.getItem('cliente_id') || localStorage.getItem('id');

  useEffect(() => {
    fetchReservas();
  }, [location]); // Recargar cuando cambie la ubicación (navegación)

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getReservas();

      // Filtrar por cliente
      const misReservas = res.data.filter(r => {
        return String(r.cliente) === String(clienteId);
      });

      setReservas(misReservas);
    } catch (err) {
      console.error('Error cargando reservas:', err);
      setError('Error cargando reservas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      await deleteReserva(id);
      fetchReservas();
    } catch (err) {
      alert('Error eliminando reserva');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'APROBADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'ANULADA': return 'error';
      default: return 'default';
    }
  };

  const formatFechaEvento = (fecha) => {
    if (!fecha) return '—';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) {
      // Fallback: intentar formato YYYY-MM-DD
      try {
        const fallback = new Date(`${fecha}T00:00:00`);
        return isNaN(fallback.getTime()) ? String(fecha) : fallback.toLocaleDateString();
      } catch {
        return String(fecha);
      }
    }
    try {
      return d.toLocaleDateString();
    } catch {
      return String(fecha);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <BackButton />
          </Box>

          <Typography variant="h4" sx={{
            color: '#FF6B9D',
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center'
          }}>
            📅 Mis Reservas
          </Typography>

          {!loading && !error && reservas.length === 0 && (
            <>
              <EmptyState
                icon="🎈"
                message="No tienes reservas por el momento"
                subtitle="¡Explora nuestros servicios y haz tu primera reserva!"
              />
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8C94 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Ver Servicios
                </Button>
              </Box>
            </>
          )}

          {!loading && !error && reservas.length > 0 && (
            <Paper elevation={3} sx={{ borderRadius: '15px', overflow: 'hidden' }}>
              <List>
                {reservas.map((reserva, index) => (
                  <React.Fragment key={reserva.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': { background: 'rgba(255, 107, 157, 0.05)' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6B9D' }}>
                          Reserva #{reserva.codigo_reserva}
                        </Typography>
                        <Chip
                          label={reserva.estado}
                          color={getEstadoColor(reserva.estado)}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                        <Box sx={{ flex: 1 }} />
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(reserva.id)}
                          sx={{ color: '#FF6348' }}
                          aria-label="Eliminar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="textSecondary">
                          📍 {reserva.direccion_evento}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          📅 Evento: {formatFechaEvento(reserva.fecha_evento)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#FFC74F', fontWeight: 'bold', mt: 1 }}>
                          💰 Total: ${reserva.total}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/confirmacion-pago/${reserva.id}`)}
                          sx={{ mt: 2, borderColor: '#FF6B9D', color: '#FF6B9D', borderRadius: '20px', textTransform: 'none', fontWeight: 600 }}
                        >
                          Ver Detalle / Gestionar Pago
                        </Button>
                      </Box>
                    </ListItem>
                    {index < reservas.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )}

          {loading && <LoadingSpinner message="Cargando reservas..." />}
          {error && <Alert severity="error">{error}</Alert>}
        </Container>
      </PageContainer>
    </ThemeProvider>

  );
}

export default PaginaReservas;
