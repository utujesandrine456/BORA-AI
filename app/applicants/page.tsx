'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  MapPin,
  User,
  ChevronRight,
  Check,
  X,
  Sparkles,
  UploadCloud,
  Briefcase,
  Loader2,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { profilesApi } from '@/lib/api/profiles';
import { uploadsApi } from '@/lib/api/uploads';
import { jobsApi } from '@/lib/api/jobs';
import { screeningApi } from '@/lib/api/screening';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';
import { Job } from '@/lib/api/types';

interface Applicant {
  id: number;
  dbId: string | undefined;
  name: string;
  role: string | undefined;
  location: string | undefined;
  score: number;
  status: string;
  date: string;
  avatar: string;
  screened: boolean;
  jobStatus: string;
}

// ─── Job Picker Modal ──────────────────────────────────────────────────────────
function JobPickerModal({
  open,
  onClose,
  onConfirm,
  selectedCount,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (jobId: string) => void;
  selectedCount: number;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [pickedJobId, setPickedJobId] = useState('');

  useEffect(() => {
    if (!open) return;
    setPickedJobId('');
    setLoadingJobs(true);
    jobsApi
      .getJobs()
      .then((j) => setJobs(j))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoadingJobs(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#111] border border-cream/20 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-cream/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-cream">Run AI Screening</h2>
              <p className="text-xs text-cream/40 font-medium mt-0.5">
                Select the job to screen {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} against
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-cream/30 hover:text-cream hover:bg-cream/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Job list */}
        <div className="p-6 max-h-72 overflow-y-auto space-y-2">
          {loadingJobs ? (
            <div className="flex items-center justify-center py-10 gap-3 text-cream/40">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Loading jobs…</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase className="w-8 h-8 text-cream/10 mx-auto mb-3" />
              <p className="text-sm text-cream/40 font-bold">No jobs found.</p>
              <p className="text-xs text-cream/20 mt-1">Create a job first before screening.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const id = job._id || job.id || '';
              const active = pickedJobId === id;
              return (
                <button
                  key={id}
                  onClick={() => setPickedJobId(id)}
                  className={`w-full text-left px-5 py-4 rounded-lg border transition-all flex items-center justify-between group ${
                    active
                      ? 'bg-cream/10 border-cream/40 text-cream'
                      : 'bg-cream/[0.03] border-cream/10 text-cream/60 hover:border-cream/30 hover:text-cream'
                  }`}
                >
                  <div>
                    <div className="font-black text-sm">{job.title}</div>
                    <div className="text-[11px] text-cream/40 mt-0.5 font-medium">
                      {job.company}{job.location ? ` · ${job.location}` : ''}
                    </div>
                  </div>
                  {active && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-dark" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-cream/10">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg border border-cream/20 text-cream/60 text-sm font-bold hover:bg-cream/5 transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!pickedJobId}
            onClick={() => onConfirm(pickedJobId)}
            className="px-8 py-3 rounded-lg bg-cream text-dark text-sm font-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <BrainCircuit className="w-4 h-4" />
            Start Screening
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ApplicantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicants, setSelectedApplicants] = useState<(string | number)[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [screening, setScreening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showJobPicker, setShowJobPicker] = useState(false);

  const fetchApplicants = useCallback(async () => {
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
        jobStatus: (p as any).jobStatus || 'Open',
      }));
      setApplicants(mapped);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const id = toast.loading('Uploading and analyzing resume...');
    try {
      await uploadsApi.uploadResume(file);
      toast.success('Resume analyzed and profile created!', { id });
      fetchApplicants();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(message, { id });
    } finally {
      setUploading(false);
    }
  };

  const handleSelectApplicant = (id: string | number, checked: boolean) => {
    setSelectedApplicants((prev) =>
      checked ? [...prev, id] : prev.filter((aId) => aId !== id)
    );
  };

  /** Called when user confirms a job in the picker modal */
  const handleScreeningConfirm = async (jobId: string) => {
    setShowJobPicker(false);
    setScreening(true);

    const toastId = toast.loading(
      `🤖 AI screening ${selectedApplicants.length} candidate${selectedApplicants.length !== 1 ? 's' : ''}…`
    );

    try {
      await screeningApi.triggerScreening(jobId);
      toast.success('Screening queued! Loading results…', { id: toastId });
      // Navigate to results — the results page will poll until data arrives
      router.push(`/screening/results?jobId=${jobId}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to trigger screening';
      toast.error(msg, { id: toastId });
    } finally {
      setScreening(false);
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (applicant.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || applicant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, applicants]);

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      {/* Job picker modal */}
      <JobPickerModal
        open={showJobPicker}
        onClose={() => setShowJobPicker(false)}
        onConfirm={handleScreeningConfirm}
        selectedCount={selectedApplicants.length}
      />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
          <div>
            <h1 className="text-5xl font-black text-cream leading-none">Applicants List</h1>
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

        {/* Filters */}
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
                className={`cursor-pointer inline-flex items-center justify-center gap-2 py-4 px-6 transition-all active:scale-[0.98] rounded-md font-bold ${
                  showFilters
                    ? 'bg-cream/50 border border-cream/40 text-cream'
                    : 'bg-dark border border-cream/10 text-cream/40 hover:bg-cream/10'
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Advanced Filters</span>
                {statusFilter !== 'All' && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />
                  <Card
                    variant="glass"
                    className="absolute right-0 mt-3 w-72 p-6 z-40 animate-in fade-in zoom-in duration-200"
                  >
                    <div className="space-y-6">
                      <div>
                        <div className="text-[10px] font-black text-cream/30 mb-4">Lifecycle status</div>
                        <div className="grid grid-cols-1 gap-2">
                          {['All', 'Shortlisted', 'In review', 'Interviewing', 'New'].map((s: string) => (
                            <button
                              key={s}
                              onClick={() => { setStatusFilter(s); setShowFilters(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-md text-xs transition-all ${
                                statusFilter === s
                                  ? 'bg-cream text-dark font-black'
                                  : 'text-cream/60 hover:bg-cream/5 border border-cream/5'
                              }`}
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

        {/* Applicant cards */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 w-full bg-cream/5 rounded-xl animate-pulse mb-4" />
            ))
          ) : filteredApplicants.length > 0 ? (
            <div className="space-y-4">
              {filteredApplicants.map((applicant: any) => (
                <div key={applicant.id} className="group relative block">
                  <Card
                    variant="glass"
                    className="p-8 transition-all duration-500 overflow-hidden relative border-cream/10 group-hover:border-cream/40"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <Sparkles className="w-32 h-32 -mr-16 -mt-16" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectedApplicants.includes(applicant.dbId)}
                          onChange={(e) => handleSelectApplicant(applicant.dbId, e.target.checked)}
                          className="w-6 h-6 accent-cream/80 cursor-pointer rounded-lg border-cream/20 bg-dark/50"
                        />
                      </div>

                      <div className="w-16 h-16 bg-cream/10 border border-cream/20 rounded-lg flex items-center justify-center text-cream font-black text-2xl group-hover:bg-cream group-hover:text-dark transition-all duration-500 shadow-xl shadow-black/20">
                        {applicant.avatar}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black text-cream group-hover:text-white transition-colors">
                            {applicant.name}
                          </h3>
                          <Badge
                            variant={applicant.status === 'Shortlisted' ? 'success' : 'secondary'}
                            className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20"
                          >
                            {applicant.status}
                          </Badge>
                          <Badge
                            variant={applicant.screened ? 'success' : 'secondary'}
                            className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20"
                          >
                            {applicant.screened ? 'Screened' : 'Not Screened'}
                          </Badge>
                          <Badge
                            variant={applicant.jobStatus === 'Open' ? 'success' : 'secondary'}
                            className="px-3 py-1 rounded-md text-[10px] font-black border-cream/20"
                          >
                            Job: {applicant.jobStatus}
                          </Badge>
                        </div>
                        <div className="text-[13px] text-cream/50 font-bold flex flex-wrap items-center gap-x-6 gap-y-2">
                          <span className="flex items-center gap-2 text-cream/70 underline underline-offset-4 decoration-cream/20">
                            {applicant.role}
                          </span>
                          <span className="flex items-center gap-1.5 opacity-60 font-serif italic">
                            <MapPin className="w-3.5 h-3.5" /> {applicant.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-10 md:gap-2 ml-auto shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] font-black text-cream/30 mb-1">AI potential</div>
                          <div className="flex items-center gap-3">
                            {applicant.score >= 90 && (
                              <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[9px] font-black">
                                High Match
                              </div>
                            )}
                            <span
                              className={`text-4xl font-black ${
                                applicant.score >= 90 ? 'text-cream' : 'text-cream/40'
                              }`}
                            >
                              {applicant.score}%
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] font-black text-cream/20">Joined {applicant.date}</div>
                      </div>

                      <div className="hidden md:flex items-center justify-center p-3 text-cream/10 group-hover:text-cream/60 group-hover:scale-125 transition-all">
                        <Link href={`/applicants/${applicant.dbId || applicant.id}`}>
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
                <p className="text-cream/40 text-sm font-medium font-serif italic">
                  Adjust your search parameters or import fresh talent.
                </p>
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

      {/* ── Floating Action Bar ── */}
      {selectedApplicants.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-cream text-dark px-10 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] font-black border border-white/20 backdrop-blur-3xl animate-in slide-in-from-bottom-2 duration-300">
          {/* Count */}
          <div className="flex items-center gap-4 border-r border-dark/10 pr-8">
            <div className="bg-dark text-cream w-8 h-8 rounded flex items-center justify-center text-sm shadow-inner">
              {selectedApplicants.length}
            </div>
            <div className="text-xs opacity-60">
              Candidate{selectedApplicants.length !== 1 ? 's' : ''} selected
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {selectedApplicants.length === 1 ? (
              <>
                <button
                  disabled={screening}
                  onClick={() => setShowJobPicker(true)}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 bg-dark text-cream py-3 px-8 text-xs hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md font-semibold"
                >
                  {screening ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Screening…</>
                  ) : (
                    <><BrainCircuit className="w-4 h-4" /> Trigger Screen</>
                  )}
                </button>
                <button
                  className="cursor-pointer inline-flex items-center justify-center gap-2 bg-dark/5 border border-dark/10 text-dark py-3 px-8 text-xs hover:bg-dark/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md font-semibold"
                  onClick={() => router.push(`/applicants/${selectedApplicants[0]}`)}
                >
                  Inspect details
                </button>
              </>
            ) : (
              <button
                disabled={screening}
                onClick={() => setShowJobPicker(true)}
                className="cursor-pointer inline-flex items-center justify-center gap-2 bg-dark text-cream py-4 px-12 text-sm hover:scale-[1.02] shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md font-black"
              >
                {screening ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Screening…</>
                ) : (
                  <><BrainCircuit className="w-5 h-5" /> Screen &amp; Rank (AI)</>
                )}
              </button>
            )}
          </div>

          {/* Clear */}
          <button
            onClick={() => setSelectedApplicants([])}
            className="p-3 ml-4 bg-dark/5 hover:bg-dark/10 rounded-full transition-colors"
            aria-label="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
