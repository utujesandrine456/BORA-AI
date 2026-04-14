'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, Briefcase, MapPin, Clock, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';
import Button from './ui/Button';
import Badge from './ui/Badge';

const INITIAL_JOBS = [
  { id: 1, title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', posted: '2 days ago', applicants: 45, status: 'Open', color: 'bg-[#38bdf8]' },
  { id: 2, title: 'Product Designer', type: 'Contract', location: 'San Francisco', posted: '4 days ago', applicants: 32, status: 'Open', color: 'bg-[#38bdf8]' },
  { id: 3, title: 'Data Scientist', type: 'Full-time', location: 'New York', posted: '1 week ago', applicants: 28, status: 'Closed', color: 'bg-[#38bdf8]' },
  { id: 4, title: 'DevOps Engineer', type: 'Full-time', location: 'Remote', posted: '1 week ago', applicants: 19, status: 'Open', color: 'bg-[#38bdf8]' },
  { id: 5, title: 'Backend Engineer', type: 'Full-time', location: 'Austin', posted: '2 weeks ago', applicants: 38, status: 'Open', color: 'bg-[#38bdf8]' },
];

export default function JobTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredJobs = useMemo(() => {
    let result = [...INITIAL_JOBS];

    // Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(lowerSearch) || 
        job.location.toLowerCase().includes(lowerSearch)
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(job => job.status === statusFilter);
    }

    // Type Filter
    if (typeFilter !== 'All') {
      result = result.filter(job => job.type === typeFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'applicants') {
        return b.applicants - a.applicants;
      }
      // Default to "latest" (by ID for this mock)
      return b.id - a.id;
    });

    return result;
  }, [searchTerm, statusFilter, typeFilter, sortBy]);

  return (
    <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all font-normal"
          />
        </div>
        
        <div className="flex items-center gap-3 relative">
          {/* Filters Toggle Button */}
          <div className="relative">
            <Button 
              variant="secondary" 
              className={`gap-2 font-normal ${showFilters ? 'bg-slate-100' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(statusFilter !== 'All' || typeFilter !== 'All') && (
                <span className="w-2 h-2 bg-[#38bdf8] rounded-full"></span>
              )}
            </Button>

            {/* Simple Dropdown Menu */}
            {showFilters && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 z-40 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Job Status</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Open', 'Closed'].map(s => (
                          <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === s ? 'bg-[#f0f9ff] text-[#38bdf8] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {s}
                            {statusFilter === s && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Job Type</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Full-time', 'Contract'].map(t => (
                          <button 
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${typeFilter === t ? 'bg-[#f0f9ff] text-[#38bdf8] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {t}
                            {typeFilter === t && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => { setStatusFilter('All'); setTypeFilter('All'); }}
                      className="text-xs text-slate-400 hover:text-[#38bdf8] font-bold underline decoration-dotted underline-offset-4"
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#38bdf8]/20 focus:border-[#38bdf8] transition-all font-normal text-slate-600 cursor-pointer appearance-none pr-10 relative inline-block"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
          >
            <option value="latest">Latest first</option>
            <option value="applicants">Most applicants</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="text-left px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Job Role</th>
              <th className="text-left px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Location & Type</th>
              <th className="text-left px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Applicants</th>
              <th className="text-left px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date Posted</th>
              <th className="text-left px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
              <th className="text-right px-8 py-5 border-b border-slate-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <Link href={`/jobs/${job.id}`} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${job.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-[17px] mb-0.5 group-hover:text-[#38bdf8] transition-colors">{job.title}</div>
                      <div className="text-sm font-normal text-slate-400">ID: JOB-00{job.id}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-slate-600 font-normal">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="text-xs font-black text-[#38bdf8] flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#38bdf8]"></div>
                      {job.type}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-9 h-9 rounded-xl border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-slate-200"></div>
                        </div>
                      ))}
                      <div className="w-9 h-9 rounded-xl border-2 border-white bg-[#0c2d48] flex items-center justify-center text-[11px] font-black text-white">
                        +{job.applicants - 3}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-slate-500 font-normal">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{job.posted}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge variant={job.status === 'Open' ? 'success' : 'secondary'} className="px-4 py-1.5 text-[11px] uppercase tracking-wider font-normal">
                    {job.status}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold">No jobs found matching your criteria</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setStatusFilter('All'); setTypeFilter('All'); }}
                      className="text-[#38bdf8] font-black text-sm uppercase tracking-widest hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
