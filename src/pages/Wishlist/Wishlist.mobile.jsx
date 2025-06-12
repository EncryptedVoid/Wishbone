import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import CollectionSidebar from '../../components/ui/CollectionSidebar';
import WishlistToolbar from '../../components/wishes/WishlistToolbar';
import WishCard from '../../components/wishes/WishCard';
import LoadingState from '../../components/ui/LoadingState';
import AddWishModal from '../../components/wishes/AddWishModal';

// Import service functions
import {
  getMyWishlistItems,
  getMyCollections,
  getDashboardData,
  searchWishlistItems,
  getItemsByScoreRange,
  getItemsInCollection,
  deleteWishlistItem,
  createWishlistItem,
  updateWishlistItem,
  claimItem,
  unclaimItem
} from '../../lib/wishlistService';

import { getCurrentUser } from '../../lib/authService';

import {
  ultraPerformanceManager,
  getMinimalVariants,
  UltraFastSearch,
  useMinimalDebounce,
  useSimpleVirtualScrolling,
  useUltraFastFilter
} from '../../utils/aggressivePerformanceUtils';

const UltraFastWishlistMobile = React.memo(({ className, ...props }) => {
  // STATE MANAGEMENT
  const [activeCollection, setActiveCollection] = useState('all');
  const [currentMode, setCurrentMode] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // DATA STATE
  const [wishlistItems, setWishlistItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // PERFORMANCE SETTINGS
  const { enableAnimations, maxVisibleItems } = ultraPerformanceManager.settings;
  const variants = useMemo(() => getMinimalVariants(), []);

  // AUTHENTICATION CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setError('Please log in to view your wishlist');
          setLoading(false);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please log in again.');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // LOAD DASHBOARD DATA
  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { collections: userCollections, items: userItems } = await getDashboardData();

        setCollections([
          { id: 'all', name: 'All Items', icon: '📋', isDefault: true },
          ...userCollections
        ]);
        setWishlistItems(userItems);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Failed to load wishlist data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // DEBOUNCED SEARCH
  const debouncedSetSearch = useMinimalDebounce((query) => {
    setDebouncedSearchQuery(query);
  }, ultraPerformanceManager.settings.debounceDelay);

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // FILTERED ITEMS WITH SERVICE INTEGRATION
  const filteredItems = useMemo(() => {
    let items = wishlistItems;

    // Collection filtering
    if (activeCollection !== 'all') {
      items = items.filter(item =>
        item.collection_ids && item.collection_ids.includes(activeCollection)
      );
    }

    // Search filtering
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by active filters
    if (activeFilters.category) {
      // Assuming categoryTags are stored in item metadata or tags
      items = items.filter(item =>
        item.category_tags?.includes(activeFilters.category)
      );
    }

    if (activeFilters.minDesireScore) {
      const minScore = parseInt(activeFilters.minDesireScore);
      items = items.filter(item => item.score >= minScore);
    }

    if (activeFilters.status) {
      switch (activeFilters.status) {
        case 'available':
          items = items.filter(item => !item.dibbed_by);
          break;
        case 'dibbed':
          items = items.filter(item => item.dibbed_by);
          break;
        case 'private':
          items = items.filter(item => item.is_private);
          break;
        case 'public':
          items = items.filter(item => !item.is_private);
          break;
      }
    }

    return items.slice(0, maxVisibleItems);
  }, [wishlistItems, activeCollection, debouncedSearchQuery, activeFilters, maxVisibleItems]);

  // VIRTUAL SCROLLING
  const { visibleItems, totalHeight, offsetY, onScroll } = useSimpleVirtualScrolling(filteredItems);

  // EVENT HANDLERS
  const handleCollectionChange = useCallback(async (collectionId) => {
    try {
      setActiveCollection(collectionId);
      setSelectedItems([]);
      setSidebarOpen(false);

      // If specific collection, could optionally fetch items directly
      if (collectionId !== 'all') {
        // Optional: Load specific collection items for better performance
        // const collectionItems = await getItemsInCollection(collectionId);
        // Handle collection-specific loading if needed
      }
    } catch (err) {
      console.error('Error changing collection:', err);
      setError('Failed to load collection items');
    }
  }, []);

  const handleModeChange = useCallback((mode) => {
    setCurrentMode(mode);
    if (mode !== 'select') setSelectedItems([]);
  }, []);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      const index = prev.indexOf(itemId);
      if (index > -1) {
        const newSelected = [...prev];
        newSelected.splice(index, 1);
        return newSelected;
      }
      return [...prev, itemId];
    });
  }, []);

  const handleItemClick = useCallback(async (item) => {
    if (item.dibbed_by) {
      alert(`This item has been dibbed by ${item.dibbed_by}`);
      return;
    }

    if (item.link) {
      window.open(item.link, '_blank', 'noopener noreferrer');
    }
  }, []);

  // CRUD OPERATIONS
  const handleAddItem = useCallback(async (itemData) => {
    try {
      setLoading(true);

      // Transform form data to service format
      const wishlistData = {
        name: itemData.name,
        description: itemData.description,
        link: itemData.link,
        score: itemData.desireScore,
        isPrivate: itemData.isPrivate,
        imageUrl: itemData.imageUrl,
        collectionIds: itemData.collectionId ? [itemData.collectionId] : [],
        // Map category tags to a format your service expects
        metadata: {
          categoryTags: itemData.categoryTags || []
        }
      };

      const newItem = await createWishlistItem(wishlistData);

      // Update local state
      setWishlistItems(prev => [newItem, ...prev]);

      console.log('Successfully added item:', newItem.name);

    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditItem = useCallback(async (item) => {
    // TODO: Implement edit modal and update logic
    console.log('Edit item:', item);
  }, []);

  const handleDeleteItem = useCallback(async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteWishlistItem(item.id);

      // Update local state
      setWishlistItems(prev => prev.filter(i => i.id !== item.id));

      console.log('Successfully deleted item:', item.name);

    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBulkAction = useCallback(async (action, itemIds) => {
    try {
      setLoading(true);

      switch (action) {
        case 'delete':
          if (!window.confirm(`Delete ${itemIds.length} items?`)) return;

          await Promise.all(itemIds.map(id => deleteWishlistItem(id)));
          setWishlistItems(prev => prev.filter(item => !itemIds.includes(item.id)));
          break;

        case 'privacy':
          // Toggle privacy for selected items
          const updates = itemIds.map(async (id) => {
            const item = wishlistItems.find(i => i.id === id);
            if (item) {
              return updateWishlistItem(id, { isPrivate: !item.is_private });
            }
          });
          await Promise.all(updates);

          // Refresh data
          const { items: refreshedItems } = await getDashboardData();
          setWishlistItems(refreshedItems);
          break;

        default:
          console.log('Bulk action not implemented:', action);
      }

      setSelectedItems([]);
      setCurrentMode('view');

    } catch (err) {
      console.error('Error performing bulk action:', err);
      setError(err.message || 'Failed to perform bulk action');
    } finally {
      setLoading(false);
    }
  }, [wishlistItems]);

  // EMPTY STATE
  const EmptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🎁</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchQuery ? 'No items found' : 'Your wishlist is empty'}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {searchQuery ? 'Try adjusting your search' : 'Start adding items to your wishlist'}
      </p>
      {!searchQuery && (
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Your First Item
        </button>
      )}
    </div>
  ), [searchQuery]);

  // ERROR BOUNDARY
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-800">Error Loading Wishlist</h3>
          <p className="text-sm text-red-600 mb-4 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn('min-h-screen bg-white pt-16 pb-16', className)} {...props}>
        {/* Sidebar */}
        <CollectionSidebar
          collections={collections}
          activeCollection={activeCollection}
          onCollectionChange={handleCollectionChange}
          onAddCollection={() => {}} // TODO: implement
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          data-sidebar
        />

        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
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
            onAddItem={() => setShowAddModal(true)}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Content */}
          <main className="flex-1">
            <div className="p-4">
              <LoadingState isLoading={loading}>
                {/* Virtual Scrolling Container */}
                {filteredItems.length > maxVisibleItems ? (
                  <div
                    style={{ height: '600px', overflow: 'auto' }}
                    onScroll={onScroll}
                  >
                    <div style={{ height: totalHeight, position: 'relative' }}>
                      <div
                        style={{ transform: `translateY(${offsetY}px)` }}
                        className="space-y-4"
                      >
                        {visibleItems.map((item) => (
                          <WishCard
                            key={item.id}
                            item={item}
                            mode={currentMode}
                            selected={selectedItems.includes(item.id)}
                            onSelect={handleItemSelect}
                            onClick={handleItemClick}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem}
                            className="w-full"
                            user={user}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular container for small lists
                  <div className="space-y-4">
                    {enableAnimations ? (
                      <motion.div
                        variants={variants.container}
                        initial="initial"
                        animate="animate"
                      >
                        <AnimatePresence mode="popLayout">
                          {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <motion.div
                                key={item.id}
                                variants={variants.item}
                              >
                                <WishCard
                                  item={item}
                                  mode={currentMode}
                                  selected={selectedItems.includes(item.id)}
                                  onSelect={handleItemSelect}
                                  onClick={handleItemClick}
                                  onEdit={handleEditItem}
                                  onDelete={handleDeleteItem}
                                  className="w-full"
                                  user={user}
                                />
                              </motion.div>
                            ))
                          ) : (
                            <motion.div key="empty" variants={variants.item}>
                              {EmptyState}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      // No animations version
                      <>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <WishCard
                              key={item.id}
                              item={item}
                              mode={currentMode}
                              selected={selectedItems.includes(item.id)}
                              onSelect={handleItemSelect}
                              onClick={handleItemClick}
                              onEdit={handleEditItem}
                              onDelete={handleDeleteItem}
                              className="w-full"
                              user={user}
                            />
                          ))
                        ) : (
                          EmptyState
                        )}
                      </>
                    )}
                  </div>
                )}
              </LoadingState>
            </div>
          </main>
        </div>

        {/* Add Button */}
        {currentMode === 'view' && (
          <button
            onClick={() => setShowAddModal(true)}
            className={cn(
              'fixed bottom-6 right-6 z-40',
              'w-14 h-14 rounded-full',
              'bg-blue-500 text-white shadow-lg',
              'flex items-center justify-center',
              'transition-transform duration-200',
              'active:scale-95'
            )}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Add Modal */}
      <AddWishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
        defaultCollection={activeCollection}
        collections={collections}
      />
    </>
  );
});

UltraFastWishlistMobile.displayName = 'UltraFastWishlistMobile';

export default UltraFastWishlistMobile;