import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import ComingSoon from './pages/ComingSoon';
import type { NavbarItem } from './types/navbar';
import Footer from './components/Footer';
import logoImg from './assets/logo-sin-fondo.png';
import Calendar from './pages/Calendar';
import Store from './pages/Store';
import { AuthProvider } from './context/AuthContext';
import News from './pages/News';


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
        return <News />;
      case 'historia':
        return <ComingSoon pageName="Historia del Club" description="Una línea de tiempo interactiva con los hitos más importantes de los 25+ años de historia del club Anakena DCC." />;
      case 'calendario':
        return <Calendar/>;
      case 'tienda':
        return <Store/>;
      case 'inicio':
      default:
        return <Home />;
    }
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar logo={logo} items={navbarItems} />
          <Box component="main" sx={{ flex: 1 }}>
            {renderCurrentPage()}
          </Box>
          <Footer onNavigate={handleNavigation} />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;