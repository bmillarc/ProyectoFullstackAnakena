import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore, type NotificationState } from '../store/notificationStore';

export default function NotificationHost() {
  const { open, message, severity, hide } = useNotificationStore((s: NotificationState) => ({
    open: s.open,
    message: s.message,
    severity: s.severity,
    hide: s.hide
  }));

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hide}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={hide} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
