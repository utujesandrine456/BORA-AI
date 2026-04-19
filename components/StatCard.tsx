import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext: string;
  color: 'blue' | 'green' | 'orange';
}

const colorStyles = {
  blue: {
    bg: 'bg-bora-accent/5',
    icon: 'text-bora-accent',
    border: 'border-bora-accent/10',
    accent: 'bg-bora-accent',
  },
  green: {
    bg: 'bg-bora-accent/5',
    icon: 'text-bora-accent',
    border: 'border-bora-accent/10',
    accent: 'bg-bora-accent',
  },
  orange: {
    bg: 'bg-bora-accent/5',
    icon: 'text-bora-accent',
    border: 'border-bora-accent/10',
    accent: 'bg-bora-accent',
  },
};

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, subtext, color }) => {
  const styles = colorStyles[color];
  
  return (
    <div className={`bg-black backdrop-blur-xl border border-[#E5D4B6]/10 rounded-[2rem] p-8 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_40px_100px_-20px_rgba(229,212,182,0.1)] group relative overflow-hidden ring-1 ring-[#E5D4B6]/5`}>
      <div className={`absolute -right-8 -top-8 w-24 h-24 ${styles.bg} rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-1000 group-hover:animate-pulse`} />
      
      <div className={`relative z-10 w-12 h-12 bg-black border border-[#E5D4B6]/10 rounded-2xl flex items-center justify-center ${styles.icon} mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_30px_rgba(229,212,182,0.3)]`}>
        <Icon size={22} />
      </div>
      
      <div className="relative z-10 space-y-1">
        <h3 className="text-3xl font-black text-bora-accent tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left duration-500">
          {value}
        </h3>
        <p className="text-sm font-black text-[#E5D4B6] tracking-tight">
          {label}
        </p>
        <div className="flex items-center gap-2 pt-3">
           <div className={`h-1 w-8 rounded-full ${styles.accent} opacity-30`} />
           <p className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-[0.2em]">
             {subtext}
           </p>
        </div>
      </div>
    </div>
  );
};
