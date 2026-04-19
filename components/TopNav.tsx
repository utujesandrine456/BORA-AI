'use client';

import { Search, Bell } from 'lucide-react';

export default function TopNav() {

  return (
    <>
      <header className="fixed top-5 left-[300px] right-6 h-20 bg-dark/90 backdrop-blur-xl border border-cream/10 rounded-md flex items-center justify-between px-10 z-40 shadow-2xl">
        <div className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-cream/60" />
          </div>
          <input
            type="text"
            placeholder="Search Jobs, Candidates..."
            className="w-full pl-12 pr-4 py-3 bg-dark border border-cream/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cream focus:border-cream transition-all text-cream font-medium text-sm placeholder:text-cream/40 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <button className="relative p-3 text-cream/60 hover:text-cream hover:bg-cream/10 rounded-md transition-all border border-transparent cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>

          <div className="flex items-center gap-5 pl-6 border-l border-cream/20">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-cream">Sarah Chen</span>
              <span className="text-xs text-cream/60 font-medium">HR Manager</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-cream flex items-center justify-center rounded-md overflow-hidden border border-cream">
                <div className="w-full h-full bg-cream flex items-center justify-center text-dark font-bold text-sm uppercase">
                  SC
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-26" />
    </>
  );
}
