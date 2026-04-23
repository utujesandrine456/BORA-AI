'use client';

import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useSidebar } from '@/context/SidebarContext';
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



export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar, isMobileMenuOpen, toggleMobileMenu } = useSidebar();

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
    '/dashboard', '/jobs', '/applicants', '/screening', '/insights', '/settings', '/screening-history', '/notifications'
  ];
  const isAppRoute = appRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const isAuthPage = pathname.startsWith('/auth/');

      if (!token && isAppRoute) {
        router.push('/auth/login');
      } else if (token && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [isAppRoute, pathname, router, role]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [pathname]);

  if (!isAppRoute) return null;

  const menuItems = adminMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div className={`
        transition-all duration-500 ease-in-out 
        fixed lg:sticky top-0 h-full min-h-screen flex flex-col border-r border-cream/20 bg-dark z-100
        ${isMobileMenuOpen ? 'left-0' : '-left-[280px] lg:left-0'}
        ${isCollapsed ? 'lg:w-[100px] p-4' : 'lg:w-[280px] p-6'}
        ${!isCollapsed && 'w-[280px] p-6'}
        group/sidebar
      `}>
        {/* Floating Toggle Button (Desktop Only) */}
        <button
          onClick={toggleSidebar}
          className={`
            absolute -right-3 top-10 w-6 h-6 rounded-full bg-cream border border-dark 
            hidden lg:flex items-center justify-center text-dark shadow-2xl transition-all duration-300 
            hover:scale-110 active:scale-95 z-110 cursor-pointer
          `}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`mb-10 flex items-center px-2 ${isCollapsed ? 'lg:flex-col lg:gap-4' : 'gap-3'}`}>
          <div className="w-10 h-10 border-2 border-cream bg-dark rounded-full flex items-center justify-center transition-transform hover:rotate-12 duration-500 overflow-hidden shrink-0 shadow-[0_0_15px_rgba(218,197,167,0.1)]">
            <img src="/logo.png" alt="BORA Logo" className="w-full h-full object-cover" />
          </div>
          {(!isCollapsed || isMobileMenuOpen) && (
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-br from-cream via-cream to-cream/50 leading-none tracking-tighter">BORA</h1>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.name === 'Jobs' && (pathname === '/' || pathname === '/jobs')) ||
              (item.name === 'Screening Results' && (pathname === '/screening' || pathname.startsWith('/screening/results')));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-300 group cursor-pointer ${isActive
                  ? 'bg-cream text-dark font-bold'
                  : 'text-cream/60 hover:bg-cream/10 hover:text-cream'
                  } ${isCollapsed && !isMobileMenuOpen ? 'lg:justify-center' : ''}`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-dark' : 'text-cream/40 group-hover:text-cream'}`} />
                {(!isCollapsed || isMobileMenuOpen) && (
                  <span className={`text-[15px] whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-cream/20">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-md bg-cream text-dark hover:bg-cream/90 transition-all w-full group cursor-pointer text-md font-semibold ${isCollapsed && !isMobileMenuOpen ? 'lg:justify-center' : ''}`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <History className="w-5 h-5 group-hover:rotate-12 transition-transform opacity-70 shrink-0" />
            {(!isCollapsed || isMobileMenuOpen) && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
