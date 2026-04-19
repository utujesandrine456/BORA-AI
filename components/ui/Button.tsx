import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer font-semibold';

    const variants = {
      primary: 'bg-cream hover:bg-white text-dark',
      secondary: 'bg-dark border border-cream/30 text-cream hover:bg-cream/10',
      ghost: 'bg-transparent text-cream/60 hover:text-cream hover:bg-cream/10',
      danger: 'bg-transparent text-red-500 hover:bg-red-500/10 border border-red-500/30',
      success: 'bg-transparent text-[#bbf7d0] hover:bg-[#bbf7d0]/10 border border-[#bbf7d0]/30',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-6 py-3 text-sm',
      lg: 'px-6 py-4 text-md',
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
