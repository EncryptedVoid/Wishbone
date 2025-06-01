import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Badge Component - Professional badge following our design system principles
 *
 * This component follows our design system:
 * - Uses semantic color variants that adapt to themes
 * - Responsive sizing using our spacing system
 * - Optional pulsing animation for status badges
 * - Composition-friendly design for use in other components
 *
 * @param {React.ReactNode} children - Badge content (text, numbers, icons)
 * @param {string} variant - Color variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'outline'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} pulse - Whether to animate with pulsing effect (default: false)
 * @param {string} className - Additional CSS classes
 * @param {object} ...props - Additional props passed to the span element
 *
 * @example
 * // Basic notification badge
 * <Badge variant="error">3</Badge>
 *
 * @example
 * // Status badge with pulse
 * <Badge variant="success" pulse>Live</Badge>
 *
 * @example
 * // Large informational badge
 * <Badge variant="primary" size="lg">New Feature</Badge>
 */
const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className,
  ...props
}, ref) => {

  // VARIANT STYLES - Using our semantic color system
  // All colors automatically adapt to light/dark themes
  const variantClasses = {
    // Neutral variant using surface colors
    default: [
      'bg-surface text-foreground',
      'border border-border'
    ].join(' '),

    // Primary brand color
    primary: [
      'bg-primary-500 text-white',
      'border border-primary-500'
    ].join(' '),

    // Success state (green tones)
    success: [
      'bg-success/10 text-success',        // 10% opacity background
      'border border-success/20'           // 20% opacity border
    ].join(' '),

    // Warning state (amber/yellow tones)
    warning: [
      'bg-warning/10 text-warning',
      'border border-warning/20'
    ].join(' '),

    // Error state (red tones)
    error: [
      'bg-error/10 text-error',
      'border border-error/20'
    ].join(' '),

    // Secondary brand color variant
    secondary: [
      'bg-primary-50 text-primary-600',
      'border border-primary-200'
    ].join(' '),

    // Outline style with transparent background
    outline: [
      'bg-transparent text-foreground',
      'border border-border'
    ].join(' ')
  };

  // SIZE STYLES - Using our responsive sizing system
  // These automatically adapt between mobile and desktop
  const sizeClasses = {
    sm: [
      'px-responsive-sm py-responsive-xs',  // Responsive padding
      'text-responsive-xs',                 // Responsive text size
      'rounded-md'                          // Smaller border radius
    ].join(' '),

    md: [
      'px-responsive-md py-responsive-sm',  // Responsive padding
      'text-responsive-sm',                 // Responsive text size
      'rounded-md'                          // Medium border radius
    ].join(' '),

    lg: [
      'px-responsive-lg py-responsive-md',  // Responsive padding
      'text-responsive-base',               // Responsive text size
      'rounded-lg'                          // Larger border radius
    ].join(' ')
  };

  // BASE STYLES - Common to all badges
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium whitespace-nowrap',        // Prevent text wrapping
    'transition-all duration-200 ease-in-out',
    'select-none'                           // Prevent text selection
  ].join(' ');

  // MOTION VARIANTS for pulse animation
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],                 // Gentle scale animation
      transition: {
        duration: 2,                        // 2 second cycle
        repeat: Infinity,                   // Loop forever
        ease: "easeInOut"                   // Smooth easing
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      animate={pulse ? "pulse" : ""}
      variants={pulseVariants}
      {...props}
    >
      {children}
    </motion.span>
  );
});

Badge.displayName = 'Badge';

export default Badge;

/*
USAGE EXAMPLES:

// Basic badges with different variants
<Badge>Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>

// Different sizes - all responsive
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Notification badge (common pattern)
<div className="relative">
  <Bell className="w-6 h-6" />
  <Badge
    variant="error"
    size="sm"
    className="absolute -top-1 -right-1 w-5 h-5 text-xs"
  >
    3
  </Badge>
</div>

// Status badge with pulse animation
<Badge variant="success" pulse>Live</Badge>

// Custom styling while keeping design system
<Badge variant="outline" className="font-bold border-2">
  Custom
</Badge>

AUTOMATIC FEATURES:
- Adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Changes accent colors based on color theme selection
- Maintains consistent typography and spacing
- Follows accessibility guidelines
- Smooth animations and transitions
*/