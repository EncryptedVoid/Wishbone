import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Flame } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * WishScore Component - Heart-based desire score display (replaces progress bar)
 *
 * Features:
 * - Heart-based 1-10 scale (5 hearts, each represents 2 points)
 * - Interactive mode for editing scores
 * - Multiple icon variants (hearts, stars, flames)
 * - Smooth fill animations
 * - Hover predictions in interactive mode
 * - Theme-aware coloring
 *
 * @param {number} score - Score from 1-10
 * @param {string} variant - Icon type: 'hearts' | 'stars' | 'flames'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} interactive - Whether score can be changed by clicking
 * @param {function} onChange - Change handler for interactive mode
 * @param {boolean} showLabel - Whether to show numeric label
 * @param {string} className - Additional CSS classes
 */
const WishScore = React.forwardRef(({
  score = 0,
  variant = 'hearts',
  size = 'sm',
  interactive = false,
  onChange,
  showLabel = true,
  className,
  ...props
}, ref) => {

  const [hoverScore, setHoverScore] = useState(null);

  // Icon mapping
  const icons = {
    hearts: Heart,
    stars: Star,
    flames: Flame
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      gap: 'gap-1',
      text: 'text-xs'
    },
    md: {
      icon: 'w-5 h-5',
      gap: 'gap-1.5',
      text: 'text-sm'
    },
    lg: {
      icon: 'w-6 h-6',
      gap: 'gap-2',
      text: 'text-base'
    }
  };

  // Color configurations based on score intensity
  const getScoreColor = (currentScore) => {
    if (currentScore <= 2) return 'text-gray-400';
    if (currentScore <= 4) return 'text-yellow-400';
    if (currentScore <= 6) return 'text-orange-400';
    if (currentScore <= 8) return 'text-red-400';
    return 'text-pink-500';
  };

  const getScoreLabel = (currentScore) => {
    if (currentScore <= 2) return 'Low interest';
    if (currentScore <= 4) return 'Some interest';
    if (currentScore <= 6) return 'Moderate desire';
    if (currentScore <= 8) return 'Strong want';
    return 'Must have!';
  };

  const IconComponent = icons[variant];
  const currentSize = sizeClasses[size];
  const displayScore = hoverScore ?? score;
  const maxIcons = 5; // 5 icons represent 1-10 scale

  // Calculate how many icons should be filled and how much
  const getIconState = (iconIndex, currentScore) => {
    const iconValue = (iconIndex + 1) * 2; // Each icon represents 2 points
    const pointsForThisIcon = currentScore - (iconIndex * 2);

    if (pointsForThisIcon <= 0) return 'empty';
    if (pointsForThisIcon === 1) return 'half';
    return 'full';
  };

  // Handle icon click for interactive mode
  const handleIconClick = (iconIndex) => {
    if (!interactive || !onChange) return;

    const newScore = (iconIndex + 1) * 2; // Convert to 1-10 scale
    onChange(Math.min(newScore, 10));
  };

  // Handle hover for preview
  const handleIconHover = (iconIndex) => {
    if (!interactive) return;

    const previewScore = (iconIndex + 1) * 2;
    setHoverScore(Math.min(previewScore, 10));
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverScore(null);
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 5 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    },
    hover: interactive ? {
      scale: 1.2,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    } : {},
    tap: interactive ? {
      scale: 0.9,
      transition: { duration: 0.1 }
    } : {}
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex items-center',
        currentSize.gap,
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Icons */}
      <div className={cn('flex items-center', currentSize.gap)}>
        {Array.from({ length: maxIcons }, (_, index) => {
          const iconState = getIconState(index, displayScore);
          const isInteractable = interactive;

          return (
            <motion.button
              key={index}
              type="button"
              disabled={!isInteractable}
              onClick={() => handleIconClick(index)}
              onMouseEnter={() => handleIconHover(index)}
              className={cn(
                'relative transition-all duration-200',
                isInteractable ? 'cursor-pointer' : 'cursor-default',
                !isInteractable && 'pointer-events-none'
              )}
              variants={iconVariants}
              whileHover={isInteractable ? "hover" : undefined}
              whileTap={isInteractable ? "tap" : undefined}
            >
              {/* Base icon (empty state) */}
              <IconComponent
                className={cn(
                  currentSize.icon,
                  iconState === 'empty' ? 'text-gray-200 dark:text-gray-700' : 'opacity-0'
                )}
              />

              {/* Half-filled icon */}
              {iconState === 'half' && (
                <div className="absolute inset-0 overflow-hidden">
                  <IconComponent
                    className={cn(
                      currentSize.icon,
                      getScoreColor(displayScore),
                      variant === 'hearts' && 'fill-current'
                    )}
                    style={{
                      clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                    }}
                  />
                </div>
              )}

              {/* Full icon */}
              {iconState === 'full' && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconComponent
                    className={cn(
                      currentSize.icon,
                      getScoreColor(displayScore),
                      variant === 'hearts' && 'fill-current'
                    )}
                  />
                </motion.div>
              )}

              {/* Glow effect for high scores */}
              {iconState !== 'empty' && displayScore >= 8 && (
                <motion.div
                  className="absolute inset-0 -z-10"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <IconComponent
                    className={cn(
                      currentSize.icon,
                      getScoreColor(displayScore),
                      'blur-sm'
                    )}
                  />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Score label */}
      {showLabel && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={cn('font-medium tabular-nums', currentSize.text, getScoreColor(displayScore))}>
            {displayScore}/10
          </span>

          {size !== 'sm' && (
            <motion.span
              key={displayScore} // Re-trigger animation on score change
              className={cn('text-xs text-muted-foreground')}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {getScoreLabel(displayScore)}
            </motion.span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
});

WishScore.displayName = 'WishScore';

export default WishScore;