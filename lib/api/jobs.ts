import { apiClient } from './client';
import { Job } from './types';

export const jobsApi = {
  createJob: async (data: Job): Promise<Job> => {
    const response = await apiClient.post<Job>('/v1/jobs', data);
    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<Job[]>('/v1/jobs');
    return response.data;
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
