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
  LucideIcon
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
  { name: 'Screening Results', icon: ClipboardCheck, href: '/screening' },
  { name: 'Screening History', icon: History, href: '/screening-history' },
  { name: 'Candidate Insights', icon: BarChart3, href: '/insights' },
  { name: 'Profile', icon: Users, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const appRoutes = ['/dashboard', '/jobs', '/applicants', '/screening', '/insights', '/profile', '/settings'];
  const isAppRoute = appRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  if (!isAppRoute) return null;


  return (
    <div className="w-[280px] min-h-screen h-full bg-dark flex flex-col p-6 border-r border-cream/20 sticky top-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-md flex items-center justify-center transition-transform hover:rotate-12 duration-500 overflow-hidden">
          <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-cream tracking-widest uppercase leading-none">BORA</h1>
          <p className="text-[16px] text-cream/60 font-medium mt-1">Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.name === 'Jobs' && pathname === '/') ||
            (item.name === 'Screening Results' && (pathname === '/screening' || pathname.startsWith('/screening/results')));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-md transition-all duration-300 group cursor-pointer ${isActive
                ? 'bg-cream text-dark font-bold'
                : 'text-cream/60 hover:bg-cream/10 hover:text-cream'
                }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-dark' : 'text-cream/40 group-hover:text-cream'}`} />
              <span className={`text-[15px] ${isActive ? 'font-bold text-lg' : 'font-medium text-md'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-cream/20">
        <button className="flex items-center gap-3 px-5 py-3.5 rounded-md bg-cream text-dark hover:bg-cream hover:text-dark/80 transition-all w-full group cursor-pointer text-md font-semibold">
          <History className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
