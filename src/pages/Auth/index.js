import React from 'react';
import { motion } from 'framer-motion';
import AuthPageMobile from './Auth.mobile';
import AuthPageDesktop from './Auth.desktop';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * EyeWantIt AuthPage Router
 * 
 * Intelligent routing between mobile and desktop authentication experiences
 * with proper loading states and theme awareness
 */
function AuthPage() {
  const { isMobile, isLoading } = useIsMobile();
  const { theme, isLoading: themeLoading } = useTheme();

  // Show loading state while determining layout
  if (isLoading || themeLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <motion.p
            className="text-sm text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Preparing your EyeWantIt experience...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Render appropriate layout based on device type
  return (
    <motion.div
      key={isMobile ? 'mobile' : 'desktop'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {isMobile ? <AuthPageMobile /> : <AuthPageDesktop />}
    </motion.div>
  );
}

export default AuthPage;