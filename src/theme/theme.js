import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#FF6B9D' }, // Rosa vibrante
    secondary: { main: '#FFC74F' }, // Amarillo vibrante
    success: { main: '#4ECDC4' }, // Turquesa
    warning: { main: '#FF6348' }, // Rojo-naranja
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Trebuchet MS", cursive, sans-serif',
    h1: { fontWeight: 'bold', fontSize: '2.8rem' },
    h4: { fontWeight: 'bold' },
  },
});
