import { create } from 'zustand';
import type { User, LoginCredentials, RegisterData } from '../types/auth';
import * as authService from '../services/authService';

interface AuthStoreState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    set({
      user: { id: response.id, username: response.username, email: response.email },
      isAuthenticated: true
    });
  },
  register: async (data: RegisterData) => {
    const response = await authService.register(data);
    set({
      user: { id: response.id, username: response.username, email: response.email },
      isAuthenticated: true
    });
  },
  logout: async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore network/log out errors, continue clearing local state
    }
    set({ user: null, isAuthenticated: false });
  },
  refreshUser: async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      set({ user: currentUser, isAuthenticated: true });
    } catch (e) {
      set({ user: null, isAuthenticated: false });
      try {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('csrfToken');
      } catch {}
    }
  }
}));

// Initialization logic similar to previous AuthContext useEffect
async function initAuth() {
  const { refreshUser } = useAuthStore.getState();
  try {
    const storedUser = authService.getUserFromStorage();
    if (storedUser) {
      useAuthStore.setState({ user: storedUser, isAuthenticated: true });
      try {
        await refreshUser();
      } catch {
        useAuthStore.setState({ user: null, isAuthenticated: false });
        try {
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('csrfToken');
        } catch {}
      }
    }
  } catch (e) {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  } finally {
    useAuthStore.setState({ isLoading: false });
  }
}

initAuth();
