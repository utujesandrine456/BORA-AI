'use client';

import React, { useState } from 'react';
import {
  User,
  Laptop,
  Shield,
  Save,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  CheckCircle2,
  RefreshCcw,
  RotateCcw
} from 'lucide-react';
import TopNav from '@/components/TopNav';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '@/lib/api/auth';
import { systemApi } from '@/lib/api/system';

type Category = 'workspace' | 'ai' | 'security';

// ─── Password strength helper ──────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: 'Weak',   color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair',   color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'Good',   color: 'bg-blue-500' };
  return             { score, label: 'Strong', color: 'bg-emerald-500' };
}

// ─── Security Panel ────────────────────────────────────────────────────────────
function SecurityPanel() {
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew]               = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [loading, setLoading]               = useState(false);
  const [success, setSuccess]               = useState(false);

  const strength = getStrength(newPassword);

  const handleReset = async () => {
    // ── Validation ──
    if (!newPassword) {
      return toast.error('Please enter a new password.');
    }
    if (newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    setLoading(true);
    setSuccess(false);

    try {
      await authApi.changePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        err?.message ||
        'Failed to reset password. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-xl">
      {/* Section header */}
      <div className="flex items-center gap-4 pb-6 border-b border-cream/10">
        <div className="w-10 h-10 rounded-lg bg-cream/10 border border-cream/20 flex items-center justify-center">
          <KeyRound className="w-5 h-5 text-cream" />
        </div>
        <div>
          <h3 className="text-lg font-black text-cream">Reset Password</h3>
          <p className="text-xs text-cream/40 font-medium mt-0.5">
            Choose a strong password to keep your account secure.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 px-5 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-emerald-400 font-bold text-sm">
            Password changed successfully. Use your new password next time you log in.
          </p>
        </div>
      )}

      {/* New password */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-cream/50 uppercase tracking-widest">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setSuccess(false); }}
            placeholder="Enter new password"
            className="w-full bg-dark border border-cream/20 rounded-lg px-4 py-3 pr-12 text-sm text-cream font-bold outline-none focus:border-cream/60 transition-colors placeholder:text-cream/20"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength meter */}
        {newPassword.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.color : 'bg-cream/10'
                  }`}
                />
              ))}
            </div>
            <p className={`text-[11px] font-bold ${
              strength.score <= 1 ? 'text-red-400' :
              strength.score <= 2 ? 'text-amber-400' :
              strength.score <= 3 ? 'text-blue-400' :
              'text-emerald-400'
            }`}>
              {strength.label} password
            </p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-cream/50 uppercase tracking-widest">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className={`w-full bg-dark border rounded-lg px-4 py-3 pr-12 text-sm text-cream font-bold outline-none transition-colors placeholder:text-cream/20 ${
              confirmPassword && newPassword !== confirmPassword
                ? 'border-red-500/60 focus:border-red-500'
                : 'border-cream/20 focus:border-cream/60'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirmPassword && newPassword !== confirmPassword && (
          <p className="text-[11px] text-red-400 font-bold">Passwords do not match.</p>
        )}
      </div>

      {/* Requirements checklist */}
      <div className="bg-cream/[0.03] border border-cream/10 rounded-lg p-5 space-y-2">
        <p className="text-[11px] font-black text-cream/40 uppercase tracking-widest mb-3">
          Requirements
        </p>
        {[
          { label: 'At least 8 characters',          met: newPassword.length >= 8 },
          { label: 'Contains an uppercase letter',    met: /[A-Z]/.test(newPassword) },
          { label: 'Contains a number',               met: /[0-9]/.test(newPassword) },
          { label: 'Contains a special character',    met: /[^A-Za-z0-9]/.test(newPassword) },
        ].map((req) => (
          <div key={req.label} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
              req.met
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-cream/20 bg-transparent'
            }`}>
              {req.met && (
                <svg className="w-2.5 h-2.5 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-xs font-bold ${req.met ? 'text-emerald-400' : 'text-cream/30'}`}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      {/* Reset button */}
      <button
        onClick={handleReset}
        disabled={loading || !newPassword || newPassword !== confirmPassword}
        className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-cream text-dark rounded-lg font-black text-sm hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cream/10"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Resetting password…</>
        ) : (
          <><KeyRound className="w-4 h-4" /> Reset Password</>
        )}
      </button>
    </div>
  );
}

// ─── Default Constants ────────────────────────────────────────────────────────
const DEFAULT_WORKSPACE = {
  companyName: '',
  website: '',
  industry: 'Tech',
  description: '',
};

const PLACEHOLDERS = {
  companyName: 'Bora Technologies',
  website: 'https://bora.ai',
  industry: 'Tech',
  description: 'Next-generation AI recruitment platform.',
};

const DEFAULT_AI = {
  model: 'advanced',
  experienceWeight: 40,
  educationWeight: 30,
  skillsWeight: 30,
};

// ─── Main settings page ────────────────────────────────────────────────────────
export default function AdminSettings() {
  const [activeCategory, setActiveCategory] = useState<Category>('workspace');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [workspaceData, setWorkspaceData] = useState(DEFAULT_WORKSPACE);
  const [aiData, setAiData] = useState(DEFAULT_AI);

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkspace = localStorage.getItem('bora_workspace_settings');
      const savedAI = localStorage.getItem('bora_ai_settings');

      if (savedWorkspace) setWorkspaceData(JSON.parse(savedWorkspace));
      if (savedAI) setAiData(JSON.parse(savedAI));
      
      setMounted(true);
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        
        // Persist to localStorage
        localStorage.setItem('bora_workspace_settings', JSON.stringify(workspaceData));
        localStorage.setItem('bora_ai_settings', JSON.stringify(aiData));
        
        toast.success(
          `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} configuration saved and persisted!`
        );
    } catch (err) {
        toast.error('Failed to save configuration.');
    } finally {
        setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all platform settings? This will clear your saved configuration.')) {
        return;
    }

    setLoading(true);
    try {
        // Call backend reset
        await systemApi.resetPlatform();
        
        // Clear persistence
        localStorage.removeItem('bora_workspace_settings');
        localStorage.removeItem('bora_ai_settings');

        // Reset local state
        setWorkspaceData(DEFAULT_WORKSPACE);
        setAiData(DEFAULT_AI);

        toast.success('Platform settings have been reset to system defaults.');
    } catch (err: any) {
        console.error('Reset failed:', err);
        toast.error('Failed to reset settings.');
    } finally {
        setLoading(false);
    }
  };

  const categories: { id: Category; label: string; icon: React.ElementType; }[] = [
    { id: 'workspace', label: 'Workspace Profile', icon: User },
    { id: 'ai',        label: 'AI Preferences',    icon: Laptop },
    { id: 'security',  label: 'Security',           icon: Shield },
  ];

  return (
    <div className="flex flex-col h-full bg-dark min-h-screen">
      <TopNav />

      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-32">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4 border-b border-cream/10 pb-12">
          <div>
            <h1 className="text-5xl font-black text-cream leading-none mb-4">
              Platform Settings
            </h1>
            <p className="text-cream/40 font-medium text-md">
              Configure your recruitment environment, AI parameters and account security
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-cream/5 p-1.5 rounded-lg border border-cream/10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cursor-pointer px-5 py-3 rounded-md flex items-center gap-2.5 transition-all font-bold text-sm ${
                    activeCategory === cat.id
                      ? 'bg-cream text-dark shadow-xl'
                      : 'text-cream/40 hover:text-cream hover:bg-cream/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content panel */}
        <div className="bg-cream/5 border border-cream/10 rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cream/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {/* ── Workspace ── */}
              {activeCategory === 'workspace' && (
                <div className="space-y-8 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Company Name"
                      value={workspaceData.companyName}
                      onChange={(e) =>
                        setWorkspaceData({ ...workspaceData, companyName: e.target.value })
                      }
                      placeholder={PLACEHOLDERS.companyName}
                    />
                    <Input
                      label="Website URL"
                      value={workspaceData.website}
                      onChange={(e) =>
                        setWorkspaceData({ ...workspaceData, website: e.target.value })
                      }
                      placeholder={PLACEHOLDERS.website}
                    />
                  </div>
                  <Select
                    label="Industry Category"
                    options={[
                      { value: 'Tech',       label: 'Technology' },
                      { value: 'Finance',    label: 'Finance' },
                      { value: 'Healthcare', label: 'Healthcare' },
                    ]}
                    value={workspaceData.industry}
                    onChange={(e) =>
                      setWorkspaceData({ ...workspaceData, industry: e.target.value })
                    }
                  />
                  <Textarea
                    label="Company Description"
                    rows={4}
                    value={workspaceData.description}
                    onChange={(e) =>
                      setWorkspaceData({ ...workspaceData, description: e.target.value })
                    }
                    placeholder={PLACEHOLDERS.description}
                  />
                </div>
              )}

              {/* ── AI Preferences ── */}
              {activeCategory === 'ai' && (
                <div className="space-y-8 max-w-2xl">
                  <Select
                    label="Model Engine"
                    options={[
                      { value: 'standard',     label: 'Standard (Fast)' },
                      { value: 'advanced',     label: 'Advanced (Precise)' },
                      { value: 'experimental', label: 'Experimental (Cutting Edge)' },
                    ]}
                    value={aiData.model}
                    onChange={(e) => setAiData({ ...aiData, model: e.target.value })}
                  />

                  <div className="space-y-6">
                    <h4 className="text-sm font-bold text-cream">
                      Screening Weight Distribution
                    </h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Work Experience',  key: 'experienceWeight' },
                        { label: 'Education & Certs', key: 'educationWeight' },
                        { label: 'Skill Proficiency', key: 'skillsWeight' },
                      ].map((weight) => (
                        <div key={weight.key} className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-cream/60">
                            <span>{weight.label}</span>
                            <span>{aiData[weight.key as keyof typeof aiData]}%</span>
                          </div>
                          <input
                            type="range"
                            className="w-full accent-cream"
                            value={aiData[weight.key as keyof typeof aiData]}
                            onChange={(e) =>
                              setAiData({ ...aiData, [weight.key]: parseInt(e.target.value) })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Security ── */}
              {activeCategory === 'security' && <SecurityPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions button group */}
        {activeCategory !== 'security' && (
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={loading}
              className="bg-cream text-dark py-5 px-12 text-sm font-black shadow-xl h-14 flex items-center gap-3 disabled:opacity-50 w-full sm:w-auto"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Configuration
            </Button>

            <button
              onClick={handleReset}
              disabled={loading}
              className="h-14 px-8 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/5 transition-all text-sm font-bold flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>

            {loading && (
              <p className="text-cream/40 font-bold text-sm animate-pulse">
                Syncing changes with neural engine...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
