'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { 
  ClipboardCheck, 
  Users, 
  Award, 
  Calendar, 
  Eye, 
  MoreVertical 
} from 'lucide-react';

const sessions = [
  {
    title: 'Senior Frontend Developer',
    date: '2026-04-08',
    candidates: 45,
    shortlisted: 12,
    status: 'Completed'
  },
  {
    title: 'Product Designer',
    date: '2026-04-05',
    candidates: 32,
    shortlisted: 8,
    status: 'Completed'
  },
  {
    title: 'Machine Learning Engineer',
    date: '2026-04-02',
    candidates: 18,
    shortlisted: 4,
    status: 'Completed'
  }
];

export default function ScreeningHistoryPage() {
  const stats = [
    { icon: ClipboardCheck, label: 'Screening Sessions', value: '12', subtext: 'Successfully Completed', color: 'blue' as const },
    { icon: Users, label: 'CVs Analyzed', value: '482', subtext: 'Deep Analysis Done', color: 'green' as const },
    { icon: Award, label: 'Shortlisted', value: '84', subtext: 'Qualified Candidates', color: 'orange' as const },
  ];

  const historySessions = [
    { id: 'BOR-NEX-001', title: 'Senior Software Engineer', date: 'APR 12, 2026', candidates: 45, score: 9.2, status: 'Synced' },
    { id: 'BOR-NEX-002', title: 'Product Designer', date: 'APR 10, 2026', candidates: 32, score: 8.7, status: 'Synced' },
    { id: 'BOR-NEX-003', title: 'Data Scientist', date: 'APR 08, 2026', candidates: 18, score: 7.9, status: 'Synced' },
    { id: 'BOR-NEX-004', title: 'QA Specialist', date: 'APR 05, 2026', candidates: 64, score: 8.1, status: 'Synced' },
  ];

  return (
    <DashboardLayout 
      title="Screening History" 
      subtitle="View all your past CV screening sessions and see how candidates performed."
    >
      <div className="space-y-14">
        {/* Atmospheric Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          {stats.map((stat, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-top-12 duration-1000" style={{ transitionDelay: `${index * 150}ms` }}>
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Recent Reviews - Table Evolution */}
        <div className="bg-black backdrop-blur-2xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 animate-in fade-in zoom-in duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-bora-accent tracking-tighter">Recent Reviews</h2>
              <p className="text-[9px] font-black text-[#E5D4B6]/40 uppercase tracking-[0.3em] opacity-60">Records of previous CV reviews</p>
            </div>
            <button className="px-6 py-2.5 bg-black border border-[#E5D4B6]/20 rounded-xl text-[9px] font-black text-[#E5D4B6]/60 hover:text-bora-accent hover:border-bora-accent/40 transition-all uppercase tracking-widest shadow-sm">
              Export Results
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-left text-[10px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em]">
                  <th className="px-8 pb-4 whitespace-nowrap">Job Title</th>
                  <th className="px-8 pb-4">Date</th>
                  <th className="px-8 pb-4">Applicants</th>
                  <th className="px-8 pb-4">Match Score</th>
                  <th className="px-8 pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {historySessions.map((session, index) => (
                  <tr 
                    key={index} 
                    className="group bg-black hover:bg-[#111111]/50 transition-all duration-500 rounded-[1.5rem] cursor-pointer ring-1 ring-[#E5D4B6]/5 hover:ring-bora-accent/30"
                  >
                    <td className="px-8 py-6 rounded-l-[1.25rem]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#111111] border border-[#E5D4B6]/10 rounded-xl flex items-center justify-center text-bora-accent group-hover:bg-bora-accent group-hover:text-black transition-all duration-500 shadow-inner group-hover:shadow-bora-accent/20">
                           <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-bora-accent tracking-tight">{session.title}</p>
                          <p className="text-[8px] font-bold text-[#E5D4B6]/30 uppercase tracking-widest">{session.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-[#E5D4B6]/40 italic opacity-80">{session.date}</td>
                    <td className="px-8 py-6 text-[10px] font-black text-[#E5D4B6]/60 uppercase tracking-widest">{session.candidates} Applicants</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden shadow-inner border border-[#E5D4B6]/5">
                          <div 
                            className="h-full bg-bora-accent shadow-[0_0_15px_rgba(229,212,182,0.4)] transition-all duration-[2s] ease-out" 
                            style={{ width: `${session.score * 10}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-black text-bora-accent tracking-tighter">{session.score}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right rounded-r-[1.25rem]">
                      <span className="px-4 py-1.5 bg-bora-accent/10 text-bora-accent text-[8px] font-black uppercase tracking-[0.2em] rounded-full border border-bora-accent/20 transition-all group-hover:bg-bora-accent group-hover:text-black">
                        {session.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
