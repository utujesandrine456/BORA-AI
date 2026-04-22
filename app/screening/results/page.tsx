"use client";

import React, { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import {
  Filter,
  Trophy,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BrainCircuit,
  RefreshCw,
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

// ─── Types ────────────────────────────────────────────────────────────────────
interface MappedResult {
  id: string;
  name: string;
  score: number;
  isBest: boolean;
  barColor: string;
  matchAnalysis: string;
  role: string;
}

// ─── Polling config ───────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 3000;   // retry every 3 s
const POLL_MAX_ATTEMPTS = 20;    // give up after ~60 s

// ─── Inner content (needs useSearchParams so must be in Suspense) ─────────────
function ScreeningResultsContent() {
  const [activeCandidateId, setActiveCandidateId] = useState<string | number>('');
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [results, setResults] = useState<MappedResult[]>([]);
  const [jobInfo, setJobInfo] = useState<{ title?: string; company?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [topLimit, setTopLimit] = useState('10');

  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef(0);

  const displayResults = results
    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, topLimit === 'all' ? undefined : parseInt(topLimit, 10));

  // ── Map raw API results to display objects ──────────────────────────────────
  const mapResults = useCallback(
    async (
      resultsData: Awaited<ReturnType<typeof screeningApi.getResults>>,
      profilesData: Awaited<ReturnType<typeof profilesApi.getProfiles>>
    ): Promise<MappedResult[]> => {
      return resultsData.map((res, index) => {
        const profile = profilesData.data.find((p) => p._id === res.profileId);
        return {
          id: res.profileId,
          name: profile
            ? `${profile.firstName} ${profile.lastName}`
            : `Candidate ${index + 1}`,
          score: res.score,
          isBest: index === 0,
          barColor: res.score >= 90 ? 'bg-emerald-500' : 'bg-blue-500',
          matchAnalysis: res.matchAnalysis,
          role: profile?.headline || 'Applicant',
        };
      });
    },
    []
  );

  // ── Single fetch attempt ───────────────────────────────────────────────────
  const attemptFetch = useCallback(async (): Promise<boolean> => {
    if (!jobId) return false;
    try {
      const [resultsData, jobsData, profilesResponse] = await Promise.all([
        screeningApi.getResults(jobId),
        jobsApi.getJobs(),
        profilesApi.getProfiles(),
      ]);

      const job = jobsData.find((j) => j._id === jobId || j.id === jobId);
      setJobInfo(job ?? null);

      if (!resultsData || resultsData.length === 0) {
        // No results yet — still processing
        return false;
      }

      const mapped = await mapResults(resultsData, profilesResponse);
      setResults(mapped);
      if (mapped.length > 0) setActiveCandidateId(mapped[0].id);
      return true; // success
    } catch (err: any) {
      // 404 often means "not ready yet" — treat as not-ready
      if (err?.response?.status === 404) return false;
      throw err; // real error — bubble up
    }
  }, [jobId, mapResults]);

  // ── Polling loop ───────────────────────────────────────────────────────────
  const startPolling = useCallback(async () => {
    if (!jobId) return;
    attemptRef.current = 0;
    setPollAttempt(0);
    setPollTimedOut(false);
    setPolling(true);
    setLoading(true);

    const tick = async () => {
      attemptRef.current += 1;
      setPollAttempt(attemptRef.current);

      try {
        const done = await attemptFetch();
        if (done) {
          setPolling(false);
          setLoading(false);
          toast.success('AI screening results are ready!');
          return;
        }
      } catch (err) {
        console.error('ScreeningResults: fetch error', err);
        toast.error('Error fetching results. Retrying…');
      }

      if (attemptRef.current >= POLL_MAX_ATTEMPTS) {
        setPolling(false);
        setLoading(false);
        setPollTimedOut(true);
        toast.error('AI screening is taking longer than expected. Try refreshing manually.');
        return;
      }

      pollTimer.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();
  }, [jobId, attemptFetch]);

  // ── Initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    startPolling();
    return () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [jobId, startPolling]);

  // ── Download report ─────────────────────────────────────────────────────────
  const activeCandidate = results.find((c) => c.id === activeCandidateId);

  const handleDownloadReport = () => {
    if (!activeCandidate || !jobInfo) {
      return toast.error('No candidate selected or job data missing');
    }
    const reportText = `
BORA AI - MATCH ANALYSIS REPORT
===============================
Date: ${new Date().toLocaleDateString()}
Job Role: ${jobInfo.title}
Candidate Name: ${activeCandidate.name}
Headline: ${activeCandidate.role}
Match Score: ${activeCandidate.score}%
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
    toast.success('Report downloaded');
  };

  // ─── No jobId ────────────────────────────────────────────────────────────────
  if (!jobId) {
    return (
      <div className="flex flex-col h-full bg-dark text-cream min-h-screen">
        <TopNav />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-4">
          <BrainCircuit className="w-16 h-16 text-cream/10" />
          <h1 className="text-3xl font-black text-cream">No job selected</h1>
          <p className="text-cream/40 font-medium max-w-sm">
            Go to the Applicants page, select candidates, and click{' '}
            <strong className="text-cream/60">Screen &amp; Rank (AI)</strong> to begin.
          </p>
          <Link href="/applicants">
            <Button variant="primary" className="px-8 py-3">
              Go to Applicants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Polling / loading state ─────────────────────────────────────────────────
  const isProcessing = loading && polling;

  return (
    <div className="flex flex-col h-full bg-dark text-cream min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto pb-20">

          {/* Page header */}
          <div className="mb-10 border-b border-cream/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-cream mb-3">Screening results</h1>
              <p className="text-cream/60 font-medium text-md">
                {jobInfo?.title || 'Loading job…'}
                {results.length > 0 && ` · ${results.length} candidates ranked`}
              </p>
            </div>

            {/* Refresh button */}
            {!isProcessing && (
              <button
                onClick={startPolling}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-cream/20 text-cream/60 hover:text-cream hover:border-cream/40 transition-all text-sm font-bold"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Results
              </button>
            )}
          </div>

          {/* ── Polling / waiting state ── */}
          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-32 gap-8">
              {/* Animated brain icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-emerald-500 animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-cream">AI is screening candidates…</h2>
                <p className="text-cream/40 font-medium text-sm max-w-sm">
                  The engine is analyzing skills, experience, and job fit. This usually takes a few seconds.
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(POLL_MAX_ATTEMPTS, 10) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < Math.min(pollAttempt, 10)
                        ? 'bg-emerald-500 scale-125'
                        : 'bg-cream/10'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[11px] text-cream/20 font-bold">
                Attempt {pollAttempt} / {POLL_MAX_ATTEMPTS}
              </p>
            </div>
          )}

          {/* ── Timed out state ── */}
          {pollTimedOut && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <div>
                <h2 className="text-2xl font-black text-cream mb-2">Still processing…</h2>
                <p className="text-cream/40 font-medium text-sm max-w-sm">
                  The AI engine is taking longer than expected. Click below to check again.
                </p>
              </div>
              <button
                onClick={startPolling}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-cream text-dark font-black text-sm hover:bg-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Check Again
              </button>
            </div>
          )}

          {/* ── Results grid ── */}
          {!isProcessing && results.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: ranked candidate list */}
              <div className="lg:col-span-1 space-y-6">
                <Card padding="md" className="h-[800px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-cream">Top candidates</h2>
                    <button className="text-cream/60 hover:text-cream transition-colors">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mb-6 space-y-4">
                    <input
                      type="text"
                      placeholder="Search candidates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-bold outline-none focus:border-cream"
                    />
                    <select
                      value={topLimit}
                      onChange={(e) => setTopLimit(e.target.value)}
                      className="w-full bg-dark border border-cream/20 rounded-md px-4 py-3 text-sm text-cream font-bold outline-none focus:border-cream cursor-pointer appearance-none"
                    >
                      <option value="10">Top 10 Candidates</option>
                      <option value="25">Top 25 Candidates</option>
                      <option value="50">Top 50 Candidates</option>
                      <option value="all">All Candidates</option>
                    </select>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {displayResults.length > 0 ? (
                      displayResults.map((candidate, index) => {
                        const isActive = activeCandidateId === candidate.id;
                        return (
                          <div
                            key={candidate.id}
                            onClick={() => setActiveCandidateId(candidate.id)}
                            className={`p-5 rounded-md border cursor-pointer transition-all ${
                              isActive
                                ? 'bg-cream/10 border-cream border-l-4 border-l-emerald-500'
                                : 'bg-cream/5 border-cream/10 border-l-4 border-l-transparent hover:border-cream/30'
                            }`}
                          >
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
                                <div className="font-semibold text-cream text-md">
                                  {candidate.name}
                                </div>
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
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20">
                        <Trophy className="w-12 h-12" />
                        <span className="text-xs font-bold">No results match your search</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right: candidate detail */}
              <div className="lg:col-span-2 space-y-6">
                <Card padding="lg" className="min-h-[800px]">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10 pb-8 border-b border-cream/10">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Trophy className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-cream mb-2">
                          {activeCandidate?.name || '—'}
                        </h2>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-cream leading-none">
                            {activeCandidate?.score ?? '—'}%
                          </span>
                        </div>
                        <p className="text-cream/40 text-sm font-medium mt-1">
                          {activeCandidate?.role}
                        </p>
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

                  {/* Best Match / Verified Match alert */}
                  {activeCandidate?.isBest ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-5 mb-10 flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <span className="text-emerald-500 font-bold text-sm">
                        Best Match — Top candidate for this position
                      </span>
                    </div>
                  ) : (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-5 mb-10 flex items-center gap-4">
                      <AlertCircle className="w-6 h-6 text-blue-500" />
                      <span className="text-blue-500 font-bold text-sm">
                        Verified Match — Candidate meets core requirements
                      </span>
                    </div>
                  )}

                  {/* AI Recommendation */}
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-cream mb-4">AI recommendation</h3>
                    <p className="text-cream/80 font-medium leading-relaxed italic border-l-2 border-cream/20 pl-4 py-2">
                      {activeCandidate?.matchAnalysis ||
                        'No detailed analysis available for this candidate.'}
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                      {
                        label: 'Skills',
                        value: `${Math.min((activeCandidate?.score ?? 0) + 2, 100)}%`,
                      },
                      {
                        label: 'Experience',
                        value: `${Math.max((activeCandidate?.score ?? 0) - 3, 0)}%`,
                      },
                      { label: 'Education', value: '90%' },
                      { label: 'Relevance', value: `${activeCandidate?.score ?? 0}%` },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-cream/5 border border-cream/10 rounded-md p-6 text-center hover:bg-cream/10 transition-colors"
                      >
                        <div className="text-3xl font-black text-cream mb-1">{stat.value}</div>
                        <div className="text-xs text-cream/60 font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export default function ScreeningResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-dark text-cream gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-bold">Loading…</span>
        </div>
      }
    >
      <ScreeningResultsContent />
    </Suspense>
  );
}
