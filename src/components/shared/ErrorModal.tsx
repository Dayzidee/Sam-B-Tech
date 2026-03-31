import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // User's package.json says "motion", but likely Framer
import { AlertCircle, X, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  title = "Something went wrong",
  message,
  onClose,
  onRetry
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-surface-container-highest rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/10 overflow-hidden"
          >
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <AlertCircle className="w-32 h-32 text-error" />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>

              <h3 className="text-2xl font-black tracking-tight text-on-surface mb-2">{title}</h3>
              <p className="text-secondary leading-relaxed mb-8">
                {message || "We encountered an unexpected technical issue. Our team has been notified and we're working to fix it."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {onRetry && (
                  <Button onClick={onRetry} variant="primary" className="flex-1 gap-2">
                    <RefreshCcw className="w-4 h-4" /> Try Again
                  </Button>
                )}
                <Button onClick={onClose} variant="outline" className="flex-1">
                  Dismiss
                </Button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-secondary hover:text-on-surface transition-colors rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
