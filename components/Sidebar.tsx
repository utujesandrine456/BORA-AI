'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardCheck, 
  History, 
  BarChart3, 
  Settings,
  LucideIcon,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Jobs', icon: Briefcase, href: '/jobs' },
  { name: 'Applicants', icon: Users, href: '/applicants' },
  { name: 'Screening Results', icon: ClipboardCheck, href: '/screening-results' },
  { name: 'Screening History', icon: History, href: '/screening-history' },
  { name: 'Candidate Insights', icon: BarChart3, href: '/insights' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[280px] min-h-screen h-full bg-[#071e2d] flex flex-col p-6 border-r border-white/5 sticky top-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-[#38bdf8] rounded-xl flex items-center justify-center shadow-lg shadow-[#38bdf8]/20">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight leading-none">BORA</h1>
          <p className="text-[10px] text-[#38bdf8] font-black uppercase tracking-[0.2em] mt-1">Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Jobs' && pathname === '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group cursor-pointer ${
                isActive 
                  ? 'bg-[#38bdf8] text-white shadow-lg shadow-[#38bdf8]/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#38bdf8]'}`} />
              <span className="font-normal text-[15px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group cursor-pointer">
          <History className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="font-normal text-[15px]">Logout</span>
        </button>
      </div>
    </div>
  );
}
