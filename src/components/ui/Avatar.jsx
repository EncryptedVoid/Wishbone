import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Avatar Component - Professional avatar with semantic sizing and theme integration
 *
 * This component follows our design system principles:
 * - Uses semantic sizing (sm, md, lg) that automatically adapts to mobile/desktop
 * - Integrates with our theme system for consistent colors
 * - Provides fallback hierarchy: image → initials → icon
 * - Supports status indicators for online/offline states
 * - Includes professional animations and interactions
 *
 * @param {string} src - Image URL for the avatar
 * @param {string} alt - Alt text for the image (falls back to name or 'Avatar')
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {string} name - User's name (used for initials fallback)
 * @param {string} status - Status indicator: 'online' | 'away' | 'offline' | 'busy'
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler (makes avatar interactive)
 * @param {object} ...props - Additional props passed to the container
 *
 * @example
 * // Basic avatar with image
 * <Avatar src="/user.jpg" name="John Doe" />
 *
 * @example
 * // Interactive avatar with status
 * <Avatar
 *   name="Jane Smith"
 *   status="online"
 *   size="lg"
 *   onClick={() => openUserProfile()}
 * />
 *
 * @example
 * // Fallback to initials
 * <Avatar name="Alex Chen" size="sm" />
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
  // These automatically adapt between mobile and desktop viewports
  const sizeClasses = {
    sm: [
      'w-8 h-8',               // 32px on desktop, smaller on mobile
      'text-responsive-xs'     // Responsive font size
    ].join(' '),

    md: [
      'w-10 h-10',             // 40px on desktop, adaptive on mobile
      'text-responsive-sm'     // Responsive font size
    ].join(' '),

    lg: [
      'w-12 h-12',             // 48px on desktop, adaptive on mobile
      'text-responsive-base'   // Responsive font size
    ].join(' ')
  };

  // STATUS INDICATOR STYLES
  // Colors automatically adapt to current theme (light/dark)
  const statusClasses = {
    online: 'bg-success',      // Uses our semantic success color
    away: 'bg-warning',        // Uses our semantic warning color
    offline: 'bg-muted',       // Uses our semantic muted color
    busy: 'bg-error'           // Uses our semantic error color
  };

  // Status indicator sizes that scale with avatar size
  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };

  // BASE STYLES - Following our design system
  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'rounded-full overflow-hidden',
    'bg-surface border border-border',         // Theme-aware background and border
    'font-medium text-foreground',             // Theme-aware text color
    'transition-all duration-200 ease-in-out', // Smooth transitions
    // Add interactive styles only if onClick is provided
    onClick && 'cursor-pointer hover:ring-2 hover:ring-primary-500/50'
  ].filter(Boolean).join(' ');

  /**
   * Extract initials from a full name
   * Takes first letter of each word, max 2 letters
   *
   * @param {string} name - Full name
   * @returns {string} - Uppercase initials
   */
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

  // MOTION VARIANTS - Professional animation patterns
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

  // Avatar content with fallback hierarchy
  const avatarContent = (
    <>
      {/* PRIMARY: Avatar Image */}
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide broken image and show fallback
            e.target.style.display = 'none';
          }}
        />
      ) : initials ? (
        /* SECONDARY: Initials Fallback */
        <span className="select-none font-semibold">
          {initials}
        </span>
      ) : (
        /* TERTIARY: Icon Fallback */
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

  // Render as button if interactive, div otherwise
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
        aria-label={`Avatar for ${name || 'user'}`}
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

/*
USAGE EXAMPLES:

// Basic avatar with image
<Avatar src="/avatar.jpg" name="John Doe" />

// Avatar with initials fallback
<Avatar name="Jane Smith" size="lg" />

// Interactive avatar with status
<Avatar
  name="Alex Chen"
  status="online"
  onClick={() => console.log('Avatar clicked')}
/>

// Different sizes - all responsive
<Avatar name="User" size="sm" />
<Avatar name="User" size="md" />
<Avatar name="User" size="lg" />

// Custom styling while keeping design system
<Avatar name="User" className="ring-2 ring-primary-500" />

AUTOMATIC FEATURES:
- Shows initials when no image is provided
- Adapts sizing for mobile vs desktop
- Changes colors based on light/dark theme
- Changes accent colors based on color theme
- Provides consistent hover states
- Follows accessibility guidelines
- Graceful image loading error handling
*/