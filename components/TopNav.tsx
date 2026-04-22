'use client';

import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';

export default function TopNav() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_e) { }
    }

    const fetchUser = async () => {
      try {
        const res = await authApi.getMe();
        const freshUser = res.user || res;
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        }
      } catch (error) {
        console.warn('TopNav: Failed to fetch fresh user data from /auth/me:', error);
      }
    };

    fetchUser();
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <>
      <header className="fixed top-6 left-[300px] right-8 h-20 bg-dark/40 backdrop-blur-3xl border border-cream/10 rounded-md flex items-center justify-between px-10 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-4 gap-4 flex items-center pointer-events-none">
            <Search className="h-3 w-3 text-cream/30" />
          </div>
          <input
            type="text"
            placeholder="Search jobs, candidates, or insights..."
            className="w-full pl-8 pr-4 py-3 bg-white/5 border border-cream/10 rounded-md focus:outline-none focus:ring-1 focus:ring-cream/40 focus:border-cream/40 transition-all text-cream font-medium text-sm placeholder:text-cream/20 cursor-pointer backdrop-blur-md"
          />
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <Link href="/notifications" className="relative p-3 text-cream/40 hover:text-cream hover:bg-cream/5 rounded-md transition-all border cursor-pointer block border-cream/5">
            <Bell className="h-5 w-5" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full border-2 border-dark shadow-lg"></span>
          </Link>

          <div className="flex items-center gap-6 pl-8 border-l border-cream/10">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-cream ">{user?.name || (user ? 'Authenticating...' : 'Loading...')}</span>
              <span className="text-[12px] text-cream/40 font-medium">{user?.role || 'User'}</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-12 h-12 bg-cream flex items-center justify-center rounded-md overflow-hidden border border-cream/20 shadow-2xl group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-cream flex items-center justify-center text-dark font-black text-sm">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-28" />
    </>
  );
}
