'use client';

import React, { useState, useEffect } from 'react';
import { User, Shield, Laptop, Check, Save } from 'lucide-react';
import TopNav from '@/components/TopNav';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api/auth';

type Category = 'security' | 'profile';

export default function AdminSettings() {
    const [activeCategory, setActiveCategory] = React.useState<Category>('security');
    const [loading, setLoading] = React.useState(false);
    const [fetching, setFetching] = React.useState(true);

    const [recruiterData, setRecruiterData] = React.useState({
        name: '',
        email: '',
        role: ''
    });

    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    React.useEffect(() => {
        const loadProfile = async () => {
            try {
                setFetching(true);
                const res = await authApi.getMe();
                // backend might return { user: {...} } or just the user
                const user = res.user || res;

                if (user) {
                    setRecruiterData({
                        name: user.name || '',
                        email: user.email || '',
                        role: user.role || 'Recruiter'
                    });
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
                toast.error('Failed to load recruiter profile');
            } finally {
                setFetching(false);
            }
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        if (activeCategory === 'security') {
            if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                toast.error('Please fill in all password fields');
                return;
            }
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }
            if (passwordData.newPassword.length < 6) {
                toast.error('New password must be at least 6 characters');
                return;
            }
        }

        setLoading(true);
        const id = toast.loading(`Saving ${activeCategory === 'security' ? 'security updates' : 'account details'}...`);
        try {
            if (activeCategory === 'profile') {
                const updated = await authApi.updateMe({ name: recruiterData.name });
                setRecruiterData({
                    name: updated.name || recruiterData.name,
                    email: updated.email || recruiterData.email,
                    role: updated.role || recruiterData.role,
                });

                if (typeof window !== 'undefined') {
                    const stored = localStorage.getItem('user');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        localStorage.setItem('user', JSON.stringify({ ...parsed, name: updated.name }));
                    }
                }
                toast.success('Profile updated successfully!', { id });
            } else {
                await authApi.changePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                toast.success('Password changed successfully!', { id });
            }
        } catch (error: any) {
            console.error('Save failed:', error);
            toast.error(error?.response?.data?.message || error.message || 'Failed to save configuration', { id });
        } finally {
            setLoading(false);
        }
    };

    const categories: { id: Category; label: string; icon: any; color: string }[] = [
        { id: 'security', label: 'Account Security', icon: Shield, color: 'text-amber-500' },
        { id: 'profile', label: 'Account Details', icon: User, color: 'text-emerald-500' },
    ];

    if (fetching) {
        return (
            <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
                <p className="text-cream/40 font-bold text-sm">Syncing settings...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
                    <div>
                        <h1 className="text-5xl font-black text-cream leading-none mb-4">Platform Settings</h1>
                        <p className="text-cream/40 font-medium text-md">Manage your account security and profile information</p>
                    </div>

                    <div className="flex items-center gap-4 bg-cream/5 p-1.5 rounded-md border border-cream/10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`cursor-pointer px-6 py-3 rounded-md flex items-center gap-3 transition-all font-bold text-sm ${activeCategory === cat.id
                                    ? 'bg-cream text-dark shadow-xl'
                                    : 'text-cream/40 hover:text-cream hover:bg-cream/5'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-cream/5 border border-cream/10 rounded-3xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cream/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            {activeCategory === 'security' && (
                                <div className="space-y-8 max-w-xl">
                                    <h3 className="text-xl font-bold text-cream">Change Password</h3>
                                    <div className="space-y-6">
                                        <Input
                                            label="Current Password"
                                            type="password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="New Password"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="Confirm New Password"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                        <div className="flex gap-3">
                                            <Shield className="w-5 h-5 text-amber-500 shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Security Recommendation</p>
                                                <p className="text-xs text-cream/60 leading-relaxed">
                                                    Use at least 8 characters with a mix of letters, numbers, and symbols for maximum security.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeCategory === 'profile' && (
                                <div className="space-y-8 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Full Name"
                                            value={recruiterData.name}
                                            onChange={(e) => setRecruiterData({ ...recruiterData, name: e.target.value })}
                                            placeholder="Enter your name"
                                        />
                                        <Input
                                            label="Email Address"
                                            value={recruiterData.email}
                                            readOnly
                                            disabled
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div className="p-6 bg-cream/5 border border-cream/10 rounded-md">
                                        <h4 className="text-sm font-bold text-cream mb-2">Role & Permissions</h4>
                                        <p className="text-xs text-cream/40 mb-4 text-pretty">Your account is currently assigned the <strong>{recruiterData.role}</strong> role. Contact your administrator to change workspace permissions.</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-500 text-[10px] font-bold">
                                            <Shield className="w-3 h-3" />
                                            Active Session Secured
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="pt-12 text-left flex items-center gap-6">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-cream text-dark py-5 px-12 text-sm font-black shadow-xl h-14 flex items-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {activeCategory === 'security' ? 'Update Password' : 'Save Details'}
                    </Button>
                    {loading && (
                        <p className="text-cream/40 font-bold text-sm animate-pulse">Syncing changes with secure vaults...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
