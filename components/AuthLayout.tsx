import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black font-sans p-4 md:p-8">
      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-5xl bg-black rounded-[3rem] overflow-hidden border border-[#E5D4B6]/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[580px] max-h-[680px] animate-in fade-in zoom-in-95 duration-1000">
        
        {/* GEOMETRIC BACKGROUND LAYER REMOVED */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-black">
        </div>

        {/* CONTENT LAYERS */}
        {/* Left Content Side */}
        <div className="relative z-40 md:w-[55%] pointer-events-none hidden md:flex flex-col justify-between p-12">
          <div className="scale-100 origin-top-left pointer-events-auto filter grayscale opacity-80">
            <Logo />
          </div>
          
          <div className="mb-6">
            <h2 className="text-6xl font-black text-[#E5D4B6] tracking-tighter leading-none mb-3 drop-shadow-2xl">
              WELCOME
            </h2>
            <p className="text-[#E5D4B6] font-bold tracking-[0.4em] uppercase opacity-90 text-sm drop-shadow-lg">
              YOUR HEADLINE NAME
            </p>
            <div className="h-1 w-16 bg-[#E5D4B6]/30 mt-6 mb-4 rounded-full" />
            <p className="text-[#E5D4B6]/70 text-sm max-w-xs leading-relaxed font-bold italic drop-shadow-md">
              "Access the core infrastructure of modern AI workflows and scale your productivity exactly as designed."
            </p>
          </div>

          <div className="flex items-center gap-4 text-[#E5D4B6]/20 text-xs font-bold uppercase tracking-widest">
            <div className="w-10 h-[1px] bg-[#E5D4B6]/10" />
            <span>AUTHENTICATION CORE v4.2</span>
          </div>
        </div>

        {/* Right Content Side (Form) */}
        <div className="relative z-40 w-full md:w-[45%] p-8 md:p-12 lg:p-14 flex flex-col items-center justify-between min-h-full">
          {/* Solid Black Background for this panel only */}
          <div className="absolute inset-0 bg-black z-[-1]" />
          
          <div className="w-full relative z-10">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-4xl font-black text-[#E5D4B6] mb-3 tracking-tighter uppercase leading-none">
                {title === 'Welcome back' ? 'Sign in' : 'Sign Up'}
              </h1>
              <p className="text-[#E5D4B6]/60 font-bold text-xs uppercase tracking-widest leading-relaxed">
                 BORA AI ENTERPRISE ACCESS PORTAL
              </p>
            </div>

            <div className="w-full">
              {children}
            </div>
          </div>

          {/* Redesigned Footer Navigation */}
          <div className="relative z-10 mt-8 text-center text-sm text-[#E5D4B6]/60 font-bold uppercase tracking-widest">
            {title === 'Welcome back' ? (
              <>Don't have an account? <Link href="/signup" className="text-[#E5D4B6] font-black hover:underline hover:text-white transition-colors ml-2">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/login" className="text-[#E5D4B6] font-black hover:underline hover:text-white transition-colors ml-2">Sign in</Link></>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
        ::selection {
          background-color: #E5D4B6;
          color: black;
        }
      `}</style>
    </div>
  );
};;
