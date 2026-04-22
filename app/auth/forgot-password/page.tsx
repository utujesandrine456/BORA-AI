'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            return toast.error('Please enter your email address');
        }

        setLoading(true);
        try {
            await authApi.forgotPassword({ email });
            toast.success('Reset link sent to your email!');
            setSubmitted(true);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to send reset link';
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
                    {!submitted ? (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-cream">Forgot Password?</h2>
                                <p className="text-cream/50 text-sm font-medium leading-relaxed">
                                    No worries! Enter your email below and we'll send you a secure link to reset your password.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-cream/60 ml-1 group-focus-within:text-cream transition-colors">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            className="bg-cream/5 border-cream/20 h-14 pl-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-cream text-dark hover:bg-white font-bold text-lg rounded-xl transition-all shadow-xl shadow-cream/10 group/btn disabled:opacity-50">
                                    {loading ? 'Sending link...' : <span className="flex items-center justify-center gap-2">Send Reset Link <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                                <Send className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-cream">Check your email</h2>
                                <p className="text-cream/50 text-sm font-medium leading-relaxed">
                                    We've sent a password reset link to <span className="text-cream">{email}</span>. Please check your inbox and spam folder.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full h-12 border-cream/10 text-cream/60"
                                onClick={() => setSubmitted(false)}
                            >
                                Didn't receive an email? Try again
                            </Button>
                        </motion.div>
                    )}

                    <div className="pt-4 border-t border-cream/10 text-center">
                        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-cream/40 hover:text-cream transition-colors group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
