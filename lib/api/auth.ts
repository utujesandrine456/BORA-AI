import { apiClient } from './client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    console.log('authApi.login response data:', response.data);

    type RawLoginData = { token?: string; accessToken?: string; access_token?: string };
    const raw = response.data as any;
    let token = raw.token || raw.accessToken || raw.access_token;

    if (token && typeof token === 'object' && (token as any).accessToken) {
      token = (token as any).accessToken;
    }

    if (typeof token === 'string' && typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      console.log('Token and user info successfully stored in localStorage');
    } else if (token) {
      console.error('Token found but it is not a string:', token);
    } else {
      console.warn('No token found in login response!', response.data);
    }

    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/v1/auth/logout').catch(() => { });
    } catch (_e) {
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
  },

  getMe: async (): Promise<any> => {
    const response = await apiClient.get('/v1/auth/me');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/v1/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/v1/auth/reset-password', data);
    return response.data;
  }
};
