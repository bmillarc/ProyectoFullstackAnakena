import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Menu, MenuItem, Typography,
} from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import type { NavbarProps, NavbarItem } from '../types/navbar';
import { useAuth } from '../context/AuthContext';
import LoginDialog from './Login';
import RegisterDialog from './Register';

export default function Navbar({ logo, items }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (item: NavbarItem, event: React.MouseEvent) => {
    event.preventDefault();
    if (item.onClick) {
      item.onClick();
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* Logo */}
          <Box sx={{
            minHeight: '48px',
            height: 48,
            py: 0,
            px: 2,
          }}>
            <img src={logo} alt="Logo" style={{ height: 100 }} />
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {items.map((item, index) => (
              <Button
                key={index}
                color="inherit"
                onClick={(e) => handleItemClick(item, e)}
                sx={{ px: 2, py: 0 }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Auth Section - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Hola, {user?.username}
                </Typography>
                <IconButton
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  size="large"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">{user?.email}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => setLoginOpen(true)}
                  variant="outlined"
                  sx={{ borderColor: 'white' }}
                >
                  Iniciar Sesión
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' }, ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {items.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={(e) => {
                    handleItemClick(item, e);
                    handleDrawerToggle();
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Auth options in mobile menu */}
            <ListItem sx={{ borderTop: 1, borderColor: 'divider', mt: 1, pt: 1 }}>
              {isAuthenticated ? (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                    Hola, {user?.username}
                  </Typography>
                  <Button
                    fullWidth
                    onClick={() => {
                      handleDrawerToggle();
                      handleLogout();
                    }}
                    sx={{ mt: 1 }}
                  >
                    Cerrar Sesión
                  </Button>
                </Box>
              ) : (
                <Box sx={{ width: '100%', px: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      handleDrawerToggle();
                      setLoginOpen(true);
                    }}
                    sx={{ mb: 1 }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      handleDrawerToggle();
                      setRegisterOpen(true);
                    }}
                  >
                    Registrarse
                  </Button>
                </Box>
              )}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Login Dialog */}
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      {/* Register Dialog */}
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />

      {/* Spacer */}
      <Toolbar/>
    </>
  );
}