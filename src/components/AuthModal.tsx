import React, { useState, useEffect, useRef } from 'react';
import { X, Envelope, Lock, Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { TRANSITION_EASE } from '../utils/motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  // Sync initialMode prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error: authError } = await signIn(email.trim(), password);
        if (authError) {
          setError(authError.message);
        } else {
          onClose();
        }
      } else {
        const { error: authError } = await signUp(email.trim(), password);
        if (authError) {
          setError(authError.message);
        } else {
          setSuccessMessage('Account created! Check your email to confirm your account, then sign in.');
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.25, ease: TRANSITION_EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl p-6 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {mode === 'signin'
                  ? 'Sign in to save your assessments and track progress.'
                  : 'Create an account to persist your eligibility results.'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
                <WarningCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" weight="bold" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="mb-4 p-3 rounded border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" weight="bold" />
                  <input
                    ref={emailRef}
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" weight="bold" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeSlash className="w-4 h-4" weight="bold" /> : <Eye className="w-4 h-4" weight="bold" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-confirm-password" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" weight="bold" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-3 py-2.5 rounded text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-200 min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-semibold bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-colors border border-zinc-950 dark:border-zinc-200 shadow-sm disabled:opacity-70 disabled:cursor-wait min-h-[44px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-white dark:border-zinc-600 dark:border-t-zinc-900 rounded-full animate-spin" />
                    <span>{mode === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Mode switch */}
            <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
