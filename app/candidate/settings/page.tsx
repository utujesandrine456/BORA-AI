'use client';

import React from 'react';
import { User, Bell, Briefcase } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function CandidateSettings() {
    return (
        <div className="flex flex-col h-full bg-dark min-h-screen font-sans">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                <motion.div variants={fadeUp} initial="initial" animate="animate" className="border-b border-cream/10 pb-12">
                    <h1 className="text-5xl font-black text-cream leading-none mb-4">Profile Control Center</h1>
                    <p className="text-md font-bold text-cream/40">Manage your talent identity and discovery preferences</p>
                </motion.div>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div variants={fadeUp}>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-cream/5 border border-cream/10 rounded-xl flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">Personal Identity</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Update your name, contact info, and professional avatar.</p>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">Career Status</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Manage your availability, salary expectations, and role types.</p>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                            <div className="w-12 h-12 bg-cream/5 border border-cream/10 rounded-xl flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                                <Bell className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-black text-cream mb-2">Notifications</h3>
                                <p className="text-sm text-cream/40 leading-relaxed">Configure job alerts and AI match insight updates.</p>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeUp} initial="initial" animate="animate" className="pt-12 text-left">
                    <Button variant="primary" className="bg-cream text-dark py-5 px-12 text-sm font-black shadow-xl">
                        Update Settings
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
