import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Gift, Loader2 } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * DibsButton Component - Button for friends to reserve/unreserve gift items
 *
 * Features:
 * - Different states: available, reserved by user, reserved by others
 * - Loading states with smooth transitions
 * - Haptic-style feedback animations
 * - Icon transitions for different states
 * - Theme-aware styling
 *
 * @param {string} itemId - ID of the wish item
 * @param {string|null} dibbedBy - User ID who has dibbed this item (null if available)
 * @param {string} currentUserId - Current user's ID
 * @param {function} onDibsChange - Callback when dibs status changes
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 */
const DibsButton = React.forwardRef(({
  itemId,
  dibbedBy = null,
  currentUserId,
  onDibsChange,
  disabled = false,
  size = 'md',
  className,
  ...props
}, ref) => {

  const [loading, setLoading] = useState(false);

  // Determine current state
  const isAvailable = !dibbedBy;
  const isReservedByMe = dibbedBy === currentUserId;
  const isReservedByOther = dibbedBy && dibbedBy !== currentUserId;

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'px-3 py-1.5 text-xs gap-1.5',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'px-4 py-2 text-sm gap-2',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'px-6 py-3 text-base gap-2.5',
      icon: 'w-5 h-5'
    }
  };

  // State configurations
  const stateConfigs = {
    available: {
      icon: Gift,
      label: 'Reserve as Gift',
      colors: 'bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-300 hover:border-green-400',
      hoverColors: 'hover:bg-green-500 hover:text-white',
      action: 'reserve'
    },
    reservedByMe: {
      icon: Heart,
      label: 'Reserved by You',
      colors: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 border-blue-300 hover:border-blue-400',
      hoverColors: 'hover:bg-red-500 hover:text-white hover:border-red-400',
      action: 'unreserve'
    },
    reservedByOther: {
      icon: ShoppingBag,
      label: 'Reserved by Someone',
      colors: 'bg-gray-500/10 text-gray-600 border-gray-300 cursor-not-allowed',
      hoverColors: '',
      action: null
    }
  };

  const currentSize = sizeClasses[size];
  const currentState = isAvailable ? 'available' : isReservedByMe ? 'reservedByMe' : 'reservedByOther';
  const config = stateConfigs[currentState];
  const IconComponent = config.icon;

  // Handle click action
  const handleClick = async (e) => {
    e.stopPropagation(); // Prevent card click

    if (disabled || loading || !config.action || !onDibsChange) return;

    try {
      setLoading(true);

      if (config.action === 'reserve') {
        await onDibsChange(itemId, 'claim');
      } else if (config.action === 'unreserve') {
        await onDibsChange(itemId, 'unclaim');
      }

    } catch (error) {
      console.error('Error updating dibs status:', error);
      // Error handling could be improved with toast notifications
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      y: -1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 }
    },
    loading: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: currentState === 'available' ? 10 : currentState === 'reservedByMe' ? -10 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const isInteractive = !disabled && !loading && config.action;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={handleClick}
      disabled={disabled || loading || !config.action}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium rounded-lg border',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
        'select-none backdrop-blur-sm',

        // Size
        currentSize.button,

        // State colors
        config.colors,
        isInteractive && config.hoverColors,

        // Loading state
        loading && 'opacity-75',

        className
      )}
      variants={buttonVariants}
      initial="initial"
      animate={loading ? "loading" : "initial"}
      whileHover={isInteractive ? "hover" : undefined}
      whileTap={isInteractive ? "tap" : undefined}
      {...props}
    >
      {/* Icon */}
      <motion.div
        variants={iconVariants}
        animate={loading ? "loading" : "initial"}
        whileHover={isInteractive ? "hover" : undefined}
      >
        {loading ? (
          <Loader2 className={currentSize.icon} />
        ) : (
          <IconComponent className={currentSize.icon} />
        )}
      </motion.div>

      {/* Label */}
      <span className="truncate">
        {loading ? 'Updating...' : config.label}
      </span>

      {/* Subtle background pulse for reserved items */}
      {isReservedByMe && !loading && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-blue-400/20"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
});

DibsButton.displayName = 'DibsButton';

export default DibsButton;