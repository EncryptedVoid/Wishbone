import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Users,
  Heart,
  ShoppingBag,
  Gift,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * DibsIndicator Component - Visual indicator showing reservation status
 *
 * Features:
 * - Different visual states for dibs status
 * - Smooth status transitions
 * - Contextual icons and colors
 * - Minimal visual footprint
 * - Theme-aware styling
 *
 * @param {string|null} dibbedBy - User ID who has dibbed this item
 * @param {string} currentUserId - Current user's ID
 * @param {string} variant - Style variant: 'subtle' | 'prominent' | 'minimal'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} showLabel - Whether to show text label
 * @param {string} className - Additional CSS classes
 */
const DibsIndicator = React.forwardRef(({
  dibbedBy = null,
  currentUserId,
  variant = 'subtle',
  size = 'sm',
  showLabel = true,
  className,
  ...props
}, ref) => {

  // Determine current state
  const isAvailable = !dibbedBy;
  const isReservedByMe = dibbedBy === currentUserId;
  const isReservedByOther = dibbedBy && dibbedBy !== currentUserId;

  // Size configurations
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'px-2.5 py-1.5 text-sm gap-1.5',
      icon: 'w-4 h-4'
    },
    lg: {
      container: 'px-3 py-2 text-base gap-2',
      icon: 'w-5 h-5'
    }
  };

  // State configurations
  const stateConfigs = {
    available: {
      icon: Gift,
      label: 'Available',
      colors: {
        subtle: 'bg-green-50/80 text-green-600 border-green-200',
        prominent: 'bg-green-100 text-green-700 border-green-300',
        minimal: 'text-green-600'
      }
    },
    reservedByMe: {
      icon: Heart,
      label: 'Reserved by You',
      colors: {
        subtle: 'bg-blue-50/80 text-blue-600 border-blue-200',
        prominent: 'bg-blue-100 text-blue-700 border-blue-300',
        minimal: 'text-blue-600'
      }
    },
    reservedByOther: {
      icon: CheckCircle,
      label: 'Reserved',
      colors: {
        subtle: 'bg-gray-50/80 text-gray-600 border-gray-200',
        prominent: 'bg-gray-100 text-gray-700 border-gray-300',
        minimal: 'text-gray-600'
      }
    }
  };

  const currentSize = sizeClasses[size];
  const currentState = isAvailable ? 'available' : isReservedByMe ? 'reservedByMe' : 'reservedByOther';
  const config = stateConfigs[currentState];
  const IconComponent = config.icon;

  // Don't render if available and using minimal variant
  if (isAvailable && variant === 'minimal') {
    return null;
  }

  // Animation variants
  const indicatorVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      x: 10
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: 0,
      scale: 1,
      transition: { delay: 0.1 }
    },
    hover: {
      rotate: currentState === 'reservedByMe' ? 10 : 0,
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  // Pulsing effect for reserved by me
  const pulseVariants = isReservedByMe ? {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  } : {};

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center font-medium',
        'transition-all duration-200 select-none',

        // Variant-specific styles
        variant !== 'minimal' && [
          'rounded-full border backdrop-blur-sm',
          currentSize.container
        ],
        variant === 'minimal' && 'gap-1',

        // Colors
        config.colors[variant],

        className
      )}
      variants={indicatorVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      {...props}
    >
      {/* Background pulse effect for special states */}
      {isReservedByMe && variant !== 'minimal' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400/20"
          variants={pulseVariants}
          animate="animate"
        />
      )}

      {/* Icon */}
      <motion.div
        variants={iconVariants}
        className="relative z-10 flex-shrink-0"
      >
        <IconComponent className={currentSize.icon} />
      </motion.div>

      {/* Label */}
      {showLabel && (
        <motion.span
          className="truncate relative z-10"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          {config.label}
        </motion.span>
      )}

      {/* Subtle glow for reserved by me */}
      {isReservedByMe && variant === 'prominent' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/10 blur-sm"
          animate={{
            opacity: [0.3, 0.6, 0.3],
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
  );
});

DibsIndicator.displayName = 'DibsIndicator';

export default DibsIndicator;