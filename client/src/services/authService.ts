import api from '../api/axios';
import { AUTH_ENDPOINTS } from '../api/urls';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../interfaces/auth.interface';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie.utils';
export const authService = {
  /**
   * Login user
   * @param credentials - User login credentials
   * @returns Promise with user data and token
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);

    // Store token and user in localStorage and user ID in cookie
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Store user ID in cookie for easy access across pages
      if (response.data.user && response.data.user.id) {
        setCookie('userId', response.data.user.id.toString());
      }
    }

    return response.data;
  },

  /**
   * Register new user
   * @param userData - User registration data
   * @returns Promise with user data and token
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);

    // Store token and user in localStorage and user ID in cookie
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Store user ID in cookie for easy access across pages
      if (response.data.user && response.data.user.id) {
        setCookie('userId', response.data.user.id.toString());
      }
    }

    return response.data;
  },

  /**
   * Logout user
   * @returns Promise with logout status
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // Clear localStorage and cookies regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      deleteCookie('userId');
    }
  },

  /**
   * Get current authenticated user
   * @returns User object or null
   */
  getCurrentUser: (): any => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /**
   * Get current user ID from cookie
   * @returns User ID or null
   */
  getCurrentUserId: (): number | null => {
    const userId = getCookie('userId');
    return userId ? parseInt(userId) : null;
  },

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
