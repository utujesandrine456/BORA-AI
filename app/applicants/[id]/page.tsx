'use client';

import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  ChevronLeft,
  Calendar,
  Building2,
  GraduationCap,
  Award,
  Zap,
  CheckCircle2,
  AlertCircle,
  Code2
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { profilesApi } from '@/lib/api/profiles';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TalentProfile } from '@/lib/types/profile';

export default function CandidateDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  interface CandidateDetail {
    id: string | undefined; name: string; role: string; location: string; email: string; phone: string; avatar: string;
    status: string; score: number; matchDescription: string; jobId: string | undefined;
    socialLinks: { linkedin?: string; github?: string; portfolio?: string };
    skills: { primary: string[]; secondary: string[] };
    experience: { role: string; company: string; period: string; description: string }[];
    education: { degree: string; school: string; year: string }[];
    projects: { name: string; description: string; technologies: string[]; link?: string; year: string }[];
    aiInsights: { strengths: string[]; weaknesses: string[]; parity: string };
    certifications: string[]; languages: { name: string; proficiency: string }[];
  }
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const p = await profilesApi.getProfileById(id);

        setCandidate({
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          role: p.headline || 'Applicant',
          location: p.location || 'Remote',
          email: p.email,
          phone: (p as any).phone || 'Not provided',
          avatar: `${p.firstName?.[0] || '?'}${p.lastName?.[0] || ''}`,
          socialLinks: {
            linkedin: p.socialLinks?.linkedin || (p.socialLinks as any)?.linkedIn,
            github: p.socialLinks?.github,
            portfolio: p.socialLinks?.portfolio
          },
          status: p.aiScore
            ? 'Screened'
            : (p.summary || (p.aiStrengths && p.aiStrengths.length > 0) ? 'Failed' : (p.availability?.status || 'New')),
          score: p.aiScore || 0,
          jobId: p.jobId,
          matchDescription: p.aiScore
            ? (p.aiRecommendation || p.summary || 'Profile analysis complete.')
            : (p.summary || (p.aiStrengths && p.aiStrengths.length > 0)
              ? 'Candidate processed but did not meet minimum criteria for scoring.'
              : 'Candidate has not been screened yet. Run AI screening to generate insights.'),
          skills: {
            primary: (p.skills || []).slice(0, 5).map(s => s.name),
            secondary: (p.skills || []).slice(5).map(s => s.name)
          },
          experience: (p.experience || []).map(exp => ({
            role: exp.role || 'Role',
            company: exp.company || 'Company',
            period: `${exp.startDate || ''} - ${exp.endDate || 'Present'}`,
            description: exp.description || ''
          })),
          education: (p.education || []).map(edu => ({
            degree: edu.degree || 'Degree',
            school: edu.institution || 'Institution',
            year: String(edu.endYear || '')
          })),
          projects: (p.projects || []).map(proj => ({
            name: proj.name || 'Project',
            description: proj.description || '',
            technologies: proj.technologies || [],
            link: proj.link,
            year: proj.endDate ? proj.endDate.split('-')[0] : '2024'
          })),
          aiInsights: p.aiScore ? {
            strengths: (p.aiStrengths && p.aiStrengths.length) ? p.aiStrengths : [
              'Strong technical foundation in ' + (p.skills || []).slice(0, 2).map((s: any) => s.name).join(', '),
              'Relevant professional background in ' + (p.experience?.[0]?.role || 'engineering'),
              'Clear career progression and focus'
            ],
            weaknesses: (p.aiGaps && p.aiGaps.length) ? p.aiGaps : [
              'Requires validation on specific architectural patterns',
              'Benefit from deeper project-specific documentation'
            ],
            parity: p.aiRecommendation || p.summary || `${p.aiScore}/100 alignment with core job requirements.`
          } : (p.summary || (p.aiStrengths && p.aiStrengths.length > 0) ? {
            strengths: p.aiStrengths || [],
            weaknesses: p.aiGaps || [],
            parity: 'Failed - Did not meet score threshold.'
          } : {
            strengths: ['Pending AI analysis'],
            weaknesses: ['Pending AI analysis'],
            parity: 'Not Screened'
          }),
          certifications: [],
          languages: p.languages || []
        });
      } catch (error) {
        console.error('Failed to load candidate details:', error);
        toast.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);


  if (loading || !candidate) {
    return (
      <div className="flex flex-col h-full bg-dark min-h-screen items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full animate-spin opacity-20"></div>
        <p className="text-cream/40 font-medium text-md">Retrieving profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen pb-20">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between no-print">
          <Link href="/applicants" className="flex items-center gap-2 text-cream/40 hover:text-cream transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back</span>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="p-8 bg-linear-to-r from-cream/5 to-transparent border-cream/20">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div id="avatar-badge" className="no-print w-24 h-24 bg-cream rounded-md flex items-center justify-center text-dark text-3xl font-black shrink-0">
              {candidate.avatar}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-4xl font-black text-cream">{candidate.name}</h1>
                  <Badge variant="success" className="rounded-md px-3 py-1 font-bold text-[10px]">
                    {candidate.status}
                  </Badge>
                </div>
                <p className="text-xl text-cream/70 font-medium italic serif">{candidate.role}</p>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-cream/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cream/40" />
                  {candidate.location}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cream/40" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cream/40" />
                  {candidate.phone}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                {candidate.socialLinks.linkedin && (
                  <a href={candidate.socialLinks.linkedin.startsWith('http') ? candidate.socialLinks.linkedin : `https://${candidate.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 border border-cream/20 rounded-md hover:bg-cream/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-cream/60" />
                  </a>
                )}
                {candidate.socialLinks.github && (
                  <a href={candidate.socialLinks.github.startsWith('http') ? candidate.socialLinks.github : `https://${candidate.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="p-2 border border-cream/20 rounded-md hover:bg-cream/10 transition-colors">
                    <Github className="w-4 h-4 text-cream/60" />
                  </a>
                )}
                {candidate.socialLinks.portfolio && (
                  <a href={candidate.socialLinks.portfolio.startsWith('http') ? candidate.socialLinks.portfolio : `https://${candidate.socialLinks.portfolio}`} target="_blank" rel="noopener noreferrer" className="p-2 border border-cream/20 rounded-md hover:bg-cream/10 transition-colors">
                    <ExternalLink className="w-4 h-4 text-cream/60" />
                  </a>
                )}
              </div>
            </div>

            <div className="w-full md:w-auto text-center md:text-right space-y-2">
              <div className="text-xs text-cream/40 font-bold">AI match score</div>
              <div className="text-7xl font-black text-cream">{candidate.score > 0 || candidate.status === 'Failed' ? `${candidate.score}%` : '—'}</div>
              <div className={`text-xs font-bold flex items-center justify-center md:justify-end gap-1 ${candidate.score > 0 ? 'text-emerald-500' : 'text-cream/40'}`}>
                <Zap className="w-3 h-3" fill="currentColor" /> {candidate.score > 0 ? 'Premium Match' : (candidate.status === 'Failed' ? 'Failed' : 'Pending Analysis')}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <Building2 className="w-5 h-5 text-cream/40" />
                Professional Experience
              </h2>
              <div className="space-y-4">
                {candidate.experience.map((exp: any, i: number) => (
                  <div key={i} className="p-6 border border-cream/10 bg-dark/30 rounded-md space-y-3 relative group">
                    <div className="absolute left-0 top-6 w-1 h-8 bg-cream/20 group-hover:bg-cream transition-all rounded-r-full" />
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-cream text-lg">{exp.role}</h3>
                        <p className="text-cream/60 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-xs font-bold text-cream/40 bg-cream/5 px-2 py-1 rounded border border-cream/10">
                        {exp.period}
                      </div>
                    </div>
                    <p className="text-sm text-cream/50 leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <GraduationCap className="w-5 h-5 text-cream/40" />
                Education
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {candidate.education.map((edu: any, i: number) => (
                  <div key={i} className="p-5 border border-cream/10 bg-dark/30 rounded-md">
                    <h3 className="font-bold text-cream text-md mb-1">{edu.degree}</h3>
                    <p className="text-sm text-cream/60">{edu.school}</p>
                    <div className="text-[10px] font-bold text-cream/30 mt-2">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <Code2 className="w-5 h-5 text-cream/40" />
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {candidate.projects.map((project: any, i: number) => (
                  <div key={i} className="flex flex-col p-5 border border-cream/10 bg-dark/30 rounded-md group hover:border-cream/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-cream text-md leading-tight group-hover:text-cream transition-colors">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cream/40 hover:text-cream transition-colors shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-cream/50 leading-relaxed font-medium mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="space-y-3 mt-auto">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string) => (
                          <span key={tech} className="text-[10px] font-bold text-cream/60 bg-cream/5 px-2 py-1 rounded border border-cream/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-cream/30 pt-3 border-t border-cream/5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {project.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-8">
            {/* Skills */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <Award className="w-5 h-5 text-cream/40" />
                Technical Skills
              </h2>
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-cream/40 mb-3">Primary skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.primary.map((s: any) => (
                      <Badge key={s} className="bg-cream text-dark font-black text-[10px] rounded-sm py-1">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-cream/40 mb-3">Secondary</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.secondary.map((s: any) => (
                      <Badge key={s} variant="secondary" className="border-cream/20 text-cream/70 font-bold text-[10px] rounded-sm py-1">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </section>

            {/* AI Analysis */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <Zap className="w-5 h-5 text-cream/40" />
                BORA AI Insights
              </h2>
              <Card className="p-6 space-y-6 border-emerald-500/20 bg-emerald-500/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Key strengths</span>
                  </div>
                  <ul className="space-y-2">
                    {candidate.aiInsights.strengths.map((s: any, i: number) => (
                      <li key={i} className="text-xs text-cream/70 flex gap-2">
                        <span className="text-emerald-500/40">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-cream/10">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">Growth areas</span>
                  </div>
                  <ul className="space-y-2">
                    {candidate.aiInsights.weaknesses.map((s: any, i: number) => (
                      <li key={i} className="text-xs text-cream/70 flex gap-2">
                        <span className="text-amber-500/40">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-dark/40 rounded border border-cream/10">
                  <div className="text-[10px] font-bold text-cream/40 mb-2">Requirement parity</div>
                  <div className="text-sm italic text-cream/80 font-medium">&quot;{candidate.aiInsights.parity}&quot;</div>
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cream flex items-center gap-2 px-1">
                <Award className="w-5 h-5 text-cream/40" />
                Credentials
              </h2>
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold text-cream/40 mb-3">Certifications</h3>
                  <div className="space-y-3">
                    {candidate.certifications && candidate.certifications.length > 0 ? (
                      candidate.certifications.map((cert: any, i: number) => (
                        <div key={i} className="flex gap-3 items-start group">
                          <div className="p-1.5 bg-cream/5 rounded-md mt-0.5 border border-cream/10 group-hover:border-cream/30 transition-colors">
                            <Zap className="w-3 h-3 text-cream/60" />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-cream leading-tight">{cert.name}</h4>
                            <p className="text-[10px] text-cream/40 font-bold mt-1">{cert.issuer} • {cert.year}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-cream/40 italic">No certifications listed</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-cream/10">
                  <h3 className="text-[10px] font-bold text-cream/40 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.languages.map((lang: any, i: number) => (
                      <Badge key={i} className="bg-cream/5 text-cream border-cream/10 py-1.5 px-3">
                        <span className="font-bold text-cream">{lang.name}</span>
                        <span className="ml-2 text-[10px] opacity-40 italic font-medium text-cream">{lang.proficiency}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div >
    </div >
  );
}
