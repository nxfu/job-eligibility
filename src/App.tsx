/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueStrip } from './components/ValueStrip';
import { HowItWorks } from './components/HowItWorks';
import { JobRolesSection } from './components/JobRolesSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InstallPrompt } from './components/InstallPrompt';
import { JobRoleKey } from './types/eligibility';
import { useRouter } from './hooks/useRouter';

const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const HistoryPage = lazy(() => import('./components/HistoryPage').then(m => ({ default: m.HistoryPage })));
const CheckerForm = lazy(() => import('./components/CheckerForm').then(m => ({ default: m.CheckerForm })));

const PageLoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
      <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300 rounded-full animate-spin" />
      Loading...
    </div>
  </div>
);

function AppContent() {
  const { isRecoveryMode } = useAuth();
  const [selectedRoleFromExternal, setSelectedRoleFromExternal] = useState<JobRoleKey | null>(null);
  const { currentPage, navigate } = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot-password' | 'update-password'>('signin');

  React.useEffect(() => {
    if (isRecoveryMode) {
      setAuthModalMode('update-password');
      setAuthModalOpen(true);
    }
  }, [isRecoveryMode]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNavigate = (page: 'home' | 'profile' | 'history') => {
    navigate(page);
    window.scrollTo({ top: 0 });
  };

  const handleRoleSelection = (roleKey: JobRoleKey) => {
    setSelectedRoleFromExternal(roleKey);
  };



  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black">
      
      {/* 1. Top Sticky Navbar */}
      <Navbar
        onNavigate={navigate}
        onOpenAuth={handleOpenAuth}
        currentPage={currentPage}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {currentPage === 'profile' ? (
        <Suspense fallback={<PageLoadingFallback />}>
          <ProfilePage onBack={() => handleNavigate('home')} />
        </Suspense>
      ) : currentPage === 'history' ? (
        <Suspense fallback={<PageLoadingFallback />}>
          <HistoryPage onBack={() => handleNavigate('home')} />
        </Suspense>
      ) : (
        <main>
          {/* 2. Hero Section with AI Analysis Visualization */}
          <Hero
            onCheckEligibilityClick={() => scrollToSection('checker')}
            onSeeHowItWorksClick={() => scrollToSection('how-it-works')}
          />

          {/* 3. Trust & Value Strip */}
          <ValueStrip />

          {/* 4. Main Eligibility Checker Form Section */}
          <Suspense fallback={<PageLoadingFallback />}>
            <CheckerForm
              selectedRoleFromExternal={selectedRoleFromExternal}
              onRoleSelectionHandled={() => setSelectedRoleFromExternal(null)}
              onOpenAuth={handleOpenAuth}
            />
          </Suspense>

          {/* 5. Explore Job Roles Catalog */}
          <JobRolesSection onSelectRole={handleRoleSelection} />

          {/* 6. How It Works (3 Steps) */}
          <HowItWorks />

          {/* 7. Final High-Impact CTA */}
          <FinalCTA onCheckClick={() => scrollToSection('checker')} />
        </main>
      )}

      {/* 8. Professional Footer */}
      <Footer />
      
      {/* 9. PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
