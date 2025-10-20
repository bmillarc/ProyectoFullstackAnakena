import type { LoginCredentials, RegisterData, LoginResponse, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get CSRF token from localStorage
function getCsrfToken(): string | null {
  return localStorage.getItem('csrfToken');
}

// Helper function for protected requests (requires CSRF token)
async function fetchProtected<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const csrfToken = getCsrfToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add CSRF token if available
  if (csrfToken) {
    headers['x-csrf-token'] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Register new user (public endpoint - no CSRF needed, but returns CSRF token)
export async function register(data: RegisterData): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const responseData: LoginResponse = await response.json();

  // Store CSRF token in localStorage
  if (responseData.csrfToken) {
    localStorage.setItem('csrfToken', responseData.csrfToken);
  }

  // Store user info in localStorage
  localStorage.setItem('user', JSON.stringify({
    id: responseData.id,
    username: responseData.username,
    email: responseData.email
  }));

  return responseData;
}

// Login user (public endpoint - no CSRF needed, but returns CSRF token)
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const data: LoginResponse = await response.json();

  // Store CSRF token in localStorage
  if (data.csrfToken) {
    localStorage.setItem('csrfToken', data.csrfToken);
  }

  // Store user info in localStorage
  localStorage.setItem('user', JSON.stringify({
    id: data.id,
    username: data.username,
    email: data.email
  }));

  return data;
}

// Logout user (protected endpoint - needs CSRF token)
export async function logout(): Promise<void> {
  await fetchProtected<void>('/auth/logout', {
    method: 'POST',
  });

  // Clear localStorage
  localStorage.removeItem('csrfToken');
  localStorage.removeItem('user');
}

// Get current user (protected endpoint - needs CSRF token)
export async function getCurrentUser(): Promise<User> {
  return await fetchProtected<User>('/auth/me', {
    method: 'GET',
  });
}

// Get user from localStorage
export function getUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getUserFromStorage() !== null && getCsrfToken() !== null;
}
