'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    AreaChart,
    Area,
} from 'recharts';
import {
    TrendingUp,
    Users,
    Brain,
    Zap,
    Download,
    Calendar,
    ChevronDown,
    Info
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Types for charts
interface TooltipPayload {
    color: string;
    name: string;
    value: string | number;
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

// Mock Data
const SKILL_DISTRIBUTION = [
    { subject: 'Frontend', A: 120, fullMark: 150 },
    { subject: 'Backend', A: 98, fullMark: 150 },
    { subject: 'DevOps', A: 86, fullMark: 150 },
    { subject: 'Design', A: 110, fullMark: 150 },
    { subject: 'Testing', A: 45, fullMark: 150 },
    { subject: 'Soft Skills', A: 130, fullMark: 150 },
];

const SOURCE_DATA = [
    { name: 'LinkedIn', value: 400 },
    { name: 'Referral', value: 300 },
    { name: 'Indeed', value: 200 },
    { name: 'Direct', value: 100 },
];

const COLORS = ['#F5F5DC', '#D2B48C', '#BC8F8F', '#DEB887']; // Cream shades

const SUCCESS_RATE_DATA = [
    { month: 'Jan', candidates: 45, hired: 12 },
    { month: 'Feb', candidates: 52, hired: 15 },
    { month: 'Mar', candidates: 48, hired: 10 },
    { month: 'Apr', candidates: 70, hired: 22 },
    { month: 'May', candidates: 65, hired: 18 },
    { month: 'Jun', candidates: 85, hired: 25 },
];

const EXPERIENCE_DATA = [
    { name: 'Junior (0-2y)', value: 15 },
    { name: 'Mid (3-5y)', value: 45 },
    { name: 'Senior (5-8y)', value: 30 },
    { name: 'Lead (8y+)', value: 10 },
];

const INSIGHTS = [
    { id: 1, title: 'Backend Talent Surge', description: 'Candidates with Go/Rust experience have increased by 25% this quarter.', importance: 'High', type: 'positive' },
    { id: 2, title: 'Screening Bottleneck', description: 'Technical assessment stage is taking 3 days longer than average.', importance: 'Medium', type: 'warning' },
    { id: 3, title: 'High Referral Quality', description: 'Referrals have a 2x higher success rate compared to job boards.', importance: 'High', type: 'positive' },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark/90 border border-cream/20 p-3 rounded-md shadow-2xl backdrop-blur-md">
                <p className="text-xs font-bold text-cream mb-1">{label}</p>
                {payload.map((entry: { color: string; name: string; value: string | number }, index: number) => (
                    <p key={index} className="text-[10px] font-medium" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function InsightsPage() {
    return (
        <div className="flex flex-col h-full bg-dark min-h-screen text-cream">
            <TopNav />

            <div className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-cream tracking-tighter leading-none">
                            Candidate <span className="text-cream/40 italic serif">Insights</span>
                        </h1>
                        <p className="text-cream/60 font-medium text-lg italic serif max-w-2xl">
                            Deep dive into your talent pipeline performance and applicant demographics.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="secondary" className="bg-cream/5 border-cream/10 hover:bg-cream/10 text-cream gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last 30 Days</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                        <Button className="bg-cream text-dark hover:bg-white gap-2 font-bold px-6">
                            <Download className="w-4 h-4" />
                            Download Report
                        </Button>
                    </div>
                </div>

                {/* High Level Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Avg. Assessment Score', value: '84.2', icon: Brain, trend: '+2.4%', sub: 'vs last month' },
                        { label: 'Time to Shortlist', value: '3.5d', icon: Zap, trend: '-0.8d', sub: 'efficiency up' },
                        { label: 'Interview Conversion', value: '24%', icon: TrendingUp, trend: '+5%', sub: 'hiring velocity' },
                        { label: 'Active Candidates', value: '1,280', icon: Users, trend: '+124', sub: 'pipeline growth' },
                    ].map((metric, i) => (
                        <Card key={i} className="p-6 border-cream/10 bg-dark/40 hover:border-cream/30 transition-all group overflow-hidden relative">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="p-3 bg-cream/5 border border-cream/10 rounded-md text-cream group-hover:bg-cream transition-colors duration-500 group-hover:text-dark">
                                    <metric.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-sm border border-emerald-500/20">
                                    {metric.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl font-black text-cream mb-1">{metric.value}</div>
                                <div className="text-sm font-semibold text-cream/80">{metric.label}</div>
                                <div className="text-[10px] text-cream/30 mt-2 italic">{metric.sub}</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cream/5 rounded-full blur-2xl group-hover:bg-cream/10 transition-colors" />
                        </Card>
                    ))}
                </div>

                {/* Main Charts Grid */}
                <div className="grid lg:grid-cols-6 gap-8">
                    {/* Skill Distribution */}
                    <Card className="lg:col-span-3 p-8 border-cream/10 bg-dark/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-cream">Skill Distribution</h3>
                                <p className="text-xs text-cream/40 font-medium">Aggregated performance across core competencies</p>
                            </div>
                            <Info className="w-4 h-4 text-cream/20" />
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DISTRIBUTION}>
                                    <PolarGrid stroke="#F5F5DC20" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#F5F5DC60', fontSize: 12, fontWeight: 600 }} />
                                    <Radar
                                        name="Candidate Avg"
                                        dataKey="A"
                                        stroke="#F5F5DC"
                                        fill="#F5F5DC"
                                        fillOpacity={0.5}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Hiring Funnel Trends */}
                    <Card className="lg:col-span-3 p-8 border-cream/10 bg-dark/50">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-cream">Pipeline Success Rate</h3>
                                <p className="text-xs text-cream/40 font-medium">Candidates vs Hired over time</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-cream/20" />
                                    <span className="text-[10px] font-bold text-cream/40">Total</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-cream" />
                                    <span className="text-[10px] font-bold text-cream/40">Hired</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={SUCCESS_RATE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F5F5DC" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#F5F5DC" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5DC05" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#F5F5DC40', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#F5F5DC40', fontSize: 11, fontWeight: 700 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="candidates"
                                        name="Total"
                                        stroke="#F5F5DC20"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="hired"
                                        name="Hired"
                                        stroke="#F5F5DC"
                                        fill="url(#colorHired)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Sources and Experience */}
                    <Card className="lg:col-span-2 p-8 border-cream/10 bg-dark/50">
                        <h3 className="text-lg font-bold text-cream mb-6">Source Analytics</h3>
                        <div className="h-[200px] w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={SOURCE_DATA}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {SOURCE_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {SOURCE_DATA.map((item, i) => (
                                <div key={item.name} className="flex items-center justify-between text-[11px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="font-bold text-cream/60">{item.name}</span>
                                    </div>
                                    <span className="font-black text-cream">{(item.value / 10).toFixed(0)}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="lg:col-span-2 p-8 border-cream/10 bg-dark/50">
                        <h3 className="text-lg font-bold text-cream mb-6">Experience Level</h3>
                        <div className="h-[200px] w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={EXPERIENCE_DATA} layout="vertical" margin={{ left: -30 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#F5F5DC60', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#F5F5DC" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] text-cream/40 italic leading-relaxed">
                            The majority of our pipeline consists of <span className="text-cream font-bold">Mid-Level Engineers</span>, reflecting our current hiring focus.
                        </p>
                    </Card>

                    {/* Insights List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-bold text-cream flex items-center gap-2">
                            Deep Insights
                            <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] text-emerald-500 font-black uppercase">AI Assisted</div>
                        </h3>
                        {INSIGHTS.map((insight) => (
                            <div key={insight.id} className="p-4 border border-cream/10 rounded-md bg-cream/5 hover:bg-cream/10 transition-colors group cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${insight.type === 'positive' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className="text-xs font-bold text-cream group-hover:underline underline-offset-4">{insight.title}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-cream/10 text-[8px] border-none px-1.5 py-0">
                                        {insight.importance}
                                    </Badge>
                                </div>
                                <p className="text-[10px] text-cream/50 leading-relaxed italic">{insight.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
