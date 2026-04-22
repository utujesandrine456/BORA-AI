'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            return toast.error('Invalid or missing reset token. Please request a new one.');
        }

        if (formData.password.length < 8) {
            return toast.error('Password must be at least 8 characters long');
        }

        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await authApi.resetPassword({
                token,
                password: formData.password
            });
            toast.success('Password successfully reset!');
            setCompleted(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to reset password';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23DAC5A7' stroke-opacity='0.15' stroke-width='1'/%3E%3Cpath d='M30 60L0 30' fill='none' stroke='%23DAC5A7' stroke-opacity='0.15' stroke-width='1'/%3E%3C/svg%3E`;

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-dark relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.05 }}
                transition={{ duration: 1.5 }}
                className="fixed inset-0 z-0 pointer-events-none"
                style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '70px' }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-12 h-12 border-2 border-cream/30 bg-dark rounded-full flex items-center justify-center transition-all group-hover:border-cream group-hover:rotate-12 duration-500 overflow-hidden shadow-2xl shadow-cream/20">
                            <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-3xl font-bold text-cream">Bora</span>
                    </Link>
                </div>

                <div className="bg-cream/5 border border-cream/10 p-10 rounded-2xl space-y-8 backdrop-blur-sm">
                    {!completed ? (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-cream">Create New Password</h2>
                                <p className="text-cream/50 text-sm font-medium leading-relaxed">
                                    Set a strong, 8-character password to secure your BORA account.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2 group relative">
                                    <label className="text-sm font-medium text-cream/60 ml-1 group-focus-within:text-cream transition-colors">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                                            className="bg-cream/5 border-cream/20 h-14 pl-12 pr-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-cream/60 ml-1 group-focus-within:text-cream transition-colors">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="bg-cream/5 border-cream/20 h-14 pl-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full h-14 bg-cream text-dark hover:bg-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-cream/10 group/btn disabled:opacity-50">
                                    {loading ? 'Updating Password...' : 'Reset Password'}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-cream">Password Reset!</h2>
                                <p className="text-cream/50 text-sm font-medium">
                                    Your password has been successfully updated. You can now log in with your new credentials.
                                </p>
                            </div>
                            <Link href="/auth/login" className="block">
                                <Button className="w-full h-14 bg-cream text-dark hover:bg-white font-bold text-lg rounded-xl transition-all">
                                    Log in to BORA
                                </Button>
                            </Link>
                        </motion.div>
                    )}

                    {!completed && (
                        <div className="pt-4 border-t border-cream/10 text-center">
                            <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-cream/40 hover:text-cream transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-dark flex items-center justify-center text-cream">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
