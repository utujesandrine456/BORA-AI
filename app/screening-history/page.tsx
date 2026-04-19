'use client';

import React, { useState } from 'react';
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

// Mock Data for Screening History
const SCREENING_HISTORY = [
    {
        id: 'SH-001',
        role: 'Senior Backend Engineer',
        date: '2026-04-18',
        candidates: 12,
        avgScore: 88,
        topMatch: 'Alexander C.',
        status: 'Completed',
        matchQuality: 'High'
    },
    {
        id: 'SH-002',
        role: 'Product Designer',
        date: '2026-04-17',
        candidates: 8,
        avgScore: 92,
        topMatch: 'Emma Davis',
        status: 'Completed',
        matchQuality: 'Exceptional'
    },
    {
        id: 'SH-003',
        role: 'Fullstack Developer',
        date: '2026-04-15',
        candidates: 45,
        avgScore: 76,
        topMatch: 'Sarah Williams',
        status: 'Completed',
        matchQuality: 'Medium'
    },
    {
        id: 'SH-004',
        role: 'DevOps Lead',
        date: '2026-04-12',
        candidates: 6,
        avgScore: 84,
        topMatch: 'Michael Chen',
        status: 'Archived',
        matchQuality: 'High'
    },
    {
        id: 'SH-005',
        role: 'Node.js Developer',
        date: '2026-04-10',
        candidates: 18,
        avgScore: 72,
        topMatch: 'David K.',
        status: 'Completed',
        matchQuality: 'Medium'
    },
    {
        id: 'SH-006',
        role: 'Frontend Architect',
        date: '2026-04-05',
        candidates: 14,
        avgScore: 95,
        topMatch: 'James Wilson',
        status: 'Completed',
        matchQuality: 'Exceptional'
    },
];

export default function ScreeningHistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen text-cream">
            <TopNav />

            <div className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-cream tracking-tighter leading-none">
                            Screening <span className="text-cream/40 italic serif">History</span>
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
                        { label: 'Total Assessments', value: '142', icon: History, trend: '+12%', sub: 'since last month' },
                        { label: 'Avg. Match Quality', value: '86%', icon: Trophy, trend: 'Stable', sub: 'overall quality' },
                        { label: 'Avg. Candidates / Role', value: '18.4', icon: CheckCircle2, trend: '+4.2', sub: 'pipeline volume' },
                        { label: 'Screening Efficiency', value: '94%', icon: BarChart3, trend: '+5%', sub: 'automation rate' },
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
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40">Reference</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40">Role Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40 text-center">Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40 text-center">Batch Size</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40 text-center">Avg. Score</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40">Top Candidate</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-cream/40">Status</th>
                                    <th className="px-6 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cream/5">
                                {SCREENING_HISTORY.map((item) => (
                                    <tr key={item.id} className="group hover:bg-cream/5 transition-all text-sm font-medium animate-in fade-in duration-500">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-xs text-cream/40 select-all">{item.id}</span>
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
                                            {new Date(item.date).toLocaleDateString()}
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
                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.status === 'Archived' ? 'bg-cream/5 text-cream/40 border-cream/5' : ''
                                                    }`}
                                            >
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href="/screening/results">
                                                <button className="p-2 text-cream/20 hover:text-cream transition-colors relative group/btn">
                                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                    <span className="absolute right-0 bottom-full mb-2 px-2 py-1 bg-dark border border-cream/20 text-[10px] whitespace-nowrap rounded font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">View Results</span>
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Mockup */}
                    <div className="px-6 py-4 border-t border-cream/10 flex items-center justify-between bg-cream/5">
                        <div className="text-[11px] text-cream/40 font-bold">
                            Showing <span className="text-cream">1-6</span> of 142 assessments
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
