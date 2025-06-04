import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sunrise, Sunset, Stars, Cloud } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

/**
 * Enhanced ThemeToggle Component - Advanced theme switching with sophisticated animations
 *
 * Enhanced Features:
 * - Dynamic icon transitions with contextual animations
 * - Sophisticated glassmorphism with theme-aware styling
 * - Advanced particle effects during theme transitions
 * - Enhanced micro-interactions with haptic-style feedback
 * - Smooth color transitions with ambient lighting effects
 * - Improved accessibility with better visual feedback
 */
const ThemeToggle = ({ className, size = 'md', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();

  // Enhanced size configurations
  const sizeClasses = {
    sm: {
      button: 'p-2',
      icon: 'w-4 h-4',
      text: 'text-responsive-xs'
    },
    md: {
      button: 'p-2.5',
      icon: 'w-5 h-5',
      text: 'text-responsive-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-responsive-base'
    }
  };

  const currentSize = sizeClasses[size];

  // Enhanced icon mapping with contextual variants
  const getThemeIcon = () => {
    if (theme === 'dark') {
      return {
        main: Moon,
        accent: Stars,
        particles: ['✨', '🌟', '⭐'],
        color: 'text-blue-200'
      };
    }
    return {
      main: Sun,
      accent: Cloud,
      particles: ['☀️', '🌞', '✨'],
      color: 'text-amber-400'
    };
  };

  const iconConfig = getThemeIcon();
  const MainIcon = iconConfig.main;
  const AccentIcon = iconConfig.accent;

  // ENHANCED MOTION VARIANTS
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: theme === 'dark'
        ? "0 8px 25px rgba(59, 130, 246, 0.3)"
        : "0 8px 25px rgba(251, 191, 36, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      opacity: 1
    },
    animate: {
      scale: 1,
      rotate: theme === 'dark' ? 0 : 360,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      scale: 0.8,
      rotate: theme === 'dark' ? -180 : 180,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const particleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const glowVariants = {
    animate: theme === 'dark' ? {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.4)",
        "0 0 30px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.4)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    } : {
      boxShadow: [
        "0 0 20px rgba(251, 191, 36, 0.4)",
        "0 0 30px rgba(251, 191, 36, 0.6)",
        "0 0 20px rgba(251, 191, 36, 0.4)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.button
        onClick={toggleTheme}
        className={cn(
          "relative rounded-xl border transition-all duration-300 overflow-hidden",
          currentSize.button,
          // Enhanced glassmorphism with theme awareness
          theme === 'dark'
            ? "bg-gradient-to-r from-slate-800/90 via-slate-700/80 to-slate-800/90 border-slate-600/50 hover:border-blue-400/50"
            : "bg-gradient-to-r from-amber-50/90 via-yellow-50/80 to-amber-50/90 border-amber-200/50 hover:border-amber-400/50",
          "backdrop-blur-md shadow-lg hover:shadow-xl",
          // Texture overlay
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none"
        )}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {/* Ambient glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          variants={glowVariants}
          animate="animate"
        />

        {/* Main icon container */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn("flex items-center justify-center", iconConfig.color)}
            >
              <MainIcon className={currentSize.icon} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating particles */}
        <AnimatePresence>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`${theme}-particle-${i}`}
              className="absolute pointer-events-none text-xs"
              style={{
                left: `${20 + i * 25}%`,
                top: `${15 + i * 10}%`,
              }}
              variants={particleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: i * 0.2 }}
            >
              {iconConfig.particles[i]}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Accent icon for additional visual interest */}
        <motion.div
          className="absolute top-0 right-0 opacity-20"
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <AccentIcon className="w-2 h-2" />
        </motion.div>
      </motion.button>

      {/* Optional label */}
      {showLabel && (
        <motion.span
          className={cn(
            "font-medium transition-colors duration-300",
            currentSize.text,
            theme === 'dark' ? 'text-blue-200' : 'text-amber-600'
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {theme === 'dark' ? 'Dark' : 'Light'}
        </motion.span>
      )}
    </div>
  );
};

export default ThemeToggle;