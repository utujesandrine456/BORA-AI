'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark">
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-linear-to-br from-cream/10 via-dark to-dark">
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-md flex items-center justify-center transition-transform hover:rotate-12 duration-500">
                            <Layers className="w-6 h-6 text-cream" />
                        </div>
                        <span className="text-3xl font-black tracking-widest uppercase text-cream">
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
                            Unlock Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-cream to-cream/40 italic font-serif">True Potential</span>
                        </h1>
                        <p className="text-xl text-cream/70 max-w-xl leading-relaxed">
                            Join the elite network of talent screened by the world&apos;s most advanced AI recruitment platform.
                            Get matched with roles that truly fit your expertise.
                        </p>
                    </motion.div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-cream/80">
                            <div className="p-1 rounded-xl bg-cream ">
                                <span className="w-4 h-4 bg-cream"></span>
                            </div>
                            <span className="text-lg font-medium italic">AI-Powered Insights</span>
                        </div>
                        <div className="flex items-center gap-4 text-cream/80">
                            <div className="p-1 rounded-xl bg-cream ">
                                <span className="w-4 h-4 bg-cream"></span>
                            </div>
                            <span className="text-lg font-medium italic">Verified Talent Network</span>
                        </div>
                        <div className="flex items-center gap-4 text-cream/80">
                            <div className="p-1 rounded-xl bg-cream ">
                                <span className="w-4 h-4 bg-cream"></span>
                            </div>
                            <span className="text-lg font-medium italic">Rapid Application Process</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="flex items-center justify-center p-8 lg:p-12 bg-dark">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-lg"
                >
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-10 h-10 border border-cream bg-dark rounded-lg flex items-center justify-center">
                                <Layers className="w-5 h-5 text-cream" />
                            </div>
                            <span className="text-2xl font-black uppercase text-cream">BORA</span>
                        </Link>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-cream uppercase tracking-tight">Apply for Talent Network</h2>
                        <p className="text-cream/50 mt-2 font-medium">Create your profile and let our AI find the best opportunities for you.</p>
                    </div>

                    <div className="bg-cream/5 border border-cream/10 p-10 rounded-2xl space-y-8">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Full Name</label>
                                <Input
                                    placeholder="Enter your full name"
                                    className="bg-cream/5 border-cream/20 h-14 rounded-xl text-cream focus:border-cream/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="bg-cream/5 border-cream/20 h-14 rounded-xl text-cream focus:border-cream/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="text-md bg-cream/5 border-cream/20 h-14 rounded-xl text-cream focus:border-cream/50 transition-all font-medium pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[38px] text-cream/40 hover:text-cream transition-colors cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="flex items-start gap-3 ml-1">
                                <input type="checkbox" className="w-4 h-4 rounded border-cream/20 bg-dark text-cream mt-1 accent-cream" id="agree" />
                                <label htmlFor="agree" className="text-xs text-cream/50 leading-relaxed cursor-pointer select-none">
                                    By signing up, I agree to the <Link href="#" className="underline hover:text-cream">Terms of Use</Link> and <Link href="#" className="underline hover:text-cream">Privacy Policy</Link>.
                                </label>
                            </div>

                            <Button className="w-full h-14 bg-cream text-dark hover:bg-white font-black text-md uppercase rounded-xl transition-all shadow-xl shadow-cream/10">
                                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
