import React, { useState, useEffect } from 'react';
import { ArrowLeft, FloppyDisk, Check, WarningCircle, SignOut } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DatabaseService } from '../services/databaseService';
import { Profile } from '../types/database';
import { EDUCATION_LEVELS, BRANCH_OPTIONS, EXPERIENCE_LEVELS } from '../data/rolesData';
import { TRANSITION_EASE } from '../utils/motion';

interface ProfilePageProps {
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[0]);
  const [branch, setBranch] = useState(BRANCH_OPTIONS[0]);
  const [cgpa, setCgpa] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('0');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      const data = await DatabaseService.getProfile(user.id);
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? '');
        setEducationLevel(data.education_level ?? EDUCATION_LEVELS[0]);
        setBranch(data.branch ?? BRANCH_OPTIONS[0]);
        setCgpa(data.cgpa ?? '');
        setYearsOfExperience(data.years_of_experience ?? '0');
      }

      if (!data?.full_name && user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    setSaving(true);

    const { error: saveError } = await DatabaseService.upsertProfile(user.id, {
      full_name: fullName.trim() || null,
      education_level: educationLevel,
      branch,
      cgpa: cgpa.trim() || null,
      years_of_experience: yearsOfExperience,
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setSuccess('Profile saved successfully.');
      showToast('Profile saved successfully', 'success');
      setTimeout(() => setSuccess(null), 3000);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await signOut();
    if (signOutError) {
      setError(signOutError.message);
    } else {
      showToast('Signed out successfully', 'info');
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: TRANSITION_EASE }}
      className="max-w-2xl mx-auto px-4 sm:px-6 py-24"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" weight="bold" />
        <span>BACK TO HOME</span>
      </button>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Your Profile</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors"
          >
            <SignOut className="w-3.5 h-3.5" weight="bold" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="p-3 rounded border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
            <WarningCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" weight="bold" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 rounded border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" weight="bold" />
            <span>{success}</span>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="profile-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
            />
          </div>

          {/* Education & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-education" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Education Level
              </label>
              <select
                id="profile-education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
              >
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-branch" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Branch / Specialization
              </label>
              <select
                id="profile-branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
              >
                {BRANCH_OPTIONS.map((br) => (
                  <option key={br} value={br}>{br}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CGPA */}
          <div className="space-y-1.5">
            <label htmlFor="profile-cgpa" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              CGPA / Percentage
            </label>
            <input
              id="profile-cgpa"
              type="text"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.5 CGPA or 85%"
              className="w-full px-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
            />
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Years of Experience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp.value}
                  type="button"
                  onClick={() => setYearsOfExperience(exp.value)}
                  className={`py-2 px-2.5 rounded text-xs text-center border transition-all duration-150 min-h-[42px] touch-manipulation ${
                    yearsOfExperience === exp.value
                      ? 'border-zinc-950 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                  }`}
                >
                  {exp.value === '0' ? 'Fresher (0 yr)' : `${exp.value} Yrs`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-semibold bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-colors border border-zinc-950 dark:border-zinc-200 shadow-sm disabled:opacity-70 disabled:cursor-wait min-h-[44px]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-white dark:border-zinc-600 dark:border-t-zinc-900 rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <FloppyDisk className="w-4 h-4" weight="bold" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
