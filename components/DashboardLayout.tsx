import React from 'react';
import { Sidebar } from './Sidebar';
import { Search, Bell, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="h-screen bg-black font-sans selection:bg-bora-accent/30 selection:text-black overflow-hidden">
      
      <div className="flex flex-col relative z-10 w-full h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 bg-black border-b border-[#E5D4B6]/10 px-10 flex items-center justify-between z-30 w-full relative">
          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-bora-accent transition-colors duration-300">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search jobs, candidates..."
              className="w-full bg-[#111111] border border-[#E5D4B6]/10 rounded-[1.25rem] py-2.5 pl-12 pr-4 text-sm font-semibold text-bora-accent focus:bg-[#050505] focus:border-bora-accent/30 focus:ring-1 focus:ring-bora-accent/30 focus:outline-none transition-all duration-300 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-6 ml-10">
            <button className="relative w-11 h-11 bg-[#111111] rounded-2xl flex items-center justify-center text-[#E5D4B6]/60 hover:text-bora-accent hover:shadow-xl hover:shadow-bora-accent/10 transition-all border border-[#E5D4B6]/10 translate-y-0 hover:-translate-y-1 active:scale-95 duration-300">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-bora-accent rounded-full border-2 border-black animate-pulse" />
            </button>
            
          <div className="flex items-center gap-3 pl-6 border-l border-[#E5D4B6]/10 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-bora-accent leading-none tracking-tight">Sarah Chen</p>
              <p className="text-[11px] font-black text-bora-accent tracking-widest uppercase mt-1 opacity-70">HR Manager</p>
            </div>
              <div className="w-12 h-12 bg-bora-accent rounded-[1.25rem] flex items-center justify-center text-black shadow-lg shadow-bora-accent/20 group-hover:rotate-6 transition-all duration-500 ring-4 ring-bora-accent/5">
                <User size={22} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar bg-black">
          <main className="p-6 md:p-8 lg:p-10 max-w-[1600px] w-full mx-auto relative">
            <div className="mb-10 relative">
              <h1 className="text-3xl font-black text-bora-accent tracking-tighter leading-none mb-3 animate-in fade-in slide-in-from-left-4 duration-1000">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#E5D4B6]/60 font-bold text-sm max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-6 duration-1000 delay-150">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="relative z-10 pb-20">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
