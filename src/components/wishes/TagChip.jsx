import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * TagChip Component - Professional tag/chip component following our design system
 *
 * Features:
 * - Multiple variants for different use cases
 * - Responsive sizing using our semantic system
 * - Optional remove functionality
 * - Interactive states (clickable, removable)
 * - Theme-aware styling
 * - Smooth animations
 *
 * @param {React.ReactNode} children - Tag content (usually text)
 * @param {string} variant - Color variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'secondary'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'sm')
 * @param {boolean} removable - Whether tag can be removed (default: false)
 * @param {boolean} clickable - Whether tag is clickable (default: false)
 * @param {function} onRemove - Remove handler
 * @param {function} onClick - Click handler
 * @param {boolean} selected - Whether tag is selected/active
 * @param {string} className - Additional CSS classes
 */
const TagChip = React.forwardRef(({
  children,
  variant = 'default',
  size = 'sm',
  removable = false,
  clickable = false,
  onRemove,
  onClick,
  selected = false,
  className,
  ...props
}, ref) => {

  // SIZE STYLES - Using our semantic sizing system
  const sizeClasses = {
    sm: {
      container: 'h-6 px-responsive-sm text-responsive-xs',
      icon: 'w-3 h-3 ml-1'
    },
    md: {
      container: 'h-7 px-responsive-md text-responsive-sm',
      icon: 'w-3.5 h-3.5 ml-1.5'
    },
    lg: {
      container: 'h-8 px-responsive-lg text-responsive-base',
      icon: 'w-4 h-4 ml-2'
    }
  };

  // VARIANT STYLES - Theme-aware colors
  const variantClasses = {
    default: selected
      ? 'bg-primary-500 text-white border-primary-500'
      : 'bg-surface text-foreground border-border hover:bg-primary-50 hover:border-primary-500',

    primary: selected
      ? 'bg-primary-600 text-white border-primary-600'
      : 'bg-primary-50 text-primary-600 border-primary-200 hover:bg-primary-100',

    success: selected
      ? 'bg-success text-white border-success'
      : 'bg-success/10 text-success border-success/20 hover:bg-success/20',

    warning: selected
      ? 'bg-warning text-white border-warning'
      : 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',

    error: selected
      ? 'bg-error text-white border-error'
      : 'bg-error/10 text-error border-error/20 hover:bg-error/20',

    secondary: selected
      ? 'bg-muted text-background border-muted'
      : 'bg-muted/10 text-muted border-muted/20 hover:bg-muted/20'
  };

  const currentSize = sizeClasses[size];
  const isInteractive = clickable || removable;

  // BASE STYLES
  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-full border font-medium',
    'transition-all duration-200 ease-in-out',
    'select-none whitespace-nowrap',
    // Interactive styles
    isInteractive && 'cursor-pointer',
    clickable && 'hover:scale-105 active:scale-95'
  ].filter(Boolean).join(' ');

  // Handle remove action
  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    onRemove?.();
  };

  // MOTION VARIANTS
  const chipVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    },
    hover: clickable ? {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {},
    tap: clickable ? {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {}
  };

  const removeVariants = {
    hover: {
      scale: 1.2,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.9,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      ref={ref}
      onClick={clickable ? onClick : undefined}
      className={cn(
        baseClasses,
        currentSize.container,
        variantClasses[variant],
        className
      )}
      variants={chipVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={clickable ? "hover" : undefined}
      whileTap={clickable ? "tap" : undefined}
      {...props}
    >
      {/* Tag Content */}
      <span className="truncate">
        {children}
      </span>

      {/* Remove Button */}
      {removable && (
        <motion.button
          type="button"
          onClick={handleRemove}
          className={cn(
            'flex items-center justify-center rounded-full',
            'hover:bg-current hover:bg-opacity-20',
            'transition-colors duration-200',
            currentSize.icon
          )}
          variants={removeVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Remove tag"
        >
          <X className="w-full h-full" />
        </motion.button>
      )}
    </Component>
  );
});

TagChip.displayName = 'TagChip';

/**
 * TagGroup Component - Container for multiple tags
 */
const TagGroup = React.forwardRef(({
  children,
  className,
  spacing = 'responsive-sm',
  wrap = true,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        wrap && 'flex-wrap',
        `gap-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

TagGroup.displayName = 'TagGroup';

export { TagChip, TagGroup };
export default TagChip;

/*
USAGE EXAMPLES:

// Basic tags
<TagChip>Electronics</TagChip>
<TagChip variant="primary">Featured</TagChip>
<TagChip variant="success">In Stock</TagChip>

// Clickable tags for filtering
<TagChip
  clickable
  selected={selectedTags.includes('electronics')}
  onClick={() => toggleTag('electronics')}
>
  Electronics
</TagChip>

// Removable tags (for selected filters)
<TagChip
  variant="primary"
  removable
  onRemove={() => removeFilter('category')}
>
  Category: Electronics
</TagChip>

// Different sizes
<TagChip size="sm">Small</TagChip>
<TagChip size="md">Medium</TagChip>
<TagChip size="lg">Large</TagChip>

// Tag group for multiple tags
<TagGroup>
  <TagChip>Electronics</TagChip>
  <TagChip>Gadgets</TagChip>
  <TagChip>Tech</TagChip>
</TagGroup>

// Category tags on wish cards
<TagGroup className="mt-responsive-sm">
  {item.categoryTags.map(tag => (
    <TagChip key={tag} variant="secondary" size="sm">
      {tag}
    </TagChip>
  ))}
</TagGroup>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Interactive states (hover, selected, removable)
- Smooth animations for interactions
- Composition with TagGroup for layouts
- Accessible keyboard navigation
- Semantic sizing system integration
- Prevents text overflow with truncation
*/