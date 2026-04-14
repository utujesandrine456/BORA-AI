'use client';

import React from 'react';
import { FileText, Workflow, BarChart3, CheckCircle2, Cpu } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';

export default function ScreeningLoadingPage() {
  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TopNav />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        {/* Animated Loader Container */}
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute w-40 h-40 bg-[#38bdf8]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative w-24 h-24 rounded-full border-[6px] border-slate-100 flex items-center justify-center">
            <div className="absolute inset-[-6px] border-[6px] border-transparent border-t-[#38bdf8] rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#38bdf8] to-[#0c2d48] rounded-full shadow-lg shadow-[#38bdf8]/40 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Text Area */}
        <div className="text-center mb-12">
          <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">BORA AI Analysis</h1>
          <p className="text-slate-500 font-normal text-lg">Scanning candidate data and predicting job match...</p>
        </div>

        {/* Progress Card */}
        <Card className="w-full max-w-[580px] shadow-2xl shadow-slate-200/60 p-12 space-y-12">
          
          {/* Step 1: Completed */}
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-black text-slate-900 text-lg uppercase tracking-wider">Parsing resumes</span>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Step 2: In Progress */}
          <div className="flex items-start gap-8">
            <div className="w-14 h-14 bg-[#f0f9ff] rounded-2xl flex items-center justify-center shrink-0">
              <Workflow className="w-7 h-7 text-[#38bdf8]" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-normal text-slate-900 text-lg uppercase tracking-wider">Matching candidates</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <div className="h-full bg-[#38bdf8] rounded-full w-[65%] relative">
                  <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Pending */}
          <div className="flex items-start gap-8 opacity-30">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7 text-slate-400" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="font-normal text-slate-400 text-lg uppercase tracking-wider">Ranking results</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-200 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Status */}
        <div className="mt-12 flex items-center gap-3">
          <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-ping"></div>
          <p className="text-slate-400 font-normal text-sm uppercase tracking-[0.2em]">
            Processing neural match predictions...
          </p>
        </div>
      </div>
    </div>
  );
}
