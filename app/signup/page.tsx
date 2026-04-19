'use client';

import React from 'react';
import { User, Building2, Mail, Lock, LogIn } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Join BORA AI" 
      subtitle="Find the best candidates for your team today."
    >
      <div className="space-y-4">
        <form className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-[#E5D4B6]/70 uppercase tracking-widest mb-1 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-base"
                  placeholder="Your Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#E5D4B6]/70 uppercase tracking-widest mb-1 ml-1">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                  <Building2 size={16} />
                </div>
                <input
                  type="text"
                  className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-base"
                  placeholder="TechCorp Inc."
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#E5D4B6]/70 uppercase tracking-widest mb-1 ml-1">Work Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                <Mail size={16} />
              </div>
              <input
                type="email"
                className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-base"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#E5D4B6]/70 uppercase tracking-widest mb-1 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#E5D4B6]/40">
                <Lock size={16} />
              </div>
              <input
                type="password"
                className="w-full bg-black border border-[#E5D4B6]/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder-[#E5D4B6]/40 focus:ring-1 focus:ring-[#E5D4B6]/30 outline-none transition-all font-medium text-base"
                placeholder="At least 8 characters"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#E5D4B6] hover:bg-[#d6c3a2] text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] mt-3 uppercase tracking-widest text-base"
          >
            Create Account
          </button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5D4B6]/10"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold text-[#E5D4B6]/40 uppercase tracking-widest bg-black px-4">
            Or
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-black border-2 border-[#E5D4B6]/20 hover:border-[#E5D4B6]/40 text-[#E5D4B6] font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
        >
          <LogIn size={16} />
          Sign up with external identity
        </button>
      </div>
    </AuthLayout>
  );
}
