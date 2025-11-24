import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import ComingSoon from './pages/ComingSoon';
import type { NavbarItem } from './types/navbar';
import Footer from './components/Footer';
import logoImg from './assets/logo-sin-fondo.png';
import Calendar from './pages/Calendar';
import Store from './pages/Store';
import News from './pages/News';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';


//Tema personalizado anakena
const theme = createTheme({
  palette: {
    primary: {
      main: '#2f8549ff',
      dark: '#073d23ff',
      light: '#297438ff',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const logo = logoImg;

  const navbarItems: NavbarItem[] = [
    {
      label: 'Inicio',
      href: '/',
    },
    {
      label: 'Equipos',
      href: '/equipos',
    },
    {
      label: 'Noticias',
      href: '/noticias',
    },
    {
      label: 'Historia',
      href: '/historia',
    },
    {
      label: 'Calendario',
      href: '/calendario',
    },
    {
      label: 'Tienda',
      href: '/tienda',
    },
  ];

  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Navbar logo={logo} items={navbarItems} />
              <Box component="main" sx={{ flex: 1 }}>
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/equipos" element={<Teams />} />
                  <Route path="/noticias" element={<News />} />
                  <Route path="/historia" element={
                    <ComingSoon
                      pageName="Historia del Club"
                      description="Una línea de tiempo interactiva con los hitos más importantes de los 25+ años de historia del club Anakena DCC."
                    />
                  } />
                  <Route path="/calendario" element={<Calendar />} />

                  {/* Rutas protegidas - requieren autenticación */}
                  <Route path="/tienda" element={
                    <ProtectedRoute>
                      <Store />
                    </ProtectedRoute>
                  } />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;