import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore((s) => ({
    isAuthenticated: s.isAuthenticated,
    isLoading: s.isLoading
  }));
  const showNotification = useNotificationStore((s) => s.showNotification);
  const location = useLocation();
  const hasShownNotification = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasShownNotification.current) {
      showNotification(
        'Debes iniciar sesión para acceder a esta página',
        'warning'
      );
      hasShownNotification.current = true;
    }
  }, [isLoading, isAuthenticated, showNotification]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to home page but save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
