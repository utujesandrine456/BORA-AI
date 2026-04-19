'use client';

import React from 'react';
import { FileText, Workflow, BarChart3, CheckCircle2, Cpu } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';

export default function ScreeningLoadingPage() {
  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
    
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute w-40 h-40 bg-cream/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-full border-2 border-cream/20 flex items-center justify-center">
            <div className="absolute inset-[-2px] border-2 border-transparent border-t-cream rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-black border border-cream/30 rounded-full shadow-lg shadow-cream/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-cream animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center mb-12 uppercase">
          <h1 className="text-4xl md:text-5xl font-black text-cream tracking-[0.2em] mb-4">BORA AI Analysis</h1>
          <p className="text-cream/60 font-bold text-xs tracking-widest">Scanning candidate data and predicting job match...</p>
        </div>

        {/* Progress Card */}
        <Card className="w-full max-w-[580px] p-12 space-y-12 bg-[#111111] border-cream/20 rounded-md">

          {/* Step 1: Completed */}
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 bg-cream/10 rounded-md border border-cream/30 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-cream" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-cream text-sm uppercase tracking-[0.2em]">Parsing resumes</span>
                <CheckCircle2 className="w-5 h-5 text-cream" />
              </div>
              <div className="h-2 w-full bg-cream/10 rounded-md overflow-hidden">
                <div className="h-full bg-cream rounded-md w-full"></div>
              </div>
            </div>
          </div>

          {/* Step 2: In Progress */}
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 bg-black rounded-md border border-cream flex items-center justify-center shrink-0">
              <Workflow className="w-6 h-6 text-cream" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-cream text-sm uppercase tracking-[0.2em]">Matching candidates</span>
              </div>
              <div className="h-2 w-full bg-cream/10 rounded-md overflow-hidden relative">
                <div className="h-full bg-cream rounded-md w-[65%] relative">
                  <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="flex items-start gap-8 opacity-30">
            <div className="w-14 h-14 bg-black rounded-md border border-cream/30 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6 text-cream/50" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-cream/50 text-sm uppercase tracking-[0.2em]">Ranking results</span>
              </div>
              <div className="h-2 w-full bg-cream/10 rounded-md overflow-hidden">
                <div className="h-full bg-cream/30 rounded-md w-0"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Status */}
        <div className="mt-12 flex items-center gap-4">
          <div className="w-2 h-2 bg-cream rounded-md animate-pulse"></div>
          <p className="text-cream/60 font-bold text-[10px] uppercase tracking-[0.3em]">
            Processing neural match predictions...
          </p>
        </div>
      </div>
    </div>
  );
}
