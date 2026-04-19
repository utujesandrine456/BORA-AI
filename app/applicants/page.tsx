'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CandidateCard } from '@/components/CandidateCard';
import { Search, Filter, Users, Bookmark, Zap, MapPin, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

const INITIAL_APPLICANTS = [
  { id: 1, name: 'Alexander Chen', role: 'Senior Backend Engineer', location: 'Toronto, CAN', score: 98, status: 'Shortlisted', date: '2h ago', avatar: 'AC', skills: ['Node.js', 'PostgreSQL', 'Redis'], experience: '8 years', education: 'MS Computer Science' },
  { id: 2, name: 'Sarah Thompson', role: 'Fullstack Developer', location: 'London, UK', score: 94, status: 'In review', date: '5h ago', avatar: 'ST', skills: ['React', 'Next.js', 'Node.js'], experience: '5 years', education: 'BS Software Engineering' },
  { id: 3, name: 'Michael Laurent', role: 'Node.js Developer', location: 'Paris, FRA', score: 87, status: 'New', date: '1d ago', avatar: 'ML', skills: ['Express', 'MongoDB', 'TypeScript'], experience: '4 years', education: 'BS CS' },
  { id: 4, name: 'Emily Rodriguez', role: 'Product Designer', location: 'Madrid, ESP', score: 92, status: 'Interviewing', date: '1d ago', avatar: 'ER', skills: ['Figma', 'UI/UX', 'React'], experience: '6 years', education: 'BFA Design' },
  { id: 5, name: 'David Kim', role: 'DevOps Lead', location: 'Seoul, KOR', score: 85, status: 'New', date: '2d ago', avatar: 'DK', skills: ['AWS', 'Kubernetes', 'Docker'], experience: '10 years', education: 'MS Engineering' },
  { id: 6, name: 'Jessica Wu', role: 'Frontend Engineer', location: 'New York, US', score: 91, status: 'Shortlisted', date: '2d ago', avatar: 'JW', skills: ['React', 'Tailwind', 'Framer Motion'], experience: '3 years', education: 'BS CS' },
  { id: 7, name: 'Marcus Berg', role: 'Systems Architect', location: 'Stockholm, SWE', score: 89, status: 'Technical test', date: '3d ago', avatar: 'MB', skills: ['Rust', 'C++', 'Architecture'], experience: '12 years', education: 'PhD CS' },
];

export default function ApplicantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredApplicants = useMemo(() => {
    return INITIAL_APPLICANTS.filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           applicant.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           applicant.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <DashboardLayout 
      title="Applicants List" 
      subtitle="Review and manage candidates across all active job openings using intelligent screening."
    >
      <div className="space-y-8 animate-in fade-in zoom-in duration-1000">
        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-6 items-center bg-black/40 backdrop-blur-2xl p-6 rounded-[2rem] border border-[#E5D4B6]/10">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-bora-accent/30 group-focus-within:text-bora-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by name, role or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-black/60 border border-[#E5D4B6]/10 rounded-2xl focus:outline-none focus:border-bora-accent/40 focus:ring-1 focus:ring-bora-accent/20 transition-all text-[#E5D4B6] font-bold text-sm placeholder:text-[#E5D4B6]/20"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-3 px-8 py-4 bg-black border border-[#E5D4B6]/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    showFilters || statusFilter !== 'All' ? 'text-bora-accent border-bora-accent/30' : 'text-[#E5D4B6]/40 hover:text-bora-accent hover:border-bora-accent/20'
                  }`}
                >
                  <Filter size={16} />
                  Filters
                  {statusFilter !== 'All' && <div className="w-1.5 h-1.5 bg-bora-accent rounded-full animate-pulse" />}
                </button>

                {showFilters && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />
                    <div className="absolute right-0 mt-4 w-64 bg-black/95 backdrop-blur-3xl border border-[#E5D4B6]/20 rounded-2xl p-6 z-40 shadow-2xl animate-in fade-in zoom-in duration-200">
                      <div className="space-y-4">
                        <div className="text-[10px] font-black text-bora-accent/40 uppercase tracking-[0.2em] mb-4">Status</div>
                        <div className="space-y-2">
                          {['All', 'Shortlisted', 'In review', 'Interviewing', 'New'].map(s => (
                            <button
                              key={s}
                              onClick={() => { setStatusFilter(s); setShowFilters(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                statusFilter === s ? 'bg-bora-accent/10 text-bora-accent' : 'text-[#E5D4B6]/40 hover:bg-[#E5D4B6]/5'
                              }`}
                            >
                              {s}
                              {statusFilter === s && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
             </div>
             
             <div className="relative">
               <select 
                className="bg-black border border-[#E5D4B6]/10 text-bora-accent text-[11px] font-black uppercase tracking-widest rounded-2xl pl-6 pr-12 py-4 focus:outline-none focus:border-bora-accent/30 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 20px center' }}
               >
                  <option>Sort by Match</option>
                  <option>Sort by Date</option>
                  <option>Sort by Name</option>
               </select>
             </div>
          </div>
        </div>

        {/* Applicants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {filteredApplicants.length > 0 ? filteredApplicants.map((applicant, index) => (
            <div 
              key={applicant.id} 
              className="animate-in fade-in slide-in-from-bottom-6 duration-1000" 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CandidateCard 
                name={applicant.name}
                role={applicant.role}
                skills={applicant.skills}
                experience={applicant.experience}
                education={applicant.education}
                score={applicant.score}
              />
            </div>
          )) : (
            <div className="col-span-full py-32 text-center space-y-6 bg-black/20 border border-dashed border-[#E5D4B6]/10 rounded-[3rem]">
              <Users className="w-16 h-16 text-[#E5D4B6]/10 mx-auto" />
              <div>
                <p className="text-bora-accent font-black uppercase tracking-[0.3em] text-xs">No Results Found</p>
                <p className="text-[#E5D4B6]/40 text-sm mt-2">Try adjusting your filters or search terms</p>
              </div>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="px-8 py-3 bg-bora-accent text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
