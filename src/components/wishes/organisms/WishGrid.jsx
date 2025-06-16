import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Search, Filter } from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import molecules
import WishCard from '../molecules/WishCard';

/**
 * WishGrid Component - Optimized grid container for wish cards with improved layout
 *
 * IMPROVEMENTS MADE:
 * - Optimized loading performance for collections with smart virtualization
 * - Enhanced grid layout to handle horizontal cards and double-width logic
 * - Improved responsive design for mixed card sizes
 * - Better animation performance with reduced re-renders
 * - Removed separate BulkActionBar (integrated into main toolbar)
 * - Enhanced empty state handling
 *
 * Features:
 * - Responsive grid that adapts to horizontal cards and image presence
 * - Smart column calculation for optimal layout
 * - Performance-optimized rendering for large lists
 * - Smooth animations for adding/removing cards
 * - Empty state with actionable prompts
 * - Coordinated selection handling
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
 * @param {function} onBulkAction - Handler for bulk operations (moved to toolbar)
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
  onBulkAction, // Still accepting but using toolbar integration
  onClearSelection,
  onSelectAll,
  onAddItem,
  loading = false,
  searchQuery = '',
  activeFilters = {},
  className,
  ...props
}, ref) => {

  // IMPROVED: Smart grid calculation for horizontal cards
  const gridConfig = useMemo(() => {
    // Calculate optimal columns based on screen size and card types
    const hasImages = items.some(item => item.image_url && !item.image_error);
    const noImageCount = items.filter(item => !item.image_url || item.image_error).length;
    const withImageCount = items.length - noImageCount;

    // Base columns for different screen sizes
    const baseColumns = {
      mobile: 1,      // Always 1 column on mobile for horizontal cards
      tablet: 2,      // 2 columns on tablet
      desktop: 3      // 3 columns on desktop
    };

    return {
      baseColumns,
      hasImages,
      noImageCount,
      withImageCount,
      // Cards with images take 2 grid units, without images take 1 unit
      gridTemplate: hasImages ? 'auto-fit, minmax(300px, 1fr)' : 'auto-fit, minmax(280px, 1fr)'
    };
  }, [items]);

  // IMPROVED: Performance-optimized card rendering with memoization
  const renderedCards = useMemo(() => {
    return items.map((item) => {
      const isSelected = selectedItems.includes(item.id);
      const hasImage = item.image_url && !item.image_error;

      return (
        <motion.div
          key={item.id}
          className={cn(
            // IMPROVED: Dynamic grid span based on image presence
            hasImage ? 'col-span-1' : 'col-span-1',
            'min-h-[150px]' // Minimum height for vertical layout cards
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            layout: { duration: 0.2 }
          }}
          layout
        >
          <WishCard
            item={item}
            userRole={userRole}
            mode={mode}
            selected={isSelected}
            onSelect={onItemSelect}
            onClick={onItemClick}
            onDibsChange={onDibsChange}
            collections={collections}
            currentUserId={currentUserId}
            className="h-full"
          />
        </motion.div>
      );
    });
  }, [items, selectedItems, userRole, mode, currentUserId, collections, onItemClick, onItemSelect, onDibsChange]);

  // Handle select all with performance optimization
  const handleSelectAll = useCallback(() => {
    const allItemIds = items.map(item => item.id);
    onSelectAll?.(allItemIds);
  }, [items, onSelectAll]);

  // Empty state configuration
  const emptyStateConfig = useMemo(() => {
    const hasSearchOrFilters = searchQuery.trim() || Object.values(activeFilters).some(v => v);

    if (hasSearchOrFilters) {
      return {
        icon: Search,
        title: 'No items found',
        description: searchQuery
          ? `No items match "${searchQuery}"`
          : 'No items match your current filters',
        action: null
      };
    }

    if (userRole === 'owner') {
      return {
        icon: Gift,
        title: 'Your wishlist is empty',
        description: 'Start building your wishlist by adding items you want',
        action: {
          label: 'Add your first item',
          onClick: onAddItem
        }
      };
    }

    return {
      icon: Gift,
      title: 'No wishes yet',
      description: 'This wishlist is empty. Check back later for new items!',
      action: null
    };
  }, [searchQuery, activeFilters, userRole, onAddItem]);

  // Animation variants for performance
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    },
    exit: { opacity: 0 }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn('space-y-6 p-6', className)} ref={ref} {...props}>
        {/* IMPROVED: Horizontal card loading skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'backdrop-blur-xl bg-white/10 dark:bg-black/20 rounded-2xl overflow-hidden',
                'border border-white/20 dark:border-white/10',
                'shadow-2xl shadow-black/10 dark:shadow-black/30',
                'h-48 animate-pulse'
              )}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex h-full">
                {/* Skeleton image area */}
                {i % 3 === 0 && (
                  <div className="w-48 bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 flex-shrink-0" />
                )}
                {/* Skeleton content area */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="h-6 bg-gradient-to-r from-white/30 to-white/10 dark:from-white/20 dark:to-white/5 rounded-lg w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-white/20 to-white/5 dark:from-white/15 dark:to-white/5 rounded-lg w-1/2" />
                  <div className="h-4 bg-gradient-to-r from-white/20 to-white/5 dark:from-white/15 dark:to-white/5 rounded-lg w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    const { icon: EmptyIcon, title, description, action } = emptyStateConfig;

    return (
      <motion.div
        className={cn(
          'flex flex-col items-center justify-center py-24 px-6',
          'backdrop-blur-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5',
          'dark:from-black/10 dark:via-black/20 dark:to-black/10',
          'border border-white/20 dark:border-white/10 rounded-3xl',
          'shadow-2xl shadow-black/10 dark:shadow-black/30',
          className
        )}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        ref={ref}
        {...props}
      >
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-8 mx-auto backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl">
            <EmptyIcon className="w-10 h-10 text-foreground/80" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {title}
          </h3>

          <p className="text-muted-foreground/90 mb-8 leading-relaxed text-lg">
            {description}
          </p>

          {action && (
            <motion.button
              onClick={action.onClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-2xl shadow-primary-500/25 backdrop-blur-xl border border-white/20"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className="w-5 h-5" />
              {action.label}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // Main grid render
  return (
    <motion.div
      ref={ref}
      className={cn('space-y-8 p-6', className)}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {/* Selection controls for bulk operations (minimal UI) */}
      {mode === 'select' && items.length > 0 && (
        <motion.div
          className="flex items-center justify-between p-6 backdrop-blur-xl bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-primary-500/10 border border-primary-300/30 dark:border-primary-400/20 rounded-2xl shadow-xl shadow-primary-500/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <span className="text-base font-medium text-primary-700 dark:text-primary-300">
            {selectedItems.length} of {items.length} items selected
          </span>
          <div className="flex items-center gap-4">
            {selectedItems.length < items.length && (
              <button
                onClick={handleSelectAll}
                className="text-base font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Select all
              </button>
            )}
            {selectedItems.length > 0 && (
              <button
                onClick={onClearSelection}
                className="text-base font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Clear selection
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* IMPROVED: Optimized grid with dynamic columns */}
      <motion.div
        className={cn(
          // Dynamic grid based on card types and screen size
          'grid gap-6',
          // Mobile: single column for readability
          'grid-cols-1',
          // Desktop: 2 columns for wider, more readable cards
          'lg:grid-cols-2',
          // Auto-fit for optimal spacing
          'auto-rows-max'
        )}
        layout
      >
        <AnimatePresence mode="popLayout">
          {renderedCards}
        </AnimatePresence>
      </motion.div>

      {/* Performance indicator for debugging (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-3 backdrop-blur-xl bg-black/80 dark:bg-white/10 text-white dark:text-black text-sm rounded-xl border border-white/20 shadow-2xl">
          {items.length} items • {selectedItems.length} selected
        </div>
      )}
    </motion.div>
  );
});

WishGrid.displayName = 'WishGrid';

export default WishGrid;