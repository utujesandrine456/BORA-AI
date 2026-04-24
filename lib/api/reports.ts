import { apiClient } from './client';


export const reportsApi = {
    downloadScreeningReport: async (screeningId: string): Promise<Blob> => {
        const response = await apiClient.get<Blob>(`/v1/reports/screening/${screeningId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    }
};
