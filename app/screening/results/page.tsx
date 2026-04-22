"use client";

import React, { useState, Suspense, useCallback, useEffect } from 'react';
import {
  Filter,
  Trophy,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useSearchParams } from 'next/navigation';
import { screeningApi } from '@/lib/api/screening';
import { jobsApi } from '@/lib/api/jobs';
import { profilesApi } from '@/lib/api/profiles';
import toast from 'react-hot-toast';

function ScreeningResultsContent() {
  const [activeCandidateId, setActiveCandidateId] = useState<string | number>('');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  interface MappedResult {
    id: string; name: string; score: number; isBest: boolean; barColor: string; matchAnalysis: string; role: string;
    stats: { skills: number; experience: number; education: number };
  }
  const [results, setResults] = useState<MappedResult[]>([]);
  const [jobInfo, setJobInfo] = useState<{ title?: string; company?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [topLimit, setTopLimit] = useState('10');
  const [customLimit, setCustomLimit] = useState('4');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const finalLimit = showCustomInput ? parseInt(customLimit, 10) : (topLimit === 'all' ? undefined : parseInt(topLimit, 10));

  const displayResults = results
    .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, isNaN(finalLimit as number) ? undefined : (finalLimit as any) === undefined ? undefined : finalLimit as number);

  useEffect(() => {
    if (displayResults.length > 0 && searchTerm) {
      const currentExistsInDisplay = displayResults.some(r => r.id === activeCandidateId);
      if (!currentExistsInDisplay) {
        setActiveCandidateId(displayResults[0].id);
      }
    }
  }, [searchTerm, displayResults]);

  const fetchData = useCallback(async () => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [resultsData, jobsData, profilesResponse] = await Promise.all([
        screeningApi.getResults(jobId),
        jobsApi.getJobs(),
        profilesApi.getProfiles({ jobId, limit: 100 })
      ]);

      const job = jobsData.find((j) => j._id === jobId);
      setJobInfo(job ?? null);

      const mappedResults = resultsData.map((res: any, index) => {
        const profile = profilesResponse.data.find((p) => p._id === res.profileId);
        const score = res.score ?? res.matchScore ?? 0;

        const jobSkills = job?.skills || [];
        const profileSkills = profile?.skills?.map(s => s.name.toLowerCase()) || [];
        const matchedSkills = jobSkills.filter(s => profileSkills.includes(s.toLowerCase()));
        const skillsScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : score;

        const totalExpYears = profile?.experience?.reduce((acc, exp) => {
          const start = new Date(exp.startDate).getTime();
          const end = exp.endDate === 'Present' ? Date.now() : new Date(exp.endDate).getTime();
          return acc + (end - start) / (1000 * 60 * 60 * 24 * 365.25);
        }, 0) || 0;
        const expScore = job?.experienceYears ? Math.min(100, Math.round((totalExpYears / job.experienceYears) * 100)) : Math.max(0, score - 5);

        const hasEducationMatch = job?.education && profile?.education?.some(edu =>
          edu.degree.toLowerCase().includes(job.education!.toLowerCase()) ||
          edu.fieldOfStudy.toLowerCase().includes(job.education!.toLowerCase())
        );
        const eduScore = hasEducationMatch ? 100 : (profile?.education && profile.education.length > 0 ? 85 : 70);

        return {
          id: res.profileId,
          name: profile ? `${profile.firstName} ${profile.lastName}` : `Candidate ${index + 1}`,
          score: score,
          isBest: index === 0,
          barColor: score >= 90 ? 'bg-emerald-500' : 'bg-blue-500',
          matchAnalysis: res.matchAnalysis,
          role: profile?.headline || 'Applicant',
          stats: {
            skills: skillsScore,
            experience: expScore,
            education: eduScore
          }
        };
      });

      setResults(mappedResults);
      if (mappedResults.length > 0) setActiveCandidateId(mappedResults[0].id);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load screening results';
      console.error('ScreeningResultsPage: Failed to fetch results:', msg);
      toast.error('Failed to load screening results');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeCandidate = results.find(c => c.id === activeCandidateId);

  const handleDownloadReport = () => {
    if (!activeCandidate || !jobInfo) {
      return toast.error('No candidate selected or job data missing');
    }

    const reportText = `
BORA AI - MATCH ANALYSIS REPORT
===============================
date: ${new Date().toLocaleDateString()}
job role: ${jobInfo.title}
candidate name: ${activeCandidate.name}
HEADLINE: ${activeCandidate.role}
MATCH SCORE: ${activeCandidate.score}%
-------------------------------
AI MATCH ANALYSIS:
${activeCandidate.matchAnalysis || 'No detailed analysis provided.'}
-------------------------------
CONFIDENTIALITY NOTICE: This candidate assessment report is generated 
by BORA AI and is intended for internal recruitment purposes only.
GENERATED BY BORA AI PLATFORM
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BORA_Match_Report_${activeCandidate.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Professional report downloaded');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto pb-20">

          <div className="mb-10 border-b border-cream/20 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-cream mb-3">Screening results</h1>
            <p className="text-cream/60 font-medium text-md">
              {jobInfo?.title || 'Senior Role'} • Analyzed {results.length} candidates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card padding="md" className="h-[800px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-cream">Top candidates</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      className="p-2 text-cream/40 hover:text-emerald-500 transition-colors border border-cream/10 rounded-md hover:border-emerald-500/30"
                      title="Refresh Results"
                    >
                      <Filter className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-bold outline-none focus:border-cream"
                  />
                  <div className="flex gap-2">
                    <select
                      value={showCustomInput ? 'other' : topLimit}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'other') {
                          setShowCustomInput(true);
                        } else {
                          setShowCustomInput(false);
                          setTopLimit(val);
                        }
                      }}
                      className="flex-1 bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-bold outline-none focus:border-cream cursor-pointer appearance-none"
                    >
                      <option value="10">Top 10 Candidates</option>
                      <option value="25">Top 25 Candidates</option>
                      <option value="50">Top 50 Candidates</option>
                      <option value="all">All Candidates</option>
                      <option value="other">Other...</option>
                    </select>

                    {showCustomInput && (
                      <input
                        type="number"
                        min="1"
                        max={results.length}
                        value={customLimit}
                        onChange={(e) => setCustomLimit(e.target.value)}
                        placeholder="N"
                        className="w-20 bg-dark border border-cream/20 rounded-md px-3 py-3 text-sm text-cream font-bold outline-none focus:border-cream"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                      <div className="w-8 h-8 border-2 border-cream border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-bold">Fetching AI scores...</span>
                    </div>
                  ) : displayResults.length > 0 ? displayResults.map((candidate, index) => {
                    const isActive = activeCandidateId === candidate.id;
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => setActiveCandidateId(candidate.id)}
                        className={`p-5 rounded-md border cursor-pointer transition-all duration-300 relative group/item ${isActive
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02] z-10'
                          : 'bg-cream/5 border-cream/10 hover:border-cream/30 hover:bg-cream/8 hover:translate-x-1'
                          }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 rounded-md border border-emerald-500/50 animate-pulse-slow pointer-events-none" />
                        )}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {candidate.isBest ? (
                              <div className="text-amber-400">
                                <Trophy className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="text-cream/40 font-black text-sm">
                                #{index + 1}
                              </div>
                            )}
                            <div className="font-semibold text-cream text-md">{candidate.name}</div>
                          </div>
                          <div className="font-black text-lg">{candidate.score}%</div>
                        </div>

                        {candidate.isBest && isActive && (
                          <div className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded mb-3">
                            Best Match
                          </div>
                        )}

                        <div className="w-full bg-dark/50 h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full ${candidate.barColor}`}
                            style={{ width: `${candidate.score}%` }}
                          />
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20">
                      <Trophy className="w-12 h-12" />
                      <span className="text-xs font-bold">No results found for this job</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card padding="lg" className="min-h-[800px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-cream/10">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-cream mb-2">{activeCandidate?.name || 'Loading...'}</h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-cream leading-none">{activeCandidate?.score}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link href={`/applicants/${activeCandidateId}`}>
                      <Button variant="primary" className="px-6 py-3 font-bold rounded-md">
                        View Details
                      </Button>
                    </Link>
                    <button
                      onClick={handleDownloadReport}
                      title="Download Analysis Report"
                      className="p-3 border border-cream/20 rounded-md cursor-pointer hover:bg-cream/10 transition-colors text-cream hidden sm:block"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Best Match Alert */}
                {activeCandidate?.isBest && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-5 mb-10 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="text-emerald-500 font-bold text-sm">
                      Best Match - Top candidate for this position
                    </span>
                  </div>
                )}

                {!activeCandidate?.isBest && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-5 mb-10 flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 text-blue-500" />
                    <span className="text-blue-500 font-bold text-sm">
                      Verified Match - Candidate meets core requirements
                    </span>
                  </div>
                )}

                {/* AI Recommendation */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-cream mb-4">
                    AI recommendation
                  </h3>
                  <p className="text-cream/80 font-medium leading-relaxed italic border-l-2 border-cream/20 pl-4 py-2">
                    {activeCandidate?.matchAnalysis || "No detailed analysis available for this candidate."}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Skills', value: `${activeCandidate?.stats?.skills ?? 0}%` },
                    { label: 'Experience', value: `${activeCandidate?.stats?.experience ?? 0}%` },
                    { label: 'Education', value: `${activeCandidate?.stats?.education ?? 0}%` },
                    { label: 'Relevance', value: `${activeCandidate?.score ?? 0}%` }
                  ].map((stat, i) => (
                    <div key={i} className="bg-cream/5 border border-cream/10 rounded-md p-6 text-center hover:bg-cream/10 transition-colors">
                      <div className="text-3xl font-black text-cream mb-1">{stat.value}</div>
                      <div className="text-xs text-cream/60 font-bold">{stat.label}</div>
                    </div>
                  ))}
                </div>

              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ScreeningResultsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-dark text-cream">Loading...</div>}>
      <ScreeningResultsContent />
    </Suspense>
  );
}
