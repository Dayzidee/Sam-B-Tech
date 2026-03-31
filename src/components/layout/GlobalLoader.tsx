import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md"
        >
          <div className="relative">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
            />
            
            {/* Inner pulsing logo/icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center"
              >
                <div className="w-6 h-6 border-2 border-on-primary-fixed rounded-sm transform rotate-45" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <h2 className="text-xl font-black tracking-tight text-on-surface mb-1">
              SAM-B <span className="text-primary">TECH</span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-secondary text-xs font-bold uppercase tracking-widest">
              <Loader2 className="w-3 h-3 animate-spin" />
              Initialising Precision...
            </div>
          </motion.div>

          {/* Progress bar hint */}
          <div className="absolute bottom-0 left-0 h-1 bg-primary-container/30 w-full overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="h-full w-1/3 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
