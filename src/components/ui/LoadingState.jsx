import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoadingState = ({
  isLoading,
  children,
  fallback,
  overlay = false,
  className = ""
}) => {
  if (overlay) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              {fallback || <LoadingSpinner size="lg" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`flex items-center justify-center p-8 ${className}`}
        >
          {fallback || <LoadingSpinner size="lg" />}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingState;