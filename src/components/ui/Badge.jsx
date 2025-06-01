import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Badge Component - Professional badge following our design system principles
 *
 * Features:
 * - Semantic variants for different purposes
 * - Responsive sizing using our design system
 * - Theme-aware styling
 * - Optional pulsing animation for status badges
 * - Composition-friendly design
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
  const variantClasses = {
    default: [
      'bg-surface text-foreground',
      'border border-border'
    ].join(' '),

    primary: [
      'bg-primary-500 text-white',
      'border border-primary-500'
    ].join(' '),

    success: [
      'bg-success/10 text-success',
      'border border-success/20'
    ].join(' '),

    warning: [
      'bg-warning/10 text-warning',
      'border border-warning/20'
    ].join(' '),

    error: [
      'bg-error/10 text-error',
      'border border-error/20'
    ].join(' '),

    secondary: [
      'bg-primary-50 text-primary-600',
      'border border-primary-200'
    ].join(' '),

    outline: [
      'bg-transparent text-foreground',
      'border border-border'
    ].join(' ')
  };

  // SIZE STYLES - Using our responsive sizing system
  const sizeClasses = {
    sm: [
      'px-responsive-sm py-responsive-xs',
      'text-responsive-xs',
      'rounded-md'
    ].join(' '),

    md: [
      'px-responsive-md py-responsive-sm',
      'text-responsive-sm',
      'rounded-md'
    ].join(' '),

    lg: [
      'px-responsive-lg py-responsive-md',
      'text-responsive-base',
      'rounded-lg'
    ].join(' ')
  };

  // BASE STYLES
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium whitespace-nowrap',
    'transition-all duration-200 ease-in-out',
    'select-none'
  ].join(' ');

  // MOTION VARIANTS for pulse animation
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
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