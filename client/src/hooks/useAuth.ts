import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../interfaces/auth.interface';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // Initialize user from localStorage and userId from cookie
  useEffect(() => {
    try {
      // Get user from localStorage
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      // Get userId from cookie
      const currentUserId = authService.getCurrentUserId();
      setUserId(currentUserId);

      // If we have a user but no userId in cookie, set it
      if (currentUser?.id && !currentUserId) {
        // This is a fallback in case the cookie wasn't set properly
        document.cookie = `userId=${currentUser.id};path=/;max-age=${60*60*24*7}`;
        setUserId(currentUser.id);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      // Set user after registration
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    userId,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};
