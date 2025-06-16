import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  MoreHorizontal,
  Edit3,
  Trash2,
  Sparkles
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import CollectionCount from '../atoms/CollectionCount';

/**
 * CollectionItem Component - Modern glassmorphic redesign
 * Beautiful, clean collection items with enhanced visual hierarchy
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

  // Color theme mappings for dynamic theming
  const colorThemes = {
    blue: {
      active: 'from-blue-500/20 via-blue-400/15 to-blue-500/20',
      border: 'border-blue-400/60',
      shadow: 'shadow-blue-500/30',
      text: 'text-blue-900 dark:text-blue-100',
      indicator: 'from-blue-400 to-blue-600',
      glow: 'from-blue-500/10 via-blue-500/15 to-blue-500/10',
      icon: 'text-blue-600 dark:text-blue-400',
      count: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-blue-500/50'
    },
    green: {
      active: 'from-emerald-500/20 via-emerald-400/15 to-emerald-500/20',
      border: 'border-emerald-400/60',
      shadow: 'shadow-emerald-500/30',
      text: 'text-emerald-900 dark:text-emerald-100',
      indicator: 'from-emerald-400 to-emerald-600',
      glow: 'from-emerald-500/10 via-emerald-500/15 to-emerald-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      count: 'text-emerald-700 dark:text-emerald-300',
      ring: 'ring-emerald-500/50'
    },
    purple: {
      active: 'from-purple-500/20 via-purple-400/15 to-purple-500/20',
      border: 'border-purple-400/60',
      shadow: 'shadow-purple-500/30',
      text: 'text-purple-900 dark:text-purple-100',
      indicator: 'from-purple-400 to-purple-600',
      glow: 'from-purple-500/10 via-purple-500/15 to-purple-500/10',
      icon: 'text-purple-600 dark:text-purple-400',
      count: 'text-purple-700 dark:text-purple-300',
      ring: 'ring-purple-500/50'
    },
    pink: {
      active: 'from-pink-500/20 via-pink-400/15 to-pink-500/20',
      border: 'border-pink-400/60',
      shadow: 'shadow-pink-500/30',
      text: 'text-pink-900 dark:text-pink-100',
      indicator: 'from-pink-400 to-pink-600',
      glow: 'from-pink-500/10 via-pink-500/15 to-pink-500/10',
      icon: 'text-pink-600 dark:text-pink-400',
      count: 'text-pink-700 dark:text-pink-300',
      ring: 'ring-pink-500/50'
    },
    orange: {
      active: 'from-orange-500/20 via-orange-400/15 to-orange-500/20',
      border: 'border-orange-400/60',
      shadow: 'shadow-orange-500/30',
      text: 'text-orange-900 dark:text-orange-100',
      indicator: 'from-orange-400 to-orange-600',
      glow: 'from-orange-500/10 via-orange-500/15 to-orange-500/10',
      icon: 'text-orange-600 dark:text-orange-400',
      count: 'text-orange-700 dark:text-orange-300',
      ring: 'ring-orange-500/50'
    },
    red: {
      active: 'from-red-500/20 via-red-400/15 to-red-500/20',
      border: 'border-red-400/60',
      shadow: 'shadow-red-500/30',
      text: 'text-red-900 dark:text-red-100',
      indicator: 'from-red-400 to-red-600',
      glow: 'from-red-500/10 via-red-500/15 to-red-500/10',
      icon: 'text-red-600 dark:text-red-400',
      count: 'text-red-700 dark:text-red-300',
      ring: 'ring-red-500/50'
    },
    indigo: {
      active: 'from-indigo-500/20 via-indigo-400/15 to-indigo-500/20',
      border: 'border-indigo-400/60',
      shadow: 'shadow-indigo-500/30',
      text: 'text-indigo-900 dark:text-indigo-100',
      indicator: 'from-indigo-400 to-indigo-600',
      glow: 'from-indigo-500/10 via-indigo-500/15 to-indigo-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      count: 'text-indigo-700 dark:text-indigo-300',
      ring: 'ring-indigo-500/50'
    },
    gray: {
      active: 'from-gray-500/20 via-gray-400/15 to-gray-500/20',
      border: 'border-gray-400/60',
      shadow: 'shadow-gray-500/30',
      text: 'text-gray-900 dark:text-gray-100',
      indicator: 'from-gray-400 to-gray-600',
      glow: 'from-gray-500/10 via-gray-500/15 to-gray-500/10',
      icon: 'text-gray-600 dark:text-gray-400',
      count: 'text-gray-700 dark:text-gray-300',
      ring: 'ring-gray-500/50'
    }
  };

  const currentTheme = colorThemes[color] || colorThemes.blue;

  // Determine if this is a high-activity collection
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

  // Enhanced animation variants
  const itemVariants = {
    initial: { opacity: 0, x: -20, scale: 0.95 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      x: 6,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    tap: { scale: 0.98 }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: isActive ? 1.2 : 1.1,
      rotate: isActive ? 12 : 6,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const actionsVariants = {
    initial: { opacity: 0, scale: 0.8, y: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base modern glassmorphic styling
        'group relative w-full flex items-center overflow-hidden',
        'p-4 rounded-2xl cursor-pointer backdrop-blur-sm',
        'transition-all duration-300',

        // MUCH CLEARER Active state with collection's color
        isActive && [
          `bg-gradient-to-r ${currentTheme.active}`,
          `border-2 ${currentTheme.border} shadow-xl ${currentTheme.shadow}`,
          `${currentTheme.text} font-bold`,
          // Very prominent active indicator
          'before:absolute before:left-2 before:top-1/2 before:transform before:-translate-y-1/2',
          `before:w-2 before:h-10 before:bg-gradient-to-b before:${currentTheme.indicator}`,
          'before:rounded-full before:shadow-lg'
        ],

        // Inactive state with subtle glassmorphic effect
        !isActive && [
          'bg-white/40 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300',
          'border border-white/20 dark:border-gray-700/30',
          'hover:bg-white/60 dark:hover:bg-gray-800/60',
          'hover:border-white/40 dark:hover:border-gray-700/50',
          'hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30'
        ],

        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

        // Empty collection styling
        isEmpty && !isActive && 'opacity-80',

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
      {/* Enhanced background glow for high activity collections using collection color */}
      {isHighActivity && isActive && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${currentTheme.glow} rounded-2xl blur-lg -z-10`}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Left side: Icon and Text with enhanced spacing */}
      <div className={cn(
        'flex items-center gap-4 min-w-0 flex-1',
        // Add left padding when active to account for indicator
        isActive && 'pl-2'
      )}>
        {/* Collection Icon with enhanced container using collection color */}
        <motion.div
          className={cn(
            'flex-shrink-0 relative p-2 rounded-xl transition-all duration-300',
            isActive
              ? `bg-white/30 dark:bg-gray-700/40 shadow-lg ${currentTheme.shadow}`
              : 'bg-white/40 dark:bg-gray-700/40 group-hover:bg-white/60 dark:group-hover:bg-gray-700/60'
          )}
          variants={iconVariants}
        >
          {IconComponent ? (
            <IconComponent className={cn(
              'w-5 h-5 transition-colors duration-300',
              isActive ? currentTheme.icon : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500'
            )} />
          ) : (
            <span className={cn(
              'text-xl select-none transition-all duration-300',
              isActive && 'filter brightness-110 saturate-110 drop-shadow-sm'
            )}>
              {displayIcon}
            </span>
          )}

          {/* Enhanced high activity sparkle indicator */}
          {isHighActivity && (
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{
                scale: [0.8, 1.3, 0.8],
                rotate: [0, 180, 360],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Collection Info with enhanced typography */}
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className={cn(
            'font-semibold text-sm truncate transition-all duration-300',
            isActive
              ? currentTheme.text
              : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          )}>
            {name}
          </h3>

          {/* Description for detailed variant with enhanced styling */}
          {variant === 'detailed' && description && (
            <motion.p
              className={cn(
                'text-xs truncate transition-all duration-300',
                isActive
                  ? `${currentTheme.text} opacity-80`
                  : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={isActive ? { opacity: 1, height: 'auto' } : { opacity: 0.8, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Right side: REMOVED COUNT - NO MORE NUMBERS */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Actions Menu - REMOVED COMPLETELY - NO MORE 3 DOTS */}
      </div>

      {/* Enhanced hover gradient effect using collection color */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none',
          `bg-gradient-to-r ${currentTheme.glow}`
        )}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: isActive ? 0.3 : 0.6 }}
      />

      {/* Enhanced active state ambient glow using collection color */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${currentTheme.glow} rounded-2xl pointer-events-none`}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Floating particles effect for high activity collections */}
      {isHighActivity && isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
              initial={{
                x: Math.random() * 200,
                y: Math.random() * 50,
                opacity: 0
              }}
              animate={{
                x: Math.random() * 200,
                y: Math.random() * 50,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
});

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;