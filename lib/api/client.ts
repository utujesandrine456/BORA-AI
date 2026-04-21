import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Get base URL from environment or default to local backend
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        // Handle potential double-quoting from some storage patterns
        let cleanToken = token.trim();
        if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) || 
            (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
          cleanToken = cleanToken.slice(1, -1);
        }
        
        config.headers.Authorization = `Bearer ${cleanToken}`;
        
        // Log relative URL for cleaner console
        const url = config.url || '';
        console.log(`[API Request] ${config.method?.toUpperCase()} ${url} | Token: ${cleanToken.substring(0, 8)}...`);
      } else {
        console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} | NO TOKEN FOUND`);
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const errorData = error.response?.data;
    
    console.error(`[API Error] ${status || 'Network Error'} on ${url}:`, JSON.stringify(errorData, null, 2) || error.message);

    if (status === 401) {
      console.warn('Axios Interceptor: 401 detected. Clearing token and redirecting to login.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Avoid infinite loop if already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login?reason=session_expired';
        }
      }
    }
    return Promise.reject(error);
  }
);
