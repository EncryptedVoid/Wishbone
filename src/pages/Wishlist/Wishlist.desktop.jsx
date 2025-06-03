import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import CollectionSidebar from '../../components/ui/CollectionSidebar';
import WishlistToolbar from '../../components/wishes/WishlistToolbar';
import WishCard from '../../components/wishes/WishCard';
import LoadingState from '../../components/ui/LoadingState';
import { mockWishItems, mockCollections, mockUtils } from '../../data/mockData';

/**
 * Wishlist Desktop Component - Desktop layout for wishlist management
 *
 * Features:
 * - Fixed sidebar navigation for collections
 * - Multi-column grid layout for wish cards
 * - Advanced filtering and search
 * - Multiple interaction modes (view, edit, delete, select)
 * - Responsive grid that adapts to screen size
 * - Professional animations and transitions
 * - Bulk operations support
 *
 * @param {string} className - Additional CSS classes
 */
const WishlistDesktop = React.forwardRef(({
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

  // FILTERED ITEMS
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
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    if (mode !== 'select') {
      setSelectedItems([]); // Clear selections when exiting select mode
    }
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
      // Show dibs message
      alert(`This item has been dibbed by ${item.dibbedBy}`);
      return;
    }

    // Navigate to product link
    window.open(item.link, '_blank', 'noopener noreferrer');
  };

  const handleItemEdit = (item) => {
    // TODO: Open edit modal
    console.log('Edit item:', item);
  };

  const handleItemDelete = (item) => {
    // TODO: Show delete confirmation
    console.log('Delete item:', item);
  };

  const handleBulkAction = (action, itemIds) => {
    // TODO: Implement bulk actions
    console.log(`Bulk ${action}:`, itemIds);
  };

  const handleAddItem = () => {
    // TODO: Open add item modal
    console.log('Add new item');
  };

  const handleAddCollection = () => {
    // TODO: Open add collection modal
    console.log('Add new collection');
  };

  // GRID CONFIGURATION
  const getGridColumns = () => {
    const itemCount = filteredItems.length;
    if (itemCount === 0) return 'grid-cols-1';
    if (itemCount === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (itemCount === 2) return 'grid-cols-2 max-w-2xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // MOTION VARIANTS
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-responsive-3xl text-center">
      <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-responsive-lg">
        <span className="text-2xl">🎁</span>
      </div>
      <h3 className="text-responsive-xl font-semibold text-foreground mb-responsive-sm">
        {searchQuery || Object.keys(activeFilters).some(key => activeFilters[key])
          ? 'No items match your search'
          : 'No items in this collection'
        }
      </h3>
      <p className="text-responsive-sm text-muted mb-responsive-lg max-w-md">
        {searchQuery || Object.keys(activeFilters).some(key => activeFilters[key])
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'Start building your wishlist by adding items you desire.'
        }
      </p>
      {!searchQuery && !Object.keys(activeFilters).some(key => activeFilters[key]) && (
        <button
          onClick={handleAddItem}
          className="px-responsive-lg py-responsive-md bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Add Your First Item
        </button>
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        'min-h-screen bg-background',
        // Extra padding for navbar/footer overlap
        'pt-responsive-3xl pb-responsive-3xl',
        className
      )}
      {...props}
    >
      <div className="flex h-screen">
        {/* Fixed Sidebar */}
        <CollectionSidebar
          collections={collections}
          activeCollection={activeCollection}
          onCollectionChange={handleCollectionChange}
          onAddCollection={handleAddCollection}
          className="flex-shrink-0"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
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
          />

          {/* Content Grid */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-responsive-lg">
              <LoadingState isLoading={loading}>
                <motion.div
                  className={cn(
                    'grid gap-responsive-lg',
                    getGridColumns()
                  )}
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
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
                            className="h-full"
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
      </div>
    </div>
  );
});

WishlistDesktop.displayName = 'WishlistDesktop';

export default WishlistDesktop;

/*
USAGE EXAMPLES:

// Basic usage
<WishlistDesktop />

// With custom styling
<WishlistDesktop className="custom-wishlist" />

// The component automatically handles:
// - Collection navigation in sidebar
// - Search and filtering
// - Mode switching (view, edit, delete, select)
// - Bulk operations
// - Responsive grid layout
// - Empty states
// - Loading states
// - Professional animations

FEATURES:
- Fixed sidebar for easy collection navigation
- Multi-column responsive grid (1-4 columns based on content)
- Advanced search and filtering capabilities
- Multiple interaction modes with visual feedback
- Bulk selection and operations
- Professional animations and transitions
- Empty state handling
- Loading state management
- Theme-aware styling
- Semantic sizing system integration
- Proper spacing for navbar/footer overlap
*/