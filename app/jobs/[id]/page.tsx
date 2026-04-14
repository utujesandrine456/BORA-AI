'use client';

import React, { use, useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Pencil, 
  Play, 
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

// Types for Job Data
interface Applicant {
  name: string;
  skills: string;
  experience: string;
  match: number;
}

interface JobRequirements {
  experience: string;
  education: string;
  location: string;
}

interface JobSummary {
  total: number;
  screened: number;
  shortlisted: number;
}

interface Job {
  title: string;
  location: string;
  postedDate: string;
  applicantsCount: number;
  description: string;
  skills: string[];
  requirements: JobRequirements;
  summary: JobSummary;
  applicants: Applicant[];
}

// Dynamic mock data for different jobs
const JOBS_METADATA: Record<string, Job> = {
  '1': {
    title: 'Senior Frontend Developer',
    location: 'Remote',
    postedDate: '2026-04-05',
    applicantsCount: 45,
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using modern frameworks and best practices.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'],
    requirements: { experience: 'Senior (5+ years)', education: "Bachelor's Degree", location: 'Remote' },
    summary: { total: 45, screened: 12, shortlisted: 5 },
    applicants: [
      { name: 'Alex Johnson', skills: 'React, TypeScript, Node.js', experience: '6 years experience', match: 92 },
      { name: 'Sarah Williams', skills: 'React, JavaScript, CSS', experience: '4 years experience', match: 85 },
      { name: 'Michael Chen', skills: 'Vue, TypeScript, React', experience: '7 years experience', match: 88 },
      { name: 'Emma Davis', skills: 'React, Redux, GraphQL', experience: '5 years experience', match: 90 },
    ]
  },
  '2': {
    title: 'Product Designer',
    location: 'San Francisco',
    postedDate: '2026-04-03',
    applicantsCount: 32,
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers to bring features to life from ideation to launch.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    requirements: { experience: 'Mid-Senior (4+ years)', education: "Bachelor's in Design/HCI", location: 'San Francisco (Hybrid)' },
    summary: { total: 32, screened: 8, shortlisted: 3 },
    applicants: [
      { name: 'Chloe Miller', skills: 'Figma, Adobe XD, UI Design', experience: '5 years experience', match: 95 },
      { name: 'James Wilson', skills: 'Product Thinking, Figma, UX', experience: '4 years experience', match: 87 },
      { name: 'Olivia Brown', skills: 'Research, Figma, Prototyping', experience: '6 years experience', match: 91 },
    ]
  },
  '3': {
    title: 'Data Scientist',
    location: 'New York',
    postedDate: '2026-04-01',
    applicantsCount: 28,
    description: 'We are seeking a Data Scientist to help us extract value from our data. You will be responsible for building machine learning models and providing actionable insights to the business.',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Statistics'],
    requirements: { experience: 'Mid-Level (3+ years)', education: "Master's or PhD in STEM", location: 'New York (On-site)' },
    summary: { total: 28, screened: 10, shortlisted: 4 },
    applicants: [
      { name: 'David Lee', skills: 'Python, PyTorch, SQL', experience: '4 years experience', match: 89 },
      { name: 'Sophia Garcia', skills: 'R, Statistics, Data Viz', experience: '5 years experience', match: 93 },
    ]
  },
  '4': {
    title: 'DevOps Engineer',
    location: 'Remote',
    postedDate: '2026-03-28',
    applicantsCount: 19,
    description: 'Help us build and scale our infrastructure. You will be responsible for automating our deployments, monitoring system health, and ensuring high availability.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    requirements: { experience: 'Senior (6+ years)', education: "BS in Computer Science", location: 'Remote' },
    summary: { total: 19, screened: 5, shortlisted: 2 },
    applicants: [
      { name: 'Lucas Scott', skills: 'AWS, Terraform, K8s', experience: '7 years experience', match: 94 },
      { name: 'Maya Patel', skills: 'Docker, Jenkins, Python', experience: '5 years experience', match: 86 },
    ]
  },
  '5': {
    title: 'Backend Engineer',
    location: 'Austin',
    postedDate: '2026-03-25',
    applicantsCount: 38,
    description: 'Design and implement robust server-side logic and database schemas. You will work on high-performance APIs and ensure the scalability of our backend systems.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'gRPC'],
    requirements: { experience: 'Mid-Senior (5+ years)', education: "BS/MS in CS", location: 'Austin (Remote Friendly)' },
    summary: { total: 38, screened: 15, shortlisted: 6 },
    applicants: [
      { name: 'Ethan Hunt', skills: 'Go, PostgreSQL, Redis', experience: '6 years experience', match: 91 },
      { name: 'Ava Johnson', skills: 'Node.js, Express, Mongo', experience: '4 years experience', match: 84 },
    ]
  },
  '6': {
    title: 'Mobile Developer',
    location: 'Remote',
    postedDate: '2026-03-22',
    applicantsCount: 24,
    description: 'Build premium mobile experiences for iOS and Android. You will be responsible for developing high-impact features and ensuring a smooth mobile user experience.',
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Mobile CI/CD'],
    requirements: { experience: 'Mid-Level (3+ years)', education: "BS in CS", location: 'Remote' },
    summary: { total: 24, screened: 7, shortlisted: 2 },
    applicants: [
      { name: 'Noah Reed', skills: 'React Native, TypeScript', experience: '3 years experience', match: 88 },
      { name: 'Isabella Ross', skills: 'Swift, SwiftUI, iOS', experience: '5 years experience', match: 96 },
    ]
  },
  '7': {
    title: 'QA Engineer',
    location: 'Boston',
    postedDate: '2026-03-18',
    applicantsCount: 15,
    description: 'Ensure the quality and reliability of our products. You will build automated test suites, perform manual testing, and work closely with developers to fix bugs.',
    skills: ['Selenium', 'Jest', 'Cypress', 'Load Testing', 'API Testing', 'Bug Reporting'],
    requirements: { experience: 'Junior-Mid (2+ years)', education: "BS in CS or similar", location: 'Boston (On-site)' },
    summary: { total: 15, screened: 4, shortlisted: 1 },
    applicants: [
      { name: 'William Chen', skills: 'Cypress, Jest, Automation', experience: '3 years experience', match: 85 },
    ]
  }
};

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Select job data based on ID, fallback to Senior Frontend if not found
  const baseJob = JOBS_METADATA[id] || JOBS_METADATA['1'];
  const [job, setJob] = useState(baseJob);

  useEffect(() => {
    const saved = localStorage.getItem(`job-${id}`);
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);
        setJob(prev => ({ ...prev, ...parsedSaved }));
      } catch (e) {
        // ignore parse error
      }
    }
  }, [id]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TopNav />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto pb-20">
          {/* Back button */}
          <Link href="/jobs" className="flex items-center gap-2 text-slate-500 hover:text-[#0c2d48] font-normal mb-6 transition-colors group w-fit">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Jobs</span>
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-[42px] font-black text-slate-900 tracking-tight mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 font-normal">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <span>Posted {job.postedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <span>{job.applicantsCount} applicants</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href={`/jobs/${id}/edit`}>
                <Button variant="secondary" icon={Pencil} size="lg" className="px-8">
                  Edit Job
                </Button>
              </Link>
              <Badge variant="success" className="px-10 py-4 text-sm font-black uppercase tracking-widest">
                Open
              </Badge>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Left Column (Main Info) */}
            <div className="lg:col-span-2 space-y-10">
              {/* Job Overview */}
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Job Overview
                </h2>
                <p className="text-slate-600 leading-relaxed font-normal text-lg">
                  {job.description}
                </p>
              </Card>

              {/* Technical Requirements */}
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Technical Requirements
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="primary" className="px-8 py-3 text-sm font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Applicants List */}
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <h2 className="text-[24px] font-black text-slate-900">Applicants ({job.applicantsCount})</h2>
                  <Link href="/screening/loading">
                    <Button variant="sky" icon={Play} size="lg" className="px-10">
                      Run AI Screening
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {job.applicants.map(applicant => (
                    <div key={applicant.name} className="p-8 border border-slate-100 rounded-[32px] hover:border-[#38bdf8]/30 hover:bg-[#38bdf8]/5 transition-all group cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#38bdf8]/5 rounded-full -mr-16 -mt-16 group-hover:bg-[#38bdf8]/10 transition-colors"></div>
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
                            <Users className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 text-xl mb-1 group-hover:text-[#38bdf8] transition-colors">{applicant.name}</h3>
                            <p className="text-slate-500 font-normal mb-1">{applicant.skills}</p>
                            <p className="text-slate-400 font-normal text-sm tracking-wide uppercase">{applicant.experience}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-[32px] font-black text-slate-900 leading-none">{applicant.match}%</span>
                            <span className="text-[#38bdf8] font-black text-[10px] uppercase tracking-[0.2em] mt-2">Score Match</span>
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
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-10 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Quick Info
                </h2>
                <div className="space-y-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-black text-xs uppercase tracking-widest">Experience Level</label>
                    <span className="text-slate-900 font-normal text-xl">{job.requirements.experience}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-black text-xs uppercase tracking-widest">Education</label>
                    <span className="text-slate-900 font-normal text-xl">{job.requirements.education}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-black text-xs uppercase tracking-widest">Location Type</label>
                    <span className="text-slate-900 font-normal text-xl">{job.requirements.location}</span>
                  </div>
                </div>
              </Card>

              {/* Application Summary Card */}
              <Card padding="lg" className="bg-[#0c2d48] text-white shadow-xl shadow-[#0c2d48]/20 border-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <h2 className="text-[22px] font-black mb-10 relative z-10 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Summary
                </h2>
                <div className="space-y-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal text-lg">Total Applicants</span>
                    <span className="text-white font-black text-3xl">{job.summary.total}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal text-lg">Screened</span>
                    <span className="text-white font-black text-3xl">{job.summary.screened}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-normal text-lg">Shortlisted</span>
                    <span className="text-[#38bdf8] font-black text-3xl">{job.summary.shortlisted}</span>
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
