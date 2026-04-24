import { apiClient } from './client';
import { ProfileInput, BulkProfileInput } from './types';
import { TalentProfile } from '../types/profile';

export interface PaginatedProfiles {
  data: TalentProfile[];
  total: number;
  page: number;
  limit: number;
}

export const profilesApi = {
  addProfile: async (data: ProfileInput): Promise<TalentProfile> => {
    const response = await apiClient.post<TalentProfile>('/v1/profiles', data);
    return response.data;
  },

  getProfiles: async (params?: { jobId?: string; page?: number; limit?: number }): Promise<PaginatedProfiles> => {
    const response = await apiClient.get<PaginatedProfiles>('/v1/profiles', { params });
    return response.data;
  },

  bulkInsertProfiles: async (data: BulkProfileInput): Promise<{ inserted: number; errors: unknown[] }> => {
    const response = await apiClient.post<{ inserted: number; errors: unknown[] }>('/v1/profiles/bulk', data);
    return response.data;
  },

  getProfileById: async (id: string): Promise<TalentProfile> => {
    try {
      const response = await apiClient.get<TalentProfile>(`/v1/profiles/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`Direct profile fetch failed for ${id}. Trying list fallback...`);
        const response = await apiClient.get<PaginatedProfiles>('/v1/profiles', {
          params: { id, limit: 1 }
        });
        const found = response.data.data.find(p => p._id === id || (p as any).id === id);
        if (found) return found;
      }
      throw error;
    }
  },

  updateProfile: async (id: string, data: Partial<ProfileInput>): Promise<TalentProfile> => {
    // Switching to PUT as the jobs API uses it for updates and PATCH returned 404
    const response = await apiClient.put<TalentProfile>(`/v1/profiles/${id}`, data);
    return response.data;
  }
};
