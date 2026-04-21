'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={false}
            animate={{
                backgroundColor: isScrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)",
                borderColor: isScrolled ? "rgba(218,197,167,0.1)" : "rgba(218,197,167,0.2)",
            }}
            transition={{ duration: 0.3 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-7xl h-20 backdrop-blur-xl border border-cream/10 rounded-md shadow-2xl transition-all overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 border border-cream bg-dark rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 duration-500 overflow-hidden">
                        <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-black text-cream hidden sm:block">
                        BORA
                    </span>
                </Link>

                {/* Centered Navigation */}
                <div className="hidden md:flex items-center gap-10 text-md font-medium">
                    <Link href="#features" className="text-cream/70 hover:text-cream transition-colors">Features</Link>
                    <Link href="#workflow" className="text-cream/70 hover:text-cream transition-colors">Workflow</Link>
                    <Link href="#faq" className="text-cream/70 hover:text-cream transition-colors">FAQ</Link>
                    <Link href="#contact" className="text-cream/70 hover:text-cream transition-colors">Contact</Link>
                    <Link href="/jobs" className="text-cream/70 hover:text-cream transition-colors">Jobs</Link>
                </div>

                {/* CTA - Right */}
                <div className="flex justify-end items-center gap-4">
                    <Link href="/auth/signup" className="bg-cream text-dark px-6 py-3 rounded-md hover:bg-white transition-all flex items-center gap-2 text-md font-semibold">
                        <span>Apply Now</span> <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}
