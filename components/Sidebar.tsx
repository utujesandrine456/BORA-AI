'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardCheck, 
  History, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { Logo } from './Logo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Briefcase, label: 'Job Clips', href: '/jobs' },
  { icon: Users, label: 'Applicants', href: '/applicants' },
  { icon: ClipboardCheck, label: 'Match Results', href: '/screening/results' },
  { icon: History, label: 'Screening History', href: '/screening-history' },
  { icon: BarChart3, label: 'Analytics', href: '/insights' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  // Hide sidebar on landing page and auth pages
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/register')) {
    return null;
  }

  return (
    <div className="relative w-80 flex-shrink-0 bg-black border-r border-[#E5D4B6]/10 flex flex-col h-screen font-sans overflow-hidden group/sidebar transition-all duration-700 z-20">
      
      <div className="relative z-10 p-10 pt-12">
        <Logo />
        <div className="h-1 w-10 bg-bora-accent mt-6 rounded-full opacity-30" />
      </div>

      <nav className="relative z-10 flex-1 px-6 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                isActive 
                  ? 'bg-bora-accent text-black shadow-lg translate-x-1 ring-1 ring-bora-accent/20' 
                  : 'text-[#E5D4B6]/50 hover:bg-bora-accent/5 hover:text-bora-accent hover:ring-1 hover:ring-[#E5D4B6]/10'
              }`}
            >
              <item.icon className={`transition-all duration-500 relative z-10 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 group-hover:rotate-6'}`} size={22} />
              <span className={`text-[15px] tracking-tight uppercase font-black transition-all duration-500 relative z-10 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative z-10 p-8 border-t border-[#E5D4B6]/10">
        <div className="bg-black/50 rounded-[2.5rem] p-8 border border-[#E5D4B6]/10 shadow-2xl relative overflow-hidden group/quota transition-all duration-500 hover:shadow-lg hover:-translate-y-1 mb-6">
          <p className="text-[11px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] mb-4">CV Analysis Used</p>
          <div className="flex items-end justify-between mb-3">
            <span className="text-3xl font-black text-bora-accent tracking-tighter">65%</span>
            <span className="text-[12px] font-bold text-[#E5D4B6]/40">650 / 1000</span>
          </div>
          <div className="h-2 w-full bg-[#E5D4B6]/10 rounded-full overflow-hidden">
            <div className="h-full bg-bora-accent w-[65%] rounded-full shadow-sm" />
          </div>
        </div>

        <button className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-bora-accent/5 text-[#E5D4B6]/60 hover:bg-bora-accent hover:text-black transition-all w-full group cursor-pointer text-[13px] font-black uppercase tracking-widest border border-[#E5D4B6]/10">
          <LogOut size={18} className="group-hover:rotate-12 transition-transform opacity-70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
