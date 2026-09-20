import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DeviceMobile, X } from '@phosphor-icons/react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('jec_install_dismissed');
    if (isDismissed === 'true') {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('jec_install_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-zinc-900/95 dark:bg-zinc-100/95 backdrop-blur shadow-2xl rounded-2xl p-4 border border-white/10 dark:border-black/10 flex items-center gap-4 text-white dark:text-black"
        >
          <div className="bg-zinc-800 dark:bg-zinc-200 p-2 rounded-xl shrink-0">
            <DeviceMobile weight="duotone" className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">Install App</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
              For a better experience
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="text-xs font-semibold px-3 py-1.5 bg-white dark:bg-black text-black dark:text-white rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-black"
              aria-label="Dismiss"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
