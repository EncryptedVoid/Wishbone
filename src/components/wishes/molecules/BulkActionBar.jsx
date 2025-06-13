import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  X,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  FolderPlus,
  Archive,
  Copy,
  Share2,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * BulkActionBar Component - Action bar for bulk operations on selected items
 *
 * Features:
 * - Slide-in animation when items are selected
 * - Contextual actions based on selection and user role
 * - Batch operation confirmations for destructive actions
 * - Progress indicators for long-running operations
 * - Responsive design with priority-based action visibility
 *
 * @param {Array} selectedItems - Array of selected item IDs
 * @param {number} totalItems - Total number of items in view
 * @param {string} userRole - User's role: 'owner' | 'friend' | 'visitor'
 * @param {function} onClearSelection - Handler to clear selection
 * @param {function} onBulkDelete - Handler for bulk delete
 * @param {function} onBulkEdit - Handler for bulk edit
 * @param {function} onBulkPrivacy - Handler for bulk privacy toggle
 * @param {function} onBulkMove - Handler for bulk move to collection
 * @param {function} onBulkArchive - Handler for bulk archive
 * @param {function} onBulkDuplicate - Handler for bulk duplicate
 * @param {function} onBulkShare - Handler for bulk share
 * @param {function} onSelectAll - Handler to select all items
 * @param {Array} collections - Available collections for move operations
 * @param {boolean} loading - Whether bulk operation is in progress
 * @param {string} className - Additional CSS classes
 */
const BulkActionBar = React.forwardRef(({
  selectedItems = [],
  totalItems = 0,
  userRole = 'owner',
  onClearSelection,
  onBulkDelete,
  onBulkEdit,
  onBulkPrivacy,
  onBulkMove,
  onBulkArchive,
  onBulkDuplicate,
  onBulkShare,
  onSelectAll,
  collections = [],
  loading = false,
  className,
  ...props
}, ref) => {

  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);

  const selectedCount = selectedItems.length;
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === totalItems;

  // Don't render if no selection or user is visitor
  if (!hasSelection || userRole === 'visitor') {
    return null;
  }

  // Action configurations based on user role
  const getActions = () => {
    const baseActions = [
      {
        id: 'share',
        icon: Share2,
        label: 'Share',
        onClick: () => onBulkShare?.(selectedItems),
        colors: 'text-blue-600 hover:bg-blue-500/10',
        priority: 'medium',
        show: true
      }
    ];

    const ownerActions = [
      {
        id: 'edit',
        icon: Edit3,
        label: 'Edit',
        onClick: () => onBulkEdit?.(selectedItems),
        colors: 'text-green-600 hover:bg-green-500/10',
        priority: 'high',
        show: onBulkEdit !== undefined
      },
      {
        id: 'privacy',
        icon: Eye,
        label: 'Toggle Privacy',
        onClick: () => onBulkPrivacy?.(selectedItems),
        colors: 'text-purple-600 hover:bg-purple-500/10',
        priority: 'medium',
        show: onBulkPrivacy !== undefined
      },
      {
        id: 'move',
        icon: FolderPlus,
        label: 'Move to Collection',
        onClick: () => setShowMoveDropdown(!showMoveDropdown),
        colors: 'text-indigo-600 hover:bg-indigo-500/10',
        priority: 'medium',
        show: collections.length > 0 && onBulkMove !== undefined
      },
      {
        id: 'duplicate',
        icon: Copy,
        label: 'Duplicate',
        onClick: () => onBulkDuplicate?.(selectedItems),
        colors: 'text-gray-600 hover:bg-gray-500/10',
        priority: 'low',
        show: onBulkDuplicate !== undefined
      },
      {
        id: 'archive',
        icon: Archive,
        label: 'Archive',
        onClick: () => handleConfirmAction('archive'),
        colors: 'text-orange-600 hover:bg-orange-500/10',
        priority: 'low',
        show: onBulkArchive !== undefined
      },
      {
        id: 'delete',
        icon: Trash2,
        label: 'Delete',
        onClick: () => handleConfirmAction('delete'),
        colors: 'text-red-600 hover:bg-red-500/10',
        priority: 'high',
        destructive: true,
        show: true
      }
    ];

    return userRole === 'owner' ? [...ownerActions, ...baseActions] : baseActions;
  };

  // Handle confirmation for destructive actions
  const handleConfirmAction = (actionType) => {
    setShowConfirmation(actionType);
  };

  const executeConfirmedAction = () => {
    switch (showConfirmation) {
      case 'delete':
        onBulkDelete?.(selectedItems);
        break;
      case 'archive':
        onBulkArchive?.(selectedItems);
        break;
    }
    setShowConfirmation(null);
  };

  // Handle move to collection
  const handleMoveToCollection = (collectionId) => {
    onBulkMove?.(selectedItems, collectionId);
    setShowMoveDropdown(false);
  };

  const actions = getActions().filter(action => action.show);
  const highPriorityActions = actions.filter(action => action.priority === 'high');
  const mediumPriorityActions = actions.filter(action => action.priority === 'medium');
  const lowPriorityActions = actions.filter(action => action.priority === 'low');

  // Animation variants
  const barVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const actionVariants = {
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
    }
  };

  const confirmationVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  return (
    <>
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40',
          'bg-background/95 backdrop-blur-xl border border-border',
          'rounded-2xl shadow-2xl shadow-primary-500/20',
          'px-6 py-4 max-w-4xl mx-auto',

          // Glassmorphism effects
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:rounded-2xl before:pointer-events-none',

          className
        )}
        variants={barVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Selection Info */}
          <motion.div
            className="flex items-center gap-3"
            variants={actionVariants}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-foreground">
                <motion.span
                  key={selectedCount}
                  initial={{ scale: 1.2, color: 'rgb(59, 130, 246)' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {selectedCount}
                </motion.span>
                {' '}selected
              </span>
            </div>

            {/* Select All Toggle */}
            {totalItems > selectedCount && (
              <button
                onClick={() => onSelectAll?.()}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Select all {totalItems}
              </button>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* High Priority Actions */}
            {highPriorityActions.map(action => (
              <motion.button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={loading}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  'font-medium text-sm transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  action.colors,
                  action.destructive && 'hover:bg-red-500 hover:text-white',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
                variants={actionVariants}
                whileHover={!loading ? "hover" : undefined}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </motion.button>
            ))}

            {/* Medium Priority Actions */}
            <div className="hidden md:flex items-center gap-2">
              {mediumPriorityActions.map(action => (
                <motion.div key={action.id} className="relative">
                  <motion.button
                    type="button"
                    onClick={action.onClick}
                    disabled={loading}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg',
                      'font-medium text-sm transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      action.colors,
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                    variants={actionVariants}
                    whileHover={!loading ? "hover" : undefined}
                    whileTap={{ scale: 0.95 }}
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{action.label}</span>
                  </motion.button>

                  {/* Move to Collection Dropdown */}
                  {action.id === 'move' && showMoveDropdown && (
                    <motion.div
                      className="absolute bottom-full mb-2 left-0 min-w-48 bg-background border border-border rounded-lg shadow-lg py-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {collections.map(collection => (
                        <button
                          key={collection.id}
                          onClick={() => handleMoveToCollection(collection.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <span>{collection.emoji || '📁'}</span>
                          <span>{collection.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* More Actions Dropdown for Mobile */}
            {(mediumPriorityActions.length > 0 || lowPriorityActions.length > 0) && (
              <motion.button
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-500/10"
                variants={actionVariants}
                whileHover="hover"
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>
            )}

            {/* Cancel Button */}
            <motion.button
              type="button"
              onClick={onClearSelection}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg',
                'font-medium text-sm transition-all duration-200',
                'text-gray-600 hover:bg-gray-500/10 hover:text-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                loading && 'opacity-50 cursor-not-allowed'
              )}
              variants={actionVariants}
              whileHover={!loading ? "hover" : undefined}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
            </motion.button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 text-primary-600">
              <motion.div
                className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="font-medium">Processing...</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmation(null)}
          >
            <motion.div
              className="bg-background border border-border rounded-xl p-6 max-w-md mx-4 shadow-xl"
              variants={confirmationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm {showConfirmation === 'delete' ? 'Delete' : 'Archive'}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to {showConfirmation} {selectedCount} item{selectedCount !== 1 ? 's' : ''}?
                {showConfirmation === 'delete' && ' This action cannot be undone.'}
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeConfirmedAction}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    showConfirmation === 'delete'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  )}
                >
                  {showConfirmation === 'delete' ? 'Delete' : 'Archive'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

BulkActionBar.displayName = 'BulkActionBar';

export default BulkActionBar;