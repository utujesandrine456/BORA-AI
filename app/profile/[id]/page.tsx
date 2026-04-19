'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Mail,
    Globe,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    Code2,
    Link as LinkIcon,
    Sparkles,
    Zap,
    Clock
} from 'lucide-react';
import { FaLinkedin as Linkedin, FaGithub as Github } from 'react-icons/fa6';

import { mockProfile } from '@/lib/mockProfile';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { TalentProfile, WorkExperience, Project, Skill, Language, Education, Certification } from '@/lib/types/profile';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function ProfilePage() {
    const profile: TalentProfile = mockProfile as TalentProfile;

    return (
        <div className="min-h-screen bg-dark text-cream p-8 lg:p-12 overflow-y-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-12">
                <motion.section
                    {...fadeInUp}
                    className="relative rounded-3xl overflow-hidden border border-cream/10 bg-linear-to-br from-cream/5 to-transparent p-8 lg:p-12"
                >
                    <div className="absolute top-0 right-0 p-8">
                        <Badge className={`px-4 py-2 ${profile.availability.status === 'Available' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            profile.availability.status === 'Open to Opportunities' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}>
                            {profile.availability.status}
                        </Badge>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        <div className="w-32 h-32 rounded-2xl bg-cream/10 border-2 border-cream/20 flex items-center justify-center text-4xl font-bold text-cream shrink-0">
                            {profile.firstName[0]}{profile.lastName[0]}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black tracking-tight">{profile.firstName} {profile.lastName}</h1>
                                <p className="text-md lg:text-lg text-cream/70 font-medium mt-2">{profile.headline}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-cream/60">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{profile.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-cream/80">
                                    <Clock className="w-4 h-4" />
                                    <span>{profile.availability.type}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                {profile.socialLinks?.linkedin && (
                                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                )}
                                {profile.socialLinks?.github && (
                                    <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-colors">
                                        <Github className="w-5 h-5" />
                                    </a>
                                )}
                                {profile.socialLinks?.portfolio && (
                                    <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {profile.bio && (
                        <div className="mt-8 pt-8 border-t border-cream/10">
                            <p className="text-lg leading-relaxed text-cream/80 max-w-4xl">
                                {profile.bio}
                            </p>
                        </div>
                    )}
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Experience Section */}
                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cream/10">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase tracking-wider">Work Experience</h2>
                            </div>

                            <div className="space-y-6">
                                {profile.experience.map((exp: WorkExperience, index: number) => (
                                    <motion.div key={index} variants={fadeInUp} className="relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-cream/10">
                                        <div className="absolute left-0 top-2 w-[24px] h-[24px] rounded-full border-2 border-cream/20 bg-dark flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-cream" />
                                        </div>
                                        <Card className="p-6 bg-cream/5 border-cream/10 hover:border-cream/30 transition-all group">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold group-hover:text-cream transition-colors">{exp.role}</h3>
                                                    <p className="text-cream/60 font-semibold">{exp.company}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-cream/40 bg-cream/5 px-3 py-1 rounded-full">
                                                    <Calendar className="w-3 h-3" />
                                                    {exp.startDate} — {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-cream/70 mb-4 leading-relaxed">{exp.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.technologies.map((tech: string) => (
                                                    <span key={tech} className="text-xs font-bold tracking-wider py-1 px-2 rounded bg-cream/10 text-cream/60 border border-cream/10">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Projects Section */}
                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cream/10">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold uppercase tracking-wider">Featured Projects</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {profile.projects.map((project: Project, index: number) => (
                                    <motion.div key={index} variants={fadeInUp}>
                                        <Card className="h-full p-6 bg-cream/5 border-cream/10 hover:border-cream/30 hover:translate-y-[-4px] transition-all flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-black tracking-tight">{project.name}</h3>
                                                {project.link && (
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cream/40 hover:text-cream transition-colors">
                                                        <LinkIcon className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-sm text-cream/70 mb-6 grow leading-relaxed italic border-l-2 border-cream/20 pl-4">
                                                {project.description}
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech: string) => (
                                                        <span key={tech} className="text-[10px] font-black uppercase tracking-widest py-1 px-2 rounded bg-cream/5 border border-cream/10">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-cream/40 font-black tracking-widest pt-2 border-t border-cream/5">
                                                    <Calendar className="w-3 h-3" />
                                                    {project.startDate} - {project.endDate}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-12">

                        {/* Skills & Proficiency */}
                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 border-b border-cream/10 pb-4">
                                <h2 className="text-xl font-bold uppercase tracking-widest">Expertise</h2>
                                <Sparkles className="w-4 h-4 text-cream/40" />
                            </div>

                            <div className="space-y-4">
                                {profile.skills.map((skill: Skill, index: number) => (
                                    <motion.div key={index} variants={fadeInUp} className="group">
                                        <div className="flex justify-between mb-1 items-end">
                                            <span className="font-bold text-sm tracking-wide group-hover:text-cream transition-colors">{skill.name}</span>
                                            <span className="text-[10px] text-cream/40 font-black tracking-widest">{skill.level} • {skill.yearsOfExperience}Y</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-cream/5 rounded-full overflow-hidden border border-cream/10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: skill.level === 'Expert' ? '95%' :
                                                        skill.level === 'Advanced' ? '80%' :
                                                            skill.level === 'Intermediate' ? '60%' : '40%'
                                                }}
                                                transition={{ duration: 1, delay: 0.2 }}
                                                className="h-full bg-cream rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Languages */}
                        {profile.languages && (
                            <motion.section
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="space-y-4"
                            >
                                <h2 className="text-lg font-bold uppercase tracking-widest border-b border-cream/10 pb-2">Languages</h2>
                                <div className="flex flex-wrap gap-3">
                                    {profile.languages.map((lang: Language, index: number) => (
                                        <motion.div key={index} variants={fadeInUp}>
                                            <Badge className="bg-cream/5 text-cream border-cream/20 hover:border-cream/40 transition-colors py-1.5 px-3">
                                                <span className="font-bold">{lang.name}</span>
                                                <span className="ml-2 text-[10px] opacity-40 italic">{lang.proficiency}</span>
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Education Section */}
                        <motion.section
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 border-b border-cream/10 pb-4">
                                <h2 className="text-lg font-bold uppercase tracking-widest">Education</h2>
                                <GraduationCap className="w-4 h-4 text-cream/40" />
                            </div>

                            <div className="space-y-6">
                                {profile.education.map((edu: Education, index: number) => (
                                    <motion.div key={index} variants={fadeInUp} className="space-y-1">
                                        <h3 className="font-bold text-cream underline decoration-cream/20 underline-offset-4">{edu.institution}</h3>
                                        <p className="text-sm font-medium text-cream/70">{edu.degree} in {edu.fieldOfStudy}</p>
                                        <p className="text-[10px] text-cream/40 font-black tracking-widest">{edu.startYear} — {edu.endYear}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Certifications */}
                        {profile.certifications && (
                            <motion.section
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 border-b border-cream/10 pb-4">
                                    <h2 className="text-lg font-bold uppercase tracking-widest">Certifications</h2>
                                    <Award className="w-4 h-4 text-cream/40" />
                                </div>

                                <div className="space-y-4">
                                    {profile.certifications.map((cert: Certification, index: number) => (
                                        <motion.div key={index} variants={fadeInUp} className="flex gap-3 items-start p-3 rounded-lg bg-cream/5 border border-cream/10 group hover:bg-cream/10 transition-colors">
                                            <div className="p-1.5 bg-cream/10 rounded-md mt-0.5 group-hover:scale-110 transition-transform">
                                                <Zap className="w-3 h-3 text-cream/60" />
                                            </div>
                                            <div>
                                                <h3 className="text-[13px] font-bold leading-tight">{cert.name}</h3>
                                                <p className="text-[10px] text-cream/40 tracking-widest font-black mt-1">{cert.issuer} • {cert.issueDate}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
