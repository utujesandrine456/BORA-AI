'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MoreVertical, MapPin, Clock, Check } from 'lucide-react';
import Link from 'next/link';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { jobsApi } from '@/lib/api/jobs';
import { screeningApi } from '@/lib/api/screening';
import { profilesApi } from '@/lib/api/profiles';
import { TalentProfile } from '@/lib/types/profile';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const [data, profilesRes] = await Promise.all([
        jobsApi.getJobs(),
        profilesApi.getProfiles({ limit: 1000 })
      ]);

      const rawArray: Job[] = Array.isArray(data) ? data : [];

      // Calculate real applicant counts from profiles
      const applicantCounts: Record<string, number> = {};
      profilesRes.data.forEach((p: TalentProfile) => {
        const jId = p.jobId;
        if (jId) {
          applicantCounts[jId] = (applicantCounts[jId] || 0) + 1;
        }
      });

      console.log(`JobTable: Received ${rawArray.length} items (API + local)`);

      // Fallback mapper for properties missing from base Job schema
      const mappedJobs = rawArray.map((job: any) => {
        const jobId = job._id || job.id;
        // Handle varied status strings: 'open' | 'active' | 'draft' | 'published'
        const rawStatus = job.status || 'open';
        let displayStatus = 'Open';

        if (rawStatus.toLowerCase() === 'draft') displayStatus = 'Draft';
        else if (rawStatus.toLowerCase() === 'closed') displayStatus = 'Closed';
        else if (rawStatus.toLowerCase() === 'published' || rawStatus.toLowerCase() === 'active') displayStatus = 'Open';

        return {
          id: jobId,
          title: job.title || 'Untitled Role',
          type: job.type ? (job.type.charAt(0).toUpperCase() + job.type.slice(1)) : 'Full-time',
          location: job.location || 'Remote',
          posted: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently',
          createdAt: job.createdAt || new Date().toISOString(),
          applicants: applicantCounts[jobId] || job.applicantsCount || 0,
          status: displayStatus,
          _isLocal: job._isLocal || false, // Keep support for local sync flag
        };
      });

      console.log('JobTable: MAPPED RESULT:', mappedJobs);
      if (mappedJobs.length === 0) {
        console.warn('JobTable: No jobs mapped from raw response:', data);
      }
      setJobs(mappedJobs);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load jobs';
      console.error('JobTable: Failed to fetch jobs:', msg);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleScreen = async (jobId: string) => {
    if (!jobId) return;

    const id = toast.loading('Initiating AI analysis...');
    try {
      await screeningApi.triggerScreening(jobId);
      toast.success('Analysis initiated! Redirecting to results...', { id });
      setTimeout(() => {
        router.push('/screening');
      }, 1500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to start analysis';
      toast.error(msg, { id });
    }
  };

  const handleCloseJob = async (jobId: string) => {
    const id = toast.loading('Closing job...');
    try {
      await jobsApi.updateJob(jobId, { status: 'closed' });
      toast.success('Job closed successfully', { id });
      fetchJobs();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to close job';
      toast.error(msg, { id });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    const id = toast.loading('Deleting job...');
    try {
      await jobsApi.deleteJob(jobId);
      toast.success('Job deleted successfully', { id });
      fetchJobs();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to delete job';
      toast.error(msg, { id });
    }
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

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
        return (b.applicants || 0) - (a.applicants || 0);
      }
      // Latest first (sorting by createdAt string)
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });

    return result;
  }, [searchTerm, statusFilter, typeFilter, sortBy, jobs]);

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

            {showFilters && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-dark border border-cream/30 rounded-md shadow-2xl p-6 z-40 animate-in fade-in zoom-in duration-200">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[14px] font-bold text-cream/40 mb-3 block">Job Status</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Open', 'Closed', 'Draft'].map(s => (
                          <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${statusFilter === s ? 'bg-cream/10 text-cream font-bold border border-cream/30' : 'text-cream/60 hover:bg-cream/5'}`}
                          >
                            {s}
                            {statusFilter === s && <Check className="w-4 h-4 text-cream" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[14px] font-bold text-cream/40 mb-3 block">Job Type</label>
                      <div className="flex flex-col gap-1">
                        {['All', 'Full-time', 'Contract'].map(t => (
                          <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${typeFilter === t ? 'bg-cream/10 text-cream font-bold border border-cream/30' : 'text-cream/60 hover:bg-cream/5'}`}
                          >
                            {t}
                            {typeFilter === t && <Check className="w-4 h-4 text-cream" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => { setStatusFilter('All'); setTypeFilter('All'); }}
                      className="text-[14px] text-cream/40 hover:text-cream font-medium underline decoration-dotted underline-offset-4"
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
            className="px-6 py-3 bg-dark border border-cream/30 rounded-md focus:outline-none focus:ring-1 focus:ring-cream focus:border-cream transition-all font-medium text-sm text-cream cursor-pointer appearance-none pr-10 relative inline-block"
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center bg-dark/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-cream/20 border-t-cream rounded-full animate-spin"></div>
                    <p className="text-cream/40 font-semibold text-sm">Loading jobs...</p>
                  </div>
                </td>
              </tr>
            ) : filteredJobs.length > 0 ? filteredJobs.map((job) => (
              <tr key={job.id} className="hover:bg-cream/5 transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <Link href={`/jobs/${job.id}`} className="flex items-center gap-4">
                    <div>
                      <div className="font-bold tracking-wider text-cream text-[15px] mb-1 group-hover:text-white transition-colors flex items-center gap-2">
                        {job.title}
                        {job._isLocal && (
                          <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 animate-pulse">
                            SYNCING
                          </span>
                        )}
                      </div>
                      <div className="text-[14px] font-medium text-cream/40">ID: {String(job.id).slice(-6).toUpperCase()}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-cream/70 font-medium text-sm">
                      <MapPin className="h-4 w-4 text-cream/40" />
                      <span>{job.location}</span>
                    </div>
                    <div className="text-[10px] font-black text-cream flex items-center gap-1.5">
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
                        +{job.applicants > 3 ? job.applicants - 3 : 0}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-cream/60 font-medium text-sm">
                    <Clock className="h-4 w-4 text-cream/40" />
                    <span>{job.posted}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Badge variant={job.status === 'Open' ? 'success' : 'secondary'} className="px-4 py-1.5 rounded-md text-[10px] font-bold">
                    {job.status}
                  </Badge>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleScreen(job.id)}
                      className="px-4 py-2 text-xs font-black shadow-none transition-all group-hover:shadow-xl group-hover:shadow-cream/5"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Screen
                    </Button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === job.id ? null : job.id);
                        }}
                        className="p-2 text-cream/40 hover:text-cream hover:bg-cream/10 rounded-md transition-all cursor-pointer"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {activeMenu === job.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(null);
                            }}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-dark border border-cream/20 rounded-md shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-100">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-cream/70 hover:bg-cream/10 hover:text-cream border-b border-cream/5 flex items-center gap-2"
                            >
                              View Details
                            </Link>
                            <Link
                              href={`/jobs/${job.id}/edit`}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-cream/70 hover:bg-cream/10 hover:text-cream border-b border-cream/5 flex items-center gap-2"
                            >
                              Edit Job
                            </Link>
                            {job.status !== 'Closed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCloseJob(job.id);
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-amber-500/80 hover:bg-amber-500/10 hover:text-amber-500 border-b border-cream/5 flex items-center gap-2"
                              >
                                Close Job
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteJob(job.id);
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500/80 hover:bg-red-500/10 hover:text-red-500 flex items-center gap-2"
                            >
                              Delete Job
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center bg-dark/50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border border-cream/20 flex items-center justify-center">
                      <Search className="w-8 h-8 text-cream/20" />
                    </div>
                    <p className="text-cream/40 font-medium text-md">No jobs found matching your criteria</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('All'); setTypeFilter('All'); }}
                        className="cursor-pointer text-cream font-medium text-sm hover:underline"
                      >
                        Clear all filters
                      </button>
                      <button
                        onClick={fetchJobs}
                        className="cursor-pointer px-4 py-2 border border-cream/20 text-cream/60 hover:text-cream hover:bg-cream/5 rounded text-sm font-semibold transition-all"
                      >
                        Force Refresh
                      </button>
                    </div>
                    {lastRefreshed && (
                      <p className="text-[10px] text-cream/20 font-medium">Last checked: {lastRefreshed}</p>
                    )}
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
