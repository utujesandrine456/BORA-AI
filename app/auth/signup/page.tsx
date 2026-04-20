'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agreeToTerms: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            return toast.error('Please fill in all required fields');
        }
        if (!formData.agreeToTerms) {
            return toast.error('You must agree to the Terms of Use');
        }

        setLoading(true);
        try {
            await authApi.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            toast.success('Account created successfully!');
            router.push('/auth/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3Cpath d='M30 60L0 30' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3C/svg%3E`;

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark relative">
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.22]"
                style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '70px' }}
            />
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-linear-to-br from-cream/10 via-dark to-dark">
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-full flex items-center justify-center transition-transform hover:rotate-12 duration-500 overflow-hidden">
                            <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
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
                            <div className="w-10 h-10 border border-cream bg-dark rounded-full flex items-center justify-center overflow-hidden">
                                <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-2xl font-black uppercase text-cream">BORA</span>
                        </Link>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-cream uppercase tracking-tight">Apply for Talent Network</h2>
                        <p className="text-cream/50 mt-2 font-medium">Create your profile and let our AI find the best opportunities for you.</p>
                    </div>

                    <div className="bg-cream/5 border border-cream/10 p-10 rounded-2xl space-y-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Full Name</label>
                                <Input
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-cream/5 border-cream/20 h-14 rounded-xl text-cream focus:border-cream/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-cream/5 border-cream/20 h-14 rounded-xl text-cream focus:border-cream/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase text-cream/40 ml-1">Password</label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
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
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-cream/20 bg-dark text-cream mt-1 accent-cream" 
                                    id="agree" 
                                    checked={formData.agreeToTerms}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                />
                                <label htmlFor="agree" className="text-xs text-cream/50 leading-relaxed cursor-pointer select-none">
                                    By signing up, I agree to the <Link href="#" className="underline hover:text-cream">Terms of Use</Link> and <Link href="#" className="underline hover:text-cream">Privacy Policy</Link>.
                                </label>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 bg-cream text-dark hover:bg-white font-black text-md uppercase rounded-xl transition-all shadow-xl shadow-cream/10 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Applying...' : <>Apply Now <ArrowRight className="ml-2 w-5 h-5" /></>}
                            </Button>
                        </form>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-cream/10"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="bg-dark/80 px-4 text-cream/20 backdrop-blur-sm">Already have an account?</span>
                            </div>
                        </div>

                        <Link href="/auth/login" className="block">
                            <Button variant="secondary" className="w-full h-14 border-cream/10 text-cream/40 hover:text-cream hover:bg-cream/5 font-bold text-sm uppercase rounded-xl transition-all">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
