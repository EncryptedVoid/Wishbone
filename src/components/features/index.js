import React from 'react';
import { motion } from 'framer-motion';
import FeaturesMobile from './Features.mobile';
import FeaturesDesktop from './Features.desktop';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * EyeWantIt Features Section Router
 *
 * Smart component that renders the appropriate features experience
 * based on device type with loading states
 */
function Features() {
  const { isMobile, isLoading } = useIsMobile();
  const { theme, isLoading: themeLoading } = useTheme();

  // loading state for features section
  if (isLoading || themeLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface/30 to-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Background effects while loading */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{
              background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <motion.div
            className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full opacity-10 blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 100%)',
            }}
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="text-center z-10">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <motion.p
            className="text-sm text-muted"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Loading features showcase...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Render appropriate features based on device
  return (
    <motion.div
      key={isMobile ? 'mobile' : 'desktop'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {isMobile ? <FeaturesMobile /> : <FeaturesDesktop />}
    </motion.div>
  );
}

export default Features;