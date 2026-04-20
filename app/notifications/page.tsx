'use client';

import React, { useState } from 'react';
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

const INITIAL_NOTIFICATIONS = [
    { id: 1, type: 'application', title: 'New Application Received', message: 'Alexander Chen applied for Senior Backend Engineer.', time: '10 mins ago', read: false, icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 2, type: 'message', title: 'Message from Candidate', message: 'Sarah Thompson replied to your interview request.', time: '1 hour ago', read: false, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 3, type: 'system', title: 'System Update', message: 'Platform maintenance scheduled for this weekend.', time: '3 hours ago', read: true, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 4, type: 'job', title: 'Job Posting Expiring', message: 'Your posting for "Product Designer" expires in 2 days.', time: '1 day ago', read: true, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 5, type: 'application', title: 'Candidate Shortlisted', message: 'Michael Laurent has been moved to Shortlisted by the hiring team.', time: '2 days ago', read: true, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const toggleReadStatus = (id: number) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: !n.read } : n
        ));
    };

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream/10 pb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-5xl font-black text-cream tracking-tight">Notifications</h1>
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
                    {notifications.map((notification) => {
                        const Icon = notification.icon;
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
                            <p className="text-cream/40 font-bold tracking-wider">You&apos;re all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
