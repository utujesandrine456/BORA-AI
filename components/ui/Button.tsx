import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'sky' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer';
    
    const variants = {
      primary: 'bg-[#0c2d48] hover:bg-[#071e2d] text-white shadow-lg shadow-[#0c2d48]/20',
      sky: 'bg-[#38bdf8] hover:bg-[#0ea5e9] text-white shadow-lg shadow-[#38bdf8]/20',
      secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm',
      ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
      success: 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0] border border-[#bbf7d0]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3',
      lg: 'px-10 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
