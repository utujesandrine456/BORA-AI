'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Workflow,
  BarChart3,
  ShieldCheck,
  Zap,
  BrainCircuit
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';

const STEPS = [
  { id: 1, name: 'Initializing Neural Engine', icon: BrainCircuit, duration: 2000 },
  { id: 2, name: 'Parsing Candidate Resumes', icon: FileText, duration: 3000 },
  { id: 3, name: 'Cross-Referencing Skills', icon: Workflow, duration: 3500 },
  { id: 4, name: 'Predicting Job Fit Match', icon: Zap, duration: 2500 },
  { id: 5, name: 'Finalizing AI Insights', icon: BarChart3, duration: 2000 },
];

export default function ScreeningLoadingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = STEPS.reduce((acc, step) => acc + step.duration, 0);
    const interval = 50;
    const increment = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    let stepTimeout: NodeJS.Timeout;
    const runSteps = (index: number) => {
      if (index < STEPS.length) {
        setCurrentStep(index);
        stepTimeout = setTimeout(() => runSteps(index + 1), STEPS[index].duration);
      }
    };

    runSteps(0);

    return () => {
      clearInterval(timer);
      clearTimeout(stepTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-dark text-cream min-h-screen overflow-hidden">
      <TopNav />

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">

          {/* Logo Animation */}
          <div className="relative mb-16">
            {/* Circular Progress Ring & Orbit */}
            <div className="absolute inset-[-40px] flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="stroke-cream/5"
                  strokeWidth="0.5"
                  fill="none"
                />
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  className="stroke-cream/40"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="301.59"
                  animate={{ strokeDashoffset: 301.59 - (301.59 * progress) / 100 }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
                {/* Orbit Particle */}
                <motion.circle
                  cx="50"
                  cy="2"
                  r="1.5"
                  className="fill-cream shadow-[0_0_8px_rgba(218,197,167,0.8)]"
                  animate={{
                    cx: 50 + 48 * Math.sin((progress / 100) * 2 * Math.PI),
                    cy: 50 - 48 * Math.cos((progress / 100) * 2 * Math.PI),
                  }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
              </svg>
            </div>

            <motion.div
              className="absolute inset-[-20px] border border-cream/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[-10px] border border-cream/20 rounded-full border-t-cream/60"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative w-32 h-32 rounded-full p-1 bg-linear-to-b from-cream/30 to-transparent shadow-2xl overflow-hidden backdrop-blur-md">
              <div className="w-full h-full bg-dark rounded-full flex items-center justify-center overflow-hidden border border-cream/20">
                <motion.img
                  src="/logo.png"
                  alt="BORA Logo"
                  className="w-20 h-20 object-contain"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>

            <motion.div
              className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-cream flex items-center justify-center shadow-lg shadow-cream/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-dark" fill="currentColor" />
            </motion.div>
          </div>

          <div className="text-center mb-12 space-y-4">
            <motion.h1
              className="text-4xl md:text-5xl font-black text-cream tracking-tighter uppercase leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              AI <span className="text-cream/40 italic serif">Brain</span> Analysis
            </motion.h1>
          </div>

          {/* Progress Section */}
          <Card className="w-full p-8 border-cream/10 bg-dark/60 backdrop-blur-xl shadow-2xl overflow-hidden relative">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-cream/3 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

            <div className="space-y-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3"
                    >
                      {React.createElement(STEPS[currentStep].icon, { className: "w-5 h-5 text-cream" })}
                      <span className="text-lg font-semibold text-cream">{STEPS[currentStep].name}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-cream">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-cream/5 rounded-full overflow-hidden border border-cream/10 p-[2px]">
                <motion.div
                  className="h-full bg-cream rounded-full shadow-[0_0_15px_rgba(218,197,167,0.5)]"
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {STEPS.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`h-1 rounded-full transition-all duration-1000 ${idx <= currentStep ? 'bg-cream' : 'bg-cream/10'
                      }`}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Status Message */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-emerald-500 bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              Secure Data Analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
