import { apiClient } from './client';
import { Job } from './types';

export const jobsApi = {
  createJob: async (data: Job): Promise<Job> => {
    const response = await apiClient.post<Job>('/v1/jobs', data);
    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    type JobsResponse = Job[] | { data?: Job[]; total?: number; length?: number;[key: string]: unknown };
    // Try the base endpoint first, it usually returns all for the authenticated recruiter
    const response = await apiClient.get<JobsResponse>('/v1/jobs');
    let rawData: JobsResponse = response.data;

    if (!rawData || (Array.isArray((rawData as { data?: unknown }).data) && (rawData as { total?: number }).total === 0 && (rawData as { data?: Job[] }).data?.length === 0)) {
      try {
        const resp2 = await apiClient.get<JobsResponse>('/v1/jobs?status=all');
        if (resp2.data && ((Array.isArray((resp2.data as { data?: unknown }).data) && ((resp2.data as { total?: number }).total ?? 0) > 0) || (resp2.data as unknown[]).length > 0)) {
          rawData = resp2.data;
        }
      } catch (_e) { }
    }

    if (typeof window !== 'undefined') {
      (window as Window & { __LAST_JOBS_API_RESPONSE__?: unknown; __LAST_JOBS_API_STATUS__?: number }).__LAST_JOBS_API_RESPONSE__ = rawData;
      (window as Window & { __LAST_JOBS_API_RESPONSE__?: unknown; __LAST_JOBS_API_STATUS__?: number }).__LAST_JOBS_API_STATUS__ = response.status;
    }

    const findArray = (obj: unknown): unknown[] | null => {
      if (Array.isArray(obj)) return obj;
      if (obj && typeof obj === 'object') {
        const priorityKeys = ['jobs', 'data', 'items', 'results', 'list'];
        for (const key of priorityKeys) {
          if (Array.isArray((obj as Record<string, unknown>)[key])) return (obj as Record<string, unknown>)[key] as unknown[];
        }

        for (const key in (obj as Record<string, unknown>)) {
          const val = (obj as Record<string, unknown>)[key];
          if (Array.isArray(val)) return val;
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            for (const subKey in (val as Record<string, unknown>)) {
              if (Array.isArray((val as Record<string, unknown>)[subKey])) return (val as Record<string, unknown>)[subKey] as unknown[];
            }
          }
        }
      }
      return null;
    };

    const jobsArray = findArray(rawData);
    if (jobsArray) return jobsArray as Job[];

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
