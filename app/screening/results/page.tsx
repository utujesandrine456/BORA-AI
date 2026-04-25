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
import { reportsApi } from '@/lib/api/reports';
import toast from 'react-hot-toast';


function ScreeningResultsContent() {
  const searchParams = useSearchParams();
  const jobIdFromQuery = searchParams.get('jobId');
  const candidateIdFromQuery = searchParams.get('candidateId');
  const [jobId, setJobId] = useState<string | null>(jobIdFromQuery);
  const [activeCandidateId, setActiveCandidateId] = useState<string | number>(candidateIdFromQuery || '');

  interface MappedResult {
    id: string; screeningId: string; name: string; score: number; isBest: boolean; barColor: string; matchAnalysis: string; role: string;
    strengths: string[];
    weaknesses: string[];
  }
  const [results, setResults] = useState<MappedResult[]>([]);
  const [jobInfo, setJobInfo] = useState<{ title?: string; company?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [topLimit, setTopLimit] = useState('10');
  const [customLimit, setCustomLimit] = useState('4');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isVersionProcessing, setIsVersionProcessing] = useState(false);

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

  // If only candidateId is present (no jobId), resolve jobId from the profile
  useEffect(() => {
    const resolveJobId = async () => {
      if (!jobIdFromQuery && candidateIdFromQuery) {
        try {
          const profile = await profilesApi.getProfileById(candidateIdFromQuery);
          if (profile?.jobId) {
            setJobId(profile.jobId);
          }
        } catch (err) {
          console.error('Could not resolve jobId from candidateId:', err);
        }
      }
    };
    resolveJobId();
  }, [jobIdFromQuery, candidateIdFromQuery]);

  const fetchData = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      // Step 1: Get Job Info, Versions, and actual Profiles count concurrently
      const [job, versions, profilesRes] = await Promise.all([
        jobsApi.getJobById(jobId).catch(() => null),
        screeningApi.getResultVersions(jobId).catch(() => []),
        profilesApi.getProfiles({ jobId, limit: 1 }).catch(() => null)
      ]);

      setJobInfo(job);
      const dbCount = profilesRes?.total || 0;
      const jobCount = job?.applicantsCount || job?.applicants || 0;
      const initialTotal = Math.max(dbCount, jobCount);
      setTotalCandidates(initialTotal);

      if (!versions || versions.length === 0) {
        setIsVersionProcessing(false);
        setResults([]);
        return;
      }

      const latestVersion = versions.reduce((prev: any, curr: any) =>
        (curr.version > prev.version) ? curr : prev
      );

      const isProcessing = latestVersion.status === 'processing' || latestVersion.status === 'queued';
      setIsVersionProcessing(isProcessing);

      // Step 3: Fetch results for this specific version
      try {
        const resultsData = await screeningApi.getResults(jobId, latestVersion.version);
        const candidatesFromApi = resultsData?.rankedCandidates || resultsData?.candidates || resultsData?.data || (Array.isArray(resultsData) ? resultsData : []);

        if (candidatesFromApi && candidatesFromApi.length > 0) {
          const apiTotal = resultsData?.totalCandidates || candidatesFromApi.length || 0;
          setTotalCandidates(prev => Math.max(prev, apiTotal));

          const mappedResults = candidatesFromApi.map((candidateObj: any, index: number) => {
            const profile = typeof candidateObj.profileId === 'object' ? candidateObj.profileId : {};
            const profileId = typeof candidateObj.profileId === 'object' ? candidateObj.profileId._id : candidateObj.profileId;
            const score = candidateObj.score || 0;

            return {
              id: profileId || candidateObj._id || `temp-${index}`,
              screeningId: candidateObj._id || profileId || `temp-${index}`,
              name: profile.firstName ? `${profile.firstName} ${profile.lastName}` : (candidateObj.name || `Candidate ${index + 1}`),
              score: score,
              isBest: index === 0,
              barColor: score >= 90 ? 'bg-emerald-500' : 'bg-blue-500',
              matchAnalysis: candidateObj.recommendation || candidateObj.matchAnalysis || profile.aiRecommendation || '',
              role: profile.headline || 'Applicant',
              strengths: candidateObj.aiStrengths || profile.aiStrengths || candidateObj.strengths || [],
              weaknesses: candidateObj.aiGaps || candidateObj.aiWeaknesses || profile.aiGaps || profile.aiWeaknesses || candidateObj.weaknesses || []
            };
          });

          setResults(mappedResults);
          if (mappedResults.length > 0 && !activeCandidateId) {
            setActiveCandidateId(mappedResults[0].id);
          }
        }
      } catch (err) {
        console.warn(`Results fetch failed for version ${latestVersion.version}:`, err);
        // If the newest version has NO results yet, we might want to check the previous version
        if (versions.length > 1) {
          const previousVersion = [...versions].sort((a: any, b: any) => b.version - a.version)[1];
          const prevResults = await screeningApi.getResults(jobId, previousVersion.version).catch(() => null);
          if (prevResults && prevResults.rankedCandidates) {
            // ... show previous while new ones are still completely empty
          }
        }
      }
    } catch (error) {
      console.error('ScreeningResults fetchData error:', error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!loading && (isVersionProcessing || results.length === 0) && jobId && pollingCount < 50) {
      setIsPolling(true);
      const timer = setTimeout(() => {
        setPollingCount(prev => prev + 1);
        fetchData();
      }, 2000); // Poll faster (2s) during active analysis
      return () => clearTimeout(timer);
    } else if (results.length > 0 && !isVersionProcessing) {
      setIsPolling(false);
    } else {
      setIsPolling(false);
    }
  }, [loading, results.length, jobId, pollingCount, isVersionProcessing, fetchData]);

  const activeCandidate = results.find(c => c.id === activeCandidateId);

  const handleDownloadReport = async () => {
    const toastId = toast.loading('Generating PDF report...');

    try {
      const screeningId = activeCandidate?.screeningId || 'test-screening-id';
      const candidateName = activeCandidate?.name || 'Candidate';

      const blob = await reportsApi.downloadScreeningReport(screeningId);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BORA_Match_Report_${candidateName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Professional PDF report downloaded', { id: toastId });
    } catch (error) {
      console.error('Report download error:', error);
      toast.error('Failed to download report. Please try again.', { id: toastId });
    }
  };

  const handleRefresh = () => {
    setPollingCount(0);
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
              {jobInfo?.title || 'Senior Role'} • {results.length} of {totalCandidates} candidates screened
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
                    className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-medium outline-none focus:border-cream"
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

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative">
                  {(loading || isPolling || isVersionProcessing) && results.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md mb-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-bold text-emerald-500">
                        AI analysis in progress. Streaming available results...
                      </span>
                    </div>
                  )}

                  {loading && results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                      <div className="w-8 h-8 border-2 border-cream border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-bold">
                        {isPolling ? 'Syncing AI analysis...' : 'Fetching AI scores...'}
                      </span>
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
                    <div className="flex flex-col items-center justify-center h-full gap-8 py-20 px-4 text-center">
                      <div className="relative">
                        <Trophy className={`w-16 h-16 text-cream/10 ${isPolling ? 'animate-pulse' : ''}`} />
                        {isPolling && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <span className="text-lg font-bold text-cream block">
                          {isPolling ? 'Analysis Incoming' : 'No Results Yet'}
                        </span>
                        <p className="text-xs text-cream/40 max-w-[200px] mx-auto font-medium">
                          {isPolling
                            ? 'BORA AI is finalizing your candidate ranking. This will only take a moment.'
                            : 'Trigger a screen from the Jobs portal or try a manual sync if you suspect the analysis is ready.'}
                        </p>
                      </div>
                      {!isPolling && results.length === 0 && (
                        <button
                          onClick={handleRefresh}
                          className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-md text-xs font-bold hover:bg-emerald-500/20 transition-all mt-4"
                        >
                          Manual Sync Results
                        </button>
                      )}
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
                    {/* <button
                      onClick={handleDownloadReport}
                      title="Download Analysis Report"
                      className="p-3 border border-cream/20 rounded-md cursor-pointer hover:bg-cream/10 transition-colors text-cream hidden sm:block"
                    >
                      <Download className="w-5 h-5" />
                    </button> */}
                  </div>
                </div>

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

                <div className="mb-12">
                  <h3 className="text-xl font-bold text-cream mb-4">
                    AI recommendation
                  </h3>
                  <p className="text-cream/80 font-medium leading-relaxed italic border-l-2 border-cream/20 pl-4 py-2">
                    {activeCandidate?.matchAnalysis || "No detailed analysis available for this candidate."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-md p-6">
                    <h4 className="text-emerald-500 font-bold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Key Strengths
                    </h4>
                    {activeCandidate?.strengths && activeCandidate.strengths.length > 0 ? (
                      <ul className="space-y-3">
                        {activeCandidate.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-cream/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                            <span className="leading-relaxed font-medium">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-emerald-500/50 italic font-medium">No specific strengths listed.</p>
                    )}
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-md p-6">
                    <h4 className="text-amber-500 font-bold mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Potential Gaps
                    </h4>
                    {activeCandidate?.weaknesses && activeCandidate.weaknesses.length > 0 ? (
                      <ul className="space-y-3">
                        {activeCandidate.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-cream/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                            <span className="leading-relaxed font-medium">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-amber-500/50 italic font-medium">No particular gaps identified.</p>
                    )}
                  </div>
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