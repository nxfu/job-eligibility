import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, WarningCircle, Warning, Info, X } from '@phosphor-icons/react';
import { TRANSITION_EASE } from '../utils/motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" weight="fill" />,
    error: <WarningCircle className="w-5 h-5 text-rose-500" weight="fill" />,
    warning: <Warning className="w-5 h-5 text-amber-500" weight="fill" />,
    info: <Info className="w-5 h-5 text-cyan-500" weight="fill" />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: TRANSITION_EASE }}
      className="pointer-events-auto flex items-start gap-3 p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg w-full max-w-sm"
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 ml-2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        <X className="w-4 h-4" weight="bold" />
      </button>
    </motion.div>
  );
};
