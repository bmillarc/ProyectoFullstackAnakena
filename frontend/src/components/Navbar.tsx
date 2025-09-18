import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import type { NavbarProps } from '../types/navbar';

export default function Navbar({ logo, items }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {items.map((item, index) => (
              <Button key={index} color="inherit" href={item.href} sx= {{ px: 2, py: 0 }}>
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
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
                <ListItemButton href={item.href} onClick={handleDrawerToggle}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Spacer */}
      <Toolbar/>
    </>
  );
}