'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, MapPin } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { jobsApi } from '@/lib/api/jobs';
import toast from 'react-hot-toast';

export default function CreateJobPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'full-time',
    location: '',
    description: '',
    experienceYears: 0
  });
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
      toast.success('Skill added');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handlePublish = async (status: 'active' | 'draft' = 'active') => {
    if (!formData.title || !formData.company || !formData.description) {
      return toast.error('Title, company, and description are required');
    }

    setSaving(true);
    try {
      await jobsApi.createJob({
        title: formData.title,
        company: formData.company,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        requirements: skills,
        skills: skills,
        experienceYears: Number(formData.experienceYears) || 0,
        status: status
      });
      toast.success(`Job ${status === 'active' ? 'published' : 'saved as draft'} successfully`);
      router.push('/jobs');
    } catch (error: any) {
      toast.error('Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-cream/20 pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-cream mb-4">Create Job</h1>
              <p className="text-cream/60 font-medium text-md">Define role requirements and candidate criteria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-10">
              <Card padding="lg">
                <h2 className="text-[24px] font-black text-cream uppercase mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Basic Information
                </h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Job Title" 
                      placeholder="E.g. Senior Frontend Developer" 
                      value={formData.title}
                      onChange={(e: any) => setFormData({...formData, title: e.target.value})}
                    />
                    <Input 
                      label="Company Name" 
                      placeholder="E.g. TechCorp Inc." 
                      value={formData.company}
                      onChange={(e: any) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Select
                      label="Job Type"
                      value={formData.type}
                      onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                      options={[
                        { value: 'full-time', label: 'Full-time' },
                        { value: 'contract', label: 'Contract' },
                        { value: 'freelance', label: 'Freelance' }
                      ]}
                    />
                    <Input 
                      label="Location" 
                      placeholder="E.g. Remote" 
                      icon={MapPin} 
                      value={formData.location}
                      onChange={(e: any) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <Textarea 
                    label="Job Description" 
                    placeholder="Describe the role..." 
                    rows={6} 
                    className='text-md font-medium'
                    value={formData.description}
                    onChange={(e: any) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-[24px] font-black text-cream uppercase mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Skills & Expertise
                </h2>
                <div className="space-y-8">
                  <div className="flex items-end gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSkill()}
                      placeholder="Add Required Skills..."
                      className="flex-1"
                    />
                    <Button variant="secondary" size="md" onClick={addSkill} className="px-8">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="px-5 py-2 flex items-center gap-2 group">
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
              <Card padding="lg">
                <h2 className="text-[24px] font-black text-cream uppercase mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream"></div>
                  Role Criteria
                </h2>
                <div className="space-y-8">
                  <Select
                    label="Experience Level"
                    value={String(formData.experienceYears)}
                    onChange={(e: any) => setFormData({...formData, experienceYears: Number(e.target.value)})}
                    options={[
                      { value: '0', label: 'ENTRY LEVEL (0-2 YRS)' },
                      { value: '2', label: 'JUNIOR (2-4 YRS)' },
                      { value: '4', label: 'MID-LEVEL (4-7 YRS)' },
                      { value: '7', label: 'SENIOR (7-10 YRS)' },
                      { value: '10', label: 'LEAD (10+ YRS)' }
                    ]}
                  />
                  <Select
                    label="Education"
                    options={[
                      { value: 'bachelor', label: "BACHELOR'S DEGREE" },
                      { value: 'master', label: "MASTER'S DEGREE" },
                      { value: 'phd', label: 'PHD' }
                    ]}
                  />
                </div>
              </Card>

              <div className="flex flex-col gap-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  disabled={saving}
                  className="w-full h-14 text-md border border-cream disabled:opacity-50" 
                  onClick={() => handlePublish('active')}
                >
                  {saving ? 'Publishing...' : 'Publish Job'}
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  disabled={saving}
                  className="w-full h-14 text-md disabled:opacity-50" 
                  onClick={() => handlePublish('draft')}
                >
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
