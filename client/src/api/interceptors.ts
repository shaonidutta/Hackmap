import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

export function setupInterceptors(api: AxiosInstance): void {
  // Request interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle common errors (401, 403, etc.)
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          // Handle unauthorized - redirect to login or clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // Redirect to login page
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );
}
