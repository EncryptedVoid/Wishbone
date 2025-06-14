import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  MoreHorizontal,
  Edit3,
  Trash2,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import CollectionCount from '../atoms/CollectionCount';

/**
 * CollectionItem Component - Individual collection in sidebar with actions
 *
 * Features:
 * - Active/inactive states with smooth transitions
 * - Item count display with animated updates
 * - Contextual actions menu (edit, delete, settings)
 * - Emoji/icon support with fallbacks
 * - Hover effects and interactive states
 * - Special styling for high-activity collections
 *
 * @param {Object} collection - Collection data
 * @param {boolean} isActive - Whether this collection is currently selected
 * @param {function} onClick - Handler for collection selection
 * @param {function} onEdit - Handler for editing collection
 * @param {function} onDelete - Handler for deleting collection
 * @param {function} onSettings - Handler for collection settings
 * @param {boolean} disabled - Whether item is disabled
 * @param {string} variant - Style variant: 'default' | 'compact' | 'detailed'
 * @param {string} className - Additional CSS classes
 */
const CollectionItem = React.forwardRef(({
  collection,
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  onSettings,
  disabled = false,
  variant = 'default',
  className,
  ...props
}, ref) => {

  const [showActions, setShowActions] = useState(false);

  // Destructure collection data
  const {
    id,
    name,
    description,
    emoji,
    icon,
    item_count: itemCount = 0,
    color = 'blue',
    isDefault = false
  } = collection;

  // Determine if this is a high-activity collection
  const isHighActivity = itemCount >= 10;
  const isEmpty = itemCount === 0;

  // Get display icon (emoji takes precedence over icon)
  const displayIcon = emoji || icon || '📁';
  const IconComponent = !emoji && !icon ? (isActive ? FolderOpen : Folder) : null;

  // Color mapping for collection themes
  const colorClasses = {
    blue: {
      active: 'bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-400/20 dark:text-blue-300',
      hover: 'hover:bg-blue-50/80 dark:hover:bg-blue-950/30'
    },
    green: {
      active: 'bg-green-500/10 text-green-700 border-green-300 dark:bg-green-400/20 dark:text-green-300',
      hover: 'hover:bg-green-50/80 dark:hover:bg-green-950/30'
    },
    purple: {
      active: 'bg-purple-500/10 text-purple-700 border-purple-300 dark:bg-purple-400/20 dark:text-purple-300',
      hover: 'hover:bg-purple-50/80 dark:hover:bg-purple-950/30'
    },
    red: {
      active: 'bg-red-500/10 text-red-700 border-red-300 dark:bg-red-400/20 dark:text-red-300',
      hover: 'hover:bg-red-50/80 dark:hover:bg-red-950/30'
    },
    orange: {
      active: 'bg-orange-500/10 text-orange-700 border-orange-300 dark:bg-orange-400/20 dark:text-orange-300',
      hover: 'hover:bg-orange-50/80 dark:hover:bg-orange-950/30'
    }
  };

  const currentColors = colorClasses[color] || colorClasses.blue;

  // Handle collection click
  const handleClick = (e) => {
    if (disabled) return;

    // Don't trigger if clicking on actions menu
    if (e.target.closest('[data-actions]')) return;

    onClick?.(id);
  };

  // Handle actions menu toggle
  const handleActionsToggle = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  // Handle action clicks
  const handleActionClick = (action, e) => {
    e.stopPropagation();
    setShowActions(false);

    switch (action) {
      case 'edit':
        onEdit?.(collection);
        break;
      case 'delete':
        onDelete?.(collection);
        break;
      case 'settings':
        onSettings?.(collection);
        break;
    }
  };

  // Animation variants
  const itemVariants = {
    initial: {
      opacity: 0,
      x: -20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.6
      }
    },
    hover: {
      x: 4,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      x: 2,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { delay: 0.1 }
    },
    hover: {
      scale: isActive ? 1.2 : 1.1,
      rotate: isActive ? [0, 10, -10, 0] : [0, 5, -5, 0],
      transition: {
        type: "keyframes",
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const actionsVariants = {
    initial: { opacity: 0, scale: 0.9, x: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      x: 10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base styles
        'group relative w-full flex items-center',
        'p-3 rounded-xl cursor-pointer',
        'transition-all duration-300 backdrop-blur-sm',
        'border border-transparent',

        // Active state
        isActive && [
          currentColors.active,
          'shadow-lg shadow-primary-500/10',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:rounded-xl before:pointer-events-none'
        ].join(' '),

        // Inactive state
        !isActive && [
          'text-foreground hover:bg-surface/80',
          currentColors.hover,
          'hover:border-border/50 hover:shadow-md'
        ].join(' '),

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

        // Empty collection styling
        isEmpty && !isActive && 'opacity-75',

        className
      )}
      variants={itemVariants}
      initial="initial"
      animate="animate"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onClick={handleClick}
      {...props}
    >
      {/* Background glow for high activity collections */}
      {isHighActivity && isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl blur-lg -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Left side: Icon and Text */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Collection Icon */}
        <motion.div
          className="flex-shrink-0 relative"
          variants={iconVariants}
        >
          {IconComponent ? (
            <IconComponent className={cn(
              'w-5 h-5 transition-colors duration-300',
              isActive ? 'text-primary-600' : 'text-muted-foreground group-hover:text-primary-500'
            )} />
          ) : (
            <span className="text-lg select-none">
              {displayIcon}
            </span>
          )}

          {/* High activity indicator */}
          {isHighActivity && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Collection Info */}
        <div className="min-w-0 flex-1">
          <h3 className={cn(
            'font-medium text-sm truncate transition-colors duration-300',
            isActive ? 'text-current' : 'text-foreground'
          )}>
            {name}
          </h3>

          {/* Description for detailed variant */}
          {variant === 'detailed' && description && (
            <motion.p
              className="text-xs text-muted-foreground truncate mt-0.5"
              initial={{ opacity: 0, height: 0 }}
              animate={isActive ? { opacity: 1, height: 'auto' } : { opacity: 0.7, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right side: Count and Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Item Count */}
        <CollectionCount
          count={itemCount}
          variant={isActive ? 'active' : 'default'}
          size="sm"
          animated={true}
        />

        {/* Actions Menu - Only for non-default collections */}
        {!isDefault && (onEdit || onDelete || onSettings) && (
          <div className="relative" data-actions>
            <motion.button
              type="button"
              onClick={handleActionsToggle}
              className={cn(
                'p-1 rounded-md opacity-0 group-hover:opacity-100',
                'transition-all duration-200',
                'hover:bg-background/80 text-muted-foreground hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                showActions && 'opacity-100'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Collection actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            {/* Actions Dropdown */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className={cn(
                    'absolute right-0 top-full mt-1 z-50',
                    'bg-background border border-border rounded-lg shadow-lg',
                    'min-w-32 py-1 backdrop-blur-sm'
                  )}
                  variants={actionsVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClickCapture={() => setShowActions(false)}
                >
                  {onEdit && (
                    <motion.button
                      onClick={(e) => handleActionClick('edit', e)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-blue-600"
                      variants={{
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 }
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </motion.button>
                  )}

                  {onSettings && (
                    <motion.button
                      onClick={(e) => handleActionClick('settings', e)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-gray-600"
                      variants={{
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 }
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </motion.button>
                  )}

                  {onDelete && (
                    <motion.button
                      onClick={(e) => handleActionClick('delete', e)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors text-red-600"
                      variants={{
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Hover gradient effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 opacity-0 rounded-xl"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;