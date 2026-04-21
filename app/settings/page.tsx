'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Shield, 
  Laptop, 
  Mail, 
  Building2, 
  Globe, 
  Lock, 
  Key, 
  Save, 
  Bell 
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Card, { fadeUp, staggerContainer } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'general', label: 'General Info', icon: User },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'notifications', label: 'Alert Preferences', icon: Bell },
  { id: 'ai', label: 'AI Parameters', icon: Laptop },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [user, setUser] = useState<{ name: string; email: string; role: string; photo?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user');
        }
      }
    }
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = { ...user, photo: base64String };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const displayName = user?.name || 'User';
  const firstName = displayName.split(' ')[0] || '';
  const lastName = displayName.split(' ').slice(1).join(' ') || '';

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen font-sans">
      <TopNav />
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoChange} 
      />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        {/* Header Section */}
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="border-b border-cream/10 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-6xl font-black text-cream leading-none mb-4">Platform Settings</h1>
            <p className="text-cream/40 font-medium text-lg">Configure your recruitment environment and AI parameters</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="font-semibold px-6">Discard</Button>
            <Button variant="primary" className="gap-2 font-semibold px-6 bg-cream text-dark">
              <Save className="w-4 h-4" /> Save changes
            </Button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all font-semibold cursor-pointer ${isActive
                      ? 'bg-cream text-dark shadow-md'
                      : 'text-cream/60 hover:text-cream hover:bg-cream/10'
                      }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-dark' : 'opacity-70'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-8">
            {activeTab === 'general' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Profile Information</h2>
                    <p className="text-cream/50 text-sm font-medium">Update your personal identifying details and public profile.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-cream/10">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-cream/10 border-2 border-cream/20 flex items-center justify-center text-3xl font-black text-cream overflow-hidden">
                        {user?.photo ? (
                          <img src={user.photo} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-dark/60 text-cream text-[10px] uppercase font-bold tracking-widest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Change
                      </button>
                    </div>
                    <div>
                      <div className="text-cream font-bold text-lg mb-1">{displayName}</div>
                      <div className="text-cream/50 text-sm font-medium mb-3">{user?.email || 'email@boratech.co'}</div>
                      <span className="text-[10px] font-bold text-cream/40 bg-cream/10 px-3 py-1 rounded">{user?.role || 'User Account'}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <Input label="First Name" defaultValue={firstName} icon={User} />
                    <Input label="Last Name" defaultValue={lastName} icon={User} />
                    <Input label="Email Address" defaultValue={user?.email || ''} icon={Mail} />
                    <Input label="Role" defaultValue={user?.role || ''} icon={Building2} />
                  </div>
                </Card>

                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Company Details</h2>
                    <p className="text-cream/50 text-sm font-medium">Manage your organization's core information.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Company Name" defaultValue="BORA Technologies" icon={Building2} />
                    <Input label="Website URL" defaultValue="https://bora.tech" icon={Globe} />
                    <Select
                      label="Company Size"
                      options={[
                        { value: '1-50', label: '1 - 50 employees' },
                        { value: '51-200', label: '51 - 200 employees' },
                        { value: '201-500', label: '201 - 500 employees' },
                        { value: '500+', label: '500+ employees' }
                      ]}
                      defaultValue="51-200"
                    />
                    <Select
                      label="Timezone"
                      options={[
                        { value: 'est', label: 'Eastern Time (ET)' },
                        { value: 'pst', label: 'Pacific Time (PT)' },
                        { value: 'utc', label: 'Coordinated Universal Time (UTC)' },
                        { value: 'cet', label: 'Central European Time (CET)' }
                      ]}
                      defaultValue="est"
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Password & Authentication</h2>
                    <p className="text-cream/50 text-sm font-medium">Keep your account secure with strong credentials.</p>
                  </div>

                  <div className="space-y-6 max-w-md">
                    <Input label="Current Password" type="password" placeholder="••••••••" icon={Lock} />
                    <Input label="New Password" type="password" placeholder="••••••••" icon={Key} />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" icon={Key} />
                    <Button variant="secondary" className="font-semibold w-full mt-4">Change Password</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-8">
                <Card className="p-8 space-y-8 bg-dark/40 border-cream/10">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Alert Preferences</h2>
                    <p className="text-cream/50 text-sm font-medium">Choose what events you want to be notified about.</p>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'n1', title: 'New Application Received', desc: 'When a candidate applies directly to a job board.' },
                      { id: 'n2', title: 'High-Match Candidate Alert', desc: 'Get notified when an AI-scored >90% applies.' },
                      { id: 'n3', title: 'Daily Summary', desc: 'Receive a daily digest of hiring activity.' },
                      { id: 'n4', title: 'Interview Updates', desc: 'Rescheduling requests or cancellations.' }
                    ].map((notif, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-cream/5 border border-cream/10 rounded-md hover:border-cream/30 transition-colors">
                        <div>
                          <p className="font-bold text-cream text-md">{notif.title}</p>
                          <p className="text-xs text-cream/50 mt-1 font-medium">{notif.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                          <div className="w-11 h-6 bg-dark/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cream/40 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cream/80 peer-checked:after:bg-dark"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div variants={fadeUp} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card variant="glass" className="p-8 space-y-6 group cursor-pointer hover:border-cream/40 transition-all">
                  <div className="w-12 h-12 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-black text-cream mb-2">AI Preferences</h3>
                    <p className="text-sm text-cream/40 leading-relaxed">Adjust screening weights and explainability detail levels.</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
