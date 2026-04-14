import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-[15px] font-medium text-slate-800 mb-3">{label}</label>}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-slate-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all placeholder:text-slate-400 font-normal bg-white shadow-sm ${Icon ? 'pl-12' : ''} ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-[15px] font-medium text-slate-800 mb-3">{label}</label>}
        <textarea
          ref={ref}
          className={`w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all placeholder:text-slate-400 font-normal bg-white shadow-sm resize-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
}

import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-[15px] font-medium text-slate-800 mb-3">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all font-normal bg-white shadow-sm cursor-pointer text-slate-700 focus:bg-white ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Input;
