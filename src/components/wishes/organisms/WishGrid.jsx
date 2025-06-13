import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Search, Filter } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import molecules
import WishCard from '../molecules/WishCard';
import BulkActionBar from '../molecules/BulkActionBar';

/**
 * WishGrid Component - Main grid container for wish cards with responsive layout
 *
 * Features:
 * - Responsive grid that adapts to screen size and item count
 * - Smooth animations for adding/removing cards
 * - Empty state with actionable prompts
 * - Optimized rendering for large lists
 * - Automatic grid column calculation
 * - Coordinated bulk actions
 *
 * @param {Array} items - Array of wish items to display
 * @param {Array} selectedItems - Array of selected item IDs
 * @param {string} userRole - Current user's role: 'owner' | 'friend' | 'visitor'
 * @param {string} mode - Current mode: 'view' | 'edit' | 'select'
 * @param {string} currentUserId - Current user's ID
 * @param {Array} collections - Available collections for mapping
 * @param {function} onItemClick - Handler for card clicks
 * @param {function} onItemSelect - Handler for item selection
 * @param {function} onDibsChange - Handler for dibs changes
 * @param {function} onBulkAction - Handler for bulk operations
 * @param {function} onClearSelection - Handler to clear selection
 * @param {function} onSelectAll - Handler to select all items
 * @param {function} onAddItem - Handler to add new item
 * @param {boolean} loading - Whether grid is in loading state
 * @param {string} searchQuery - Current search query for empty state context
 * @param {Object} activeFilters - Active filters for empty state context
 * @param {string} className - Additional CSS classes
 */
const WishGrid = React.forwardRef(({
  items = [],
  selectedItems = [],
  userRole = 'friend',
  mode = 'view',
  currentUserId,
  collections = [],
  onItemClick,
  onItemSelect,
  onDibsChange,
  onBulkAction,
  onClearSelection,
  onSelectAll,
  onAddItem,
  loading = false,
  searchQuery = '',
  activeFilters = {},
  className,
  ...props
}, ref) => {

  // Calculate optimal grid columns based on item count and screen size
  const getGridColumns = useCallback((itemCount) => {
    if (itemCount === 0) return 'grid-cols-1';
    if (itemCount === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (itemCount === 2) return 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto';
    if (itemCount <= 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto';

    // For 4+ items, use full responsive grid
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }, []);

  const gridClasses = useMemo(() => getGridColumns(items.length), [items.length, getGridColumns]);

  // Determine if we should show empty state
  const showEmpty = !loading && items.length === 0;
  const isFiltered = searchQuery.trim() || Object.keys(activeFilters).length > 0;

  // Handle bulk action delegation
  const handleBulkAction = useCallback((action, itemIds, ...args) => {
    onBulkAction?.(action, itemIds, ...args);
  }, [onBulkAction]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    const allIds = items.map(item => item.id);
    onSelectAll?.(allIds);
  }, [items, onSelectAll]);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
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
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const emptyStateVariants = {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.8
      }
    }
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={cn('grid gap-6', gridClasses)}>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="bg-muted/30 rounded-xl animate-pulse"
          style={{ height: Math.random() > 0.5 ? '320px' : '200px' }}
        />
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto"
      variants={emptyStateVariants}
      initial="initial"
      animate="animate"
    >
      {/* Icon with animation */}
      <motion.div
        className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 relative overflow-hidden"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isFiltered ? (
          <Search className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Gift className="w-8 h-8 text-muted-foreground" />
        )}

        {/* Subtle background animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-primary-500/10"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {isFiltered ? 'No items found' : 'Your wishlist is empty'}
        </h3>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          {isFiltered ? (
            <>
              No items match your current search or filters.
              <br />
              Try adjusting your criteria or clearing filters.
            </>
          ) : userRole === 'owner' ? (
            <>
              Start building your wishlist by adding items you want.
              <br />
              Friends can then reserve them as gifts for you!
            </>
          ) : (
            <>
              This wishlist doesn't have any items yet.
              <br />
              Check back later for gift ideas!
            </>
          )}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isFiltered ? (
            <motion.button
              onClick={() => {
                // This would need to be connected to filter clearing logic
                console.log('Clear filters');
              }}
              className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              Clear Filters
            </motion.button>
          ) : userRole === 'owner' ? (
            <motion.button
              onClick={onAddItem}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/25"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gift className="w-4 h-4 mr-2 inline" />
              Add Your First Item
            </motion.button>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div ref={ref} className={cn('relative', className)} {...props}>
      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Empty State */}
      {showEmpty && <EmptyState />}

      {/* Grid Content */}
      {!loading && !showEmpty && (
        <motion.div
          className={cn('grid gap-6', gridClasses)}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <WishCard
                  item={item}
                  userRole={userRole}
                  mode={mode}
                  selected={selectedItems.includes(item.id)}
                  onSelect={onItemSelect}
                  onClick={onItemClick}
                  onDibsChange={onDibsChange}
                  collections={collections}
                  currentUserId={currentUserId}
                  className="h-full"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Bulk Action Bar - Rendered when items are selected */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <BulkActionBar
            selectedItems={selectedItems}
            totalItems={items.length}
            userRole={userRole}
            onClearSelection={onClearSelection}
            onBulkDelete={(itemIds) => handleBulkAction('delete', itemIds)}
            onBulkEdit={(itemIds) => handleBulkAction('edit', itemIds)}
            onBulkPrivacy={(itemIds) => handleBulkAction('privacy', itemIds)}
            onBulkMove={(itemIds, collectionId) => handleBulkAction('move', itemIds, collectionId)}
            onBulkArchive={(itemIds) => handleBulkAction('archive', itemIds)}
            onBulkDuplicate={(itemIds) => handleBulkAction('duplicate', itemIds)}
            onBulkShare={(itemIds) => handleBulkAction('share', itemIds)}
            onSelectAll={handleSelectAll}
            collections={collections}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

WishGrid.displayName = 'WishGrid';

export default WishGrid;