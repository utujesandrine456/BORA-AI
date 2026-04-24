'use client';

import React, { useState, useEffect } from 'react';
import {
    History,
    Search,
    Filter,
    Users,
    ChevronDown,
    ArrowRight,
    Download,
    Calendar,
    CheckCircle2,
    Clock,
    Plus,
    Trophy,
    BarChart3
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { jobsApi } from '@/lib/api/jobs';
import { analyticsApi } from '@/lib/api/analytics';
import { screeningApi } from '@/lib/api/screening';
import { profilesApi } from '@/lib/api/profiles';
import toast from 'react-hot-toast';


export default function ScreeningHistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    interface HistoryEntry { id: string | undefined; role: string; date: string | undefined; candidates: number; avgScore: number; topMatch: string; status: string; matchQuality: string; }
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssessments: 0,
        avgMatchQuality: 0,
        avgCandidates: 0,
        efficiency: 0
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const jobs = await jobsApi.getJobs();

                if (!Array.isArray(jobs)) {
                    setHistory([]);
                    return;
                }

                // Fetch details for each job using the analytics API
                const extendedHistory = await Promise.all(jobs.map(async (job) => {
                    const jobId = job._id || job.id || '';
                    try {
                        const analytics = await analyticsApi.getJobAnalytics(jobId);

                        let topMatchName = 'No Match';
                        if (analytics.topCandidate && (analytics.topCandidate.firstName || analytics.topCandidate.lastName)) {
                            topMatchName = `${analytics.topCandidate.firstName || ''} ${analytics.topCandidate.lastName || ''}`.trim() || 'Top Candidate';
                        } else {
                            // Fallback 1: Try screening results
                            try {
                                const resultsData = await screeningApi.getResults(jobId);
                                const candidates = resultsData?.rankedCandidates || resultsData?.data || [];
                                if (candidates.length > 0) {
                                    const top = candidates[0];
                                    const profile = typeof top.profileId === 'object' ? top.profileId : top;
                                    topMatchName = (profile.firstName || profile.lastName)
                                        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
                                        : (top.name || 'Top Candidate');
                                }
                            } catch (e) {
                                console.warn(`Fallback screening fetch failed for ${jobId}:`, e);
                            }

                            // Fallback 2: Final resort - Fetch directly from profiles API
                            if (topMatchName === 'No Match') {
                                try {
                                    const profilesRes = await profilesApi.getProfiles({ jobId, limit: 10 });
                                    if (profilesRes?.data?.length > 0) {
                                        // Sort by aiScore descending just in case the API doesn't default to it
                                        const sorted = [...profilesRes.data].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
                                        const top = sorted[0];
                                        topMatchName = `${top.firstName || ''} ${top.lastName || ''}`.trim() || 'Top Candidate';
                                    }
                                } catch (e) {
                                    console.warn(`Final resort profile fetch failed for ${jobId}:`, e);
                                }
                            }
                        }

                        return {
                            id: jobId,
                            role: job.title,
                            date: job.updatedAt || job.createdAt,
                            candidates: analytics.totalCandidates || job.applicantsCount || job.applicants || 0,
                            avgScore: Math.round(analytics.averageScore || 0),
                            topMatch: topMatchName,
                            status: job.status === 'closed' ? 'Archived' : 'Completed',
                            matchQuality: (analytics.averageScore || 0) >= 80 ? 'High' : (analytics.averageScore || 0) >= 60 ? 'Medium' : 'Low'
                        };
                    } catch (error) {
                        console.warn(`Analytics failed for job ${jobId}:`, error);
                        return {
                            id: jobId,
                            role: job.title,
                            date: job.updatedAt || job.createdAt,
                            candidates: job.applicantsCount || job.applicants || 0,
                            avgScore: 0,
                            topMatch: 'No Data',
                            status: job.status === 'closed' ? 'Archived' : 'Completed',
                            matchQuality: 'Low'
                        };
                    }
                }));

                setHistory(extendedHistory);

                const totalCands = extendedHistory.reduce((acc, curr) => acc + curr.candidates, 0);
                const totalAvgScore = extendedHistory.reduce((acc, curr) => acc + curr.avgScore, 0);
                const screenedJobs = extendedHistory.filter(h => h.candidates > 0).length;
                const efficiencyRate = jobs.length > 0 ? Math.round((screenedJobs / jobs.length) * 100) : 0;

                setStats({
                    totalAssessments: jobs.length,
                    avgMatchQuality: jobs.length > 0 ? Math.round(totalAvgScore / jobs.length) : 0,
                    avgCandidates: jobs.length > 0 ? Number((totalCands / jobs.length).toFixed(1)) : 0,
                    efficiency: efficiencyRate
                });

            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : 'Failed to load history';
                console.error('ScreeningHistoryPage: Failed to fetch history:', msg);
                toast.error('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const filteredHistory = history.filter((item: HistoryEntry) =>
        item.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen text-cream">
            <TopNav />

            <div className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-cream leading-none">
                            Screening <span className="text-cream/40 italic serif">history</span>
                        </h1>
                        <p className="text-cream/60 font-medium text-lg italic serif max-w-2xl">
                            Track and review all historical assessment results and candidate matches.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/jobs">
                            <Button className="bg-cream text-dark hover:bg-white gap-2 font-bold px-6 shadow-xl">
                                <Plus className="w-4 h-4" />
                                New Screening
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Global Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Assessments', value: stats.totalAssessments.toString(), icon: History, trend: 'Total', sub: 'overall volume' },
                        { label: 'Avg. Match Quality', value: `${stats.avgMatchQuality}%`, icon: Trophy, trend: 'Avg.', sub: 'overall quality' },
                        { label: 'Avg. Candidates / Role', value: stats.avgCandidates.toString(), icon: CheckCircle2, trend: 'Avg.', sub: 'pipeline volume' },
                        { label: 'Screening Efficiency', value: `${stats.efficiency}%`, icon: BarChart3, trend: 'Rate', sub: 'automation rate' },
                    ].map((metric, i) => (
                        <Card key={i} className="p-6 border-cream/10 bg-dark/40 hover:border-cream/30 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-cream/5 border border-cream/10 rounded-md text-cream group-hover:bg-cream group-hover:text-dark transition-all duration-500">
                                    <metric.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div className="text-[10px] font-bold text-cream/40 border border-cream/10 px-2 py-0.5 rounded-full">
                                    {metric.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-cream mb-1">{metric.value}</div>
                                <div className="text-sm font-semibold text-cream/80">{metric.label}</div>
                                <div className="text-[10px] text-cream/30 mt-2 italic">{metric.sub}</div>
                            </div>
                            {/* Subtle background decoration */}
                            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <metric.icon className="w-24 h-24 rotate-12" />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-cream/5 border border-cream/10 p-4 rounded-lg backdrop-blur-sm shadow-inner">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
                        <input
                            type="text"
                            placeholder="Search by role or candidate..."
                            className="w-full bg-dark/50 border border-cream/10 rounded-md py-2.5 pl-11 pr-4 text-sm font-medium focus:border-cream/40 outline-none transition-all text-cream placeholder:text-cream/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-dark/50 border border-cream/10 rounded-md text-sm font-bold text-cream/60 cursor-pointer hover:bg-cream/10 transition-colors group">
                            <Filter className="w-4 h-4" />
                            <span>Filter Status</span>
                            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                        </div>

                        <div className="hidden md:flex flex-1 md:flex-none items-center gap-2 px-4 py-2.5 bg-dark/50 border border-cream/10 rounded-md text-sm font-bold text-cream/60 cursor-pointer hover:bg-cream/10 transition-colors group">
                            <Calendar className="w-4 h-4" />
                            <span>Sort by Date</span>
                            <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                        </div>

                        <button className="p-2.5 bg-cream/10 border border-cream/10 rounded-md hover:bg-cream/20 text-cream transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* History Table */}
                <Card className="border-cream/10 bg-dark/50 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-cream/5 border-b border-cream/10">
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40">Reference</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40">Role Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40 text-center">Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40 text-center">Batch Size</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40 text-center">Avg. Score</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40">Top Candidate</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-cream/40">Status</th>
                                    <th className="px-6 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream/5">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="animate-pulse hover:bg-cream/5 transition-all text-sm font-medium">
                                            <td className="px-6 py-5"><div className="h-4 w-16 bg-cream/5 rounded" /></td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-cream/5 border border-cream/10 shrink-0" />
                                                    <div className="h-4 w-32 bg-cream/5 rounded" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5"><div className="h-4 w-20 bg-cream/5 rounded mx-auto" /></td>
                                            <td className="px-6 py-5"><div className="h-6 w-12 bg-cream/5 rounded mx-auto" /></td>
                                            <td className="px-6 py-5"><div className="h-6 w-16 bg-cream/5 rounded mx-auto" /></td>
                                            <td className="px-6 py-5"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cream/5" /><div className="h-4 w-24 bg-cream/5 rounded" /></div></td>
                                            <td className="px-6 py-5"><div className="h-5 w-20 bg-cream/5 rounded-md" /></td>
                                            <td className="px-6 py-5 text-right"><div className="h-6 w-6 bg-cream/5 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredHistory.length > 0 ? filteredHistory.map((item) => (
                                    <tr key={item.id} className="group hover:bg-cream/5 transition-all text-sm font-medium animate-in fade-in duration-500">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-xs text-cream/40 select-all">{String(item.id).slice(-8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-cream/5 border border-cream/10 flex items-center justify-center text-cream/60 group-hover:bg-cream group-hover:text-dark transition-colors shrink-0">
                                                    <History className="w-4 h-4" strokeWidth={1.5} />
                                                </div>
                                                <span className="text-cream group-hover:font-bold transition-all">{item.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center text-cream/60 italic font-medium">
                                            {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-cream/5 border border-cream/10 rounded text-[11px] font-bold text-cream/60">
                                                <Users className="w-3 h-3" />
                                                {item.candidates}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className={`text-lg font-black ${item.avgScore >= 90 ? 'text-emerald-500' :
                                                item.avgScore >= 80 ? 'text-cream' :
                                                    'text-amber-500'
                                                }`}>
                                                {item.avgScore}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="font-bold text-cream underline decoration-cream/20 underline-offset-4 cursor-pointer hover:decoration-cream transition-all">
                                                    {item.topMatch}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge
                                                variant={item.status === 'Completed' ? 'success' : 'secondary'}
                                                className={`px-3 py-1 rounded-md text-[10px] font-black ${item.status === 'Archived' ? 'bg-cream/5 text-cream/40 border-cream/5' : ''
                                                    }`}
                                            >
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/screening/results?jobId=${item.id}`}>
                                                <button className="p-2 text-cream/20 hover:text-cream transition-colors relative group/btn">
                                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                    <span className="absolute right-0 bottom-full mb-2 px-2 py-1 bg-dark border border-cream/20 text-[10px] whitespace-nowrap rounded font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">View Results</span>
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        No screening history found.
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Mockup */}
                    <div className="px-6 py-4 border-t border-cream/10 flex items-center justify-between bg-cream/5">
                        <div className="text-[11px] text-cream/40 font-bold">
                            Showing <span className="text-cream">{filteredHistory.length > 0 ? 1 : 0}-{filteredHistory.length}</span> of {history.length} assessments
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" className="px-3 py-1.5 text-xs border-cream/10 text-cream/40 cursor-not-allowed">
                                Previous
                            </Button>
                            <Button variant="secondary" className="px-3 py-1.5 text-xs bg-cream/10 border-cream/20 text-cream hover:bg-cream/20">
                                Next
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Actionable Insights Footer */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-6 border-cream/10 bg-linear-to-br from-cream/5 to-transparent flex items-start gap-5">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 shrink-0">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-md font-bold text-cream mb-2">High Quality Month</h4>
                            <p className="text-xs text-cream/50 leading-relaxed italic">
                                Your average assessment score this month is <span className="text-emerald-500 font-bold">8% higher</span> than the long-term average. Continue using the current screening criteria.
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 border-cream/10 bg-linear-to-br from-cream/5 to-transparent flex items-start gap-5">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-md font-bold text-cream mb-2">Process Optmization</h4>
                            <p className="text-xs text-cream/50 leading-relaxed italic">
                                Recent assessments have a <span className="text-amber-500 font-bold">20% larger candidate pool</span>. Consider increasing the initial score threshold to save review time.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
