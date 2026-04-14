import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#f0f9ff] text-[#38bdf8] border-transparent',
    secondary: 'bg-slate-100 text-slate-600 border-transparent',
    success: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
    ghost: 'bg-slate-50/50 text-slate-500 border-slate-100',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
