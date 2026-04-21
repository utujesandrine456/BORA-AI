'use client';

import React, { Suspense } from 'react';
import {
    TrendingUp,
    Zap,
    CheckCircle2,
    ArrowLeft,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { jobsApi } from '@/lib/api/jobs';
import { screeningApi } from '@/lib/api/screening';
import { profilesApi } from '@/lib/api/profiles';
import { ScreeningResult } from '@/lib/api/types';
import { TalentProfile } from '@/lib/types/profile';

function CandidateResultsContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');
    const [loading, setLoading] = useState(true);
    interface JobAnalysis { role: string; company: string; matchScore: number; lastScreened: string; recommendation: string; strengths: string[]; gaps: string[]; aiReasoning: string; }
    const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!jobId) return;
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const user = JSON.parse(storedUser);

                const [job, profilesRaw, results] = await Promise.all([
                    jobsApi.getJobById(jobId),
                    profilesApi.getProfiles(),
                    screeningApi.getResults(jobId)
                ]);
                const profiles = profilesRaw.data || [];

                const profile = profiles.find((p: TalentProfile) => p.email === user.email);
                if (!profile) {
                    console.error('No profile found for current user');
                    return;
                }

                const myResult = results.find((r: ScreeningResult) => r.profileId === profile._id);

                if (myResult) {
                    setAnalysis({
                        role: job.title,
                        company: job.company || 'BORA Partner',
                        matchScore: myResult.score,
                        lastScreened: new Date(myResult.createdAt).toLocaleDateString(),
                        recommendation: myResult.score >= 90 ? 'Strong Fit' : (myResult.score >= 70 ? 'Good Fit' : 'Requires Review'),
                        strengths: [
                            "Strong alignment with " + job.title + " requirements",
                            "Solid technical foundation in core technologies"
                        ],
                        gaps: [
                            "Deeper project documentation could benefit evaluation",
                            "Specific architectural patterns require further validation"
                        ],
                        aiReasoning: myResult.matchAnalysis || "Based on your profile and the job description, BORA AI identifies a high correlation with the technical requirements."
                    });
                }
            } catch (error) {
                console.error('CandidateResults: Failed to fetch results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [jobId]);

    if (loading || !analysis) {
        return (
            <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
                <p className="text-cream/40 font-bold text-sm">Analyzing fit...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                {/* Header Actions */}
                <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex items-center gap-4">
                    <Link href="/candidate/dashboard">
                        <button className="flex items-center gap-2 text-xs font-black text-cream/40 hover:text-cream transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to workspace
                        </button>
                    </Link>
                </motion.div>

                {/* Hero Analysis Header */}
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col md:flex-row md:items-end justify-between gap-12"
                >
                    <div className="flex-1 space-y-6">
                        <h1 className="text-5xl font-black text-cream leading-none">
                            Match Intelligence Hub
                        </h1>
                        <div className="flex items-center gap-6 pt-2">
                            <div>
                                <div className="text-[10px] font-black text-cream/30 mb-1 uppercase tracking-widest">Target role</div>
                                <div className="text-xl font-bold text-cream underline decoration-cream/20 underline-offset-8">{analysis.role}</div>
                            </div>
                            <div className="w-px h-10 bg-cream/10" />
                            <div>
                                <div className="text-[10px] font-black text-cream/30 mb-1 uppercase tracking-widest">Partner company</div>
                                <div className="text-xl font-bold text-cream/60">{analysis.company}</div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0">
                        <Card variant="glass" className="p-10 bg-linear-to-br from-cream/10 to-transparent border-cream/20 flex flex-col items-center">
                            <div className="text-[10px] font-black text-cream/30 mb-4">Final score</div>
                            <div className="relative">
                                {/* SVG Circular Progress Shadow */}
                                <svg className="w-40 h-40 transform -rotate-90">
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-cream/5"
                                    />
                                    <motion.circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={440}
                                        initial={{ strokeDashoffset: 440 }}
                                        animate={{ strokeDashoffset: 440 - (440 * (analysis.matchScore || 0)) / 100 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="text-cream"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black text-cream">{analysis.matchScore}</span>
                                    <span className="text-[10px] font-black text-cream/40 lowercase italic">points</span>
                                </div>
                            </div>
                            <div className="mt-8 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-500 text-[10px] font-black">
                                {analysis.recommendation}
                            </div>
                        </Card>
                    </div>
                </motion.div>

                {/* Analysis Breakdown */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid lg:grid-cols-2 gap-12 pt-12"
                >
                    {/* Why you're a fit */}
                    <motion.div variants={fadeUp} className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                                <Zap className="w-4 h-4 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-black text-cream">Competitive strengths</h2>
                        </div>

                        <div className="space-y-4">
                            {analysis.strengths.map((strength: string, i: number) => (
                                <Card key={i} variant="glass" className="p-6 border-emerald-500/10 group hover:border-emerald-500/30">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-cream/70 leading-relaxed group-hover:text-cream transition-colors">{strength}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Growth Opportunities */}
                    <motion.div variants={fadeUp} className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cream/10 rounded border border-cream/20">
                                <TrendingUp className="w-4 h-4 text-cream" />
                            </div>
                            <h2 className="text-2xl font-black text-cream">Growth opportunities</h2>
                        </div>

                        <div className="space-y-4">
                            {analysis.gaps.map((gap: string, i: number) => (
                                <Card key={i} variant="glass" className="p-6 border-cream/10 group hover:border-cream/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-5 h-5 rounded-full border border-cream/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-cream transition-colors">
                                            <div className="w-1.5 h-1.5 bg-cream rounded-full" />
                                        </div>
                                        <p className="text-sm font-medium text-cream/70 leading-relaxed group-hover:text-cream transition-colors">{gap}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* AI Narrative Reasoning */}
                        <div className="pt-8">
                            <Card variant="glass" className="p-10 bg-linear-to-br from-cream/5 to-transparent relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <MessageSquare className="w-12 h-12 text-cream/10 -rotate-12" />
                                </div>
                                <h3 className="text-xs font-black text-cream/40 mb-6">AI evaluation summary</h3>
                                <p className="text-lg font-medium text-cream/80 leading-relaxed font-serif italic">
                                    &quot;{analysis.aiReasoning || ""}&quot;
                                </p>
                            </Card>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function CandidateResults() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-dark text-cream">Loading...</div>}>
            <CandidateResultsContent />
        </Suspense>
    );
}

