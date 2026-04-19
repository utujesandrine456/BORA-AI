'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Save,
  Mail,
  Building2,
  Globe,
  Key
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';

const TABS = [
  { id: 'general', label: 'General Info', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-10 border-b border-cream/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-cream tracking-tight mb-2">Settings</h1>
            <p className="text-cream/60 font-medium text-lg italic serif">Manage your account preferences and platform configuration.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="font-semibold px-6">Discard</Button>
            <Button variant="primary" className="gap-2 font-semibold px-6">
              <Save className="w-4 h-4" /> Save changes
            </Button>
          </div>
        </div>

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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Profile Information</h2>
                    <p className="text-cream/50 text-sm font-medium">Update your personal identifying details and public profile.</p>
                  </div>

                  <div className="flex items-center gap-6 pb-6 border-b border-cream/10">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-cream/10 border-2 border-cream/20 flex items-center justify-center text-3xl font-black text-cream overflow-hidden">
                        AC
                      </div>
                      <button className="absolute inset-0 rounded-full bg-dark/60 text-cream text-[10px] uppercase font-bold tracking-widest flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        Change
                      </button>
                    </div>
                    <div>
                      <div className="text-cream font-bold text-lg mb-1">Alexander Chen</div>
                      <div className="text-cream/50 text-sm font-medium mb-3">alexander@boratech.co</div>
                      <span className="text-[10px] font-bold text-cream/40 bg-cream/10 px-3 py-1 rounded">Admin Account</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <Input label="First Name" defaultValue="Alexander" icon={User} />
                    <Input label="Last Name" defaultValue="Chen" icon={User} />
                    <Input label="Email Address" defaultValue="alexander@boratech.co" icon={Mail} />
                    <Input label="Role" defaultValue="Head of Recruitment" icon={Building2} />
                  </div>
                </Card>

                <Card className="p-8 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-cream mb-1">Company Details</h2>
                    <p className="text-cream/50 text-sm font-medium">Manage your organization&apos;s core information.</p>
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
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 space-y-8">
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

                <Card className="p-8 space-y-8 border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-cream mb-1 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-500" /> Two-Factor Authentication
                      </h2>
                      <p className="text-cream/60 text-sm font-medium">Add an extra layer of security to your account.</p>
                    </div>
                    <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 font-bold">Enabled</Badge>
                  </div>

                  <div className="p-4 bg-dark/40 border border-cream/10 rounded-md">
                    <p className="text-sm text-cream/70 leading-relaxed font-medium">
                      Two-factor authentication is currently enabled via <strong className="text-cream">Authenticator App</strong>.
                      You will be asked to enter a 6-digit code when logging in from a new device.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="secondary" className="font-semibold text-red-500 border-red-500/30 hover:bg-red-500/10">Disable 2FA</Button>
                    <Button variant="secondary" className="font-semibold">Generate Recovery Codes</Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 space-y-8">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

