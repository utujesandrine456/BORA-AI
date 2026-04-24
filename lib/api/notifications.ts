import { apiClient } from './client';

export interface Notification {
    id?: string;
    _id?: string;
    type: 'application' | 'message' | 'system' | 'job' | string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string;

    // Optional frontend fields
    icon?: string;
    color?: string;
    bg?: string;
    time?: string;
}

export const notificationsApi = {
    getNotifications: async (): Promise<Notification[]> => {
        const response = await apiClient.get<{ data: Notification[] } | Notification[]>('/v1/notifications');
        const data = ('data' in response.data) ? response.data.data : response.data;
        return Array.isArray(data) ? data : [];
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get<{ count: number }>('/v1/notifications/unread-count');
        return response.data.count || 0;
    },

    markAsRead: async (id: string): Promise<void> => {
        await apiClient.patch(`/v1/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await apiClient.patch('/v1/notifications/mark-all-read');
    },

    deleteNotification: async (id: string): Promise<void> => {
        await apiClient.delete(`/v1/notifications/${id}`);
    },

    deleteAll: async (): Promise<void> => {
        await apiClient.delete('/v1/notifications');
    }
};
