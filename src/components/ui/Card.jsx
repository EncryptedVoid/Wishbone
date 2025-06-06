import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Card Component - Advanced card system with sophisticated visual design
 *
 * Features:
 * - Multi-layer glassmorphism with dynamic lighting effects
 * - Advanced hover animations with elevation and perspective
 * - variant styling with gradient backgrounds
 * - Sophisticated micro-interactions with contextual feedback
 * - Improved visual hierarchy with spacing
 * - Dynamic particle effects for premium interactions
 */
const Card = React.forwardRef(({
  variant = 'default',
  size = 'md',
  interactive = false,
  premium = false,
  onClick,
  className,
  children,
  ...props
}, ref) => {

  // size styles with improved scaling
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  // variant styles with sophisticated gradients
  const variantClasses = {
    default: [
      'bg-gradient-to-br from-surface/90 via-background/95 to-surface/80',
      'border border-border/50 shadow-lg hover:shadow-xl',
      'hover:border-border/70'
    ].join(' '),

    elevated: [
      'bg-gradient-to-br from-background/95 via-surface/90 to-background/85',
      'border border-border/40 shadow-xl hover:shadow-2xl',
      'hover:border-primary-500/30'
    ].join(' '),

    outlined: [
      'bg-gradient-to-br from-transparent via-surface/20 to-transparent',
      'border-2 border-border hover:border-primary-500/50',
      'shadow-sm hover:shadow-md'
    ].join(' '),

    ghost: [
      'bg-gradient-to-br from-transparent via-surface/10 to-transparent',
      'border border-transparent hover:border-border/30',
      'shadow-none hover:shadow-sm'
    ].join(' '),

    premium: [
      'bg-gradient-to-br from-primary-50/80 via-background/90 to-primary-100/60',
      'border border-primary-200/50 shadow-lg hover:shadow-xl',
      'hover:border-primary-300/70'
    ].join(' ')
  };

  // interactive styles
  const interactiveClasses = interactive ? [
    'cursor-pointer transition-all duration-300 transform-gpu',
    'hover:scale-[1.02] active:scale-[0.98]',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/30'
  ].join(' ') : '';

  // Base styles with glassmorphism
  const baseClasses = [
    'rounded-xl backdrop-blur-md relative overflow-hidden',
    'transition-all duration-300 ease-out',
    // Multi-layer texture overlays
    'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none',
    'after:absolute after:inset-0 after:bg-gradient-to-t after:from-primary-500/5 after:via-transparent after:to-transparent after:pointer-events-none'
  ].join(' ');

  // MOTION VARIANTS
  const cardVariants = {
    initial: {
      scale: 1,
      y: 0,
      rotateX: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    hover: interactive ? {
      scale: 1.02,
      y: -4,
      rotateX: 2,
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.3
      }
    } : {},
    tap: interactive && onClick ? {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 }
    } : {}
  };

  const contentVariants = {
    initial: { opacity: 1 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut"
      }
    }
  };

  // Render as button if interactive and has onClick, otherwise as div
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[premium ? 'premium' : variant],
        sizeClasses[size],
        interactiveClasses,
        className
      )}
      onClick={onClick}
      variants={cardVariants}
      initial="initial"
      whileHover={interactive ? "hover" : "initial"}
      whileTap={interactive && onClick ? "tap" : "initial"}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...props}
    >
      {/* ambient glow effect */}
      {interactive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/10 opacity-0 rounded-xl"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Premium sparkle effect */}
      {premium && (
        <motion.div
          className="absolute top-4 right-4"
          variants={sparkleVariants}
          animate="animate"
        >
          <Sparkles className="w-4 h-4 text-primary-400" />
        </motion.div>
      )}

      {/* Content container */}
      <motion.div
        className="relative z-10"
        variants={contentVariants}
        initial="initial"
        animate="animate"
      >
        {children}
      </motion.div>

      {/* shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 -skew-x-12"
        animate={interactive ? {
          x: ['-100%', '100%'],
          opacity: [0, 1, 0]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 4
        }}
      />
    </Component>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader Component
 */
const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn('mb-4', className)}
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    {...props}
  >
    {children}
  </motion.div>
));

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Component
 */
const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <motion.h3
    ref={ref}
    className={cn(
      'text-lg font-semibold text-foreground leading-tight',
      'bg-gradient-to-r from-foreground to-foreground bg-clip-text',
      className
    )}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
    {...props}
  >
    {children}
  </motion.h3>
));

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription Component
 */
const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <motion.p
    ref={ref}
    className={cn(
      'text-sm text-muted mt-2',
      className
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.2 }}
    {...props}
  >
    {children}
  </motion.p>
));

CardDescription.displayName = 'CardDescription';

/**
 * CardContent Component
 */
const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn('', className)}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
    {...props}
  >
    {children}
  </motion.div>
));

CardContent.displayName = 'CardContent';

/**
 * CardFooter Component
 */
const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      'flex items-center justify-between mt-4 pt-4',
      'border-t border-border/30',
      className
    )}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 20,
      staggerChildren: 0.1
    }}
    {...props}
  >
    {children}
  </motion.div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;