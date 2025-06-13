import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

/**
 * CollectionCount Component - Displays item count for collections
 *
 * Features:
 * - Animated count updates
 * - Theme-aware styling
 * - Different variants for different contexts
 * - Responsive sizing
 *
 * @param {number} count - Number of items in collection
 * @param {string} variant - Style variant: 'default' | 'active' | 'muted'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} animated - Whether to animate count changes
 * @param {string} className - Additional CSS classes
 */
const CollectionCount = React.forwardRef(({
  count = 0,
  variant = 'default',
  size = 'sm',
  animated = true,
  className,
  ...props
}, ref) => {

  // Size configurations
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 min-w-[1.25rem] h-5',
    md: 'text-sm px-2.5 py-1 min-w-[1.5rem] h-6',
    lg: 'text-base px-3 py-1.5 min-w-[2rem] h-8'
  };

  // Variant configurations
  const variantClasses = {
    default: 'bg-muted/80 text-muted-foreground border-border',
    active: 'bg-primary-500/20 text-primary-700 border-primary-300 dark:bg-primary-400/20 dark:text-primary-300',
    muted: 'bg-background/50 text-muted-foreground/70 border-border/50'
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  // Animation variants
  const countVariants = {
    initial: { scale: 1, opacity: 1 },
    update: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const Component = animated ? motion.span : 'span';
  const animationProps = animated ? {
    key: count, // Re-trigger animation when count changes
    variants: countVariants,
    initial: "initial",
    animate: "update"
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'rounded-full font-medium border',
        'transition-all duration-200',
        'select-none tabular-nums', // Consistent number width

        // Size and variant
        currentSize,
        currentVariant,

        // Hide if count is 0
        count === 0 && 'opacity-0',

        className
      )}
      {...animationProps}
      {...props}
    >
      {count}
    </Component>
  );
});

CollectionCount.displayName = 'CollectionCount';

export default CollectionCount;