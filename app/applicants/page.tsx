'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  User,
  ChevronRight,
  Download,
  Check,
  Zap,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { profilesApi } from '@/lib/api/profiles';
import { uploadsApi } from '@/lib/api/uploads';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';

// Mock Data fallback removed



export default function ApplicantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await profilesApi.getProfiles();
      const mapped = response.data.map((p: TalentProfile, index: number) => ({
        id: index + 1, // Frontend local ID
        dbId: (p as any)._id,
        name: `${p.firstName} ${p.lastName}`,
        role: p.headline,
        location: p.location,
        score: Math.floor(Math.random() * 20) + 80, // Default score if not screened
        status: p.availability?.status || 'New',
        date: 'Recently',
        avatar: `${p.firstName[0]}${p.lastName[0]}`
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed', { id });
    } finally {
      setUploading(false);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const id = toast.loading('Uploading CSV talent pool...');
    try {
      await uploadsApi.uploadCsv(file);
      toast.success('Talent pool imported successfully!', { id });
      fetchApplicants(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'CSV Import failed', { id });
    } finally {
      setUploading(false);
    }
  };

  const handleSelectApplicant = (id: number, checked: boolean) => {
    setSelectedApplicants(prev =>
      checked ? [...prev, id] : prev.filter(aId => aId !== id)
    );
  };

  const [showFilters, setShowFilters] = useState(false);

  const filteredApplicants = useMemo(() => {
    return applicants.filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || applicant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, applicants]);

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream/10 pb-8">
          <div>
            <h1 className="text-5xl font-black text-cream tracking-tight mb-2">Applicants List</h1>
            <p className="text-cream/60 font-medium text-lg italic serif">Review and manage candidates across all active job openings.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
              />
              <Button 
                variant="primary" 
                className="gap-2"
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={uploading}
              >
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${uploading ? 'animate-pulse' : ''}`} />
                  {uploading ? 'Analyzing...' : 'Scan Resume'}
                </div>
              </Button>
            </div>
            <div className="relative">
              <input
                type="file"
                id="csv-upload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleCsvUpload}
                disabled={uploading}
              />
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => document.getElementById('csv-upload')?.click()}
                disabled={uploading}
              >
                <Download className="w-4 h-4" />
                {uploading ? 'Importing...' : 'Batch Import'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
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
              <Button
                variant="secondary"
                className={`gap-2 ${showFilters ? 'bg-cream/10 border-cream/40' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filters
                {statusFilter !== 'All' && <span className="w-2 h-2 bg-cream rounded-full" />}
              </Button>

              {showFilters && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowFilters(false)} />
                  <Card className="absolute right-0 mt-3 w-64 p-6 z-40 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-cream/40 tracking-wider mb-2">Status</div>
                      <div className="space-y-1">
                        {['All', 'Shortlisted', 'In review', 'Interviewing', 'New'].map(s => (
                          <button
                            key={s}
                            onClick={() => { setStatusFilter(s); setShowFilters(false); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${statusFilter === s ? 'bg-cream/10 text-cream font-bold' : 'text-cream/60 hover:bg-cream/5'}`}
                          >
                            {s}
                            {statusFilter === s && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
            <select
              className="bg-dark border border-cream/20 text-cream text-sm rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cream/40 cursor-pointer appearance-none pr-10"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23DAC5A7' stroke-opacity='0.4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              <option>Sort by Match</option>
              <option>Sort by Date</option>
              <option>Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Applicants Grid/List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-cream border-t-transparent rounded-full animate-spin mx-auto opacity-20"></div>
              <p className="text-cream/40 font-bold tracking-widest text-sm uppercase">Loading talent database...</p>
            </div>
          ) : filteredApplicants.length > 0 ? filteredApplicants.map((applicant) => (
            <div
              key={applicant.id}
              className="group relative block"
            >
              <Card className="p-6 transition-all duration-300 group-hover:border-cream/40 group-hover:bg-cream/2">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Checkbox Wrapper */}
                  <div className="relative z-10 flex items-center justify-center pt-2 md:pt-0">
                    <input
                      type="checkbox"
                      checked={selectedApplicants.includes(applicant.dbId)}
                      onChange={(e) => handleSelectApplicant(applicant.dbId, e.target.checked)}
                      className="w-5 h-5 accent-cream/80 cursor-pointer rounded border-cream/20 bg-dark/50"
                    />
                  </div>

                  {/* Absolute Link */}
                  <Link href={`/applicants/${applicant.dbId || applicant.id}`} className="absolute inset-0 z-0" />

                  <div className="relative z-0 w-14 h-14 bg-cream/10 border border-cream/20 rounded-md flex items-center justify-center text-cream font-black text-xl group-hover:bg-cream group-hover:text-dark transition-colors duration-500">
                    {applicant.avatar}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-cream group-hover:text-white transition-colors">{applicant.name}</h3>
                      <Badge variant="secondary" className="bg-cream/5 border-cream/20 text-cream font-medium text-[10px] rounded px-2 py-0.5">
                        {applicant.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-cream/60 font-medium flex items-center gap-4">
                      <span>{applicant.role}</span>
                      <span className="flex items-center gap-1.5 opacity-60">
                        <MapPin className="w-3.5 h-3.5" /> {applicant.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end gap-6 md:gap-1 ml-auto shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-cream/30 tracking-wider mb-0.5">Match</div>
                      <div className="flex items-center gap-2">
                        {applicant.score >= 90 && <Zap className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" />}
                        <span className={`text-2xl font-black ${applicant.score >= 90 ? 'text-cream' : 'text-cream/60'}`}>
                          {applicant.score}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-cream/30">Applied {applicant.date}</div>
                  </div>

                  <div className="hidden md:flex items-center justify-center p-2 text-cream/20 group-hover:text-cream/60 transition-colors">
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4 border border-dashed border-cream/10 rounded-md">
              <User className="w-12 h-12 text-cream/10 mx-auto" />
              <p className="text-cream/40 font-bold tracking-wider">No applicants found matching your search</p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                className="text-xs font-bold text-cream underline underline-offset-4 decoration-cream/20 hover:decoration-cream transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedApplicants.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom flex items-center gap-4 bg-cream text-dark px-6 py-4 rounded-xl shadow-2xl font-bold border border-dark/10">
          <div className="flex items-center gap-2 border-r border-dark/20 pr-4">
            <span className="bg-dark text-cream w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {selectedApplicants.length}
            </span>
            <span>Selected</span>
          </div>

          {selectedApplicants.length === 1 ? (
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                className="border border-dark/20 text-cream hover:bg-dark/80 hover:text-dark whitespace-nowrap"
              >
                Screen
              </Button>
              <Button
                variant="secondary"
                className="border border-dark/20 text-cream hover:bg-dark hover:text-white whitespace-nowrap"
                onClick={() => router.push(`/applicants/${selectedApplicants[0]}`)}
              >
                View details
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              className="bg-dark text-white hover:bg-dark/80 hover:text-dark whitespace-nowrap"
            >
              Screen All
            </Button>
          )}

          <button
            onClick={() => setSelectedApplicants([])}
            className="p-2 ml-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Clear selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
