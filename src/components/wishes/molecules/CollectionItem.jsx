import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  MoreHorizontal,
  Edit3,
  Trash2,
  Sparkles,
  EyeOff,
  Lock
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import CollectionCount from '../atoms/CollectionCount';

/**
 * CollectionItem Component - Individual collection in sidebar with prominent styling
 *
 * IMPROVEMENTS MADE:
 * - Made tabs more prominent with circular/highlight styling when active
 * - Enhanced visual hierarchy with better contrast and spacing
 * - Improved active state to be more visually distinct
 * - Added circular indicator for active state
 * - Enhanced hover animations and feedback
 * - Removed archive functionality for MVP
 *
 * Features:
 * - Prominent active/inactive states with circular indicators
 * - Item count display with animated updates
 * - Contextual actions menu (edit, delete)
 * - Emoji/icon support with fallbacks
 * - Enhanced hover effects and interactive states
 * - Special styling for high-activity collections
 *
 * @param {Object} collection - Collection data
 * @param {boolean} isActive - Whether this collection is currently selected
 * @param {function} onClick - Handler for collection selection
 * @param {function} onEdit - Handler for editing collection
 * @param {function} onDelete - Handler for deleting collection
 * @param {boolean} disabled - Whether item is disabled
 * @param {string} variant - Style variant: 'default' | 'compact' | 'detailed' | 'prominent'
 * @param {string} className - Additional CSS classes
 */
const CollectionItem = React.forwardRef(({
  collection,
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  disabled = false,
  variant = 'default',
  className,
  ...props
}, ref) => {

  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showActions]);

  // Destructure collection data
  const {
    id,
    name,
    description,
    emoji,
    icon,
    item_count: itemCount = 0,
    color = 'blue',
    is_default: isDefault = false,
    is_private: isPrivate = false
  } = collection;

  // Determine collection states
  const isHighActivity = itemCount >= 10;
  const isEmpty = itemCount === 0;

  // Get display icon (emoji takes precedence over icon)
  const displayIcon = emoji || icon || '📁';
  const IconComponent = !emoji && !icon ? (isActive ? FolderOpen : Folder) : null;

  // Handle click behavior
  const handleClick = () => {
    if (disabled) return;
    onClick?.(id);
  };

  // Handle actions
  const handleActionsToggle = (e) => {
    e.stopPropagation();
    setShowActions(prev => !prev);
  };

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
    }
  };

  // Get color classes based on collection color
  const getColorClasses = () => {
    const colorMap = {
      blue: { bg: 'bg-blue-50/80', border: 'border-blue-300/60', text: 'text-blue-700', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-50/80', border: 'border-green-300/60', text: 'text-green-700', accent: 'bg-green-500' },
      purple: { bg: 'bg-purple-50/80', border: 'border-purple-300/60', text: 'text-purple-700', accent: 'bg-purple-500' },
      pink: { bg: 'bg-pink-50/80', border: 'border-pink-300/60', text: 'text-pink-700', accent: 'bg-pink-500' },
      yellow: { bg: 'bg-yellow-50/80', border: 'border-yellow-300/60', text: 'text-yellow-700', accent: 'bg-yellow-500' },
      red: { bg: 'bg-red-50/80', border: 'border-red-300/60', text: 'text-red-700', accent: 'bg-red-500' },
      gray: { bg: 'bg-gray-50/80', border: 'border-gray-300/60', text: 'text-gray-700', accent: 'bg-gray-500' },
      indigo: { bg: 'bg-indigo-50/80', border: 'border-indigo-300/60', text: 'text-indigo-700', accent: 'bg-indigo-500' }
    };

    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses();

  // Animation variants
  const itemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    hover: {
      scale: 1.02,
      x: 4,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: isActive ? 1.2 : 1.1,
      rotate: isActive ? 5 : 3,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
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
        // Base styles with enhanced prominence
        'group relative w-full flex items-center',
        'p-3 rounded-xl cursor-pointer',
        'transition-all duration-300 backdrop-blur-sm',
        'border-2', // Thicker border for prominence

        // Enhanced active state with color theming
        isActive && [
          colors.bg,
          colors.border,
          'shadow-lg shadow-black/10',
          colors.text,
          'font-semibold',
          // Add circular accent
          'before:absolute before:left-2 before:top-1/2 before:transform before:-translate-y-1/2',
          'before:w-2 before:h-2 before:rounded-full before:shadow-sm',
          `before:${colors.accent.replace('bg-', 'bg-')}`
        ],

        // Enhanced inactive state
        !isActive && [
          'text-foreground hover:bg-surface/80 border-transparent',
          'hover:border-border/50 hover:shadow-md hover:shadow-black/5',
          // Subtle circular indicator for hover
          'hover:before:absolute hover:before:left-2 hover:before:top-1/2 hover:before:transform hover:before:-translate-y-1/2',
          'hover:before:w-1.5 hover:before:h-1.5 hover:before:bg-muted-foreground/40 hover:before:rounded-full',
          'hover:before:transition-all hover:before:duration-300'
        ],

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
      {/* Enhanced background glow for high activity collections */}
      {isHighActivity && isActive && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-xl blur-lg -z-10',
            colors.bg.replace('/80', '/10')
          )}
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

      {/* Left side: Icon and Text with improved spacing */}
      <div className={cn(
        'flex items-center gap-3 min-w-0 flex-1',
        // Add left padding when active to account for circular indicator
        isActive && 'pl-4'
      )}>
        {/* Collection Icon with enhanced animations */}
        <motion.div
          className="flex-shrink-0 relative"
          variants={iconVariants}
        >
          {IconComponent ? (
            <IconComponent className={cn(
              'w-5 h-5 transition-colors duration-300',
              isActive ? colors.text : 'text-muted-foreground group-hover:text-primary-500'
            )} />
          ) : (
            <span className={cn(
              'text-lg select-none transition-all duration-300',
              isActive && 'filter brightness-110 saturate-110'
            )}>
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
              <Sparkles className="w-3 h-3 text-amber-400 drop-shadow-sm" />
            </motion.div>
          )}

          {/* Private indicator */}
          {isPrivate && (
            <motion.div
              className="absolute -bottom-1 -right-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Lock className="w-2.5 h-2.5 text-gray-500 bg-background rounded-full p-0.5" />
            </motion.div>
          )}
        </motion.div>

        {/* Collection Info with improved typography */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              'font-medium text-sm truncate transition-all duration-300',
              isActive ? 'text-current font-semibold' : 'text-foreground group-hover:text-primary-600'
            )}>
              {name}
            </h3>

            {/* Private badge */}
            {isPrivate && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                Private
              </span>
            )}

            {/* Default badge */}
            {isDefault && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                Default
              </span>
            )}
          </div>

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

      {/* Right side: Count and Actions with improved layout */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Item Count with enhanced active styling */}
        <CollectionCount
          count={itemCount}
          variant={isActive ? 'active' : 'default'}
          size="sm"
          animated={true}
          className={cn(
            isActive && colors.bg.replace('/80', '/20') + ' ' + colors.text + ' ' + colors.border.replace('/60', '/30')
          )}
        />

        {/* Actions Menu */}
        {!isDefault && (onEdit || onDelete) && (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              type="button"
              onClick={handleActionsToggle}
              className={cn(
                'p-1 rounded-md transition-all duration-200',
                'hover:bg-background/80 text-muted-foreground hover:text-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                // More prominent on active collections
                isActive ? 'opacity-80 hover:opacity-100' : 'opacity-0 group-hover:opacity-100',
                showActions && 'opacity-100 bg-background/80'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Collection actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            {/* Actions Dropdown with archive support */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  className={cn(
                    'absolute right-0 top-full mt-1 z-50',
                    'bg-background border border-border rounded-lg shadow-lg',
                    'min-w-36 py-1 backdrop-blur-sm'
                  )}
                  variants={actionsVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
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

      {/* Enhanced hover gradient effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-xl transition-opacity duration-300',
          isActive
            ? colors.bg.replace('/80', '/5') + ' opacity-0'
            : 'bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 opacity-0'
        )}
        whileHover={{ opacity: 1 }}
      />

      {/* Active state pulse effect */}
      {isActive && (
        <motion.div
          className={cn('absolute inset-0 rounded-xl', colors.bg.replace('/80', '/5'))}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
});

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;