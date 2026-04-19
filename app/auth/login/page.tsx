'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3Cpath d='M30 60L0 30' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3C/svg%3E`;

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.22]"
                style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '70px' }}
            />
            
            {/* Left Side: Hero / Brand */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-linear-to-br from-cream/10 via-dark to-dark border-r border-cream/5">
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 border-2 border-cream/30 bg-dark rounded-full flex items-center justify-center transition-all group-hover:border-cream group-hover:rotate-12 duration-500 overflow-hidden shadow-2xl shadow-cream/20">
                            <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-3xl font-black tracking-widest uppercase text-cream transition-all duration-700">
                            BORA
                        </span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl xl:text-6xl font-black text-cream leading-tight">
                            Welcome Back to the <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cream to-cream/40 italic font-serif">Elite Network</span>
                        </h1>
                        <p className="text-xl text-cream/70 max-w-xl leading-relaxed">
                            Sign in to manage your talent pipeline, review AI insights, and finalize top matches.
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-cream/80">
                            <div className="p-1 rounded-xl bg-cream ">
                                <span className="w-4 h-4 bg-cream"></span>
                            </div>
                            <span className="text-lg font-medium italic">10k+ Verified Talent</span>
                        </div>
                        <div className="flex items-center gap-4 text-cream/80">
                            <div className="p-1 rounded-xl bg-cream ">
                                <span className="w-4 h-4 bg-cream"></span>
                            </div>
                            <span className="text-lg font-medium italic">98% Match Quality</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 bg-dark">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-lg"
                >
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 border border-cream/20 bg-dark rounded-full flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-black uppercase text-cream">BORA</span>
                        </Link>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-cream uppercase tracking-tight">Login</h2>
                        <p className="text-cream/50 mt-2 font-medium">Enter your credentials to access your BORA space.</p>
                    </div>

                    <div className="bg-cream/5 border border-cream/10 p-10 rounded-2xl space-y-8">
                        <form className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1 group-focus-within:text-cream transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        className="bg-cream/5 border-cream/20 h-14 pl-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group relative">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase text-cream/40 group-focus-within:text-cream transition-colors">Password</label>
                                    <Link href="#" className="text-[10px] font-bold text-cream/40 hover:text-cream transition-colors">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 group-focus-within:text-cream/60 transition-colors" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="bg-cream/5 border-cream/20 h-14 pl-12 pr-12 rounded-xl text-cream focus:border-cream/50 transition-all font-medium placeholder:text-cream/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream transition-colors cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-3 cursor-pointer group/check select-none">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-cream border-cream' : 'border-cream/20 hover:border-cream/40'}`}
                                         onClick={() => setRememberMe(!rememberMe)}>
                                        {rememberMe && <ArrowRight className="w-3 h-3 text-dark -rotate-45" />}
                                    </div>
                                    <span className="text-xs text-cream/40 font-bold group-hover/check:text-cream/60">Remember Me</span>
                                </label>
                            </div>

                            <Button className="w-full h-14 bg-cream text-dark hover:bg-white font-black text-md uppercase rounded-xl transition-all shadow-xl shadow-cream/10 group/btn">
                                Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </form>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-cream/10"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="bg-dark/80 px-4 text-cream/20 backdrop-blur-sm">New to BORA?</span>
                            </div>
                        </div>

                        <Link href="/auth/signup" className="block">
                            <Button variant="secondary" className="w-full h-14 border-cream/10 text-cream/40 hover:text-cream hover:bg-cream/5 font-bold text-sm uppercase rounded-xl transition-all">
                                Create an Account
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
