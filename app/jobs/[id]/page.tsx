'use client';

import React, { use, useState } from 'react';
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

  const baseJob = JOBS_METADATA[id] || JOBS_METADATA['1'];
  const [job] = useState(() => {
    if (typeof window === 'undefined') return baseJob;
    try {
      const saved = localStorage.getItem(`job-${id}`);
      if (saved) return { ...baseJob, ...JSON.parse(saved) };
    } catch {
      // ignore parse error
    }
    return baseJob;
  });

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto pb-20">
          {/* Back button */}
          <Link href="/jobs" className="flex items-center gap-2 text-cream/60 hover:text-cream text-sm uppercase tracking-widest font-bold mb-10 transition-colors group w-fit">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Jobs</span>
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-cream/20">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-cream tracking-widest uppercase mb-4">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-cream/60 font-bold uppercase tracking-wider text-xs">
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
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Job Overview
                </h2>
                <p className="text-cream/80 leading-relaxed font-medium text-lg">
                  {job.description}
                </p>
              </Card>

              {/* Technical Requirements */}
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Technical Requirements
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-6 py-2.5 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Applicants List */}
              <Card padding="lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-cream/10 pb-6">
                  <h2 className="text-[22px] font-black text-cream uppercase tracking-widest">Applicants ({job.applicantsCount})</h2>
                  <Link href="/screening/loading">
                    <Button variant="primary" icon={Play} size="md" className="px-8">
                      Run AI Screening
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {job.applicants.map((applicant: Applicant) => (
                    <div key={applicant.name} className="p-8 border border-cream/20 bg-dark rounded-md hover:border-cream hover:bg-cream/5 transition-all group cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cream/5 rounded-md -mr-16 -mt-16 group-hover:bg-cream/10 transition-colors"></div>
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 bg-black border border-cream/30 rounded-md flex items-center justify-center text-cream group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-black text-cream uppercase tracking-widest text-xl mb-1">{applicant.name}</h3>
                            <p className="text-cream/60 font-bold text-sm uppercase tracking-wider mb-2">{applicant.skills}</p>
                            <p className="text-cream/40 font-bold text-[10px] tracking-[0.2em] uppercase">{applicant.experience}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-4xl font-black text-cream leading-none">{applicant.match}%</span>
                            <span className="text-cream/60 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Score Match</span>
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
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-10 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream"></div>
                  Quick Info
                </h2>
                <div className="space-y-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px] uppercase tracking-[0.2em]">Experience Level</label>
                    <span className="text-cream font-bold uppercase tracking-widest text-sm">{job.requirements.experience}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px] uppercase tracking-[0.2em]">Education</label>
                    <span className="text-cream font-bold uppercase tracking-widest text-sm">{job.requirements.education}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-cream/40 font-black text-[10px] uppercase tracking-[0.2em]">Location Type</label>
                    <span className="text-cream font-bold uppercase tracking-widest text-sm">{job.requirements.location}</span>
                  </div>
                </div>
              </Card>

              {/* Application Summary Card */}
              <Card padding="lg" className="border-cream bg-cream">
                <h2 className="text-[22px] font-black mb-10 text-dark uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-8 bg-dark"></div>
                  Summary
                </h2>
                <div className="space-y-8 text-dark">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-widest text-xs">Total Applicants</span>
                    <span className="font-black text-3xl">{job.summary.total}</span>
                  </div>
                  <div className="h-px bg-dark/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-widest text-xs">Screened</span>
                    <span className="font-black text-3xl">{job.summary.screened}</span>
                  </div>
                  <div className="h-px bg-dark/20" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-widest text-xs">Shortlisted</span>
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
