import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Flame } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * DesireScoreDisplay Component - Visual representation of desire score (1-10)
 *
 * Features:
 * - Multiple display styles (hearts, stars, flames, numeric, bar)
 * - Responsive sizing using our semantic system
 * - Theme-aware colors with intensity mapping
 * - Animated rendering for visual appeal
 * - Interactive mode for score selection
 *
 * @param {number} score - Desire score from 1-10
 * @param {string} variant - Display style: 'hearts' | 'stars' | 'flames' | 'numeric' | 'bar' (default: 'hearts')
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} interactive - Whether score can be changed (default: false)
 * @param {function} onChange - Change handler for interactive mode
 * @param {boolean} showLabel - Whether to show "Desire Score" label (default: false)
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

  // SIZE STYLES - Using our semantic sizing system
  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-responsive-xs',
      bar: 'h-1.5',
      gap: 'gap-1'
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-responsive-sm',
      bar: 'h-2',
      gap: 'gap-1.5'
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-responsive-base',
      bar: 'h-2.5',
      gap: 'gap-2'
    }
  };

  const currentSize = sizeClasses[size];

  // VARIANT ICONS
  const variantIcons = {
    hearts: Heart,
    stars: Star,
    flames: Flame
  };

  // COLOR INTENSITY MAPPING - Based on score value
  const getIntensityColor = (currentScore, maxScore = 10) => {
    const intensity = currentScore / maxScore;

    if (intensity <= 0.3) return 'text-muted';           // Low: 1-3
    if (intensity <= 0.6) return 'text-warning';        // Medium: 4-6
    if (intensity <= 0.8) return 'text-primary-500';    // High: 7-8
    return 'text-error';                                 // Very High: 9-10
  };

  // BAR FILL COLOR MAPPING
  const getBarFillColor = (currentScore, maxScore = 10) => {
    const intensity = currentScore / maxScore;

    if (intensity <= 0.3) return 'bg-muted';
    if (intensity <= 0.6) return 'bg-warning';
    if (intensity <= 0.8) return 'bg-primary-500';
    return 'bg-error';
  };

  // Handle interactive score change
  const handleScoreChange = (newScore) => {
    if (interactive && onChange) {
      onChange(newScore);
    }
  };

  // MOTION VARIANTS
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    }
  };

  // RENDER VARIANTS
  const renderIconVariant = () => {
    const IconComponent = variantIcons[variant];
    const maxScore = 10;

    return (
      <motion.div
        className={cn('flex items-center', currentSize.gap)}
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: maxScore }, (_, index) => {
          const iconScore = index + 1;
          const isFilled = iconScore <= score;

          return (
            <motion.button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => handleScoreChange(iconScore)}
              className={cn(
                'transition-all duration-200',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'pointer-events-none',
                isFilled ? getIntensityColor(score) : 'text-border'
              )}
              variants={itemVariants}
              whileHover={interactive ? { scale: 1.2 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
            >
              <IconComponent
                className={cn(
                  currentSize.icon,
                  isFilled && variant === 'hearts' && 'fill-current'
                )}
              />
            </motion.button>
          );
        })}
      </motion.div>
    );
  };

  const renderNumericVariant = () => (
    <div className={cn('flex items-center', currentSize.gap)}>
      <span className={cn('font-bold', getIntensityColor(score), currentSize.text)}>
        {score}
      </span>
      <span className={cn('text-muted', currentSize.text)}>
        / 10
      </span>
    </div>
  );

  const renderBarVariant = () => (
    <div className="flex items-center w-full max-w-24">
      <div className={cn('flex-1 bg-border rounded-full', currentSize.bar)}>
        <motion.div
          className={cn('rounded-full', getBarFillColor(score), currentSize.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className={cn('ml-2 font-medium', getIntensityColor(score), currentSize.text)}>
        {score}
      </span>
    </div>
  );

  // RENDER CONTENT
  const renderContent = () => {
    switch (variant) {
      case 'hearts':
      case 'stars':
      case 'flames':
        return renderIconVariant();
      case 'numeric':
        return renderNumericVariant();
      case 'bar':
        return renderBarVariant();
      default:
        return renderIconVariant();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col',
        !showLabel && 'items-center',
        className
      )}
      {...props}
    >
      {/* Label */}
      {showLabel && (
        <span className={cn('text-muted font-medium mb-1', currentSize.text)}>
          Desire Score
        </span>
      )}

      {/* Score Display */}
      {renderContent()}
    </div>
  );
});

DesireScoreDisplay.displayName = 'DesireScoreDisplay';

export default DesireScoreDisplay;

/*
USAGE EXAMPLES:

// Basic desire score display
<DesireScoreDisplay score={7} />

// Different variants
<DesireScoreDisplay score={8} variant="hearts" />
<DesireScoreDisplay score={6} variant="stars" />
<DesireScoreDisplay score={9} variant="flames" />
<DesireScoreDisplay score={5} variant="numeric" />
<DesireScoreDisplay score={7} variant="bar" />

// Different sizes
<DesireScoreDisplay score={8} size="sm" />
<DesireScoreDisplay score={8} size="md" />
<DesireScoreDisplay score={8} size="lg" />

// Interactive score selector
<DesireScoreDisplay
  score={userScore}
  interactive
  onChange={setUserScore}
  showLabel
  variant="hearts"
/>

// With label for forms
<DesireScoreDisplay
  score={wishItem.desireScore}
  showLabel
  variant="bar"
/>

// On wish cards (compact)
<DesireScoreDisplay
  score={item.desireScore}
  size="sm"
  variant="hearts"
/>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Color intensity mapping (low=muted, high=error)
- Multiple visual styles for different contexts
- Interactive mode for score selection
- Smooth animations for visual appeal
- Semantic sizing system integration
- Professional color progression
*/