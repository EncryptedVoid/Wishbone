import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// This is a professional Button component that demonstrates all our design system principles
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {

  // VARIANT STYLES - These use our semantic color system
  const variantClasses = {
    primary: [
      'bg-primary-500 hover:bg-primary-600 active:bg-primary-700',
      'text-white',
      'border border-primary-500 hover:border-primary-600',
      'shadow-medium hover:shadow-strong',
      'focus:ring-2 focus:ring-primary-500/50'
    ].join(' '),

    secondary: [
      'bg-surface hover:bg-primary-50 active:bg-primary-100',
      'text-foreground hover:text-primary-600',
      'border border-border hover:border-primary-500',
      'shadow-soft hover:shadow-medium',
      'focus:ring-2 focus:ring-primary-500/50'
    ].join(' '),

    outline: [
      'bg-transparent hover:bg-primary-50 active:bg-primary-100',
      'text-primary-500 hover:text-primary-600',
      'border-2 border-primary-500 hover:border-primary-600',
      'shadow-none hover:shadow-soft',
      'focus:ring-2 focus:ring-primary-500/50'
    ].join(' '),

    ghost: [
      'bg-transparent hover:bg-surface active:bg-primary-50',
      'text-foreground hover:text-primary-600',
      'border border-transparent hover:border-border',
      'shadow-none hover:shadow-soft',
      'focus:ring-2 focus:ring-primary-500/50'
    ].join(' '),

    danger: [
      'bg-error hover:bg-red-600 active:bg-red-700',
      'text-white',
      'border border-error hover:border-red-600',
      'shadow-medium hover:shadow-strong',
      'focus:ring-2 focus:ring-red-500/50'
    ].join(' ')
  };

  // SIZE STYLES - These use our responsive sizing system
  const sizeClasses = {
    sm: [
      'h-button-sm',              // Uses our CSS variable - automatically responsive!
      'px-responsive-md',         // Responsive padding
      'text-responsive-sm',       // Responsive text size
      'rounded-md'
    ].join(' '),

    md: [
      'h-button-md',              // Uses our CSS variable - automatically responsive!
      'px-responsive-lg',         // Responsive padding
      'text-responsive-base',     // Responsive text size
      'rounded-lg'
    ].join(' '),

    lg: [
      'h-button-lg',              // Uses our CSS variable - automatically responsive!
      'px-responsive-xl',         // Responsive padding
      'text-responsive-lg',       // Responsive text size
      'rounded-lg'
    ].join(' ')
  };

  // BASE STYLES - These apply to all buttons
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
    // Accessibility improvements
    'focus-visible:ring-2 focus-visible:ring-offset-2'
  ].join(' ');

  // LOADING STYLES
  const loadingClasses = loading ? 'cursor-wait pointer-events-none' : '';

  // COMBINE ALL STYLES
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loadingClasses,
    className
  );

  // MOTION VARIANTS for professional animations
  const motionVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.98,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || loading}
      variants={motionVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      {...props}
    >
      {/* Loading state with spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 mr-responsive-sm animate-spin" />
      )}

      {/* Button content */}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;

/*
USAGE EXAMPLES:

// Basic usage - automatically responsive and theme-aware
<Button>Click me</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>

// Different sizes - all automatically responsive
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Saving...</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Custom styling while keeping design system
<Button className="w-full">Full width</Button>

// The magic: All of these automatically:
// - Adapt their size for mobile vs desktop
// - Change colors based on light/dark theme
// - Change accent colors based on color theme (blue/purple/green)
// - Have consistent hover/focus states
// - Follow accessibility guidelines
// - Use professional animations
*/