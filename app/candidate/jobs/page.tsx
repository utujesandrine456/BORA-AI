'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Clock,
    X,
    UploadCloud,
    CheckCircle2,
    Zap,
    BarChart3,
    Target
} from 'lucide-react';
import { uploadsApi } from '@/lib/api/uploads';
import toast from 'react-hot-toast';
import TopNav from '@/components/TopNav';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';


import { useEffect } from 'react';
import { jobsApi } from '@/lib/api/jobs';
import { Job } from '@/lib/api/types';

export default function CandidateJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', summary: '' });
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await jobsApi.getJobs();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
                toast.error('Failed to load job opportunities');
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.tags || []).some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, jobs]);
    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvFile) {
            toast.error('Please upload your CV');
            return;
        }

        const id = toast.loading('Submitting application...');
        try {
            await uploadsApi.uploadResume(cvFile);

            toast.success('Application submitted successfully!', { id });
            setIsSuccess(true);
            setTimeout(() => {
                setIsApplying(false);
                setIsSuccess(false);
                setSelectedJob(null);
                setCvFile(null);
                setFormData({ name: '', email: '', summary: '' });
            }, 3000);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to submit application';
            toast.error(message, { id });
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark min-h-screen">
            <TopNav />

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
                {/* Header */}
                <motion.div
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12"
                >
                    <div className="flex-1">
                        <h1 className="text-5xl font-black text-cream leading-none">
                            Career Discovery Hub
                        </h1>
                    </div>

                    <div className="w-full md:w-96">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-cream/30 group-focus-within:text-cream transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by tech stack or title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-dark border border-cream/10 rounded-lg focus:outline-none focus:border-cream/40 focus:ring-1 focus:ring-cream/40 transition-all text-cream text-sm placeholder:text-cream/20 font-medium"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar */}
                    <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-cream/40 mb-6 uppercase tracking-wider">Employment Type</h3>
                            <div className="space-y-3">
                                {['Full-time', 'Contract', 'Part-time'].map((type: string) => (
                                    <label key={type} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-5 h-5 border border-cream/20 rounded flex items-center justify-center group-hover:border-cream transition-colors">
                                            <div className="w-2.5 h-2.5 bg-cream scale-0 group-has-checked:scale-100 transition-transform rounded-[1px]" />
                                        </div>
                                        <input type="checkbox" className="hidden" />
                                        <span className="text-sm font-bold text-cream/60 group-hover:text-cream transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-cream/40 mb-6 uppercase tracking-wider">Location Preference</h3>
                            <div className="space-y-3">
                                {['Remote', 'Hybrid', 'On-site'].map((loc: string) => (
                                    <label key={loc} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-5 h-5 border border-cream/20 rounded flex items-center justify-center group-hover:border-cream transition-colors">
                                            <div className="w-2.5 h-2.5 bg-cream scale-0 group-has-checked:scale-100 transition-transform rounded-[1px]" />
                                        </div>
                                        <input type="checkbox" className="hidden" />
                                        <span className="text-sm font-bold text-cream/60 group-hover:text-cream transition-colors">{loc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Card variant="glass" className="p-6 bg-emerald-500/5 border-emerald-500/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-black text-emerald-500">Pro tip</span>
                            </div>
                            <p className="text-[11px] text-emerald-500/70 font-medium leading-relaxed italic">
                                AI matching considers your Skill Proficiency levels. Keep your profile updated for higher scores.
                            </p>
                        </Card>
                    </motion.div>

                    {/* Jobs List */}
                    <div className="lg:col-span-3">
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="space-y-6"
                        >
                            {filteredJobs.map((job: Job, index: number) => (
                                <motion.div key={job._id || job.id || index} variants={fadeUp}>
                                    <Card variant="glass" className="p-4 group hover:border-cream/40 transition-all duration-500 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                            <BarChart3 className="w-32 h-32 -mr-16 -mt-16" />
                                        </div>

                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 relative z-10">
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h2 className="text-xl font-bold text-cream group-hover:text-white transition-colors">{job.title}</h2>
                                                        <Badge variant="secondary" className="px-3 py-1 rounded-md text-[12px] font-semibold border-cream/10">
                                                            {job.type || 'Full-time'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-cream/40 font-bold">
                                                        <span className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" /> {job.location}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" /> {job.posted}
                                                        </span>
                                                        <span className="text-cream/70 font-black">{job.salary}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {(job.tags || []).map((tag: string, i: number) => (
                                                        <span key={`${tag}-${i}`} className="px-3 py-1 bg-cream/5 border border-cream/5 rounded-md text-[10px] font-bold text-cream/40">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 shrink-0">
                                                <div className="text-right">
                                                    <div className="text-[10px] font-black text-cream/30 mb-1">Fit score</div>
                                                    <div className="flex items-center gap-3">
                                                        {job.match >= 90 && <Target className="w-5 h-5 text-emerald-500" />}
                                                        <span className={`text-4xl font-black ${job.match >= 90 ? 'text-cream' : 'text-cream/40'}`}>{job.match}%</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    className="bg-cream text-dark py-4 px-10 text-xs font-black shadow-none group-hover:shadow-xl group-hover:shadow-cream/5"
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setIsApplying(true);
                                                    }}
                                                >
                                                    Quick Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {isApplying && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsApplying(false)}
                            className="absolute inset-0 bg-dark/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl"
                        >
                            <Card variant="glass" className="p-12 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                                <button
                                    onClick={() => setIsApplying(false)}
                                    className="absolute top-8 right-8 text-cream/40 hover:text-cream transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {isSuccess ? (
                                    <div className="py-20 flex flex-col items-center text-center space-y-6">
                                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <h2 className="text-4xl font-black text-cream">Application Sent</h2>
                                        <p className="text-cream/60 font-medium max-w-xs leading-relaxed">
                                            Your details and CV are being processed by our AI engine. We&apos;ll update your matching score shortly.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleApply} className="space-y-8">
                                        <div>
                                            <div className="text-[10px] font-black text-cream/30 uppercase tracking-[0.2em] mb-2 italic">Discovery mode</div>
                                            <h2 className="text-4xl font-black text-cream text-left leading-tight">{selectedJob?.title}</h2>
                                            <div className="text-md font-bold text-cream/40 mt-2 text-left">{selectedJob?.company || 'BORA Partner'}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black text-cream/40 uppercase tracking-widest pl-1">Full name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-dark/50 border border-cream/10 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-cream/40 transition-all font-medium"
                                                    placeholder="Sarah Chen"
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <label className="text-[10px] font-black text-cream/40 uppercase tracking-widest pl-1">Email address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-dark/50 border border-cream/10 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-cream/40 transition-all font-medium"
                                                    placeholder="sarah@bora.ai"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black text-cream/40 uppercase tracking-widest pl-1">Professional summary</label>
                                            <textarea
                                                value={formData.summary}
                                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                                rows={3}
                                                className="w-full bg-dark/50 border border-cream/10 rounded-lg px-4 py-3 text-cream focus:outline-none focus:border-cream/40 transition-all font-medium resize-none"
                                                placeholder="Briefly describe your core expertise..."
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black text-cream/40 uppercase tracking-widest pl-1">Resume / CV</label>
                                            <label className="relative group cursor-pointer block">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                                                />
                                                <div className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center transition-all ${cvFile ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-cream/10 hover:border-cream/20 bg-dark/20'}`}>
                                                    <UploadCloud className={`w-10 h-10 mb-4 ${cvFile ? 'text-emerald-500' : 'text-cream/20 group-hover:scale-110 transition-transform'}`} />
                                                    {cvFile ? (
                                                        <div className="text-center">
                                                            <div className="text-sm font-black text-cream">{cvFile.name}</div>
                                                            <div className="text-[10px] font-black text-emerald-500 uppercase mt-1">Ready to upload</div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm font-black text-cream">Click to upload CV</div>
                                                            <div className="text-[10px] font-black text-cream/30 uppercase mt-2 italic">PDF, DOCX up to 10MB</div>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        </div>

                                        <Button type="submit" variant="primary" className="w-full py-5 text-sm font-black bg-cream text-dark">
                                            Submit Application
                                        </Button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
