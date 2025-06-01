import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Card Component - Professional card component following our design system
 *
 * This component provides consistent card layouts with:
 * - Responsive sizing using our semantic system
 * - Theme-aware styling that adapts to light/dark modes
 * - Multiple variants for different use cases
 * - Optional interactive behaviors
 * - Flexible composition with header, body, and footer sections
 *
 * @param {string} variant - Style variant: 'default' | 'elevated' | 'outlined' | 'ghost' (default: 'default')
 * @param {string} size - Padding size: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} interactive - Whether the card should have hover effects (default: false)
 * @param {function} onClick - Click handler for interactive cards
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Card content
 * @param {object} ...props - Additional props passed to the container
 */
const Card = React.forwardRef(({
  variant = 'default',
  size = 'md',
  interactive = false,
  onClick,
  className,
  children,
  ...props
}, ref) => {

  // SIZE STYLES - Using our semantic spacing system
  const sizeClasses = {
    sm: 'p-responsive-sm',
    md: 'p-responsive-lg',
    lg: 'p-responsive-xl'
  };

  // VARIANT STYLES - Theme-aware styling
  const variantClasses = {
    default: [
      'bg-surface border border-border',
      'shadow-soft'
    ].join(' '),

    elevated: [
      'bg-background border border-border',
      'shadow-medium'
    ].join(' '),

    outlined: [
      'bg-transparent border-2 border-border',
      'shadow-none'
    ].join(' '),

    ghost: [
      'bg-transparent border border-transparent',
      'shadow-none'
    ].join(' ')
  };

  // INTERACTIVE STYLES
  const interactiveClasses = interactive ? [
    'cursor-pointer transition-all duration-200',
    'hover:shadow-strong hover:border-primary-500/50',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
    'active:scale-[0.98]'
  ].join(' ') : '';

  // BASE STYLES
  const baseClasses = [
    'rounded-lg',
    'transition-all duration-200 ease-in-out'
  ].join(' ');

  // Combine all classes
  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    interactiveClasses,
    className
  );

  // MOTION VARIANTS
  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: interactive ? {
      scale: 1.02,
      y: -2,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {}
  };

  // Render as button if interactive and has onClick, otherwise as div
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      className={cardClasses}
      onClick={onClick}
      variants={cardVariants}
      initial="initial"
      whileHover={interactive ? "hover" : "initial"}
      whileTap={interactive && onClick ? "tap" : "initial"}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = 'Card';

/**
 * CardHeader Component - Header section for cards
 */
const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('mb-responsive-md', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Component - Title for card headers
 */
const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-responsive-lg font-semibold text-foreground leading-tight',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription Component - Description for card headers
 */
const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-responsive-sm text-muted mt-responsive-xs',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

/**
 * CardContent Component - Main content area of cards
 */
const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

/**
 * CardFooter Component - Footer section for cards
 */
const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between mt-responsive-md pt-responsive-md border-t border-border',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Export all components
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;

/*
USAGE EXAMPLES:

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Interactive card
<Card interactive onClick={() => console.log('clicked')}>
  <CardContent>
    <p>Click me!</p>
  </CardContent>
</Card>

// Different variants
<Card variant="elevated">Elevated card</Card>
<Card variant="outlined">Outlined card</Card>
<Card variant="ghost">Ghost card</Card>

// Different sizes
<Card size="sm">Small padding</Card>
<Card size="md">Medium padding</Card>
<Card size="lg">Large padding</Card>

// With footer
<Card>
  <CardHeader>
    <CardTitle>Settings</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Manage your preferences</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Multiple visual variants for different contexts
- Interactive hover and click animations
- Flexible composition with sub-components
- Semantic sizing system integration
- Professional visual hierarchy
- Full accessibility support
*/