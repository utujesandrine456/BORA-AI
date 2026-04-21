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
  UploadCloud,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import { profilesApi } from '@/lib/api/profiles';
import { uploadsApi } from '@/lib/api/uploads';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';
import { downloadAsFile, jsonToCsv } from '@/lib/utils/download';


export default function ApplicantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicants, setSelectedApplicants] = useState<(string | number)[]>([]);
  interface Applicant { id: number; dbId: string | undefined; name: string; role: string | undefined; location: string | undefined; score: number; status: string; date: string; avatar: string; }
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleExportApplicants = () => {
    if (!applicants || !applicants.length) return toast.error('No applicants to export');
    
    // Prepare data for CSV
    const exportData = applicants.map(a => ({
      ID: a.id,
      Name: a.name,
      Role: a.role,
      Location: a.location,
      Score: a.score,
      Status: a.status,
      DateApplied: a.date
    }));

    const csvContent = jsonToCsv(exportData);
    downloadAsFile(`applicants_export_${new Date().toISOString().split('T')[0]}.csv`, csvContent, 'text/csv');
    toast.success('Applicants list exported as CSV');
  };

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(message, { id });
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
      toast.success('Applicants List imported successfully!', { id });
      fetchApplicants();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'CSV Import failed';
      toast.error(message, { id });
    } finally {
      setUploading(false);
    }
  };

  const handleSelectApplicant = (id: string | number, checked: boolean) => {
    setSelectedApplicants(prev =>
      checked ? [...prev, id] : prev.filter(aId => aId !== id)
    );
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
        {/* Header Section */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-cream/10 border border-cream/20 rounded-full text-[10px] font-black text-cream flex items-center gap-2">
                <User className="w-3 h-3" /> Recruiters portal
              </span>
            </div>
            <h1 className="text-6xl font-black text-cream leading-none">
              Talent <br />
              <span className="text-cream/40 italic serif text-4xl">database</span>
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
              <Button
                variant="primary"
                className="gap-3 py-4 px-8 bg-cream text-dark"
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={uploading}
              >
                <UploadCloud className={`w-5 h-5 ${uploading ? 'animate-bounce' : ''}`} />
                <span className="font-black text-sm">{uploading ? 'Processing...' : 'Scan Single Resume'}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                className="gap-2 py-4 px-6 border-cream/20 hover:border-cream/60"
                onClick={handleExportApplicants}
                disabled={uploading}
              >
                <FileText className="w-4 h-4" />
                <span className="font-black text-sm">Export CSV</span>
              </Button>

              <div className="relative">
                <input
                  type="file"
                  id="csv-batch-upload"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleCsvUpload}
                  disabled={uploading}
                />
                <Button 
                  variant="secondary" 
                  className="gap-2 py-4 px-6 border-cream/20 hover:border-cream/60"
                  onClick={() => document.getElementById('csv-batch-upload')?.click()}
                  disabled={uploading}
                >
                  <UploadCloud className="w-4 h-4 rotate-180" />
                  <span className="font-black text-sm">{uploading ? 'Importing...' : 'Batch Import'}</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row gap-6 items-center"
        >
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
                className={`gap-2 py-4 px-6 ${showFilters ? 'bg-cream/10 border-cream/40 text-cream' : 'border-cream/10 text-cream/40'}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span className="font-bold">Advanced Filters</span>
                {statusFilter !== 'All' && <span className="w-2 h-2 bg-emerald-500 rounded-full" />}
              </Button>

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
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4"
        >
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-cream border-t-transparent rounded-full animate-spin mx-auto opacity-20"></div>
              <p className="text-cream/40 font-bold text-sm">Loading talent database...</p>
            </div>
          ) : filteredApplicants.length > 0 ? filteredApplicants.map((applicant: any) => (
            <motion.div
              key={applicant.id}
              variants={fadeUp}
              className="group relative block"
            >
              <Card variant="glass" className="p-8 transition-all duration-500 overflow-hidden relative border-cream/10 group-hover:border-cream/40">
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

                  <Link href={`/applicants/${applicant.dbId || applicant.id}`} className="absolute inset-0 z-0" />

                  <div className="w-16 h-16 bg-cream/10 border border-cream/20 rounded-lg flex items-center justify-center text-cream font-black text-2xl group-hover:bg-cream group-hover:text-dark transition-all duration-500 shadow-xl shadow-black/20">
                    {applicant.avatar}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black text-cream group-hover:text-white transition-colors">{applicant.name}</h3>
                      <Badge variant={applicant.status === 'Shortlisted' ? 'success' : 'secondary'} className="px-3 py-1 rounded-md text-[10px] font-black">
                        {applicant.status}
                      </Badge>
                    </div>
                    <div className="text-[13px] text-cream/50 font-bold flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="flex items-center gap-2 text-cream/70 underline underline-offset-4 decoration-cream/20">{applicant.role}</span>
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
                          <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[9px] font-black">High Match</div>
                        )}
                        <span className={`text-4xl font-black ${applicant.score >= 90 ? 'text-cream' : 'text-cream/40'}`}>
                          {applicant.score}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-cream/20">Joined {applicant.date}</div>
                  </div>

                  <div className="hidden md:flex items-center justify-center p-3 text-cream/10 group-hover:text-cream/60 group-hover:scale-125 transition-all">
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )) : (
            <motion.div variants={fadeUp} className="py-24 text-center space-y-6 bg-cream/2 border border-dashed border-cream/10 rounded-xl mt-8">
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
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      {
        selectedApplicants.length > 0 && (
          <motion.div
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            className="fixed bottom-10 left-1/2 z-50 flex items-center gap-8 bg-cream text-dark px-10 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] font-black border border-white/20 backdrop-blur-3xl"
          >
            <div className="flex items-center gap-4 border-r border-dark/10 pr-8">
              <div className="bg-dark text-cream w-8 h-8 rounded flex items-center justify-center text-sm shadow-inner group-hover:scale-110 transition-transform">
                {selectedApplicants.length}
              </div>
              <div className="text-xs opacity-60">Candidates selected</div>
            </div>

            <div className="flex items-center gap-4">
              {selectedApplicants.length === 1 ? (
                <>
                  <Button
                    variant="primary"
                    className="bg-dark text-cream py-3 px-8 text-xs hover:bg-black/90"
                  >
                    Trigger Screen
                  </Button>
                  <Button
                    variant="secondary"
                    className="bg-dark/5 border border-dark/10 text-dark py-3 px-8 text-xs hover:bg-dark/10"
                    onClick={() => router.push(`/applicants/${selectedApplicants[0]}`)}
                  >
                    Inspect details
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  className="bg-dark text-cream py-4 px-12 text-sm hover:scale-[1.02] shadow-2xl transition-all"
                >
                  Screen & Rank (AI)
                </Button>
              )}
            </div>

            <button
              onClick={() => setSelectedApplicants([])}
              className="p-3 ml-4 bg-dark/5 hover:bg-dark/10 rounded-full transition-colors"
              aria-label="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )
      }
    </div >
  );
}
