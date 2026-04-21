import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'glass';
}

export const cardTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md', variant = 'outline' }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
  };

  const variants = {
    outline: 'bg-dark border border-cream/20',
    glass: 'bg-dark/40 backdrop-blur-md border border-cream/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]',
  };

  return (
    <div className={`${variants[variant]} rounded-md cursor-pointer hover:bg-cream/5 transition-all duration-500 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
