import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Logo Component - Professional logo component following our design system
 *
 * Features:
 * - Responsive sizing using our design system
 * - Theme-aware styling
 * - Interactive animations
 * - Flexible icon/text composition
 * - Click handling for navigation
 */
const Logo = React.forwardRef(({
  size = 'md',
  showText = true,
  interactive = true,
  className,
  onClick,
  ...props
}, ref) => {

  // SIZE STYLES - Using our semantic sizing system
  const sizeClasses = {
    sm: {
      container: 'space-x-responsive-sm',
      icon: 'w-6 h-6',
      iconContainer: 'w-7 h-7',
      text: 'text-responsive-lg font-bold',
      sparkle: 'w-3 h-3'
    },
    md: {
      container: 'space-x-responsive-md',
      icon: 'w-7 h-7',
      iconContainer: 'w-8 h-8',
      text: 'text-responsive-xl font-bold',
      sparkle: 'w-4 h-4'
    },
    lg: {
      container: 'space-x-responsive-lg',
      icon: 'w-8 h-8',
      iconContainer: 'w-10 h-10',
      text: 'text-responsive-2xl font-bold',
      sparkle: 'w-5 h-5'
    }
  };

  const currentSize = sizeClasses[size];

  // BASE STYLES
  const baseClasses = [
    'inline-flex items-center',
    currentSize.container,
    interactive && 'cursor-pointer',
    'transition-all duration-200 ease-in-out',
    'select-none'
  ].filter(Boolean).join(' ');

  // MOTION VARIANTS
  const logoVariants = {
    initial: { scale: 1 },
    hover: interactive ? {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {}
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: interactive ? {
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    } : {}
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const LogoContent = (
    <>
      {/* Icon Container with Gradient Background */}
      <motion.div
        className={cn(
          'relative rounded-lg flex items-center justify-center',
          'bg-gradient-to-br from-primary-500 to-primary-600',
          'shadow-medium',
          currentSize.iconContainer
        )}
        variants={iconVariants}
      >
        <Gift className={cn('text-white', currentSize.icon)} />

        {/* Sparkle Animation in Corner */}
        <motion.div
          className="absolute -top-1 -right-1"
          variants={sparkleVariants}
          animate="animate"
        >
          <Sparkles className={cn('text-warning', currentSize.sparkle)} />
        </motion.div>
      </motion.div>

      {/* Brand Text */}
      {showText && (
        <motion.span
          className={cn(
            'text-foreground tracking-tight',
            'bg-gradient-to-r from-foreground to-primary-600 bg-clip-text text-transparent',
            currentSize.text
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          EyeWantIt
        </motion.span>
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, className)}
        onClick={onClick}
        variants={logoVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {LogoContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(baseClasses, className)}
      variants={logoVariants}
      initial="initial"
      whileHover={interactive ? "hover" : "initial"}
      {...props}
    >
      {LogoContent}
    </motion.div>
  );
});

Logo.displayName = 'Logo';

export default Logo;