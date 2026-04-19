'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  User, 
  Mail, 
  Briefcase, 
  Phone, 
  Building2, 
  MapPin, 
  Globe, 
  Save, 
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  Key
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General Info', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your personal profile and platform configuration details."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-black">
        {/* Profile Sidebar (Always Visible) */}
        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="bg-black backdrop-blur-2xl rounded-[2.5rem] p-8 border border-[#E5D4B6]/10 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-bora-accent/10 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-black border border-[#E5D4B6]/20 rounded-2xl mx-auto flex items-center justify-center text-bora-accent shadow-2xl mb-6 group-hover:scale-105 transition-transform duration-500 ring-4 ring-bora-accent/5 overflow-hidden">
                <span className="text-3xl font-black">AC</span>
              </div>
              <h3 className="text-xl font-black text-bora-accent tracking-tighter mb-1">Alexander Chen</h3>
              <p className="text-[10px] font-black text-[#E5D4B6]/50 uppercase tracking-[0.2em]">HR Manager at BORA AI</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="bg-black p-4 rounded-xl border border-[#E5D4B6]/10">
                    <p className="text-lg font-black text-bora-accent">128</p>
                    <p className="text-[8px] font-bold text-[#E5D4B6]/30 uppercase tracking-widest mt-1">Reviews</p>
                 </div>
                 <div className="bg-black p-4 rounded-xl border border-[#E5D4B6]/10">
                    <p className="text-lg font-black text-bora-accent">24</p>
                    <p className="text-[8px] font-bold text-[#E5D4B6]/30 uppercase tracking-widest mt-1">Open Jobs</p>
                 </div>
              </div>
            </div>
          </div>

          <nav className="bg-black rounded-[2rem] p-4 border border-[#E5D4B6]/10 space-y-2 shadow-xl">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] cursor-pointer border ${isActive
                    ? 'bg-bora-accent text-black border-bora-accent shadow-lg'
                    : 'text-[#E5D4B6]/40 border-transparent hover:text-bora-accent hover:bg-[#E5D4B6]/5'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-black' : 'opacity-50'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <section className="bg-black backdrop-blur-xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-bora-accent rounded-2xl flex items-center justify-center text-black shadow-xl ring-4 ring-bora-accent/5">
                        <User size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-bora-accent tracking-tighter uppercase">Personal Details</h2>
                        <p className="text-[11px] font-bold text-[#E5D4B6]/40 uppercase tracking-widest">Update your identification info</p>
                      </div>
                   </div>
                   <button className="flex items-center gap-3 px-8 py-3 bg-bora-accent text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                      <Save size={14} /> Save
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {[
                    { label: 'First Name', value: 'Alexander', icon: User },
                    { label: 'Last Name', value: 'Chen', icon: User },
                    { label: 'Email Address', value: 'alexander@boratech.co', icon: Mail },
                    { label: 'Role', value: 'Head of Recruitment', icon: Briefcase }
                  ].map((field, i) => (
                    <div key={i} className="space-y-4">
                      <label className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <field.icon size={12} className="text-bora-accent/50" />
                        {field.label}
                      </label>
                      <input 
                        type="text" 
                        defaultValue={field.value}
                        className="w-full bg-black/60 border border-[#E5D4B6]/10 rounded-2xl px-6 py-4 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all placeholder:text-bora-accent/20" 
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-black backdrop-blur-xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 shadow-2xl">
                 <div className="flex items-center gap-5 mb-12">
                    <div className="w-12 h-12 bg-bora-accent rounded-2xl flex items-center justify-center text-black shadow-xl ring-4 ring-bora-accent/5">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-bora-accent tracking-tighter uppercase">Company Info</h2>
                      <p className="text-[11px] font-bold text-[#E5D4B6]/40 uppercase tracking-widest">Global platform preferences</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] ml-1">Business Name</label>
                      <input type="text" defaultValue="BORA Technologies" className="w-full bg-black/60 border border-[#E5D4B6]/10 rounded-2xl px-6 py-4 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] ml-1">Website URL</label>
                      <input type="text" defaultValue="https://bora.tech" className="w-full bg-black/60 border border-[#E5D4B6]/10 rounded-2xl px-6 py-4 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all" />
                    </div>
                 </div>
              </section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <section className="bg-black backdrop-blur-xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 shadow-2xl">
                <div className="flex items-center gap-5 mb-12">
                   <div className="w-12 h-12 bg-bora-accent rounded-2xl flex items-center justify-center text-black shadow-xl ring-4 ring-bora-accent/5">
                     <Lock size={24} />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-bora-accent tracking-tighter uppercase">Security</h2>
                     <p className="text-[11px] font-bold text-[#E5D4B6]/40 uppercase tracking-widest">Access control & credentials</p>
                   </div>
                </div>

                <div className="max-w-md space-y-8 pl-2">
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] ml-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-black/60 border border-[#E5D4B6]/10 rounded-2xl px-6 py-4 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[9px] font-black text-[#E5D4B6]/30 uppercase tracking-[0.2em] ml-1">New Secure Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-black/60 border border-[#E5D4B6]/10 rounded-2xl px-6 py-4 text-xs font-black text-bora-accent focus:border-bora-accent/50 focus:outline-none transition-all" />
                   </div>
                   <button className="w-full py-4 bg-bora-accent text-black text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                     Change Credentials
                   </button>
                </div>
              </section>

              <section className="bg-bora-accent/5 backdrop-blur-xl rounded-[3rem] p-10 border border-emerald-500/20 shadow-2xl">
                 <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-emerald-500/20 shadow-xl ring-4 ring-emerald-500/10">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Two-Factor Auth</h2>
                        <p className="text-[11px] font-bold text-emerald-500/60 uppercase tracking-widest">Status: active & protected</p>
                      </div>
                    </div>
                    <div className="px-5 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Enabled</div>
                 </div>
                 
                 <div className="p-8 bg-black/40 border border-emerald-500/10 rounded-3xl mb-8">
                    <p className="text-sm text-[#E5D4B6]/70 leading-relaxed font-bold italic">
                      "Two-factor authentication is currently enabled via Authenticator App. You will be asked to enter a 6-digit code when logging in from a new device."
                    </p>
                 </div>

                 <div className="flex gap-4">
                   <button className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-black transition-all">Disable 2FA</button>
                   <button className="px-8 py-4 bg-black border border-[#E5D4B6]/10 text-[#E5D4B6]/60 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-bora-accent transition-all">Recovery Codes</button>
                 </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <section className="bg-black backdrop-blur-xl rounded-[3rem] p-10 border border-[#E5D4B6]/10 shadow-2xl">
                <div className="flex items-center gap-5 mb-12">
                   <div className="w-12 h-12 bg-bora-accent rounded-2xl flex items-center justify-center text-black shadow-xl ring-4 ring-bora-accent/5">
                     <Bell size={24} />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-bora-accent tracking-tighter uppercase">Alerts</h2>
                     <p className="text-[11px] font-bold text-[#E5D4B6]/40 uppercase tracking-widest">Communication Preferences</p>
                   </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'n1', title: 'New Application Received', desc: 'When a candidate applies directly to a job board.' },
                    { id: 'n2', title: 'High-Match Candidate Alert', desc: 'Get notified when an AI-scored >90% applies.' },
                    { id: 'n3', title: 'Daily Summary', desc: 'Receive a daily digest of hiring activity.' },
                    { id: 'n4', title: 'Interview Updates', desc: 'Rescheduling requests or cancellations.' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-[#E5D4B6]/10 rounded-2xl hover:border-bora-accent/30 transition-all group">
                      <div className="space-y-1">
                        <p className="font-black text-bora-accent text-sm uppercase tracking-wider">{notif.title}</p>
                        <p className="text-[11px] text-[#E5D4B6]/40 font-bold">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                        <div className="w-14 h-7 bg-black border border-[#E5D4B6]/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#E5D4B6]/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bora-accent peer-checked:after:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
