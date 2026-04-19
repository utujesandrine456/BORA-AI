import React from 'react';

interface LogoProps {
  className?: string;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", textColor = "text-white" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative w-11 h-11 pointer-events-auto">
      {/* Multi-layered Squares (Signature BORA Logo) */}
      <div className="absolute inset-0 bg-bora-accent rounded-xl shadow-lg ring-1 ring-white/20 transform rotate-6 transition-transform hover:rotate-0 duration-500" />
      <div className="absolute inset-0 bg-bora-accent/80 rounded-xl shadow-md backdrop-blur-sm -translate-x-1 -translate-y-1 transform -rotate-3 transition-transform hover:rotate-0 duration-500" />
      <div className="absolute inset-0 bg-white rounded-xl shadow-inner flex items-center justify-center p-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-bora-accent w-full h-full"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    </div>
    <span className={`text-2xl font-black tracking-tighter ${textColor} uppercase`}>BORA</span>
  </div>
);
