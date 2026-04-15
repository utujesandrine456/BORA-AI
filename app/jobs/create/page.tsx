'use client';

import React from 'react';
import { X, MapPin } from 'lucide-react';
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
      toast.success('Skill added');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-dark text-cream">
      <TopNav />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-cream/20 pb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-cream uppercase tracking-widest mb-4">Create Job</h1>
              <p className="text-cream/60 font-bold uppercase tracking-widest text-sm">Define role requirements and candidate criteria</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-10">
              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Basic Information
                </h2>

                <div className="space-y-8">
                  <Input label="Job Title" placeholder="E.G. SENIOR FRONTEND DEVELOPER" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Select
                      label="Job Type"
                      defaultValue="full-time"
                      options={[
                        { value: 'full-time', label: 'FULL-TIME' },
                        { value: 'contract', label: 'CONTRACT' },
                        { value: 'freelance', label: 'FREELANCE' }
                      ]}
                    />
                    <Input label="Location" placeholder="E.G. REMOTE" icon={MapPin} />
                  </div>

                  <Textarea label="Job Description" placeholder="DESCRIBE THE ROLE..." rows={6} />
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream rounded-md"></div>
                  Skills & Expertise
                </h2>
                <div className="space-y-8">
                  <div className="flex items-end gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSkill(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSkill()}
                      placeholder="ADD REQUIRED SKILL..."
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
                <h2 className="text-[22px] font-black text-cream uppercase tracking-widest mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-cream"></div>
                  Role Criteria
                </h2>
                <div className="space-y-8">
                  <Select
                    label="Experience Level"
                    options={[
                      { value: 'entry', label: 'ENTRY LEVEL (0-2 YRS)' },
                      { value: 'junior', label: 'JUNIOR (2-4 YRS)' },
                      { value: 'mid', label: 'MID-LEVEL (4-7 YRS)' },
                      { value: 'senior', label: 'SENIOR (7-10 YRS)' },
                      { value: 'lead', label: 'LEAD (10+ YRS)' }
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
                <Button variant="primary" size="lg" className="w-full h-14 text-lg border border-cream" onClick={() => toast.success('Job published successfully')}>
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
