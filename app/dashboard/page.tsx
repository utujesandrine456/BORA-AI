'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  MoreHorizontal,
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
import { downloadAsFile, jsonToCsv } from '@/lib/utils/download';
import toast from 'react-hot-toast';
import { Job } from '@/lib/api/types';
import { TalentProfile } from '@/lib/types/profile';

export default function Dashboard() {
  interface Stat { label: string; value: string; change: string; trend: string; icon: React.ElementType; color: string; }
  interface Applicant { id: string; name: string; role: string; match: number; status: string; avatar: string; }
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [jobs, profilesResponse] = await Promise.all([
          jobsApi.getJobs(),
          profilesApi.getProfiles({ limit: 5 })
        ]);

        // Calculate Stats
        const activeJobs = jobs.filter((j: Job) => j.status !== 'closed' && j.status !== 'archived').length;
        const totalApplicants = profilesResponse.total || 0;

        setStats([
          {
            label: 'Total Applicants',
            value: totalApplicants.toLocaleString(),
            change: '+5.2%',
            trend: 'up',
            icon: Users,
            color: 'text-cream'
          },
          {
            label: 'Active Jobs',
            value: activeJobs.toString(),
            change: '+1',
            trend: 'up',
            icon: Briefcase,
            color: 'text-emerald-500'
          },
          {
            label: 'Screening Tasks',
            value: (activeJobs * 3).toString(), // Mocked derivation
            change: '-2',
            trend: 'down',
            icon: ClipboardCheck,
            color: 'text-amber-500'
          }
        ]);

        // Map Recent Applicants
        const mappedApplicants = (profilesResponse.data || []).slice(0, 3).map((p: TalentProfile) => ({
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          role: p.headline || 'Applicant',
          match: p.matchScore || 85, // Fallback if not screened
          status: p.matchScore && p.matchScore >= 90 ? 'High Match' : 'In Review',
          avatar: `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}` || '?'
        }));

        setRecentApplicants(mappedApplicants);
      } catch (error) {
        console.error('Dashboard: Failed to fetch real data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownloadReport = () => {
    if (!stats || stats.length === 0) return;

    const exportData = stats.map(s => ({
      Metric: s.label,
      Value: s.value,
      Trend: s.trend,
      Change: s.change
    }));

    const csvContent = jsonToCsv(exportData);
    downloadAsFile(`workspace_summary_${new Date().toISOString().split('T')[0]}.csv`, csvContent, 'text/csv');
    toast.success('Workspace summary report downloaded');
  };

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

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        {/* Header Section */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12"
        >
          <div className="flex-1">
            <h1 className="text-5xl font-black text-cream leading-none">
              Recruitment Intelligence
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <div className="text-xs font-medium text-cream/30 mb-1">System health</div>
              <div className="flex items-center gap-2 text-emerald-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold">AI Engine Active</span>
              </div>
            </div>
            <Link href="/jobs">
              <Button variant="primary" className="py-4 px-8 bg-cream text-dark">
                Post New Job
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
          {stats.map((stat, i: number) => (
            <motion.div key={i} variants={fadeUp}>
              <Card variant="glass" className="p-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon className="w-24 h-24 -mr-8 -mt-8" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cream/10 border border-cream/20 rounded-md text-cream shadow-xl">
                    <stat.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="text-md font-bold text-cream/80">{stat.label}</div>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className={`text-4xl font-black ${stat.color}`}>
                    {loading ? (
                      <div className="w-20 h-10 bg-cream/5 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  {!loading && (
                    <div className={`flex items-center text-[10px] font-black ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tables/Lists Section */}
        <div className="grid lg:grid-cols-3 gap-12 pt-4">
          {/* Main Activity */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-cream">Recent applicants</h2>
              <Link href="/applicants" className="text-[10px] font-black text-cream/40 hover:text-cream underline underline-offset-4 transition-colors text-right">View All Candidates</Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-24 w-full bg-cream/5 rounded-md animate-pulse" />
                ))
              ) : recentApplicants.length > 0 ? (
                recentApplicants.map((app) => (
                  <Link key={app.id} href={`/applicants/${app.id}`}>
                    <Card variant="glass" className="p-6 hover:border-cream/40 transition-all group cursor-pointer relative overflow-hidden mb-4">
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-cream/10 border border-cream/20 rounded-md flex items-center justify-center text-cream font-black text-lg group-hover:bg-cream group-hover:text-dark transition-all duration-500">
                          {app.avatar}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-cream group-hover:text-white transition-colors">{app.name}</h3>
                            <Badge variant={app.match >= 90 ? 'success' : 'secondary'} className="px-2 py-0.5 rounded text-[8px] font-black border-cream/20">
                              {app.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-cream/40 font-bold">{app.role}</div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div className="text-[10px] font-black text-cream/30">Match score</div>
                          <div className="text-2xl font-black text-cream">{app.match}%</div>
                        </div>

                        <div className="pl-4">
                          <ChevronRight className="w-5 h-5 text-cream/20 group-hover:text-cream group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 bg-cream/5 rounded-md border border-dashed border-cream/10">
                  <Users className="w-10 h-10 text-cream/10 mx-auto mb-4" />
                  <p className="text-cream/40 font-medium">No recent applicants found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Side Panel: System Insights */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <h2 className="text-2xl font-black text-cream">Live insights</h2>

            <Card variant="glass" className="p-8 border-emerald-500/20 relative group">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-12 h-12 text-emerald-500/10 group-hover:rotate-12 transition-transform duration-700" />
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                  <Clock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-black text-cream/40">Average TTH</div>
                  <div className="text-lg font-black text-cream">4.2 Days</div>
                </div>
              </div>

              <p className="text-sm text-cream/60 leading-relaxed font-medium mb-8">
                Your current screening process is performing <span className="text-emerald-500 font-black">15% faster</span> than the previous month. AI shortlisting is saving an average of <span className="text-cream font-black italic">22 hours</span> per role.
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-cream/40">Matching accuracy</span>
                    <span className="text-xs font-black text-cream">94.8%</span>
                  </div>
                  <div className="h-2 w-full bg-cream/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '94.8%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-cream blur-[0.5px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-cream/10">
                <button 
                  onClick={handleDownloadReport}
                  className="w-full py-3 bg-cream text-dark font-semibold text-sm rounded-md hover:bg-white transition-all shadow-xl"
                >
                  Download Report
                </button>
              </div>
            </Card>

            <Card variant="glass" className="p-8 bg-cream/5 border-cream/10">
              <div className="flex items-center gap-3 mb-4">
                <MoreHorizontal className="w-4 h-4 text-cream/40" />
                <span className="text-sm font-semibold text-cream/40">Quick actions</span>
              </div>
              <div className="space-y-2">
                <button className="cursor-pointer w-full py-3 px-4 bg-cream/50 border border-cream/5 rounded text-left text-[12px] font-bold text-dark hover:text-dark hover:border-cream/20 transition-all">Download Applicants CSV</button>
                <button className="cursor-pointer w-full py-3 px-4 bg-cream/50 border border-cream/5 rounded text-left text-[12px] font-bold text-dark hover:text-dark hover:border-cream/20 transition-all">Invite Team Members</button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
