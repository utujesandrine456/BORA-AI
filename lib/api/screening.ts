import { apiClient } from './client';
import { ScreeningResult } from './types';

export const screeningApi = {
  triggerScreening: async (jobId: string): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(`/v1/screen/${jobId}`);
    return response.data;
  },

  getResults: async (jobId: string, version?: number): Promise<any> => {
    const query = version ? `?version=${version}` : '';
    const response = await apiClient.get(`/v1/results/${jobId}${query}`);
    return response.data;
  },

  getResultVersions: async (jobId: string): Promise<any[]> => {
    const response = await apiClient.get(`/v1/results/${jobId}/versions`);
    return response.data;
  }
};
