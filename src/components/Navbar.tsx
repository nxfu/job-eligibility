import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ArrowRight, List, X, User, ClockCounterClockwise, SignOut, SignIn } from '@phosphor-icons/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TRANSITION_EASE } from '../utils/motion';

interface NavbarProps {
  onNavigate?: (page: 'home' | 'profile' | 'history') => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenAuth, currentPage = 'home' }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isNavigatingRef = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Skip scroll spy while a programmatic scroll is in progress
      if (isNavigatingRef.current) return;

      // Simple active section detection
      const sections = ['hero', 'checker', 'roles', 'how-it-works'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setActiveSection(id);

    // If not on home page, navigate to home first
    if (currentPage !== 'home' && onNavigate) {
      onNavigate('home');
      // Wait for home page to render, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -72;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Lock scroll spy so intermediate sections don't hijack the active pill
    isNavigatingRef.current = true;
    setTimeout(() => { isNavigatingRef.current = false; }, 800);

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    if (onNavigate) onNavigate('home');
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'checker', label: 'Check Eligibility' },
    { id: 'roles', label: 'Job Roles' },
    { id: 'how-it-works', label: 'How It Works' }
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: TRANSITION_EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_1px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)]'
          : 'bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-zinc-200/50 dark:border-zinc-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              if (currentPage !== 'home' && onNavigate) {
                onNavigate('home');
              } else {
                scrollToSection('hero');
              }
            }}
          >
            <div className="h-8 w-8 rounded flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 overflow-hidden">
              <img src={theme === 'dark' ? '/favicon-dark.png' : '/favicon-light.png'} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
                Job Eligibility Checker
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Career Analysis
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav role="navigation" aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === 'home' && activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-zinc-950 dark:text-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-md bg-zinc-100/90 dark:bg-zinc-800/80 -z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="theme-toggle-btn"
              onClick={(e) => toggleTheme(e)}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" weight="bold" /> : <Moon className="w-4 h-4" weight="bold" />}
            </motion.button>

            {user ? (
              /* Authenticated: User menu dropdown */
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors overflow-hidden"
                  aria-label="User menu"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" weight="bold" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: TRANSITION_EASE }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg py-1.5 z-50"
                    >
                      {/* User info */}
                      <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2.5">
                        {user.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                            <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" weight="bold" />
                          </div>
                        )}
                        <div className="min-w-0">
                          {user.user_metadata?.full_name && (
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{user.user_metadata.full_name}</p>
                          )}
                          <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => { setUserMenuOpen(false); onNavigate?.('profile'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => { setUserMenuOpen(false); onNavigate?.('history'); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <ClockCounterClockwise className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                        <span>Assessment History</span>
                      </button>

                      <div className="border-t border-zinc-200 dark:border-zinc-800 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                        >
                          <SignOut className="w-3.5 h-3.5" weight="bold" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Unauthenticated: Sign In button */
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenAuth?.('signin')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <SignIn className="w-3.5 h-3.5" weight="bold" />
                <span>Sign In</span>
              </motion.button>
            )}

            {/* Get Started Button */}
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              id="navbar-get-started-btn"
              onClick={() => scrollToSection('checker')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors border border-zinc-800 dark:border-zinc-200 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" weight="bold" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-theme-toggle"
              onClick={(e) => toggleTheme(e)}
              aria-label="Toggle theme"
              className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" weight="bold" /> : <Moon className="w-4 h-4" weight="bold" />}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" weight="bold" /> : <List className="w-5 h-5" weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with smooth slide & fade */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: TRANSITION_EASE }}
            role="navigation"
            aria-label="Mobile navigation"
            className="overflow-hidden md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left py-2 px-2 rounded text-sm text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                {link.label}
              </button>
            ))}

            {/* Auth items in mobile */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              {user ? (
                <>
                  <div className="px-2 py-1.5 flex items-center gap-2.5">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" weight="bold" />
                      </div>
                    )}
                    <div className="min-w-0">
                      {user.user_metadata?.full_name && (
                        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{user.user_metadata.full_name}</p>
                      )}
                      <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate?.('profile'); }}
                    className="block w-full text-left py-2 px-2 rounded text-sm text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onNavigate?.('history'); }}
                    className="block w-full text-left py-2 px-2 rounded text-sm text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Assessment History
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 px-2 rounded text-sm text-rose-600 dark:text-rose-400 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth?.('signin'); }}
                  className="block w-full text-left py-2 px-2 rounded text-sm text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => scrollToSection('checker')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
