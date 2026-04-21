'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Award,
    Zap,
    Target,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { jobsApi } from '@/lib/api/jobs';
import { profilesApi } from '@/lib/api/profiles';
import { screeningApi } from '@/lib/api/screening';
import { Job, ScreeningResult } from '@/lib/api/types';
import { TalentProfile } from '@/lib/types/profile';
import { Briefcase } from 'lucide-react';

export default function CandidateDashboard() {
    const [stats, setStats] = useState([
        { label: 'Active Applications', value: '0', icon: Briefcase, color: 'text-cream' },
        { label: 'Avg Match Score', value: '0%', icon: Target, color: 'text-emerald-500' },
        { label: 'Profile Strength', value: 'Expert', icon: Award, color: 'text-amber-500' },
    ]);

    interface ActiveJob { id: string | undefined; jobId: string | undefined; role: string; company: string; status: string; score: number; date: string; insight: string; }
    const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                setLoading(true);
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return;
                const user = JSON.parse(storedUser);

                // Fetch all jobs and profiles
                const [jobs, profilesData] = await Promise.all([
                    jobsApi.getJobs(),
                    profilesApi.getProfiles()
                ]);

                // Find candidate's profiles (applications)
                const candidateProfiles = (profilesData.data || []).filter((p: TalentProfile) => p.email === user.email);

                // Map all jobs to their status for this candidate
                const jobsWithStatus = await Promise.all(jobs.map(async (job: Job) => {
                    const profile = candidateProfiles.find((p: TalentProfile) => p.jobId === job._id);
                    let score = 0;
                    let insight = '';
                    let status = 'Open to Apply';

                    if (profile) {
                        status = 'Pending';
                        try {
                            const results = await screeningApi.getResults(job._id!);
                            const myResult = results.find((r: ScreeningResult) => r.profileId === profile._id);
                            if (myResult) {
                                score = myResult.score;
                                insight = myResult.matchAnalysis;
                                status = 'Screened';
                            }
                        } catch (err) {
                            console.error('Failed to fetch results for job:', job._id, err);
                        }
                    }

                    return {
                        id: job._id,
                        jobId: job._id,
                        role: job.title || 'Unknown Role',
                        company: job.company || 'BORA Partner',
                        status: status,
                        score: score || 0,
                        date: profile?.createdAt ? `Applied ${new Date(profile.createdAt).toLocaleDateString()}` : 'Active opportunity',
                        insight: insight ? (insight.length > 100 ? insight.substring(0, 100) + '...' : insight) : 
                                 (profile ? "Screening in progress..." : "AI insights available upon application")
                    };
                }));

                setActiveJobs(jobsWithStatus);

                // Update Stats
                const screenedJobs = jobsWithStatus.filter(j => j.status === 'Screened');
                const avgScore = screenedJobs.length > 0
                    ? Math.round(screenedJobs.reduce((acc: number, curr: ActiveJob) => acc + (curr.score || 0), 0) / screenedJobs.length)
                    : 0;

                setStats([
                    { label: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'text-cream' },
                    { label: 'Avg Match Score', value: `${avgScore}%`, icon: Target, color: 'text-emerald-500' },
                    { label: 'Profile Strength', value: 'Expert', icon: Award, color: 'text-amber-500' },
                ]);

            } catch (error) {
                console.error('CandidateDashboard: Failed to load real data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateData();
    }, []);

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12"
                >
                    <div>
                        <h1 className="text-5xl font-black text-cream leading-none">
                            Personal Career Hub
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/candidate/jobs">
                            <Button variant="primary" className="gap-3 py-4 px-8 bg-cream text-dark">
                                <Search className="w-5 h-5" />
                                <span className="font-black text-sm">Browse Opportunities</span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {stats.map((stat, i) => (
                        <motion.div key={i} variants={fadeUp}>
                            <Card variant="glass" className="p-8 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <stat.icon className="w-24 h-24 -mr-8 -mt-8" />
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-cream/10 border border-cream/20 rounded-md text-cream shadow-xl">
                                        <stat.icon className="w-5 h-5" strokeWidth={1.5} />
                                    </div>
                                    <div className="text-md font-bold text-cream/40">{stat.label}</div>
                                </div>
                                <div className={`text-4xl font-black ${stat.color}`}>
                                    {loading ? <div className="h-10 w-24 bg-cream/5 animate-pulse rounded" /> : stat.value}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-12 pt-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-cream">Active job opportunities</h2>
                            <span className="text-[10px] font-black text-cream/40 italic">Live marketplace</span>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-40 w-full bg-cream/5 rounded-md animate-pulse" />)
                            ) : activeJobs.length > 0 ? (
                                activeJobs.map((job, idx) => (
                                    <motion.div key={job.id || idx} variants={fadeUp}>
                                        <Card variant="glass" className="p-8 hover:border-cream/40 transition-all group relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                                <div className="w-16 h-16 bg-cream/10 border border-cream/20 rounded-md flex items-center justify-center text-cream font-black text-xl group-hover:bg-cream group-hover:text-dark transition-all duration-500">
                                                    {job.company[0]}
                                                </div>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-black text-cream group-hover:text-white transition-colors">{job.role}</h3>
                                                        <Badge variant={job.status === 'Screened' ? 'success' : (job.status === 'Pending' ? 'secondary' : 'ghost')} className="px-3 py-1 rounded text-[9px] font-black border-cream/20">
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-[13px] text-cream/50 font-bold flex items-center gap-4">
                                                        <span className="text-cream/70 font-semibold">{job.company}</span>
                                                        <span className="opacity-40 italic serif">{job.date}</span>
                                                    </div>
                                                    {job.insight && (
                                                        <div className="pt-2 flex items-start gap-2">
                                                            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                            <p className="text-[11px] text-emerald-500/70 font-medium italic">{job.insight}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <div className="text-[10px] font-black text-cream/30">Match score</div>
                                                    <div className="text-3xl font-black text-cream">{job.score > 0 ? `${job.score}%` : '—'}</div>
                                                    {job.status === 'Screened' ? (
                                                        <Link href={`/candidate/results?jobId=${job.jobId}`}>
                                                            <button className="text-[9px] font-black text-cream/40 hover:text-cream underline underline-offset-4 transition-colors">
                                                                Analyze fit
                                                            </button>
                                                        </Link>
                                                    ) : job.status === 'Open to Apply' && (
                                                        <Link href="/candidate/jobs">
                                                            <button className="text-[9px] font-black text-cream/40 hover:text-cream underline underline-offset-4 transition-colors">
                                                                Apply now
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-cream/5 rounded-md border border-dashed border-cream/10">
                                    <Briefcase className="w-10 h-10 text-cream/10 mx-auto mb-4" />
                                    <p className="text-cream/40 font-medium">No active jobs found</p>
                                    <Link href="/candidate/jobs" className="text-cream text-xs font-bold mt-4 block hover:underline">Browse job board &rarr;</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* AI Insights & Recommendation */}
                    <motion.div variants={fadeUp} className="space-y-8">
                        <h2 className="text-2xl font-black text-cream">AI fit insights</h2>

                        <Card variant="glass" className="p-8 border-emerald-500/20 relative group">
                            <div className="absolute top-0 right-0 p-4">
                                <Sparkles className="w-12 h-12 text-emerald-500/10 group-hover:rotate-12 transition-transform duration-700" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                    <Zap className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <div className="text-xs font-black text-cream/40">Market fit</div>
                                    <div className="text-lg font-black text-cream">Top 5% Candidate</div>
                                </div>
                            </div>

                            <p className="text-sm text-cream/60 leading-relaxed font-medium mb-8">
                                Your profile is performing <span className="text-emerald-500 font-black">2.4x better</span> than peers in Backend Engineering roles. Optimize your <span className="text-cream font-black italic">Distributed Systems</span> projects to unlock higher scores.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-cream/40">Profile progress</span>
                                        <span className="text-xs font-black text-cream">88%</span>
                                    </div>
                                    <div className="h-2 w-full bg-cream/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '88%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-cream blur-[0.5px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button variant="primary" className="w-full mt-8 py-4 bg-cream text-dark group flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Refine with AI</span>
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

