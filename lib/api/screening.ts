import { apiClient } from './client';
import { ScreeningResult } from './types';

export const screeningApi = {
  /**
   * POST /v1/screen/{jobId}
   * Queues AI screening for a job. Non-blocking — returns immediately.
   */
  triggerScreening: async (jobId: string): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(
      `/v1/screen/${jobId}`
    );
    return response.data;
  },

  /**
   * GET /v1/results/{jobId}
   * Returns the latest screening results for a job.
   * Handles multiple response shapes: plain array, { data: [] }, { results: [] }
   */
  getResults: async (jobId: string): Promise<ScreeningResult[]> => {
    const response = await apiClient.get<unknown>(`/v1/results/${jobId}`);
    const raw = response.data;

    if (Array.isArray(raw)) return raw as ScreeningResult[];

    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      // Check common envelope keys
      for (const key of ['data', 'results', 'candidates', 'items']) {
        if (Array.isArray(obj[key])) return obj[key] as ScreeningResult[];
      }
    }

    return [];
  },

  /**
   * GET /v1/results/{jobId}/versions
   * Lists all screening result versions for a job.
   */
  getResultVersions: async (
    jobId: string
  ): Promise<{ version: number; createdAt: string }[]> => {
    const response = await apiClient.get<unknown>(`/v1/results/${jobId}/versions`);
    const raw = response.data;
    if (Array.isArray(raw)) return raw as { version: number; createdAt: string }[];
    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      for (const key of ['data', 'versions', 'items']) {
        if (Array.isArray(obj[key])) return obj[key] as { version: number; createdAt: string }[];
      }
    }
    return [];
  },
};
