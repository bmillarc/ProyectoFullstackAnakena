import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import type { NavbarItem } from './types/navbar';
import type { SliderData } from './types/slider';
import bannerImg from './assets/banner.png';
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
  //Logo navbar
  const logo = logoImg;

  //Menu Navbar
  const navbarItems: NavbarItem[] = [
    {
      label: 'Inicio',
      href: '/',
    },
    {
      label: 'Noticias',
      href: '/noticias',
    },
    {
      label: 'Equipo',
      href: '/equipo',
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

  //Datos Slider - usar las variables importadas correctamente
  const slides: SliderData[] = [
    {
      id: 'slide1',
      title: 'Bienvenido a Anakena',
      subtitle: '',
      image: bannerImg, 
    },
    {
      id: 'slide2',
      title: 'Nuestro Equipo',
      subtitle: '',
      image: bannerImg, 
    },
    {
      id: 'slide3',
      title: 'Historia y Tradición',
      subtitle: '',
      image: bannerImg, 
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar logo={logo} items={navbarItems} />
        <Box component="main">
          <Slider slides={slides} autoPlay={true} autoPlayInterval={4000} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;