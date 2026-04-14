'use client';

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="h-20 bg-white border-b border-[#f1f5f9] flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shadow-slate-200/20">
      <div className="flex-1 max-w-2xl relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search jobs, candidates..."
          className="w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all text-slate-600 font-normal placeholder:text-slate-400 cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="flex flex-col items-end">
            <span className="text-sm font-normal text-slate-900">Sarah Chen</span>
            <span className="text-xs text-slate-500 font-normal">HR Manager</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] flex items-center justify-center overflow-hidden border border-[#38bdf8]/10">
              <div className="w-full h-full bg-[#38bdf8] flex items-center justify-center text-white font-normal text-sm">
                SC
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
