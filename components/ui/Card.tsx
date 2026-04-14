import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
  };

  return (
    <div className={`bg-white rounded-[32px] border border-slate-200/60 shadow-sm ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
