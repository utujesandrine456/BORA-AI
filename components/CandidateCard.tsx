import React from 'react';
import { User, ArrowUpRight, Zap } from 'lucide-react';

interface CandidateCardProps {
  name: string;
  role: string;
  skills: string[];
  experience: string;
  education: string;
  score: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ name, role, skills, experience, education, score }) => {
  return (
    <div className="bg-black backdrop-blur-xl border border-[#E5D4B6]/20 hover:border-[#E5D4B6]/50 rounded-[1.75rem] p-6 transition-all duration-700 hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[20px_40px_100px_-20px_rgba(229,212,182,0.15)] group cursor-pointer relative overflow-hidden ring-1 ring-[#E5D4B6]/5">
      {/* Abstract Background Spark */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5D4B6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="absolute top-4 right-4 text-[#E5D4B6]/30 group-hover:text-bora-accent group-hover:-rotate-12 transition-all duration-500 scale-100 group-hover:scale-110 flex items-center gap-2">
        {score >= 90 && <Zap size={14} className="text-emerald-500 fill-emerald-500" />}
        <span className="text-lg font-black text-[#E5D4B6]/60 group-hover:text-bora-accent">{score}%</span>
        <ArrowUpRight size={22} className="ml-1" />
      </div>

      <div className="flex items-start gap-5 mb-6 relative z-10">
        <div className="w-14 h-14 bg-[#111111] border border-[#E5D4B6]/10 rounded-2xl flex items-center justify-center text-[#E5D4B6]/60 group-hover:bg-bora-accent group-hover:text-black transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(229,212,182,0.5)]">
          <User size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black text-bora-accent tracking-tighter leading-tight group-hover:translate-x-1 transition-transform duration-500">{name}</h3>
          <p className="text-[11px] font-black text-[#E5D4B6]/40 uppercase tracking-[0.2em] mt-1 group-hover:translate-x-1 transition-transform duration-500 delay-75">{role}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {skills.slice(0, 3).map((skill, idx) => (
          <span 
            key={idx} 
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
              idx === 0 ? 'bg-bora-accent/10 text-bora-accent border border-bora-accent/20' : 'bg-black text-[#E5D4B6]/60 border border-[#E5D4B6]/10 group-hover:border-[#E5D4B6]/20'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#E5D4B6]/10 relative z-10">
        <div>
          <p className="text-[10px] font-black text-[#E5D4B6]/40 uppercase tracking-widest leading-none mb-1">Experience</p>
          <p className="text-xs font-black text-bora-accent tracking-tight">{experience}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-[#E5D4B6]/40 uppercase tracking-widest leading-none mb-1 text-right">Education</p>
          <p className="text-[10px] font-bold text-[#E5D4B6]/70 italic text-right truncate max-w-[120px]">
            {education}
          </p>
        </div>
      </div>
    </div>
  );
};
