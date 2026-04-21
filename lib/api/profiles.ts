import { apiClient } from './client';
import { ProfileInput, BulkProfileInput } from './types';
import { TalentProfile } from '../types/profile';

// Extending standard interface for pagination metadata since list is paginated
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
    const response = await apiClient.get<TalentProfile>(`/v1/profiles/${id}`);
    return response.data;
  }
};
