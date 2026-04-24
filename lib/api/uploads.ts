import { apiClient } from './client';

export const uploadsApi = {
  uploadCsv: async (file: File, jobId: string): Promise<unknown> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);

    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
        token = token.slice(1, -1);
      }
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bora-backend-w0sw.onrender.com/api';
    const response = await fetch(`${baseURL}/v1/upload/csv?jobId=${jobId}`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!response.ok) {
      let errorMsg = 'Upload failed';
      try {
        const err = await response.json();
        errorMsg = err.message || errorMsg;
      } catch (e) { }
      throw new Error(errorMsg);
    }
    return response.json();
  }
};
