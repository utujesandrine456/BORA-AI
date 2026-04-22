'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  User,
  ChevronRight,
  Check,
  X,
  Sparkles,
  UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { profilesApi } from '@/lib/api/profiles';
import { uploadsApi } from '@/lib/api/uploads';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';

export default function ApplicantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  interface Applicant { id: number; dbId: string | undefined; name: string; role: string | undefined; location: string | undefined; score: number; status: string; date: string; avatar: string; screened: boolean; jobStatus: string; }
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await profilesApi.getProfiles();
      const mapped = response.data.map((p: TalentProfile, index: number) => ({
        id: index + 1,
        dbId: p._id,
        name: `${p.firstName} ${p.lastName}`,
        role: p.headline,
        location: p.location,
        score: p.matchScore || 0,
        status: p.availability?.status || 'New',
        date: 'Recently',
        avatar: `${p.firstName[0]}${p.lastName[0]}`,
        screened: !!p.matchScore,
        jobStatus: (p as any).jobStatus || 'Open'
      }));
      setApplicants(mapped);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const id = toast.loading('Uploading and analyzing resume...');
    try {
      await uploadsApi.uploadResume(file);
      toast.success('Resume analyzed and profile created!', { id });
      fetchApplicants(); // Refresh list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(message, { id });
    } finally {
      setUploading(false);
    }
  };




  const [showFilters, setShowFilters] = useState(false);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (applicant.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, applicants]);

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
          <div>
            <h1 className="text-5xl font-black text-cream leading-none">
              Applicants List
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
              />
              <button
                className="cursor-pointer inline-flex items-center justify-center gap-3 py-4 px-8 bg-cream hover:bg-white text-dark transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md font-black text-sm"
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={uploading}
              >
                <UploadCloud className={`w-5 h-5 ${uploading ? 'animate-bounce' : ''}`} />
                <span>{uploading ? 'Processing...' : 'Scan Single Resume'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/30" />
            <input
              type="text"
              placeholder="Search by name, role or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark/50 border border-cream/20 rounded-md focus:outline-none focus:ring-1 focus:ring-cream/40 transition-all text-cream font-medium text-sm placeholder:text-cream/20"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <button
                className={`cursor-pointer inline-flex items-center justify-center gap-2 py-4 px-6 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md font-bold ${showFilters ? 'bg-cream/50 border border-cream/40 text-cream' : 'bg-dark border border-cream/10 text-cream/40 hover:bg-cream/10'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                {statusFilter !== 'All' && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />
                  <Card variant="glass" className="absolute right-0 mt-3 w-72 p-6 z-40 animate-in fade-in zoom-in duration-200">
                    <div className="space-y-6">
                      <div>
                        <div className="text-[10px] font-black text-cream/30 mb-4">Lifecycle status</div>
                        <div className="grid grid-cols-1 gap-2">
                          {['All', 'Shortlisted', 'In review', 'Interviewing', 'New'].map((s: string) => (
                            <button
                              key={s}
                              onClick={() => { setStatusFilter(s); setShowFilters(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs transition-all ${statusFilter === s ? 'bg-cream text-dark font-black' : 'text-cream/60 hover:bg-cream/5 border border-cream/5'}`}
                            >
                              {s}
                              {statusFilter === s && <Check className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 w-full bg-cream/5 rounded-xl animate-pulse mb-4" />
            ))
          ) : filteredApplicants.length > 0 ? (
            <div className="space-y-4">
              {filteredApplicants.map((applicant: any) => (
                <div
                  key={applicant.dbId || applicant.id}
                  onClick={() => setSelectedId(applicant.dbId || applicant.id)}
                  className="group relative block"
                >
                  <Card
                    variant="glass"
                    className={`p-8 transition-all duration-500 overflow-hidden relative border-cream/10 cursor-pointer group/item ${selectedId === (applicant.dbId || applicant.id) ? 'bg-cream/10 border-cream/60 shadow-[0_0_40px_rgba(218,197,167,0.15)] scale-[1.01] z-20' : 'group-hover:border-cream/40'}`}
                  >
                    {selectedId === (applicant.dbId || applicant.id) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cream shadow-[0_0_15px_rgba(218,197,167,0.8)] animate-in slide-in-from-left duration-300" />
                    )}
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <Sparkles className="w-32 h-32 -mr-16 -mt-16" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">


                      <div className="w-16 h-16 bg-cream/10 border border-cream/20 rounded-lg flex items-center justify-center text-cream font-black text-2xl group-hover:bg-cream group-hover:text-dark transition-all duration-500 shadow-xl shadow-black/20">
                        {applicant.avatar}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black text-cream group-hover:text-white transition-colors">{applicant.name}</h3>
                          <Badge variant={applicant.status === 'Shortlisted' ? 'success' : 'secondary'} className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20">
                            {applicant.status}
                          </Badge>
                          <Badge variant={applicant.screened ? 'success' : 'secondary'} className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20">
                            {applicant.screened ? 'Screened' : 'Not Screened'}
                          </Badge>
                          <Badge variant={applicant.jobStatus === 'Open' ? 'success' : 'secondary'} className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20">
                            Job: {applicant.jobStatus}
                          </Badge>
                        </div>
                        <div className="text-[13px] text-cream/50 font-bold flex flex-wrap items-center gap-x-6 gap-y-2">
                          <span className="flex items-center gap-2 text-cream/70 underline underline-offset-4 decoration-cream/20">{applicant.role}</span>
                          <span className="flex items-center gap-1.5 opacity-60 font-serif italic">
                            <MapPin className="w-3.5 h-3.5" /> {applicant.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 ml-auto shrink-0">
                        {applicant.screened && (
                          <Link href={`/screening/results?jobId=${applicant.jobId || 'all'}`}>
                            <button className="cursor-pointer w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-dark transition-all rounded-md font-bold text-xs uppercase tracking-tighter">
                              <Sparkles className="w-3.5 h-3.5" />
                              Screening Results
                            </button>
                          </Link>
                        )}
                        <Link href={`/applicants/${applicant.dbId || applicant.id}`}>
                          <button className="cursor-pointer w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-cream text-dark hover:bg-white transition-all rounded-md font-black text-xs uppercase tracking-tighter">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-6 bg-cream/2 border border-dashed border-cream/10 rounded-xl mt-8">
              <div className="w-20 h-20 bg-cream/5 rounded-full flex items-center justify-center mx-auto border border-cream/10">
                <User className="w-10 h-10 text-cream/20" />
              </div>
              <div>
                <p className="text-cream text-lg font-bold">No candidates identified</p>
                <p className="text-cream/40 text-sm font-medium font-serif italic">Adjust your search parameters or import fresh talent.</p>
              </div>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="cursor-pointer px-6 py-2 bg-cream/10 text-cream/60 rounded-full hover:bg-cream/20 transition-all font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
