/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueStrip } from './components/ValueStrip';
import { CheckerForm } from './components/CheckerForm';
import { HowItWorks } from './components/HowItWorks';
import { JobRolesSection } from './components/JobRolesSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { JobRoleKey } from './types/eligibility';

type Page = 'home' | 'profile' | 'history';

export default function App() {
  const [selectedRoleFromExternal, setSelectedRoleFromExternal] = useState<JobRoleKey | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleRoleSelection = (roleKey: JobRoleKey) => {
    setSelectedRoleFromExternal(roleKey);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-black">
          
          {/* 1. Top Sticky Navbar */}
          <Navbar
            onNavigate={handleNavigate}
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
            <ProfilePage onBack={() => handleNavigate('home')} />
          ) : currentPage === 'history' ? (
            <HistoryPage onBack={() => handleNavigate('home')} />
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
              <CheckerForm
                selectedRoleFromExternal={selectedRoleFromExternal}
                onRoleSelectionHandled={() => setSelectedRoleFromExternal(null)}
                onOpenAuth={handleOpenAuth}
              />

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
          
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
