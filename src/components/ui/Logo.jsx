import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Logo Component - Professional logo component following our design system
 *
 * This component provides a consistent brand representation with:
 * - Responsive sizing using our semantic system
 * - Theme-aware styling that adapts to light/dark modes
 * - Interactive animations for better user experience
 * - Flexible composition (icon-only or with text)
 * - Graceful fallback when logo image fails to load
 *
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} showText - Whether to show brand text next to icon (default: true)
 * @param {boolean} interactive - Whether logo should have hover/click animations (default: true)
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler for navigation
 * @param {object} ...props - Additional props passed to the container
 *
 * @example
 * // Standard logo with click navigation
 * <Logo onClick={() => navigate('/')} />
 *
 * @example
 * // Compact logo for mobile headers
 * <Logo size="sm" showText={false} />
 *
 * @example
 * // Large logo for landing pages
 * <Logo size="lg" interactive={false} />
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
  // Each size has coordinated icon, container, text, and decoration sizes
  const sizeClasses = {
    sm: {
      container: 'space-x-responsive-sm',    // Responsive spacing between elements
      icon: 'w-6 h-6',                      // Main icon size
      iconContainer: 'w-7 h-7',             // Container for icon background
      text: 'text-responsive-lg font-bold',  // Responsive text size
      sparkle: 'w-3 h-3'                    // Decorative sparkle size
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

  // BASE STYLES - Common layout and behavior
  const baseClasses = [
    'inline-flex items-center',
    currentSize.container,
    interactive && 'cursor-pointer',         // Only show pointer if interactive
    'transition-all duration-200 ease-in-out',
    'select-none'                           // Prevent text selection
  ].filter(Boolean).join(' ');

  // MOTION VARIANTS - Professional animation patterns
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

  // Icon animation - subtle rotation on hover
  const iconVariants = {
    initial: { rotate: 0 },
    hover: interactive ? {
      rotate: [0, -5, 5, 0],               // Playful wiggle animation
      transition: { duration: 0.5, ease: "easeInOut" }
    } : {}
  };

  // Sparkle decoration animation - continuous rotation
  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],                   // Gentle breathing effect
      rotate: [0, 180, 360],                // Full rotation
      transition: {
        duration: 3,                        // 3 second cycle
        repeat: Infinity,                   // Loop forever
        ease: "easeInOut"
      }
    }
  };

  // Logo content structure
  const LogoContent = (
    <>
      {/* Icon Container with Gradient Background */}
      <motion.div
        className={cn(
          'relative rounded-lg flex items-center justify-center',
          'bg-gradient-to-br from-primary-500 to-primary-600', // Theme-aware gradient
          'shadow-medium',                                      // Consistent shadow
          currentSize.iconContainer
        )}
        variants={iconVariants}
      >
        {/* Primary logo image with fallback */}
        <img
          src="/assets/logo.png"
          alt="EyeWantIt Logo"
          className={cn('object-contain', currentSize.icon)}
          onError={(e) => {
            // Hide broken image and show fallback icon
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Fallback icon (hidden by default) */}
        <Gift
          className={cn('text-white', currentSize.icon)}
          style={{ display: 'none' }}
        />

        {/* Decorative Sparkle Animation */}
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
            // Gradient text effect that adapts to theme
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

  // Render as button if interactive (has onClick), div otherwise
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
        aria-label="EyeWantIt Logo - Go to homepage"
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

/*
USAGE EXAMPLES:

// Standard navigation logo
<Logo onClick={() => navigate('/')} />

// Different sizes - all responsive
<Logo size="sm" />           // Compact for mobile
<Logo size="md" />           // Standard size
<Logo size="lg" />           // Large for hero sections

// Icon only for minimal layouts
<Logo showText={false} />

// Non-interactive for footers or static displays
<Logo interactive={false} />

// Custom styling while maintaining design system
<Logo className="opacity-80" />

FEATURES:
- Automatically loads /assets/logo.png
- Graceful fallback to Gift icon if image fails
- Adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Changes accent colors based on color theme
- Smooth hover and click animations
- Decorative sparkle animation
- Maintains brand consistency
- Follows accessibility guidelines

LOGO ASSET REQUIREMENTS:
- Place your logo at: /assets/logo.png
- Recommended: SVG or PNG with transparent background
- Square aspect ratio works best
- The component will automatically size and color it
*/