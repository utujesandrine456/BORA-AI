'use client';

import React from 'react';
import {
  Users,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const STATS = [
  {
    label: 'Total Applicants',
    value: '2,840',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    description: 'Updated 2 hours ago'
  },
  {
    label: 'Active Jobs',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: Briefcase,
    description: '3 ending this week'
  },
  {
    label: 'Screening Tasks',
    value: '156',
    change: '-5%',
    trend: 'down',
    icon: ClipboardCheck,
    description: '45 pending review'
  },
  {
    label: 'Conversion Rate',
    value: '18.4%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Industry avg: 12.5%'
  },
];

const RECENT_APPLICANTS = [
  { id: 1, name: 'Alexander C.', role: 'Senior Backend Engineer', score: 98, status: 'Shortlisted', date: '2h ago' },
  { id: 2, name: 'Sarah T.', role: 'Fullstack Developer', score: 94, status: 'Under Review', date: '5h ago' },
  { id: 3, name: 'Michael L.', role: 'Node.js Developer', score: 87, status: 'New', date: '1d ago' },
  { id: 4, name: 'Emily R.', role: 'Product Designer', score: 92, status: 'Interviewing', date: '1d ago' },
  { id: 5, name: 'David K.', role: 'DevOps Lead', score: 85, status: 'New', date: '2d ago' },
];

import { useEffect, useState } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { profilesApi } from '@/lib/api/profiles';

export default function DashboardPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [jobs, profilesResponse] = await Promise.all([
          jobsApi.getJobs(),
          profilesApi.getProfiles({ limit: 5 })
        ]);

        const jobsArray = Array.isArray(jobs) ? jobs : [];
        const activeJobs = jobsArray.filter((j: any) => {
          const status = String(j.status || '').toLowerCase();
          return status === 'active' || status === 'open' || status === 'published';
        }).length;
        const totalApplicants = profilesResponse.total;

        setStats([
          {
            label: 'Total Applicants',
            value: totalApplicants.toLocaleString(),
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            description: 'Database total'
          },
          {
            label: 'Active Jobs',
            value: activeJobs.toString(),
            change: '+2',
            trend: 'up',
            icon: Briefcase,
            description: 'Currently recruiting'
          },
          {
            label: 'Screening Tasks',
            value: '156', // Keep mock for specific task counts if no backend yet
            change: '-5%',
            trend: 'down',
            icon: ClipboardCheck,
            description: '45 pending review'
          },
          {
            label: 'Conversion Rate',
            value: '18.4%',
            change: '+2.1%',
            trend: 'up',
            icon: TrendingUp,
            description: 'Industry avg: 12.5%'
          },
        ]);

        setRecentApplicants(profilesResponse.data.map((p: any) => ({
          id: p._id,
          name: `${p.firstName} ${p.lastName[0]}.`,
          role: p.headline || 'Candidate',
          score: p.score || 85,
          status: p.status || 'New',
          date: 'Recently'
        })));

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
        <p className="text-cream/40 font-bold tracking-widest text-sm uppercase mt-4">Loading Workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cream/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-cream tracking-tight mb-2">Workspace Overview</h1>
            <p className="text-cream/60 font-medium text-md italic serif">Welcome back. Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-cream/40 font-bold tracking-wider mb-1">Status</div>
            <div className="text-sm font-bold text-cream flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Analysis
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 group hover:border-cream/40 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-cream/5 border border-cream/10 rounded-md text-cream group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-cream mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-cream/70 mb-2">{stat.label}</div>
                <div className="text-[11px] text-cream/40 font-medium">{stat.description}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applicants Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2">
                Recent Applicants
                <span className="px-2 py-0.5 bg-cream/10 border border-cream/20 rounded-md text-[10px] text-cream/60 font-black tracking-widest">Live</span>
              </h2>
              <Link href="/applicants" className="text-xs font-bold text-cream/40 hover:text-cream transition-colors flex items-center gap-1 group">
                View All <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="bg-dark/50 border border-cream/10 rounded-md overflow-hidden backdrop-blur-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-cream/10 text-left">
                    <th className="px-6 py-4 text-sm font-bold text-cream/40 tracking-wider">Candidate</th>
                    <th className="px-6 py-4 text-sm font-bold text-cream/40 tracking-wider">Role</th>
                    <th className="px-6 py-4 text-sm font-bold text-cream/40 tracking-wider text-center">Match</th>
                    <th className="px-6 py-4 text-sm font-bold text-cream/40 tracking-wider">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream/5">
                  {recentApplicants.map((applicant) => (
                    <tr key={applicant.id} className="group hover:bg-cream/5 transition-all cursor-pointer">
                      <td className="px-6 py-4">
                        <Link href={`/applicants/${applicant.id}`} className="font-bold text-cream hover:underline underline-offset-4 decoration-cream/30">
                          {applicant.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-cream/60">{applicant.role}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-md border text-sm font-black ${applicant.score >= 90 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                          applicant.score >= 80 ? 'bg-cream/10 border-cream/20 text-cream' :
                            'bg-amber-500/10 border-amber-500/20 text-amber-500'
                          }`}>
                          {applicant.score}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={applicant.status === 'Shortlisted' ? 'success' : 'secondary'} className="px-3 py-1 rounded-md text-[10px] font-bold">
                          {applicant.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-cream/20 hover:text-cream/60 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed / Insights */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-cream">System Insights</h2>
            <Card className="p-6 bg-linear-to-br from-cream/5 to-transparent border-cream/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-md bg-cream/10 flex items-center justify-center border border-cream/20">
                  <TrendingUp className="w-5 h-5 text-cream" />
                </div>
                <div>
                  <div className="text-sm font-bold text-cream">Hiring Velocity</div>
                  <div className="text-[11px] text-cream/40">Efficiency report</div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-end justify-between mb-1">
                  <div className="text-xs font-bold text-cream/60">Time to Hire</div>
                  <div className="text-2xl font-black text-cream">14.2d</div>
                </div>
                <div className="h-1.5 w-full bg-cream/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cream w-[65%]" />
                </div>
                <p className="text-xs text-cream/50 leading-relaxed italic">
                  You&apos;re currently <span className="text-emerald-500 font-bold">12% faster</span> than last month.
                  High-score applicants are responding 20% quicker.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-cream/10">
                <button className="cursor-pointer w-full py-3 bg-cream text-dark font-semibold text-sm rounded-md hover:bg-white transition-all shadow-xl">
                  Download Report
                </button>
              </div>
            </Card>

            <div className="bg-dark/30 border border-cream/10 rounded-md p-5 space-y-4">
              <h3 className="text-xs font-bold text-cream/40 tracking-wider">Pending tasks</h3>
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-amber-500/40 group-hover:bg-amber-500 transition-colors" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-cream/80 group-hover:text-cream transition-colors">Screening #J-00{i + 2}</div>
                    <div className="text-[10px] text-cream/40 flex items-center gap-1">
                      <Clock className="w-2 h-2" /> 4h pending
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cream/20 group-hover:text-cream/40 transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


