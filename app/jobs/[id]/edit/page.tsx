'use client';

import React, { use } from 'react';
import { MapPin, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input, { Textarea, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';

// Types for Job Data
interface JobRequirements {
  experience: string;
  education: string;
  location: string;
}

interface Job {
  title: string;
  location: string;
  postedDate: string;
  applicantsCount: number;
  description: string;
  skills: string[];
  requirements: JobRequirements;
}

// Re-using mock data
const JOBS_METADATA: Record<string, Job> = {
  '1': {
    title: 'Senior Frontend Developer',
    location: 'Remote',
    postedDate: '2026-04-05',
    applicantsCount: 45,
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using modern frameworks and best practices.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'],
    requirements: { experience: 'Senior (5+ years)', education: "Bachelor's Degree", location: 'Remote' },
  },
  '2': {
    title: 'Product Designer',
    location: 'San Francisco',
    postedDate: '2026-04-03',
    applicantsCount: 32,
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and engineers to bring features to life from ideation to launch.',
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    requirements: { experience: 'Mid-Senior (4+ years)', education: "Bachelor's in Design/HCI", location: 'San Francisco (Hybrid)' },
  },
  '3': {
    title: 'Data Scientist',
    location: 'New York',
    postedDate: '2026-04-01',
    applicantsCount: 28,
    description: 'We are seeking a Data Scientist to help us extract value from our data. You will be responsible for building machine learning models and providing actionable insights to the business.',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'TensorFlow', 'Statistics'],
    requirements: { experience: 'Mid-Level (3+ years)', education: "Master's or PhD in STEM", location: 'New York (On-site)' },
  },
  '4': {
    title: 'DevOps Engineer',
    location: 'Remote',
    postedDate: '2026-03-28',
    applicantsCount: 19,
    description: 'Help us build and scale our infrastructure. You will be responsible for automating our deployments, monitoring system health, and ensuring high availability.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
    requirements: { experience: 'Senior (6+ years)', education: "BS in Computer Science", location: 'Remote' },
  },
  '5': {
    title: 'Backend Engineer',
    location: 'Austin',
    postedDate: '2026-03-25',
    applicantsCount: 38,
    description: 'Design and implement robust server-side logic and database schemas. You will work on high-performance APIs and ensure the scalability of our backend systems.',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Microservices', 'gRPC'],
    requirements: { experience: 'Mid-Senior (5+ years)', education: "BS/MS in CS", location: 'Austin (Remote Friendly)' },
  },
  '6': {
    title: 'Mobile Developer',
    location: 'Remote',
    postedDate: '2026-03-22',
    applicantsCount: 24,
    description: 'Build premium mobile experiences for iOS and Android. You will be responsible for developing high-impact features and ensuring a smooth mobile user experience.',
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase', 'Mobile CI/CD'],
    requirements: { experience: 'Mid-Level (3+ years)', education: "BS in CS", location: 'Remote' },
  },
  '7': {
    title: 'QA Engineer',
    location: 'Boston',
    postedDate: '2026-03-18',
    applicantsCount: 15,
    description: 'Ensure the quality and reliability of our products. You will build automated test suites, perform manual testing, and work closely with developers to fix bugs.',
    skills: ['Selenium', 'Jest', 'Cypress', 'Load Testing', 'API Testing', 'Bug Reporting'],
    requirements: { experience: 'Junior-Mid (2+ years)', education: "BS in CS or similar", location: 'Boston (On-site)' },
  }
};

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // Select job data based on ID, fallback to Senior Frontend if not found
  const initialJob = JOBS_METADATA[id] || JOBS_METADATA['1'];

  const [title, setTitle] = React.useState(initialJob.title);
  const [description, setDescription] = React.useState(initialJob.description);
  const [location, setLocation] = React.useState(initialJob.location);
  const [skills, setSkills] = React.useState<string[]>(initialJob.skills);
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const router = useRouter();

  const handleSave = () => {
    const updatedJob = {
      ...initialJob,
      title,
      description,
      location,
      skills,
    };
    localStorage.setItem(`job-${id}`, JSON.stringify(updatedJob));
    toast.success('Job updated successfully!');
    router.push(`/jobs/${id}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TopNav />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto pb-20">
          <Link href={`/jobs/${id}`} className="flex items-center gap-2 text-slate-500 hover:text-[#0c2d48] font-normal mb-6 transition-colors group w-fit">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Job Details</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">Edit Job</h1>
              <p className="text-slate-500 font-normal text-lg">Update role requirements and candidate criteria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-10">
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Basic Information
                </h2>
                
                <div className="space-y-8">
                  <Input 
                    label="Job Title" 
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Developer" 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Select 
                      label="Job Type" 
                      defaultValue="full-time"
                      options={[
                        { value: 'full-time', label: 'Full-time' },
                        { value: 'contract', label: 'Contract' },
                        { value: 'freelance', label: 'Freelance' }
                      ]} 
                    />
                    <Input 
                      label="Location" 
                      value={location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                      placeholder="e.g. Remote or San Francisco" 
                      icon={MapPin} 
                    />
                  </div>

                  <Textarea 
                    label="Job Description" 
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="Describe the role, responsibilities, and team..." 
                    rows={6} 
                  />
                </div>
              </Card>

              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-[#38bdf8] rounded-full"></div>
                  Skills & Expertise
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-2">
                    <Input 
                      value={newSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSkill()}
                      placeholder="Add a required skill..." 
                      className="flex-1"
                    />
                    <Button variant="sky" onClick={addSkill} className="px-8">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map(skill => (
                      <Badge key={skill} className="px-5 py-2 flex items-center gap-2 group">
                        {skill}
                        <X 
                          className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" 
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar (Settings/Publish) */}
            <div className="space-y-10">
              <Card padding="lg" className="shadow-xl shadow-slate-200/40">
                <h2 className="text-[22px] font-black text-slate-900 mb-8">Role Criteria</h2>
                <div className="space-y-8">
                  <Select 
                    label="Experience Level" 
                    options={[
                      { value: 'entry', label: 'Entry Level (0-2 years)' },
                      { value: 'junior', label: 'Junior (2-4 years)' },
                      { value: 'mid', label: 'Mid-Level (4-7 years)' },
                      { value: 'senior', label: 'Senior (7-10 years)' },
                      { value: 'lead', label: 'Lead/Manager (10+ years)' }
                    ]} 
                  />
                  <Select 
                    label="Education" 
                    options={[
                      { value: 'high_school', label: 'High School' },
                      { value: 'associate', label: 'Associate Degree' },
                      { value: 'bachelor', label: "Bachelor's Degree" },
                      { value: 'master', label: "Master's Degree" },
                      { value: 'phd', label: 'PhD' }
                    ]} 
                  />
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <Button variant="primary" size="lg" className="w-full shadow-xl shadow-[#0c2d48]/20 h-14 text-lg" onClick={handleSave}>
                  Save Changes
                </Button>
                <Link href={`/jobs/${id}`} className="w-full">
                  <Button variant="secondary" size="lg" className="w-full h-14 text-lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
