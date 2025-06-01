import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Avatar Component - Professional avatar with semantic sizing and theme integration
 *
 * Features:
 * - Semantic sizing system (sm, md, lg)
 * - Automatic fallback to initials or icon
 * - Theme-aware styling
 * - Status indicator support
 * - Professional animations
 */
const Avatar = React.forwardRef(({
  src,
  alt,
  size = 'md',
  name,
  status,
  className,
  onClick,
  ...props
}, ref) => {

  // SIZE STYLES - Using our semantic sizing system
  const sizeClasses = {
    sm: [
      'w-8 h-8',
      'text-responsive-xs'
    ].join(' '),

    md: [
      'w-10 h-10',
      'text-responsive-sm'
    ].join(' '),

    lg: [
      'w-12 h-12',
      'text-responsive-base'
    ].join(' ')
  };

  // STATUS INDICATOR STYLES
  const statusClasses = {
    online: 'bg-success',
    away: 'bg-warning',
    offline: 'bg-muted',
    busy: 'bg-error'
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  // BASE STYLES - Following our design system
  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'rounded-full overflow-hidden',
    'bg-surface border border-border',
    'font-medium text-foreground',
    'transition-all duration-200 ease-in-out',
    onClick && 'cursor-pointer hover:ring-2 hover:ring-primary-500/50'
  ].filter(Boolean).join(' ');

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(name);

  // MOTION VARIANTS
  const motionVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
      scale: 0.95,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const avatarContent = (
    <>
      {/* Avatar Image or Fallback */}
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : initials ? (
        <span className="select-none font-semibold">
          {initials}
        </span>
      ) : (
        <User className="w-1/2 h-1/2 text-muted" />
      )}

      {/* Status Indicator */}
      {status && (
        <motion.div
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            statusClasses[status],
            statusSizes[size]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], className)}
        onClick={onClick}
        variants={motionVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {avatarContent}
      </motion.button>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(baseClasses, sizeClasses[size], className)}
      {...props}
    >
      {avatarContent}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;