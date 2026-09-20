import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash,
  ClockCounterClockwise,
  Eye,
  WarningCircle,
  Briefcase,
} from '@phosphor-icons/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { DatabaseService } from '../services/databaseService';
import { EligibilityAnalysisResult, CandidateProfile } from '../types/eligibility';
import { AnalysisResultView } from './AnalysisResultView';
import { TRANSITION_EASE } from '../utils/motion';

interface HistoryPageProps {
  onBack: () => void;
}

interface HistoryEntry {
  id: string;
  target_role: string;
  profile: CandidateProfile;
  result: EligibilityAnalysisResult;
  created_at: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await DatabaseService.getResults(user.id);
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setEntries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assessment? This action cannot be undone.')) return;

    setDeletingId(id);
    const { error: deleteError } = await DatabaseService.deleteResult(id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
    setDeletingId(null);
  };

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case 'Highly Eligible':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80';
      case 'Eligible':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/80';
      case 'Partially Eligible':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80';
      default:
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80';
    }
  };

  // If viewing a saved result
  if (selectedEntry) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: TRANSITION_EASE }}
        className="max-w-5xl mx-auto px-4 sm:px-6 py-24"
      >
        <button
          onClick={() => setSelectedEntry(null)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" weight="bold" />
          <span>BACK TO HISTORY</span>
        </button>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-4 sm:p-6 md:p-8">
          <AnalysisResultView
            result={selectedEntry.result}
            onReset={() => setSelectedEntry(null)}
            onEditProfile={() => setSelectedEntry(null)}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: TRANSITION_EASE }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-24"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" weight="bold" />
        <span>BACK TO HOME</span>
      </button>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <ClockCounterClockwise className="w-5 h-5 text-zinc-700 dark:text-zinc-300" weight="bold" />
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Assessment History</h1>
          </div>
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {entries.length} {entries.length === 1 ? 'ASSESSMENT' : 'ASSESSMENTS'}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
            <WarningCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" weight="bold" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 rounded-full animate-spin" />
              Loading history...
            </div>
          </div>
        ) : entries.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16 space-y-3">
            <ClockCounterClockwise className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-700" weight="thin" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No assessments yet.</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Run an eligibility check to see your saved results here.
            </p>
          </div>
        ) : (
          /* History list */
          <div className="space-y-3">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: TRANSITION_EASE }}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-zinc-500 shrink-0" weight="bold" />
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {entry.result.targetRole?.title ?? entry.target_role}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${getTierBadgeClass(entry.result.scores?.tier ?? '')}`}>
                          {entry.result.scores?.tier ?? 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <span>Score: {entry.result.scores?.overallScore ?? '–'}/100</span>
                        <span>•</span>
                        <span>{new Date(entry.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" weight="bold" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-800 transition-colors disabled:opacity-50"
                      >
                        {deletingId === entry.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 rounded-full animate-spin" />
                        ) : (
                          <Trash className="w-3.5 h-3.5" weight="bold" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
