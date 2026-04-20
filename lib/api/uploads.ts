import { apiClient } from './client';

export const uploadsApi = {
  uploadCsv: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Override Content-Type for this request
    const response = await apiClient.post('/v1/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/v1/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
