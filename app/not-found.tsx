'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const patternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3Cpath d='M30 60L0 30' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='1'/%3E%3C/svg%3E`;

    return (
        <div className="relative min-h-screen bg-dark text-cream flex flex-col items-center justify-center px-6 overflow-hidden">

            {/* Diamond-lattice pattern */}
            <div
                className="fixed inset-0 z-0 pointer-events-none opacity-[0.22]"
                style={{ backgroundImage: `url("${patternSvg}")`, backgroundSize: '70px' }}
            />

            {/* Ambient radial glow */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(218,197,167,0.08) 0%, transparent 70%)',
                }}
            />

            {/* Corner decorations */}
            <div className="fixed top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cream/30 rounded-tl-sm z-10" />
            <div className="fixed top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-cream/30 rounded-tr-sm z-10" />
            <div className="fixed bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cream/30 rounded-bl-sm z-10" />
            <div className="fixed bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cream/30 rounded-br-sm z-10" />

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
            >
                <div className="w-10 h-10 border border-cream/20 rounded-full flex items-center justify-center overflow-hidden grayscale opacity-40">
                    <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black tracking-widest uppercase text-cream/60">BORA</span>
            </motion.div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">

                {/* 404 glitch number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="relative mb-4 select-none"
                >
                    {/* Shadow layer for glitch effect */}
                    <motion.span
                        animate={{ x: [0, -3, 3, -2, 0], opacity: [1, 0.8, 0.9, 0.7, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                        className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-cream/10 blur-sm pointer-events-none"
                        aria-hidden="true"
                    >
                        404
                    </motion.span>
                    <span className="relative text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-cream">
                        404
                    </span>
                </motion.div>

                {/* Divider line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full h-px bg-cream/20 mb-10 origin-left"
                />

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="text-3xl md:text-5xl font-black uppercase tracking-tight text-cream mb-4"
                >
                    Page Not Found
                </motion.h1>

                {/* Sub text */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="text-cream/50 text-lg font-medium leading-relaxed mb-12 max-w-md"
                >
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-3 bg-cream text-dark px-8 py-4 rounded-md font-semibold hover:bg-white transition-all duration-300 shadow-xl shadow-cream/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </motion.div>

            </div>

            {/* Floating decorative orb */}
            <motion.div
                animate={{ y: [0, -18, 0], opacity: [0.06, 0.12, 0.06] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="fixed bottom-24 right-24 w-64 h-64 rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(218,197,167,0.15) 0%, transparent 70%)' }}
            />
            <motion.div
                animate={{ y: [0, 14, 0], opacity: [0.04, 0.09, 0.04] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="fixed top-32 left-16 w-48 h-48 rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(218,197,167,0.12) 0%, transparent 70%)' }}
            />
        </div>
    );
}
