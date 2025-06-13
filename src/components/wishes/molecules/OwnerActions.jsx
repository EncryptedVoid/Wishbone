import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal,
  Share2,
  Archive,
  Star,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * OwnerActions Component - Action buttons available to wishlist owners
 *
 * Features:
 * - Owner-specific actions (edit, delete, privacy toggle)
 * - Contextual button states and confirmations
 * - Expandable actions menu for space efficiency
 * - Quick actions vs secondary actions
 * - Smooth animations and hover effects
 *
 * @param {Object} item - Wish item data
 * @param {function} onEdit - Handler for editing item
 * @param {function} onDelete - Handler for deleting item
 * @param {function} onTogglePrivacy - Handler for toggling privacy
 * @param {function} onDuplicate - Handler for duplicating item
 * @param {function} onShare - Handler for sharing item
 * @param {function} onArchive - Handler for archiving item
 * @param {function} onTogglePriority - Handler for toggling priority
 * @param {boolean} disabled - Whether actions are disabled
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} layout - Layout variant: 'horizontal' | 'vertical' | 'compact' | 'dropdown'
 * @param {string} className - Additional CSS classes
 */
const OwnerActions = React.forwardRef(({
  item,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onDuplicate,
  onShare,
  onArchive,
  onTogglePriority,
  disabled = false,
  size = 'md',
  layout = 'compact',
  className,
  ...props
}, ref) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'p-1.5 text-xs gap-1',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'p-2 text-sm gap-1.5',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'p-2.5 text-base gap-2',
      icon: 'w-5 h-5'
    }
  };

  const currentSize = sizeClasses[size];

  // Primary actions (always visible)
  const primaryActions = [
    {
      id: 'edit',
      icon: Edit3,
      label: 'Edit',
      onClick: () => onEdit?.(item),
      colors: 'text-blue-600 hover:bg-blue-500/10 hover:text-blue-700',
      show: true
    },
    {
      id: 'privacy',
      icon: item.is_private ? EyeOff : Eye,
      label: item.is_private ? 'Make Public' : 'Make Private',
      onClick: () => onTogglePrivacy?.(item.id, !item.is_private),
      colors: item.is_private
        ? 'text-orange-600 hover:bg-orange-500/10 hover:text-orange-700'
        : 'text-green-600 hover:bg-green-500/10 hover:text-green-700',
      show: true
    },
    {
      id: 'link',
      icon: ExternalLink,
      label: 'View Item',
      onClick: () => window.open(item.link, '_blank', 'noopener noreferrer'),
      colors: 'text-purple-600 hover:bg-purple-500/10 hover:text-purple-700',
      show: Boolean(item.link)
    }
  ];

  // Secondary actions (in dropdown or extended layout)
  const secondaryActions = [
    {
      id: 'duplicate',
      icon: Copy,
      label: 'Duplicate',
      onClick: () => onDuplicate?.(item),
      colors: 'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
      show: onDuplicate !== undefined
    },
    {
      id: 'share',
      icon: Share2,
      label: 'Share',
      onClick: () => onShare?.(item),
      colors: 'text-indigo-600 hover:bg-indigo-500/10 hover:text-indigo-700',
      show: onShare !== undefined
    },
    {
      id: 'priority',
      icon: Star,
      label: item.score >= 8 ? 'Remove Priority' : 'Mark Priority',
      onClick: () => onTogglePriority?.(item.id, item.score >= 8 ? 5 : 9),
      colors: item.score >= 8
        ? 'text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700'
        : 'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
      show: onTogglePriority !== undefined
    },
    {
      id: 'archive',
      icon: Archive,
      label: 'Archive',
      onClick: () => onArchive?.(item),
      colors: 'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
      show: onArchive !== undefined
    },
    {
      id: 'delete',
      icon: Trash2,
      label: 'Delete',
      onClick: () => setConfirmDelete(true),
      colors: 'text-red-600 hover:bg-red-500/10 hover:text-red-700',
      show: true
    }
  ];

  // Handle delete confirmation
  const handleDelete = () => {
    onDelete?.(item.id);
    setConfirmDelete(false);
  };

  // Filter visible actions
  const visiblePrimaryActions = primaryActions.filter(action => action.show);
  const visibleSecondaryActions = secondaryActions.filter(action => action.show);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, x: 10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
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

  const dropdownVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
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
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  // Render action button
  const renderActionButton = (action, variant = buttonVariants) => {
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
          'font-medium rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          'select-none backdrop-blur-sm',

          // Size
          currentSize.button,

          // Colors
          action.colors,

          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
        variants={variant}
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap={!isDisabled ? "tap" : undefined}
        aria-label={action.label}
        title={action.label}
      >
        <IconComponent className={currentSize.icon} />

        {/* Show label on larger layouts */}
        {(layout === 'horizontal' || layout === 'vertical') && size !== 'sm' && (
          <span>{action.label}</span>
        )}

        {/* Priority indicator */}
        {action.id === 'priority' && item.score >= 8 && (
          <motion.div
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
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
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative flex items-center',
        layout === 'vertical' ? 'flex-col gap-1' : 'flex-row gap-1',
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {/* Primary Actions */}
      {visiblePrimaryActions.map(action => renderActionButton(action))}

      {/* Dropdown Toggle or Secondary Actions */}
      {layout === 'dropdown' ? (
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={cn(
              'inline-flex items-center justify-center',
              'font-medium rounded-lg transition-all duration-200',
              'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
              currentSize.button
            )}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="More actions"
          >
            <MoreHorizontal className={currentSize.icon} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                className={cn(
                  'absolute right-0 top-full mt-1 z-50',
                  'bg-background border border-border rounded-lg shadow-lg',
                  'min-w-40 py-1 backdrop-blur-sm'
                )}
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onClickCapture={() => setShowDropdown(false)}
              >
                {visibleSecondaryActions.map(action => (
                  <motion.button
                    key={action.id}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2',
                      'text-sm font-medium text-left',
                      'hover:bg-muted/50 transition-colors',
                      action.colors.replace('hover:bg-', 'hover:bg-').replace('/10', '/5')
                    )}
                    variants={{
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 }
                    }}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Direct Secondary Actions */
        visibleSecondaryActions.slice(0, 2).map(action => renderActionButton(action))
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              className="bg-background border border-border rounded-xl p-6 max-w-sm mx-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Delete "{item.name}"?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone. The item will be permanently removed from your wishlist.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

OwnerActions.displayName = 'OwnerActions';

export default OwnerActions;