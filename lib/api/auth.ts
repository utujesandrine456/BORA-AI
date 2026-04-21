import { apiClient } from './client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    console.log('authApi.login response data:', response.data);

    // Some backends use 'accessToken' or 'access_token' instead of 'token'
    let token = (response.data as any).token || (response.data as any).accessToken || (response.data as any).access_token;

    // Safety check: if token is an object with accessToken (common in some NestJS patterns)
    if (token && typeof token === 'object' && token.accessToken) {
      token = token.accessToken;
    }

    if (typeof token === 'string' && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      console.log('Token successfully stored in localStorage');
    } else if (token) {
      console.error('Token found but it is not a string:', token);
    } else {
      console.warn('No token found in login response!', response.data);
    }
    
    return response.data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
};
