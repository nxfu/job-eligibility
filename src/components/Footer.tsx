import React from 'react';
import { GithubLogo, ArrowUp } from '@phosphor-icons/react';
import { useTheme } from '../context/ThemeContext';


export const Footer: React.FC = () => {
  const { theme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-200 dark:border-zinc-800">
          
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded flex items-center justify-center overflow-hidden">
                <img src={theme === 'dark' ? '/favicon-dark.png' : '/favicon-light.png'} alt="Logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Job Eligibility Checker
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              AI-powered career analysis
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed pt-1">
              Objective role eligibility benchmarking platform. Designed with minimal, high-contrast aesthetics for ambitious developers and technical professionals.
            </p>
          </div>

          {/* Links Col */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-semibold">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:text-zinc-950 dark:focus-visible:text-zinc-100"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('checker')}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:text-zinc-950 dark:focus-visible:text-zinc-100"
                >
                  Check Eligibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('roles')}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:text-zinc-950 dark:focus-visible:text-zinc-100"
                >
                  Job Roles
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:text-zinc-950 dark:focus-visible:text-zinc-100"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Socials Col */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-semibold">
              Connect
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/nxfu/job-eligibility"
                target="_blank"
                rel="noreferrer"
                id="footer-github-link"
                className="p-2 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                aria-label="GitHub"
              >
                <GithubLogo className="w-4 h-4" weight="bold" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Ready for Python FastAPI / Flask backend ingestion.
            </p>
          </div>

        </div>

        {/* Bottom copyright and back-to-top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <div>
            © 2026 Job Eligibility Checker. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" weight="bold" />
          </button>
        </div>
      </div>
    </footer>
  );
};
