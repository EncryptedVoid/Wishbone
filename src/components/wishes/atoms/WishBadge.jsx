import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Target, Eye, Heart, Crown, Clock } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * WishBadge Component - Status badges for wish items
 *
 * Features:
 * - Multiple badge types with contextual icons and colors
 * - Smooth animations and hover effects
 * - Theme-aware styling
 * - Glassmorphism effects
 * - Responsive sizing
 *
 * @param {string} type - Badge type: 'private' | 'reserved' | 'public' | 'claimed' | 'owner' | 'pending'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} variant - Style variant: 'solid' | 'outline' | 'ghost'
 * @param {boolean} animated - Whether to show entrance animation
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Custom content (overrides type-based content)
 */
const WishBadge = React.forwardRef(({
  type = 'private',
  size = 'sm',
  variant = 'solid',
  animated = true,
  className,
  children,
  ...props
}, ref) => {

  // Badge configurations
  const badgeConfigs = {
    private: {
      icon: Lock,
      label: 'Private',
      colors: {
        solid: 'bg-slate-500/90 text-white border-slate-400',
        outline: 'bg-slate-50/90 text-slate-700 border-slate-300',
        ghost: 'bg-slate-100/50 text-slate-600'
      }
    },
    reserved: {
      icon: Target,
      label: 'Reserved',
      colors: {
        solid: 'bg-amber-500/90 text-white border-amber-400',
        outline: 'bg-amber-50/90 text-amber-700 border-amber-300',
        ghost: 'bg-amber-100/50 text-amber-600'
      }
    },
    public: {
      icon: Eye,
      label: 'Public',
      colors: {
        solid: 'bg-green-500/90 text-white border-green-400',
        outline: 'bg-green-50/90 text-green-700 border-green-300',
        ghost: 'bg-green-100/50 text-green-600'
      }
    },
    claimed: {
      icon: Heart,
      label: 'Claimed',
      colors: {
        solid: 'bg-pink-500/90 text-white border-pink-400',
        outline: 'bg-pink-50/90 text-pink-700 border-pink-300',
        ghost: 'bg-pink-100/50 text-pink-600'
      }
    },
    owner: {
      icon: Crown,
      label: 'Owner',
      colors: {
        solid: 'bg-purple-500/90 text-white border-purple-400',
        outline: 'bg-purple-50/90 text-purple-700 border-purple-300',
        ghost: 'bg-purple-100/50 text-purple-600'
      }
    },
    pending: {
      icon: Clock,
      label: 'Pending',
      colors: {
        solid: 'bg-orange-500/90 text-white border-orange-400',
        outline: 'bg-orange-50/90 text-orange-700 border-orange-300',
        ghost: 'bg-orange-100/50 text-orange-600'
      }
    }
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3 h-3'
    },
    md: {
      container: 'px-2.5 py-1.5 text-sm gap-1.5',
      icon: 'w-3.5 h-3.5'
    },
    lg: {
      container: 'px-3 py-2 text-base gap-2',
      icon: 'w-4 h-4'
    }
  };

  const config = badgeConfigs[type];
  const IconComponent = config?.icon;
  const currentSize = sizeClasses[size];
  const currentColors = config?.colors[variant] || badgeConfigs.private.colors[variant];

  // Animation variants
  const badgeVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: -5
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      y: -1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    animate: { rotate: 0 },
    hover: {
      rotate: type === 'reserved' ? 10 : type === 'private' ? -5 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    variants: badgeVariants,
    initial: "initial",
    animate: "animate",
    whileHover: "hover"
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center font-medium',
        'rounded-full border backdrop-blur-sm',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200',
        'select-none',

        // Size
        currentSize.container,

        // Colors
        currentColors,

        className
      )}
      {...animationProps}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {IconComponent && (
            <motion.div
              variants={iconVariants}
              className="flex-shrink-0"
            >
              <IconComponent className={currentSize.icon} />
            </motion.div>
          )}
          <span className="truncate">{config?.label}</span>
        </>
      )}
    </Component>
  );
});

WishBadge.displayName = 'WishBadge';

export default WishBadge;