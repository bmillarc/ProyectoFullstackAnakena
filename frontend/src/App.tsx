import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import ComingSoon from './pages/ComingSoon';
import type { NavbarItem } from './types/navbar';
import logoImg from './assets/logo-sin-fondo.png';

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
  // Function to get the current page from URL hash
  const getPageFromHash = (): string => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    return hash || 'inicio';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromHash());
  const logo = logoImg;

  // Handle navigation and update URL hash
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.location.hash = `#${page}`;
  };

  // Listen for hash changes (back/forward buttons, direct hash changes)
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setCurrentPage(newPage);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Set initial page based on current hash
    handleHashChange();

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

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
      case 'noticias':
        return <ComingSoon pageName="Noticias" description="Aquí encontrarás todas las noticias y novedades del club Anakena. Incluirá artículos completos, galerías de fotos y videos de los partidos más importantes." />;
      case 'historia':
        return <ComingSoon pageName="Historia del Club" description="Una línea de tiempo interactiva con los hitos más importantes de los 25+ años de historia del club Anakena DCC." />;
      case 'calendario':
        return <ComingSoon pageName="Calendario" description="Aquí podrás ver todos los partidos programados, horarios, ubicaciones y resultados de todos nuestros equipos." />;
      case 'tienda':
        return <ComingSoon pageName="Tienda Anakena" description="Próximamente podrás adquirir merchandising oficial del club: camisetas, gorras, accesorios y más." />;
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