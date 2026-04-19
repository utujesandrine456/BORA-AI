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
    <div className={`bg-dark border border-cream/20 shadow-none rounded-md cursor-pointer hover:bg-cream/5 transition-all ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
