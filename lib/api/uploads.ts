import { apiClient } from './client';

export const uploadsApi = {
  uploadCsv: async (file: File, jobId: string): Promise<unknown> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);

    const response = await apiClient.post(`/v1/upload/csv?jobId=${jobId}`, formData, {
      headers: {
        'Content-Type': undefined, // Crucial: Let Axios handle the boundary
      }
    });
    return response.data;
  },

  uploadResume: async (file: File): Promise<unknown> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/v1/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }
};
