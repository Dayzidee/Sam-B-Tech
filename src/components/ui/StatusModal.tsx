import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { cn } from '@/utils';

export type StatusType = 'success' | 'error' | 'info';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: StatusType;
  title: string;
  message: string;
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message
}) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
          bg: 'bg-green-50',
          border: 'border-green-100',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          bg: 'bg-red-50',
          border: 'border-red-100',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'info':
        return {
          icon: <Info className="w-8 h-8 text-blue-500" />,
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border",
              styles.border
            )}
          >
            <div className={cn("p-8 flex flex-col items-center text-center", styles.bg)}>
              <div className="mb-4 p-3 bg-white rounded-2xl shadow-sm">
                {styles.icon}
              </div>
              <h3 className="text-xl font-headline font-black text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {message}
              </p>
              <Button 
                onClick={onClose}
                className={cn("w-full h-12 font-black uppercase tracking-widest text-[10px] text-white", styles.button)}
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
