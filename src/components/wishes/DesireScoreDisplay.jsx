import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Flame, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Enhanced DesireScoreDisplay Component - Visual representation of desire score with 5-heart system
 *
 * Enhanced Features:
 * - Converted to 5-heart system while maintaining 1-10 internal scoring
 * - Advanced heart animations with pulsing, scaling, and color transitions
 * - Sophisticated hover effects with predictive highlighting
 * - Enhanced color psychology with gradient transitions
 * - Improved micro-interactions with haptic-style feedback
 * - Dynamic sparkle effects for high-value scores
 * - Advanced visual hierarchy with contextual sizing
 * - Smooth transitions between different emotional intensity levels
 *
 * Scoring System:
 * - Internal: 1-10 scale for compatibility
 * - Display: 5 hearts (each heart represents 2 points)
 * - Visual: Empty, half-filled, and full hearts based on score
 *
 * @param {number} score - Desire score from 1-10 (displayed as 5 hearts)
 * @param {string} variant - Display style: 'hearts' | 'stars' | 'flames' | 'numeric' | 'bar'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} interactive - Whether score can be changed
 * @param {function} onChange - Change handler for interactive mode
 * @param {boolean} showLabel - Whether to show "Desire Score" label
 * @param {string} className - Additional CSS classes
 */
const DesireScoreDisplay = React.forwardRef(({
  score = 0,
  variant = 'hearts',
  size = 'md',
  interactive = false,
  onChange,
  showLabel = false,
  className,
  ...props
}, ref) => {

  // Enhanced size configuration with improved scaling
  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-responsive-sm',
      bar: 'h-2',
      gap: 'gap-1',
      padding: 'p-1'
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-responsive-base',
      bar: 'h-3',
      gap: 'gap-2',
      padding: 'p-2'
    },
    lg: {
      icon: 'w-8 h-8',
      text: 'text-responsive-lg',
      bar: 'h-4',
      gap: 'gap-3',
      padding: 'p-3'
    }
  };

  const currentSize = sizeClasses[size];

  // Enhanced variant icons
  const variantIcons = {
    hearts: Heart,
    stars: Star,
    flames: Flame
  };

  // Advanced color intensity mapping with sophisticated gradients
  const getIntensityColor = (heartIndex, currentScore) => {
    const heartsToFill = Math.ceil(currentScore / 2);
    const heartValue = heartIndex + 1;

    if (heartValue <= heartsToFill) {
      // Determine color based on overall score intensity
      if (currentScore <= 2) return 'text-slate-400';      // Very Low: 1-2
      if (currentScore <= 4) return 'text-orange-400';     // Low: 3-4
      if (currentScore <= 6) return 'text-amber-400';      // Medium: 5-6
      if (currentScore <= 8) return 'text-emerald-400';    // High: 7-8
      return 'text-rose-400';                              // Very High: 9-10
    }
    return 'text-border';
  };

  // Enhanced gradient colors for backgrounds
  const getGradientColor = (currentScore) => {
    if (currentScore <= 2) return 'from-slate-500/20 to-slate-600/30';
    if (currentScore <= 4) return 'from-orange-500/20 to-orange-600/30';
    if (currentScore <= 6) return 'from-amber-500/20 to-amber-600/30';
    if (currentScore <= 8) return 'from-emerald-500/20 to-emerald-600/30';
    return 'from-rose-500/20 to-rose-600/30';
  };

  // Enhanced bar fill color mapping
  const getBarFillColor = (currentScore) => {
    if (currentScore <= 2) return 'bg-slate-400';
    if (currentScore <= 4) return 'bg-orange-400';
    if (currentScore <= 6) return 'bg-amber-400';
    if (currentScore <= 8) return 'bg-emerald-400';
    return 'bg-rose-400';
  };

  // Calculate heart fill state (empty, half, full)
  const getHeartFillState = (heartIndex, currentScore) => {
    const pointsForThisHeart = currentScore - (heartIndex * 2);
    if (pointsForThisHeart <= 0) return 'empty';
    if (pointsForThisHeart === 1) return 'half';
    return 'full';
  };

  // Handle interactive score change (convert heart index to 1-10 scale)
  const handleScoreChange = (heartIndex) => {
    if (interactive && onChange) {
      const newScore = (heartIndex + 1) * 2;
      onChange(Math.min(newScore, 10));
    }
  };

  // Handle hover prediction for interactive mode
  const handleHeartHover = (heartIndex) => {
    // This could be used for hover preview effects
  };

  // ENHANCED MOTION VARIANTS
  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const heartVariants = {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
        duration: 0.6
      }
    },
    hover: interactive ? {
      scale: 1.3,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15,
        duration: 0.3
      }
    } : {},
    tap: interactive ? {
      scale: 0.9,
      transition: { duration: 0.1 }
    } : {}
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut"
      }
    }
  };

  // Enhanced 5-heart display rendering
  const renderHeartsVariant = () => {
    const maxHearts = 5;
    const IconComponent = variantIcons[variant];

    return (
      <motion.div
        className={cn('flex items-center relative', currentSize.gap)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Background glow effect for high scores */}
        {score >= 8 && (
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full blur-lg -z-10',
              'bg-gradient-to-r from-rose-500/30 to-pink-500/30'
            )}
            variants={pulseVariants}
            animate="animate"
          />
        )}

        {Array.from({ length: maxHearts }, (_, index) => {
          const heartIndex = index;
          const fillState = getHeartFillState(heartIndex, score);
          const colorClass = getIntensityColor(heartIndex, score);
          const isInteractable = interactive;

          return (
            <motion.div
              key={index}
              className="relative"
              variants={heartVariants}
              whileHover={isInteractable ? "hover" : undefined}
              whileTap={isInteractable ? "tap" : undefined}
            >
              <motion.button
                type="button"
                disabled={!isInteractable}
                onClick={() => handleScoreChange(heartIndex)}
                onMouseEnter={() => handleHeartHover(heartIndex)}
                className={cn(
                  'transition-all duration-300 relative',
                  isInteractable && 'cursor-pointer',
                  !isInteractable && 'pointer-events-none'
                )}
                whileHover={isInteractable ? {
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                } : {}}
              >
                {/* Base heart (always visible for structure) */}
                <IconComponent
                  className={cn(
                    currentSize.icon,
                    fillState === 'empty' ? 'text-border' : 'opacity-0'
                  )}
                />

                {/* Half-filled heart */}
                {fillState === 'half' && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative overflow-hidden">
                      <IconComponent
                        className={cn(currentSize.icon, colorClass)}
                        style={{
                          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                        }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Full heart */}
                {fillState === 'full' && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent
                      className={cn(
                        currentSize.icon,
                        colorClass,
                        variant === 'hearts' && 'fill-current'
                      )}
                    />
                  </motion.div>
                )}

                {/* Sparkle effect for filled hearts on high scores */}
                {fillState !== 'empty' && score >= 9 && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    variants={sparkleVariants}
                    animate="animate"
                  >
                    <Sparkles className="w-2 h-2 text-yellow-300" />
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}

        {/* Score indicator for reference */}
        {interactive && (
          <motion.div
            className="ml-2 text-responsive-xs text-muted font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}/10
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Enhanced numeric display
  const renderNumericVariant = () => (
    <motion.div
      className={cn('flex items-center', currentSize.gap)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <motion.span
        className={cn('font-bold', getIntensityColor(0, score), currentSize.text)}
        key={score}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        {score}
      </motion.span>
      <span className={cn('text-muted', currentSize.text)}>
        / 10
      </span>
    </motion.div>
  );

  // Enhanced bar display
  const renderBarVariant = () => (
    <div className="flex items-center w-full max-w-32">
      <div className={cn('flex-1 bg-border rounded-full overflow-hidden', currentSize.bar)}>
        <motion.div
          className={cn('rounded-full', getBarFillColor(score), currentSize.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <motion.span
        className={cn('ml-2 font-medium', getIntensityColor(0, score), currentSize.text)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {score}
      </motion.span>
    </div>
  );

  // Content rendering logic
  const renderContent = () => {
    switch (variant) {
      case 'hearts':
      case 'stars':
      case 'flames':
        return renderHeartsVariant();
      case 'numeric':
        return renderNumericVariant();
      case 'bar':
        return renderBarVariant();
      default:
        return renderHeartsVariant();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex flex-col',
        !showLabel && 'items-center',
        currentSize.padding,
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Enhanced label with contextual messaging */}
      {showLabel && (
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={cn('text-muted font-medium', currentSize.text)}>
            Desire Level
          </span>
          <motion.p
            className="text-responsive-xs text-muted/70 mt-1"
            key={score}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {score <= 2 && "Mild interest"}
            {score > 2 && score <= 4 && "Some interest"}
            {score > 4 && score <= 6 && "Moderate desire"}
            {score > 6 && score <= 8 && "Strong want"}
            {score > 8 && "Must have!"}
          </motion.p>
        </motion.div>
      )}

      {/* Enhanced score display with background gradient */}
      <motion.div
        className={cn(
          'relative rounded-xl transition-all duration-500',
          interactive && 'hover:shadow-lg',
          score > 0 && `bg-gradient-to-r ${getGradientColor(score)}`,
          currentSize.padding
        )}
        whileHover={interactive ? { scale: 1.05 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {renderContent()}

        {/* Ambient glow effect for maximum scores */}
        {score === 10 && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-xl -z-10"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
});

DesireScoreDisplay.displayName = 'DesireScoreDisplay';

export default DesireScoreDisplay;