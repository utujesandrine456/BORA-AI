import { UserPlus, MessageSquare, AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react';

export interface Notification {
    id: string;
    type: 'application' | 'message' | 'system' | 'job';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: any;
    color: string;
    bg: string;
    createdAt: string;
}

const STORAGE_KEY = 'bora_notifications';

const INITIAL_NOTIFICATIONS: Notification[] = [];

export const notificationsApi = {
    getNotifications: async (): Promise<Notification[]> => {
        if (typeof window === 'undefined') return [];

        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
            return INITIAL_NOTIFICATIONS;
        }

        let notifications: Notification[] = JSON.parse(stored);

        // Robust cleanup: Filter out any legacy mock IDs (1 through 5)
        const mockIds = ['1', '2', '3', '4', '5'];
        const cleanNotifications = notifications.filter(n => !mockIds.includes(n.id));

        if (cleanNotifications.length !== notifications.length) {
            notificationsApi.saveNotifications(cleanNotifications);
            return cleanNotifications;
        }

        return notifications;
    },

    saveNotifications: (notifications: Notification[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        }
    },

    markAsRead: async (id: string): Promise<void> => {
        const notifications = await notificationsApi.getNotifications();
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        notificationsApi.saveNotifications(updated);
    },

    markAllAsRead: async (): Promise<void> => {
        const notifications = await notificationsApi.getNotifications();
        const updated = notifications.map(n => ({ ...n, read: true }));
        notificationsApi.saveNotifications(updated);
    },

    addNotification: async (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> => {
        const notifications = await notificationsApi.getNotifications();
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            read: false,
            createdAt: new Date().toISOString()
        };
        notificationsApi.saveNotifications([newNotification, ...notifications]);
    }
};
