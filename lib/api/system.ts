import { apiClient } from './client';

export const systemApi = {
  /**
   * Resets the platform configuration and potentially clears demo data.
   * Uses the internal Next.js API route to perform database cleanup.
   */
  resetPlatform: async (): Promise<{ message: string }> => {
    // We use a relative path to hit the internal Next.js API route
    // instead of the remote backend baseURL.
    const response = await fetch('/api/system/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset failed');
    }
    
    return response.json();
  },

  /**
   * Resets AI preferences to system defaults.
   */
  resetAIPreferences: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/v1/system/reset/ai');
    return response.data;
  }
};
