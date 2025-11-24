import { create } from 'zustand';
import type { AlertColor } from '@mui/material';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  showNotification: (message: string, severity?: AlertColor) => void;
  hide: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  showNotification: (message: string, severity: AlertColor = 'info') => {
    set({ open: true, message, severity });
  },
  hide: () => set({ open: false })
}));
