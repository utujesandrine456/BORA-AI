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
        const loadNotifications = async () => {
            try {
                setLoading(true);
                const data = await notificationsApi.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to load notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        loadNotifications();
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = async () => {
        await notificationsApi.markAllAsRead();
        const data = await notificationsApi.getNotifications();
        setNotifications(data);
    };

    const toggleReadStatus = async (id: string) => {
        const notifications = await notificationsApi.getNotifications();
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: !n.read } : n
        );
        notificationsApi.saveNotifications(updated);
        setNotifications(updated);
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

                                    <div className="shrink-0 flex items-center gap-2 opactiy-0 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleReadStatus(notification.id)}
                                            className="p-2 hover:bg-cream/10 rounded-md text-cream/50 hover:text-cream transition-colors"
                                            title={notification.read ? "Mark as unread" : "Mark as read"}
                                        >
                                            {notification.read ? <Bell className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </button>
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
