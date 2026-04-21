'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  History,
  Settings,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';


interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Jobs', icon: Briefcase, href: '/jobs' },
  { name: 'Applicants', icon: Users, href: '/applicants' },
  { name: 'Screening Results', icon: ClipboardCheck, href: '/screening' },
  { name: 'Screening History', icon: History, href: '/screening-history' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

const candidateMenuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/candidate/dashboard' },
  { name: 'Jobs', icon: Briefcase, href: '/candidate/jobs' },
  { name: 'Screening Results', icon: ClipboardCheck, href: '/candidate/results' },
  { name: 'Settings', icon: Settings, href: '/candidate/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role] = React.useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          return parsed.role?.toLowerCase() || 'admin';
        } catch (_e) {
          // ignore
        }
      }
    }
    return 'admin';
  });

  const handleLogout = () => {
    authApi.logout();
    toast.success('Signed out successfully');
    router.push('/auth/login');
  };

  const appRoutes = [
    '/dashboard', '/jobs', '/applicants', '/screening', '/insights', '/settings', '/screening-history', '/notifications',
    '/candidate/dashboard', '/candidate/jobs', '/candidate/results', '/candidate/settings'
  ];
  const isAppRoute = appRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const isAuthPage = pathname.startsWith('/auth/');

      if (!token && isAppRoute) {
        router.push('/auth/login');
      } else if (token && isAuthPage) {
        router.push(role === 'candidate' ? '/candidate/dashboard' : '/dashboard');
      }
    }
  }, [isAppRoute, pathname, router, role]);

  if (!isAppRoute) return null;

  // Determine menu items based on current portal path for immediate UI update
  const isCandidatePortal = pathname.startsWith('/candidate');
  const menuItems = isCandidatePortal ? candidateMenuItems : adminMenuItems;

  return (
    <div className="w-[280px] min-h-screen h-full bg-dark flex flex-col p-6 border-r border-cream/20 sticky top-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 border-2 border-cream bg-dark rounded-full flex items-center justify-center transition-transform hover:rotate-12 duration-500 overflow-hidden">
          <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-cream leading-none">BORA</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.name === 'Jobs' && (pathname === '/' || pathname === '/candidate/jobs')) ||
            (item.name === 'Screening Results' && (pathname === '/screening' || pathname.startsWith('/screening/results') || pathname === '/candidate/results'));
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-3.5 rounded-md bg-cream text-dark hover:bg-cream hover:text-dark/80 transition-all w-full group cursor-pointer text-md font-semibold"
        >
          <History className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
