import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import type { NavbarItem } from './types/navbar';
import logoImg from './assets/logo.png';

// Tema personalizado anakena
const theme = createTheme({
  palette: {
    primary: {
      main: '#2f8549ff',
      dark: '#073d23ff',
      light: '#184821ff',
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
  const [currentPage, setCurrentPage] = useState('inicio');
  const logo = logoImg;

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const navbarItems: NavbarItem[] = [
    {
      label: 'Inicio',
      href: 'inicio',
      onClick: () => handleNavigation('inicio'),
    },
    {
      label: 'Equipos',
      href: 'equipos',
      onClick: () => handleNavigation('equipos'),
    },
    {
      label: 'Noticias',
      href: 'noticias',
      onClick: () => handleNavigation('noticias'),
    },
    {
      label: 'Historia',
      href: 'historia',
      onClick: () => handleNavigation('historia'),
    },
    {
      label: 'Calendario',
      href: 'calendario',
      onClick: () => handleNavigation('calendario'),
    },
    {
      label: 'Tienda',
      href: 'tienda',
      onClick: () => handleNavigation('tienda'),
    },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'equipos':
        return <Teams />;
      case 'inicio':
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar logo={logo} items={navbarItems} />
        <Box component="main">
          {renderCurrentPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;