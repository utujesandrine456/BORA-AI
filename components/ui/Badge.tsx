import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-cream text-dark border-cream',
    secondary: 'bg-dark text-cream border-cream/30',
    success: 'bg-dark text-cream border-cream shadow-[0_0_10px_rgba(218,197,167,0.2)]', // Highlighted
    warning: 'bg-dark text-cream border-cream/50 border-dashed',
    danger: 'bg-transparent text-red-500 border-red-500/30',
    ghost: 'bg-transparent text-cream/60 border-transparent',
  };

  return (
    <span className={`px-4 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-widest border transition-all ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
