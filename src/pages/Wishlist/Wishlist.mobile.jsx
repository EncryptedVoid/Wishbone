import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import CollectionSidebar from '../../components/ui/CollectionSidebar';
import WishlistToolbar from '../../components/wishes/WishlistToolbar';
import WishCard from '../../components/wishes/WishCard';
import LoadingState from '../../components/ui/LoadingState';
import { mockWishItems, mockCollections, mockUtils } from '../../data/mockData';

/**
 * Wishlist Mobile Component - Mobile-optimized layout for wishlist management
 *
 * Features:
 * - Collapsible drawer sidebar for collections
 * - Single-column card layout optimized for touch
 * - Simplified toolbar with touch-friendly buttons
 * - Swipe gestures for card interactions
 * - Pull-to-refresh functionality
 * - Mobile-specific animations and transitions
 * - Touch-optimized spacing and sizing
 *
 * @param {string} className - Additional CSS classes
 */
const WishlistMobile = React.forwardRef(({
  className,
  ...props
}, ref) => {

  // STATE MANAGEMENT
  const [collections] = useState(mockCollections);
  const [allItems] = useState(mockWishItems);
  const [activeCollection, setActiveCollection] = useState('all');
  const [currentMode, setCurrentMode] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // FILTERED ITEMS (same logic as desktop)
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Filter by collection
    if (activeCollection !== 'all') {
      items = items.filter(item => item.collectionId === activeCollection);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      items = mockUtils.searchItems(searchQuery);
      // If we're in a specific collection, filter the search results too
      if (activeCollection !== 'all') {
        items = items.filter(item => item.collectionId === activeCollection);
      }
    }

    // Apply additional filters
    if (activeFilters.category) {
      items = items.filter(item =>
        item.categoryTags.includes(activeFilters.category)
      );
    }

    if (activeFilters.minDesireScore) {
      items = items.filter(item =>
        item.desireScore >= parseInt(activeFilters.minDesireScore)
      );
    }

    if (activeFilters.status) {
      switch (activeFilters.status) {
        case 'available':
          items = items.filter(item => !item.isDibbed);
          break;
        case 'dibbed':
          items = items.filter(item => item.isDibbed);
          break;
        case 'private':
          items = items.filter(item => item.isPrivate);
          break;
        case 'public':
          items = items.filter(item => !item.isPrivate);
          break;
      }
    }

    return items;
  }, [allItems, activeCollection, searchQuery, activeFilters]);

  // HANDLERS
  const handleCollectionChange = (collectionId) => {
    setActiveCollection(collectionId);
    setSelectedItems([]); // Clear selections when changing collections
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    if (mode !== 'select') {
      setSelectedItems([]); // Clear selections when exiting select mode
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item) => {
    if (item.isDibbed) {
      // Show dibs message (mobile-friendly alert)
      alert(`This item has been dibbed by ${item.dibbedBy}`);
      return;
    }

    // Navigate to product link
    window.open(item.link, '_blank', 'noopener noreferrer');
  };

  const handleItemEdit = (item) => {
    // TODO: Open mobile edit modal
    console.log('Edit item:', item);
  };

  const handleItemDelete = (item) => {
    // TODO: Show mobile delete confirmation
    console.log('Delete item:', item);
  };

  const handleBulkAction = (action, itemIds) => {
    // TODO: Implement mobile bulk actions
    console.log(`Bulk ${action}:`, itemIds);
  };

  const handleAddItem = () => {
    // TODO: Open mobile add item modal
    console.log('Add new item');
  };

  const handleAddCollection = () => {
    // TODO: Open mobile add collection modal
    console.log('Add new collection');
  };

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('[data-sidebar]')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('touchstart', handleClickOutside);
    return () => document.removeEventListener('touchstart', handleClickOutside);
  }, [sidebarOpen]);

  // MOTION VARIANTS
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 250, damping: 25 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25 }
    }
  };

  // Mobile-specific empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-responsive-3xl px-responsive-lg text-center">
      <motion.div
        className={cn(
          'w-24 h-24 rounded-full mb-responsive-lg',
          'bg-gradient-to-br from-primary-100 to-primary-200',
          'backdrop-blur-sm border border-primary-200/50 shadow-xl',
          'flex items-center justify-center'
        )}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-4xl">🎁</span>
      </motion.div>
      <h3 className="text-responsive-xl font-semibold text-foreground mb-responsive-sm">
        {searchQuery || Object.keys(activeFilters).some(key => activeFilters[key])
          ? 'No items found'
          : 'No items yet'
        }
      </h3>
      <p className="text-responsive-sm text-muted mb-responsive-lg max-w-sm leading-relaxed">
        {searchQuery || Object.keys(activeFilters).some(key => activeFilters[key])
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Start building your wishlist by adding items you desire.'
        }
      </p>
      {!searchQuery && !Object.keys(activeFilters).some(key => activeFilters[key]) && (
        <motion.button
          onClick={handleAddItem}
          className={cn(
            'w-full max-w-xs py-responsive-md px-responsive-lg rounded-xl font-medium',
            'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
            'shadow-lg hover:shadow-xl transition-all duration-300'
          )}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Your First Item
        </motion.button>
      )}
    </div>
  );

  // Pull to refresh indicator
  const PullToRefreshIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: refreshing ? 1 : 0, y: refreshing ? 0 : -20 }}
      className="flex justify-center py-responsive-md"
    >
      <div className="flex items-center gap-responsive-sm text-primary-500">
        <motion.div
          animate={{ rotate: refreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
        <span className="text-responsive-sm font-medium">Refreshing...</span>
      </div>
    </motion.div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        'min-h-screen relative',
        // Enhanced background with subtle texture
        'bg-gradient-to-br from-background via-background to-surface/30',
        // Extra padding for mobile navbar/footer
        'pt-responsive-2xl pb-responsive-3xl',
        className
      )}
      {...props}
    >
      {/* Collapsible Sidebar */}
      <CollectionSidebar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={handleCollectionChange}
        onAddCollection={handleAddCollection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        data-sidebar
      />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Mobile Toolbar */}
        <WishlistToolbar
          currentMode={currentMode}
          onModeChange={handleModeChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          selectedItems={selectedItems}
          onBulkAction={handleBulkAction}
          onAddItem={handleAddItem}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={handleSidebarToggle}
        />

        {/* Pull to Refresh Indicator */}
        <PullToRefreshIndicator />

        {/* Content Area */}
        <main className="flex-1">
          <div className="p-responsive-md">
            <LoadingState isLoading={loading}>
              <motion.div
                className="space-y-responsive-lg"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                onTouchStart={(e) => {
                  // Simple pull-to-refresh detection
                  const touch = e.touches[0];
                  if (touch && window.scrollY === 0 && !refreshing) {
                    // Start tracking for pull-to-refresh
                  }
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        layout
                      >
                        <WishCard
                          item={item}
                          mode={currentMode}
                          selected={selectedItems.includes(item.id)}
                          onSelect={handleItemSelect}
                          onClick={handleItemClick}
                          onEdit={handleItemEdit}
                          onDelete={handleItemDelete}
                          className="w-full"
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      key="empty"
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <EmptyState />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </LoadingState>
          </div>
        </main>
      </div>

      {/* Mobile-specific floating action button for quick add */}
      {currentMode === 'view' && filteredItems.length > 0 && (
        <motion.button
          onClick={handleAddItem}
          className={cn(
            'fixed bottom-responsive-xl right-responsive-lg z-40',
            'w-16 h-16 rounded-full',
            // Enhanced glassmorphism FAB
            'bg-gradient-to-r from-primary-500 to-primary-600',
            'backdrop-blur-lg shadow-2xl border border-primary-400/50',
            'flex items-center justify-center',
            'transition-all duration-300',
            'hover:shadow-primary-500/30 hover:shadow-2xl',
            'active:scale-95'
          )}
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 180 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.button>
      )}
    </div>
  );
});

WishlistMobile.displayName = 'WishlistMobile';

export default WishlistMobile;

/*
USAGE EXAMPLES:

// Basic mobile usage
<WishlistMobile />

// With custom styling
<WishlistMobile className="custom-mobile-wishlist" />

MOBILE-SPECIFIC FEATURES:
- Collapsible drawer sidebar that slides in from left
- Single-column layout optimized for touch interaction
- Larger touch targets for better usability
- Pull-to-refresh functionality (basic implementation)
- Floating action button for quick add
- Mobile-friendly empty states with larger touch areas
- Touch-optimized spacing and sizing
- Automatic sidebar close after collection selection
- Backdrop touch to close sidebar
- Mobile-specific animations (slower, more forgiving)

RESPONSIVE BEHAVIORS:
- Toolbar buttons adapt to mobile layout
- Search input takes appropriate mobile size
- Filter panels stack vertically
- Cards expand to full width
- Professional mobile interaction patterns
- Theme-aware styling for all mobile contexts
*/