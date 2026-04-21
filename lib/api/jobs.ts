import { apiClient } from './client';
import { Job } from './types';
import { saveLocalJob, mergeWithLocalJobs } from '../localJobsStore';

export const jobsApi = {
  createJob: async (data: any): Promise<Job> => {
    const response = await apiClient.post<any>('/v1/jobs', data);
    const created = response.data;

    // Immediately persist to local store so it appears in the portal
    // even if backend isn't returning it yet in list queries
    const backendJob = (created as any)?.data || (created as any)?.job || created;
    if (backendJob) {
      saveLocalJob({
        id: backendJob._id || backendJob.id || `local-${Date.now()}`,
        title: data.title,
        company: data.company,
        location: data.location || '',
        type: data.type || 'full-time',
        status: data.status || 'open',
        description: data.description || '',
        skills: data.skills || [],
        requirements: data.requirements || [],
        experienceYears: data.experienceYears || 0,
        createdAt: backendJob.createdAt || new Date().toISOString(),
        updatedAt: backendJob.updatedAt || new Date().toISOString(),
      });
    }

    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    type JobsResponse = Job[] | { data?: Job[]; total?: number; length?: number; [key: string]: unknown };
    const response = await apiClient.get<JobsResponse>('/v1/jobs?status=all');
    let rawData: JobsResponse = response.data;

    if ((!rawData || (Array.isArray((rawData as {data?: unknown}).data) && (rawData as {total?: number}).total === 0)) && !(rawData as unknown[]).length) {
      try {
        const resp2 = await apiClient.get<JobsResponse>('/v1/jobs/');
        if (resp2.data && ((Array.isArray((resp2.data as {data?: unknown}).data) && ((resp2.data as {total?: number}).total ?? 0) > 0) || (resp2.data as unknown[]).length > 0)) {
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

    const jobsArray = findArray(rawData) || [];
    return mergeWithLocalJobs(jobsArray) as Job[];
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
