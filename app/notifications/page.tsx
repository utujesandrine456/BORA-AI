'use client';

import React, { useState, useEffect } from 'react';
import {
    Bell,
    Check,
    Briefcase,
    MessageSquare,
    UserPlus,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

import { notificationsApi, Notification } from '@/lib/api/notifications';

const ICON_MAP: Record<string, any> = {
    UserPlus,
    MessageSquare,
    AlertCircle,
    Briefcase,
    CheckCircle2
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getNotifications();

            // Map backend data to UI format
            const mappedData = data.map(n => {
                let iconStr = 'Bell';
                let colorStr = 'text-cream';
                let bgStr = 'bg-cream/10';

                if (n.type === 'application') { iconStr = 'UserPlus'; colorStr = 'text-emerald-500'; bgStr = 'bg-emerald-500/10'; }
                else if (n.type === 'message') { iconStr = 'MessageSquare'; colorStr = 'text-amber-500'; bgStr = 'bg-amber-500/10'; }
                else if (n.type === 'system') { iconStr = 'AlertCircle'; colorStr = 'text-red-500'; bgStr = 'bg-red-500/10'; }
                else if (n.type === 'job') { iconStr = 'Briefcase'; colorStr = 'text-[#38bdf8]'; bgStr = 'bg-[#38bdf8]/10'; }
                else if (n.type === 'success') { iconStr = 'CheckCircle2'; colorStr = 'text-emerald-500'; bgStr = 'bg-emerald-500/10'; }

                // Format relative time if necessary or use createdAt
                const timeStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'Recently';

                return {
                    ...n,
                    id: n.id || n._id,
                    icon: n.icon || iconStr,
                    color: n.color || colorStr,
                    bg: n.bg || bgStr,
                    time: n.time || timeStr
                };
            });

            setNotifications(mappedData);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            await loadNotifications();
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    };

    const toggleReadStatus = async (id: string | undefined, currentlyRead: boolean) => {
        if (!id) return;
        try {
            if (!currentlyRead) {
                await notificationsApi.markAsRead(id);
            }
            // If the user wants to unread, backend doesn't have an endpoint for it as per screenshot, so we might just refetch
            await loadNotifications();
        } catch (e) {
            console.error('Failed to update notification:', e);
        }
    };

    const deleteNotification = async (id: string | undefined) => {
        if (!id) return;
        try {
            await notificationsApi.deleteNotification(id);
            await loadNotifications();
        } catch (e) {
            console.error('Failed to delete notification:', e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream/10 pb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-5xl font-black text-cream ">Notifications</h1>
                            {unreadCount > 0 && (
                                <div className="bg-cream text-dark px-3 mt-2 py-0.5 rounded-full text-sm font-bold">
                                    {unreadCount} New
                                </div>
                            )}
                        </div>
                        <p className="text-cream/60 font-medium text-md italic serif">Stay updated on your platform activities and candidate pipelines.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="gap-2" onClick={markAllAsRead}>
                            <Check className="w-4 h-4" /> Mark all as read
                        </Button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-24 w-full bg-cream/5 border border-cream/10 rounded-md animate-pulse" />
                        ))
                    ) : notifications.map((notification) => {
                        const Icon = ICON_MAP[notification.icon as string] || Bell;
                        return (
                            <Card
                                key={notification.id}
                                className={`p-5 transition-all duration-300 relative group overflow-hidden ${notification.read ? 'border-cream/5 bg-transparent' : 'border-cream/20 bg-cream/5'
                                    }`}
                            >
                                {!notification.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cream rounded-l-md" />
                                )}

                                <div className="flex items-start gap-5">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notification.bg}`}>
                                        <Icon className={`w-6 h-6 ${notification.color}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                            <h3 className={`text-lg font-bold truncate ${notification.read ? 'text-cream/80' : 'text-cream'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs font-bold text-cream/40 whitespace-nowrap hidden sm:block">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${notification.read ? 'text-cream/50' : 'text-cream/70 font-medium'} max-w-2xl`}>
                                            {notification.message}
                                        </p>
                                        <span className="text-xs font-bold text-cream/40 mt-2 sm:hidden block">
                                            {notification.time}
                                        </span>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleReadStatus(notification.id, notification.read); }}
                                                className="p-2 hover:bg-cream/10 rounded-md text-emerald-500 hover:text-emerald-400 transition-colors"
                                                title="Mark as read"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {notifications.length === 0 && (
                        <div className="py-20 text-center space-y-4 border border-dashed border-cream/10 rounded-md">
                            <Bell className="w-12 h-12 text-cream/10 mx-auto" />
                            <p className="text-cream/40 font-bold ">You&apos;re all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
