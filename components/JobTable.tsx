'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, MapPin, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import Button from './ui/Button';
import Badge from './ui/Badge';

const INITIAL_JOBS = [
  { id: 1, title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', posted: '2 days ago', applicants: 45, status: 'Open', color: 'bg-cream' },
  { id: 2, title: 'Product Designer', type: 'Contract', location: 'San Francisco', posted: '4 days ago', applicants: 32, status: 'Open', color: 'bg-cream' },
  { id: 3, title: 'Data Scientist', type: 'Full-time', location: 'New York', posted: '1 week ago', applicants: 28, status: 'Closed', color: 'bg-cream' },
  { id: 4, title: 'DevOps Engineer', type: 'Full-time', location: 'Remote', posted: '1 week ago', applicants: 19, status: 'Open', color: 'bg-cream' },
  { id: 5, title: 'Backend Engineer', type: 'Full-time', location: 'Austin', posted: '2 weeks ago', applicants: 38, status: 'Open', color: 'bg-cream' },
];

export default function JobTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredJobs = useMemo(() => {
    let result = [...INITIAL_JOBS];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title.toLowerCase().includes(lowerSearch) ||
        job.location.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(job => job.status === statusFilter);
    }

    if (typeFilter !== 'All') {
      result = result.filter(job => job.type === typeFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'applicants') {
        return b.applicants - a.applicants;
      }
      return b.id - a.id;
    });

    return result;
  }, [searchTerm, statusFilter, typeFilter, sortBy]);

  return (
    <div className="bg-dark border border-cream/20 overflow-hidden rounded-md">
      <div className="p-8 border-b border-cream/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/60" />
          <input
            type="text"
            placeholder="Search Jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark border border-cream/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cream focus:border-cream transition-all font-medium text-cream text-sm placeholder:text-cream/40"
          />
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Filters Toggle Button */}
          <div className="relative">
            <Button
              variant="secondary"
              className={`gap-2 ${showFilters ? 'bg-cream/10' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(statusFilter !== 'All' || typeFilter !== 'All') && (
                <span className="w-2 h-2 bg-cream rounded-full"></span>
              )}
            </Button>

            {/* Simple Dropdown Menu */}
            {showFilters && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-dark border border-cream/30 rounded-md shadow-2xl p-6 z-40 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-cream/40 tracking-widest mb-3 block">Job Status</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Open', 'Closed'].map(s => (
                          <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`flex items-center justify-between px-3 py-2 rounded-md tracking-widest text-xs transition-colors ${statusFilter === s ? 'bg-cream/10 text-cream font-bold border border-cream/30' : 'text-cream/60 hover:bg-cream/5'}`}
                          >
                            {s}
                            {statusFilter === s && <Check className="w-4 h-4 text-cream" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-cream/40 tracking-widest mb-3 block">Job Type</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Full-time', 'Contract'].map(t => (
                          <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`flex items-center justify-between px-3 py-2 rounded-md uppercase tracking-widest text-xs transition-colors ${typeFilter === t ? 'bg-cream/10 text-cream font-bold border border-cream/30' : 'text-cream/60 hover:bg-cream/5'}`}
                          >
                            {t}
                            {typeFilter === t && <Check className="w-4 h-4 text-cream" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setStatusFilter('All'); setTypeFilter('All'); }}
                      className="text-[10px] text-cream/40 hover:text-cream font-bold underline decoration-dotted underline-offset-4"
                    >
                      Reset filters
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-dark border border-cream/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cream focus:border-cream transition-all font-bold tracking-wider text-xs text-cream cursor-pointer appearance-none pr-10 relative inline-block"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23DAC5A7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
          >
            <option value="latest">Latest first</option>
            <option value="applicants">Most applicants</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark">
              <th className="text-left px-8 py-5 text-[13px] font-semibold text-cream/40 border-b border-cream/20">Job Role</th>
              <th className="text-left px-8 py-5 text-[13px] font-semibold text-cream/40 border-b border-cream/20">Location & Type</th>
              <th className="text-left px-8 py-5 text-[13px] font-semibold text-cream/40 border-b border-cream/20">Applicants</th>
              <th className="text-left px-8 py-5 text-[13px] font-semibold text-cream/40 border-b border-cream/20">Date Posted</th>
              <th className="text-left px-8 py-5 text-[13px] font-semibold text-cream/40 border-b border-cream/20">Status</th>
              <th className="text-right px-8 py-5 border-b border-cream/20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream/10">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-cream/5 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <Link href={`/jobs/${job.id}`} className="flex items-center gap-4">
                    <div>
                      <div className="font-bold tracking-wider text-cream text-[15px] mb-1 group-hover:text-white transition-colors">{job.title}</div>
                      <div className="text-[14px] font-medium text-cream/40">ID: JOB-00{job.id}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-cream/70 font-medium tracking-widest text-xs">
                      <MapPin className="h-4 w-4 text-cream/40" />
                      <span>{job.location}</span>
                    </div>
                    <div className="text-[10px] font-black text-cream flex items-center gap-1.5 tracking-widest">
                      <div className="w-1 h-1 rounded-full bg-cream"></div>
                      {job.type}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-9 h-9 rounded-md border border-dark bg-cream/20 flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-cream/10"></div>
                        </div>
                      ))}
                      <div className="w-9 h-9 rounded-md border border-cream bg-dark flex items-center justify-center text-[11px] font-black text-cream">
                        +{job.applicants - 3}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-cream/60 font-medium tracking-widest text-xs">
                    <Clock className="h-4 w-4 text-cream/40" />
                    <span>{job.posted}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge variant={job.status === 'Open' ? 'success' : 'secondary'} className="px-4 py-1.5 rounded-md text-[10px] tracking-wider font-bold">
                    {job.status}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-cream/40 hover:text-cream hover:bg-cream/10 rounded-md transition-all cursor-pointer">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center bg-dark/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border border-cream/20 flex items-center justify-center">
                      <Search className="w-8 h-8 text-cream/20" />
                    </div>
                    <p className="text-cream/40 font-bold tracking-widest text-sm">No jobs found matching your criteria</p>
                    <button
                      onClick={() => { setSearchTerm(''); setStatusFilter('All'); setTypeFilter('All'); }}
                      className="text-cream font-black text-xs tracking-widest hover:underline"
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
