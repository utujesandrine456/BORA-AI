import { apiClient } from './client';
import { ScreeningResult } from './types';

export const screeningApi = {
  triggerScreening: async (jobId: string): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(`/v1/screen/${jobId}`);
    return response.data;
  },

  getResults: async (jobId: string): Promise<ScreeningResult[]> => {
    const response = await apiClient.get<ScreeningResult[]>(`/v1/results/${jobId}`);
    return response.data;
  },

  getResultVersions: async (jobId: string): Promise<{ version: number; createdAt: string }[]> => {
    const response = await apiClient.get<{ version: number; createdAt: string }[]>(`/v1/results/${jobId}/versions`);
    return response.data;
  }
};
