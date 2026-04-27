import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
        if ((cleanToken.startsWith('"') && cleanToken.endsWith('"')) ||
          (cleanToken.startsWith("'") && cleanToken.endsWith("'"))) {
          cleanToken = cleanToken.slice(1, -1);
        }

        config.headers.Authorization = `Bearer ${cleanToken}`;

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


apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Axios Interceptor: 401 detected. Clearing token.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        const isPublicPage = window.location.pathname === '/' || window.location.pathname.startsWith('/auth/');
        if (!isPublicPage) {
          console.warn('Redirecting to login from private page.');
          window.location.href = '/auth/login?reason=session_expired';
        }
      }
    }
    return Promise.reject(error);
  }
);
