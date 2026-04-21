import { apiClient } from './client';
import { Job } from './types';

export const jobsApi = {
  createJob: async (data: Job): Promise<Job> => {
    const response = await apiClient.post<Job>('/v1/jobs', data);
    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<any>('/v1/jobs');
    // Extreme resilience: check all common data wrappers
    const rawData = response.data;
    if (Array.isArray(rawData)) return rawData;
    if (Array.isArray(rawData?.data)) return rawData.data;
    if (Array.isArray(rawData?.jobs)) return rawData.jobs;
    if (Array.isArray(rawData?.results)) return rawData.results;
    if (Array.isArray(rawData?.items)) return rawData.items;
    return [];
  },

  getJobById: async (id: string): Promise<Job> => {
    const response = await apiClient.get<Job>(`/v1/jobs/${id}`);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await apiClient.put<Job>(`/v1/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/jobs/${id}`);
  }
};
