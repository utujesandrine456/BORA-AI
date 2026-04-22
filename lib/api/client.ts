import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bora-backend-w0sw.onrender.com/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        let cleanToken = token.trim();
        // Strip accidental surrounding quotes
        if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
          (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
          cleanToken = cleanToken.slice(1, -1);
        }
        config.headers.Authorization = `Bearer ${cleanToken}`;
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} | Token: ${cleanToken.substring(0, 12)}...`);
      } else {
        // No token — this is the most common cause of a 401
        console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} | NO TOKEN IN localStorage — user may not be logged in.`);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/auth/');
        if (!isAuthPage) {
          console.warn('[API Client] 401 Unauthorized — clearing session and redirecting to login.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login?reason=session_expired';
        }
      }
    } else if (status === 400) {
      console.error('[API Client] 400 Bad Request:', error.response?.data);
    }
    return Promise.reject(error);
  }
);
