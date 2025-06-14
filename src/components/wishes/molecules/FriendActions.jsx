import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Share2,
  BookmarkPlus,
  Heart,
  Gift,
  MessageCircle,
  Info
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * FriendActions Component - Action buttons available to friends viewing wishlists
 *
 * Features:
 * - Friend-specific actions (dibs, share, save)
 * - Contextual button states based on item status
 * - Smooth animations and hover effects
 * - Responsive button grouping
 * - Integration with external sharing and bookmarking
 *
 * @param {Object} item - Wish item data
 * @param {string} currentUserId - Current user's ID
 * @param {function} onDibsToggle - Handler for dibs toggle
 * @param {function} onShare - Handler for sharing item
 * @param {function} onSave - Handler for saving/bookmarking item
 * @param {function} onComment - Handler for adding comments/notes
 * @param {boolean} disabled - Whether actions are disabled
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} layout - Layout variant: 'horizontal' | 'vertical' | 'compact'
 * @param {string} className - Additional CSS classes
 */
const FriendActions = React.forwardRef(({
  item,
  currentUserId,
  onDibsToggle,
  onShare,
  onSave,
  onComment,
  disabled = false,
  size = 'md',
  layout = 'horizontal',
  className,
  ...props
}, ref) => {

  // Item state calculations
  const isDibbedByMe = item.dibbed_by === currentUserId;
  const isDibbedByOther = item.dibbed_by && item.dibbed_by !== currentUserId;
  const canDibs = !item.dibbed_by || isDibbedByMe;
  const hasLink = Boolean(item.link);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'p-2 text-xs gap-1',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'p-2.5 text-sm gap-1.5',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'p-3 text-base gap-2',
      icon: 'w-5 h-5'
    }
  };

  const currentSize = sizeClasses[size];

  // Layout configurations
  const layoutClasses = {
    horizontal: 'flex-row flex-wrap gap-2',
    vertical: 'flex-col gap-1',
    compact: 'flex-row gap-1'
  };

  // Action configurations
  const actions = [
    {
      id: 'dibs',
      icon: isDibbedByMe ? Heart : Gift,
      label: isDibbedByMe ? 'Remove Dibs' : 'Reserve Gift',
      onClick: () => onDibsToggle?.(item.id, isDibbedByMe ? 'unclaim' : 'claim'),
      disabled: !canDibs,
      variant: isDibbedByMe ? 'primary' : 'outline',
      colors: isDibbedByMe
        ? 'bg-red-500/10 text-red-600 border-red-300 hover:bg-red-500 hover:text-white'
        : 'bg-green-500/10 text-green-600 border-green-300 hover:bg-green-500 hover:text-white',
      show: true
    },
    {
      id: 'link',
      icon: ExternalLink,
      label: 'View Item',
      onClick: () => window.open(item.link, '_blank', 'noopener noreferrer'),
      disabled: !hasLink,
      variant: 'ghost',
      colors: 'text-blue-600 hover:bg-blue-500/10 hover:text-blue-700',
      show: hasLink
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      onClick: () => onShare?.(item),
      disabled: false,
      variant: 'ghost',
      colors: 'text-purple-600 hover:bg-purple-500/10 hover:text-purple-700',
      show: true
    },
    {
      id: 'save',
      icon: BookmarkPlus,
      label: 'Save',
      onClick: () => onSave?.(item),
      disabled: false,
      variant: 'ghost',
      colors: 'text-amber-600 hover:bg-amber-500/10 hover:text-amber-700',
      show: onSave !== undefined
    },
    {
      id: 'comment',
      icon: MessageCircle,
      label: 'Note',
      onClick: () => onComment?.(item),
      disabled: false,
      variant: 'ghost',
      colors: 'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
      show: onComment !== undefined
    }
  ];

  // Filter actions based on show conditions
  const visibleActions = actions.filter(action => action.show);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25
      }
    },
    hover: {
      scale: 1.05,
      y: -1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  // Don't render if no actions are visible
  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex items-center',
        layoutClasses[layout],
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {visibleActions.map((action) => {
        const IconComponent = action.icon;
        const isDisabled = disabled || action.disabled;

        return (
          <motion.button
            key={action.id}
            type="button"
            onClick={action.onClick}
            disabled={isDisabled}
            className={cn(
              // Base styles
              'inline-flex items-center justify-center',
              'font-medium rounded-lg border',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
              'select-none backdrop-blur-sm',

              // Size
              currentSize.button,

              // Colors
              action.colors,

              // Disabled state
              isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',

              // Layout-specific adjustments
              layout === 'compact' && 'px-2',
              layout === 'vertical' && 'w-full justify-start'
            )}
            variants={buttonVariants}
            whileHover={!isDisabled ? "hover" : undefined}
            whileTap={!isDisabled ? "tap" : undefined}
            aria-label={action.label}
            title={action.label}
          >
            <IconComponent className={currentSize.icon} />

            {/* Show label on larger sizes or vertical layout */}
            {(size !== 'sm' || layout === 'vertical') && (
              <span className={layout === 'compact' ? 'sr-only' : ''}>
                {action.label}
              </span>
            )}

            {/* Special indicator for dibbed items */}
            {action.id === 'dibs' && isDibbedByMe && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.button>
        );
      })}

      {/* Status indicator for reserved items */}
      {isDibbedByOther && (
        <motion.div
          className={cn(
            'flex items-center gap-1 px-2 py-1',
            'text-xs text-amber-600 bg-amber-50/80',
            'border border-amber-200 rounded-md',
            'backdrop-blur-sm'
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Info className="w-3 h-3" />
          <span>Reserved by someone</span>
        </motion.div>
      )}
    </motion.div>
  );
});

FriendActions.displayName = 'FriendActions';

export default FriendActions;