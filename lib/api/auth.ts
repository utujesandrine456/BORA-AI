import { apiClient } from './client';
import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/v1/auth/login', data);
    const raw = response.data as any;

    console.log('[authApi.login] Raw response data:', raw);

    let token = raw.token || raw.accessToken || raw.access_token;

    if (token && typeof token === 'object' && token.accessToken) {
      token = token.accessToken;
    }

    if (!token) {
      console.warn('[authApi.login] No token found in response');
      return response.data;
    }

    const cleanToken = token.trim().replace(/^["']|["']$/g, ''); // strip accidental quotes

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', cleanToken);

      // Store user info from wherever the backend puts it
      const user = raw?.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      console.log('[authApi.login] Token stored successfully. Preview:', cleanToken.substring(0, 16) + '...');
    }

    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/v1/auth/logout');
    } catch (error) {
      console.error('[authApi.logout] Logout API call failed (non-critical):', error);
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

  /**
   * Change password for the currently logged-in user.
   * Calls our internal Next.js API route.
   */
  changePassword: async (newPassword: string): Promise<{ message: string }> => {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ newPassword })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }

    return response.json();
  },
};
