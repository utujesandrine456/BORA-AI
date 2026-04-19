'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Sign in to BORA AI" 
      subtitle="Find your best candidates easily."
    >
      <div className="space-y-4">
        <form className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[#E5D4B6]/70 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                <Mail size={16} />
              </div>
              <input
                type="email"
                className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-sm"
                placeholder="you@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5 ml-1">
              <label className="block text-[10px] font-black text-[#E5D4B6]/70 uppercase tracking-widest">Password</label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                <Lock size={16} />
              </div>
              <input
                type="password"
                className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-12 py-3.5 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-sm"
                placeholder="Password"
                required
              />
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button type="button" className="text-[#E5D4B6] hover:text-white transition-colors">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest">Show</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded border-[#E5D4B6]/30 bg-black text-[#E5D4B6] focus:ring-[#E5D4B6] transition-all" />
              <span className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest">Remember me</span>
            </label>
            <Link href="#" className="text-[9px] font-black text-[#E5D4B6] hover:underline uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#E5D4B6] hover:bg-[#d6c3a2] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] mt-2 uppercase tracking-widest text-sm"
          >
            Sign in
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5D4B6]/10"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-widest bg-black px-4">
            Or
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-black border-2 border-[#E5D4B6]/20 hover:border-[#E5D4B6]/40 text-[#E5D4B6] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          <LogIn size={16} />
          Sign in with other
        </button>
      </div>
    </AuthLayout>
  );
}
