import React, { useState, useEffect, useRef } from 'react';
import { X, Envelope, Lock, Eye, EyeSlash, WarningCircle, ArrowLeft } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { TRANSITION_EASE } from '../utils/motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot-password' | 'update-password';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, updatePassword, setIsRecoveryMode } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password' | 'update-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
      setGoogleLoading(false);
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  // Sync initialMode prop
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleGoogleSignIn = async () => {
    if (googleLoading || loading) return;
    setError(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message);
        setGoogleLoading(false);
      }
      // On success, Supabase redirects — modal closes via onAuthStateChange.
      // Keep googleLoading=true to prevent double-clicks during redirect.
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'forgot-password') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        const { error: authError } = await resetPassword(email.trim());
        if (authError) {
          setError(authError.message);
        } else {
          setSuccessMessage('Check your email for the password reset link.');
        }
      } catch {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'update-password') {
      if (!password) {
        setError('Please enter your new password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setLoading(true);
      try {
        const { error: authError } = await updatePassword(password);
        if (authError) {
          setError(authError.message);
        } else {
          setIsRecoveryMode(false);
          onClose();
        }
      } catch {
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

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

  const isAnyLoading = loading || googleLoading;

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
            <div className="mb-6 relative">
              {mode === 'forgot-password' && (
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="absolute -top-1 -left-2 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Back to sign in"
                >
                  <ArrowLeft className="w-4 h-4" weight="bold" />
                </button>
              )}
              <h2 className={`text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 ${mode === 'forgot-password' ? 'ml-6' : ''}`}>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot-password' && 'Reset Password'}
                {mode === 'update-password' && 'Update Password'}
              </h2>
              <p className={`text-xs text-zinc-500 dark:text-zinc-400 mt-1 ${mode === 'forgot-password' ? 'ml-6' : ''}`}>
                {mode === 'signin' && 'Sign in to save your assessments and track progress.'}
                {mode === 'signup' && 'Create an account to persist your eligibility results.'}
                {mode === 'forgot-password' && 'Enter your email to receive a password reset link.'}
                {mode === 'update-password' && 'Enter your new password below.'}
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

            {mode !== 'forgot-password' && mode !== 'update-password' && (
              <>
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isAnyLoading}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded text-sm font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors disabled:opacity-60 disabled:cursor-wait min-h-[44px]"
                >
                  {googleLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 rounded-full animate-spin" />
                      <span>Connecting to Google...</span>
                    </div>
                  ) : (
                    <>
                      {/* Google "G" logo — official colors */}
                      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-zinc-950 px-3 text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      or continue with email
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              {mode !== 'update-password' && (
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
              )}

              {/* Password */}
              {mode !== 'forgot-password' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-password" className="block text-xs font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      {mode === 'update-password' ? 'New Password' : 'Password'}
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot-password')}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" weight="bold" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={(mode === 'signup' || mode === 'update-password') ? 'Min. 6 characters' : '••••••••'}
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
              )}

              {/* Confirm Password (signup and update-password only) */}
              {(mode === 'signup' || mode === 'update-password') && (
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
                disabled={isAnyLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-sm font-semibold bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 transition-colors border border-zinc-950 dark:border-zinc-200 shadow-sm disabled:opacity-70 disabled:cursor-wait min-h-[44px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-white dark:border-zinc-600 dark:border-t-zinc-900 rounded-full animate-spin" />
                    <span>
                      {mode === 'signin' && 'Signing in...'}
                      {mode === 'signup' && 'Creating account...'}
                      {mode === 'forgot-password' && 'Sending...'}
                      {mode === 'update-password' && 'Updating...'}
                    </span>
                  </div>
                ) : (
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot-password' && 'Send Reset Link'}
                    {mode === 'update-password' && 'Update Password'}
                  </span>
                )}
              </button>
            </form>

            {/* Mode switch */}
            {(mode === 'signin' || mode === 'signup') && (
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
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
