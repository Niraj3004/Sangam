import axios from 'axios';

// Get API URL from env, fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We will attach interceptors later when we build the auth store using Zustand
export const setupInterceptors = (getToken: () => string | null, logout: () => void) => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Basic 401 handling for now (we'll implement refresh token logic later)
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
