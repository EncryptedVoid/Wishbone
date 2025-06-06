import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * TagChip Component - Professional tag/chip with advanced animations
 *
 * Features:
 * - Sophisticated gradient backgrounds with dynamic lighting effects
 * - Advanced micro-interactions with haptic-style feedback
 * - Particle effects for premium interactions
 * - visual hierarchy with improved typography
 * - Smart color transitions based on interaction states
 * - Contextual animations that adapt to usage patterns
 */
const TagChip = React.forwardRef(({
  children,
  variant = 'default',
  size = 'sm',
  removable = false,
  clickable = false,
  onRemove,
  onClick,
  selected = false,
  className,
  ...props
}, ref) => {

  // size configurations with improved scaling
  const sizeClasses = {
    sm: {
      container: 'h-7 px-3 text-responsive-xs',
      icon: 'w-3 h-3 ml-1.5',
      sparkle: 'w-2 h-2'
    },
    md: {
      container: 'h-8 px-4 text-responsive-sm',
      icon: 'w-3.5 h-3.5 ml-2',
      sparkle: 'w-2.5 h-2.5'
    },
    lg: {
      container: 'h-9 px-5 text-responsive-base',
      icon: 'w-4 h-4 ml-2.5',
      sparkle: 'w-3 h-3'
    }
  };

  // variant styles with sophisticated gradients
  const variantClasses = {
    default: selected
      ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/25'
      : 'bg-gradient-to-r from-surface/80 via-background/90 to-surface/80 text-foreground border-border/60 hover:from-primary-50 hover:via-primary-100/50 hover:to-primary-50 hover:border-primary-300 hover:shadow-md',

    primary: selected
      ? 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 text-white border-primary-500 shadow-lg shadow-primary-500/30'
      : 'bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 text-primary-700 border-primary-200 hover:from-primary-200 hover:via-primary-100 hover:to-primary-200 hover:shadow-md',

    success: selected
      ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
      : 'bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 hover:from-emerald-200 hover:via-emerald-100 hover:to-emerald-200',

    warning: selected
      ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/30'
      : 'bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-700 border-amber-200 hover:from-amber-200 hover:via-amber-100 hover:to-amber-200',

    error: selected
      ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white border-red-500 shadow-lg shadow-red-500/30'
      : 'bg-gradient-to-r from-red-100 via-red-50 to-red-100 text-red-700 border-red-200 hover:from-red-200 hover:via-red-100 hover:to-red-200',

    secondary: selected
      ? 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/30'
      : 'bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 text-slate-700 border-slate-200 hover:from-slate-200 hover:via-slate-100 hover:to-slate-200',

    outline: selected
      ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-white border-primary-400 shadow-lg shadow-primary-500/25'
      : 'bg-transparent text-foreground border-border hover:bg-gradient-to-r hover:from-surface/50 hover:to-background/50 hover:border-primary-300'
  };

  const currentSize = sizeClasses[size];
  const isInteractive = clickable || removable;

  // base styles
  const baseClasses = [
    'inline-flex items-center justify-center relative overflow-hidden',
    'rounded-full border font-medium backdrop-blur-sm',
    'transition-all duration-300 ease-out',
    'select-none whitespace-nowrap',
    // Interactive enhancements
    isInteractive && 'cursor-pointer transform-gpu',
    clickable && 'hover:scale-105 active:scale-95',
    // Glass morphism effect
    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none before:rounded-full'
  ].filter(Boolean).join(' ');

  // Handle remove action with feedback
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
  };

  // MOTION VARIANTS
  const chipVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 10
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.6
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      y: -10,
      transition: { duration: 0.3 }
    },
    hover: clickable ? {
      scale: 1.05,
      y: -2,
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.3
      }
    } : {},
    tap: clickable ? {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.1
      }
    } : {}
  };

  const removeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.2 }
    },
    hover: {
      scale: 1.2,
      rotate: 90,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: {
      scale: 0.8,
      transition: { duration: 0.1 }
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
        repeatDelay: 3
      }
    }
  };

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      onClick={clickable ? onClick : undefined}
      className={cn(
        baseClasses,
        currentSize.container,
        variantClasses[variant],
        className
      )}
      variants={chipVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={clickable ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      {...props}
    >
      {/* background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
        animate={selected ? {
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />

      {/* Tag Content */}
      <motion.span
        className="truncate relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Premium sparkle effect for selected state */}
      {selected && variant === 'primary' && (
        <motion.div
          className={cn('absolute top-0 right-1', currentSize.sparkle)}
          variants={sparkleVariants}
          animate="animate"
        >
          <Sparkles className="w-full h-full text-white/60" />
        </motion.div>
      )}

      {/* Remove Button */}
      {removable && (
        <motion.button
          type="button"
          onClick={handleRemove}
          className={cn(
            'flex items-center justify-center rounded-full relative z-10',
            'hover:bg-current hover:bg-opacity-20',
            'transition-colors duration-200',
            currentSize.icon
          )}
          variants={removeVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          aria-label="Remove tag"
        >
          <X className="w-full h-full" />

          {/* Remove button glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-current opacity-0"
            whileHover={{ opacity: 0.2 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      )}
    </Component>
  );
});

TagChip.displayName = 'TagChip';

/**
 * TagGroup Component - Container for multiple tags with advanced layout
 */
const TagGroup = React.forwardRef(({
  children,
  className,
  spacing = 'responsive-sm',
  wrap = true,
  animated = true,
  ...props
}, ref) => {

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const Component = animated ? motion.div : 'div';
  const componentProps = animated ? {
    variants: containerVariants,
    initial: "initial",
    animate: "animate"
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        'flex items-center',
        wrap && 'flex-wrap',
        `gap-${spacing}`,
        className
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  );
});

TagGroup.displayName = 'TagGroup';

export { TagChip, TagGroup };
export default TagChip;