import { apiClient } from './client';
import { Job } from './types';

export const jobsApi = {
  createJob: async (data: Job): Promise<Job> => {
    console.log('[DEBUG] Creating job with payload:', JSON.stringify(data, null, 2));
    const response = await apiClient.post<Job>('/v1/jobs', data);
    console.log('[DEBUG] Job creation response data:', JSON.stringify(response.data, null, 2));
    return response.data;
  },

  getJobs: async (): Promise<Job[]> => {
    const response = await apiClient.get<any>('/v1/jobs?status=all');
    let rawData = response.data;

    if ((!rawData || (Array.isArray(rawData.data) && rawData.total === 0)) && !rawData.length) {
      console.log('[DEBUG] list is empty, trying /v1/jobs/ fallback...');
      try {
        const resp2 = await apiClient.get<any>('/v1/jobs/');
        if (resp2.data && ((Array.isArray(resp2.data.data) && resp2.data.total > 0) || resp2.data.length > 0)) {
          rawData = resp2.data;
        }
      } catch (e) { }
    }
    console.log('[DEBUG] getJobs rawData:', JSON.stringify(rawData, null, 2));

    // Store for UI debugging
    if (typeof window !== 'undefined') {
      (window as any).__LAST_JOBS_API_RESPONSE__ = rawData;
      (window as any).__LAST_JOBS_API_STATUS__ = response.status;
    }

    // Deep search for an array in the response
    const findArray = (obj: any): any[] | null => {
      if (Array.isArray(obj)) return obj;
      if (obj && typeof obj === 'object') {
        // Broad search for keys like 'jobs', 'data', 'items', 'results'
        const priorityKeys = ['jobs', 'data', 'items', 'results', 'list'];
        for (const key of priorityKeys) {
          if (Array.isArray(obj[key])) return obj[key];
        }

        // Exhaustive search
        for (const key in obj) {
          if (Array.isArray(obj[key])) return obj[key];
          // Check one level deep for common wrappers like data.items
          if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            for (const subKey in obj[key]) {
              if (Array.isArray(obj[key][subKey])) return obj[key][subKey];
            }
          }
        }
      }
      return null;
    };

    const jobsArray = findArray(rawData);
    if (jobsArray) return jobsArray;

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
