'use client';

import React from 'react';
import { Plus, X, MapPin } from 'lucide-react';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Input, { Textarea, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function CreateJobPage() {
  const [skills, setSkills] = React.useState<string[]>(['React', 'TypeScript', 'Tailwind CSS']);
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

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <TopNav />
      
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-[40px] font-black text-slate-900 tracking-tight mb-2">Create New Job</h1>
              <p className="text-slate-500 font-normal text-lg">Define role requirements and candidate criteria</p>
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
                  <Input label="Job Title" placeholder="e.g. Senior Frontend Developer" />
                  
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
                    <Input label="Location" placeholder="e.g. Remote or San Francisco" icon={MapPin} />
                  </div>

                  <Textarea label="Job Description" placeholder="Describe the role, responsibilities, and team..." rows={6} />
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
                <Button variant="primary" size="lg" className="w-full shadow-xl shadow-[#0c2d48]/20 h-14 text-lg" onClick={() => toast.success('Job published successfully')}>
                  Publish Job
                </Button>
                <Button variant="secondary" size="lg" className="w-full h-14 text-lg" onClick={() => toast.success('Draft saved successfully')}>
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
