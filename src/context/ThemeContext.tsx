import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jec_theme') as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
      // Respect system preference when no explicit user choice exists
      if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
      // Default to dark as per modern developer platform aesthetics
      return 'dark';
    }
    return 'dark';
  });

  // Mirrors `theme` synchronously so rapid toggles in the same tick don't read
  // a stale value out of the render closure.
  const currentThemeRef = useRef<Theme>(theme);

  // Identifies the most recent view transition so a superseded one can't strip
  // the helper class off the transition that replaced it.
  const transitionTokenRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    currentThemeRef.current = theme;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('jec_theme', theme);
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent) => {
    const isGoingDark = currentThemeRef.current === 'light';
    const newTheme: Theme = isGoingDark ? 'dark' : 'light';
    currentThemeRef.current = newTheme;

    // Get circle origin from the clicked button's center
    let x = window.innerWidth - 40;
    let y = 20;
    if (e?.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    // Radius large enough to cover the entire viewport from the origin point
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const supportsViewTransition = 'startViewTransition' in document;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsViewTransition || prefersReducedMotion) {
      // Fallback: instant toggle for unsupported browsers or reduced motion
      setThemeState(newTheme);
      return;
    }

    const token = ++transitionTokenRef.current;
    const releaseHelperClass = () => {
      // A newer toggle owns the class now; leave it alone.
      if (transitionTokenRef.current !== token) return;
      document.documentElement.classList.remove('light-transition');
    };

    // Telegram-style circular reveal via View Transition API.
    // When going to light mode we need the OLD snapshot (dark) on top so we can
    // animate its clip-path from full → zero (contracting). The CSS
    // `.light-transition` class flips the z-index stacking. Set it on every
    // toggle rather than only adding it, so an interrupted light transition
    // can't leave the stacking inverted for the dark transition that follows.
    document.documentElement.classList.toggle('light-transition', !isGoingDark);

    let transition: { ready: Promise<void>; finished: Promise<void> };
    try {
      transition = (document as any).startViewTransition(() => {
        // Synchronously toggle the dark class so the API captures the new state
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        setThemeState(newTheme);
      });
    } catch {
      // Never let a transition failure leave the theme unchanged
      releaseHelperClass();
      setThemeState(newTheme);
      return;
    }

    transition.ready.then(() => {
      const clipExpanded = `circle(${maxRadius}px at ${x}px ${y}px)`;
      const clipCollapsed = `circle(0px at ${x}px ${y}px)`;

      document.documentElement.animate(
        {
          clipPath: isGoingDark
            ? [clipCollapsed, clipExpanded]   // Dark expands outward from button
            : [clipExpanded, clipCollapsed]   // Light contracts back toward button
        },
        {
          duration: 450,
          easing: 'ease-out',
          fill: 'forwards',
          pseudoElement: isGoingDark
            ? '::view-transition-new(root)'   // Animate the new (dark) snapshot expanding
            : '::view-transition-old(root)'   // Animate the old (dark) snapshot contracting
        }
      );
    }).catch(() => {
      // Transition was skipped or interrupted — theme is already applied
    });

    // Clean up the helper class after the transition completes
    transition.finished.then(releaseHelperClass, releaseHelperClass);
  };

  const setTheme = (newTheme: Theme) => {
    currentThemeRef.current = newTheme;
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
