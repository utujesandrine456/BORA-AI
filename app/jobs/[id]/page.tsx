'use client';

import React from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Pencil,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { jobsApi } from '@/lib/api/jobs';
import { profilesApi } from '@/lib/api/profiles';
import { Job as ApiJob } from '@/lib/api/types';
import { TalentProfile } from '@/lib/types/profile';


interface EnrichedJob extends Omit<ApiJob, 'requirements' | 'applicants'> {
  postedDate: string;
  applicantsCount: number;
  requirements: { experience: string; education: string; location: string };
  summary: { total: number; screened: number; shortlisted: number };
  applicants: { name: string; skills: string; experience: string; match: number }[];
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<EnrichedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [screening, setScreening] = useState(false);


  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const [data, profilesRes] = await Promise.all([
          jobsApi.getJobById(id),
          profilesApi.getProfiles({ jobId: id, limit: 100 })
        ]);

        const applicants = profilesRes.data.map((p: TalentProfile) => ({
          name: `${p.firstName} ${p.lastName}`,
          skills: p.headline || 'Candidate',
          experience: p.experience?.[0]?.role || 'Professional',
          match: p.aiScore || 0
        }));

        const screened = applicants.filter(a => a.match > 0).length;
        const shortlisted = applicants.filter(a => a.match >= 85).length;

        const enrichedJob = {
          ...data,
          postedDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recently',
          applicantsCount: profilesRes.total || applicants.length,
          requirements: {
            experience: data.experienceLevel || 'Mid-Senior',
            education: data.education || "Bachelor's Degree",
            location: data.location || 'Remote'
          },
          summary: {
            total: profilesRes.total || applicants.length,
            screened,
            shortlisted
          },
          applicants,
          skills: data.skills || data.requirements || []
        };
        setJob(enrichedJob);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id]);


  if (loading) {
    return (
      <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
        <p className="text-cream/40 font-bold text-sm mt-4">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center">
        <p className="text-cream/40 font-bold">Job not found</p>
        <Link href="/jobs" className="text-cream mt-4 underline">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto pb-20">
          {/* Back button */}
          <Link href="/jobs" className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm font-bold mb-10 transition-colors group w-fit">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to jobs</span>
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-cream/20">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-cream mb-4">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-cream/60 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1 border border-cream/20 rounded-md bg-cream/5">
                    <MapPin className="w-4 h-4 text-cream" />
                  </div>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 border border-cream/20 rounded-md bg-cream/5">
                    <Calendar className="w-4 h-4 text-cream" />
                  </div>
                  <span>Posted {job.postedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 border border-cream/20 rounded-md bg-cream/5">
                    <Users className="w-4 h-4 text-cream" />
                  </div>
                  <span>{job.applicantsCount} applicants</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href={`/jobs/${id}/edit`}>
                <Button variant="secondary" icon={Pencil} size="md" className="px-6 py-3">
                  Edit Job
                </Button>
              </Link>
              <Badge variant="success" className="px-10 py-4 text-sm font-black">
                Open
              </Badge>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Job Overview */}
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Job overview
                </h2>
                <p className="text-cream/80 leading-relaxed font-medium text-lg">
                  {job.description}
                </p>
              </Card>

              {/* Technical Requirements */}
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Technical requirements
                </h2>
                <div className="flex flex-wrap gap-3">
                  {(job.skills || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-6 py-2.5 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-cream/10 pb-6">
                  <h2 className="text-[22px] font-black text-cream">Applicants ({job.applicantsCount})</h2>
                  {job.status === 'closed' ? (
                    <div className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 font-bold text-center">
                      This position is currently closed
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Link href={`/apply/${job._id}`} className="flex-1">
                        <Button className="w-full h-14 bg-cream text-dark hover:bg-white font-black text-lg rounded-md transition-all shadow-xl shadow-cream/10">
                          Apply for this Position
                        </Button>
                      </Link>
                      <Button
                        variant="secondary"
                        onClick={() => setScreening(true)}
                        disabled={screening}
                        className="h-14 px-8 border-cream/20 text-cream hover:bg-cream/5 font-bold"
                      >
                        {screening ? 'Processing...' : 'Run AI Screening'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {job.applicants.map((applicant) => (
                    <div key={applicant.name} className="p-8 border border-cream/20 bg-dark rounded-md hover:border-cream hover:bg-cream/5 transition-all group cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cream/5 rounded-md -mr-16 -mt-16 group-hover:bg-cream/10 transition-colors"></div>
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 bg-black border border-cream/30 rounded-md flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-black text-cream text-xl mb-1">{applicant.name}</h3>
                            <p className="text-cream/60 font-bold text-sm mb-2">{applicant.skills}</p>
                            <p className="text-cream/40 font-bold text-[10px]">{applicant.experience}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-4xl font-black text-cream leading-none">{applicant.match > 0 ? `${applicant.match}%` : '—'}</span>
                            <span className="text-cream/60 font-black text-[10px] mt-2">{applicant.match > 0 ? 'Score match' : 'Not screened'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="space-y-10">
              {/* Quick Info Card */}
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream mb-10 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream"></div>
                  Quick info
                </h2>
                <div className="space-y-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px]">Experience Level</label>
                    <span className="text-cream font-bold text-sm">{job.requirements.experience}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px]">Education</label>
                    <span className="text-cream font-bold text-sm">{job.requirements.education}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px]">Location Type</label>
                    <span className="text-cream font-bold text-sm">{job.requirements.location}</span>
                  </div>
                </div>
              </Card>

              {/* Application Summary Card */}
              <Card padding="lg" className="border-cream bg-cream">
                <h2 className="text-[22px] font-black mb-10 text-dark flex items-center gap-3">
                  <div className="w-2 h-8 bg-dark"></div>
                  Summary
                </h2>
                <div className="space-y-8 text-dark">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Total applicants</span>
                    <span className="font-black text-3xl">{job.summary.total}</span>
                  </div>
                  <div className="h-px bg-dark/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Screened</span>
                    <span className="font-black text-3xl">{job.summary.screened}</span>
                  </div>
                  <div className="h-px bg-dark/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Shortlisted</span>
                    <span className="font-black text-3xl relative">
                      {job.summary.shortlisted}
                      <span className="absolute -top-1 -right-4 w-2 h-2 bg-black rounded-full animate-pulse"></span>
                    </span>
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
