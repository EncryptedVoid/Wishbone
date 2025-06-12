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
  unclaimItem,
  createCollection
} from '../../lib/wishlistService';

import { getCurrentUser } from '../../lib/authService';

import {
  ultraPerformanceManager,
  getMinimalVariants,
  UltraFastSearch,
  useMinimalDebounce,
  useUltraFastFilter
} from '../../utils/aggressivePerformanceUtils';

const UltraFastWishlistDesktop = React.memo(({ className, ...props }) => {
  // STATE MANAGEMENT
  const [activeCollection, setActiveCollection] = useState('all');
  const [currentMode, setCurrentMode] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);

  // DATA STATE
  const [wishlistItems, setWishlistItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [dashboardSummary, setDashboardSummary] = useState({});

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

        const { collections: userCollections, items: userItems, summary } = await getDashboardData();

        setCollections([
          { id: 'all', name: 'All Items', icon: '📋', isDefault: true, item_count: userItems.length },
          ...userCollections
        ]);
        setWishlistItems(userItems);
        setDashboardSummary(summary);

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
        item.description?.toLowerCase().includes(query) ||
        (item.metadata?.categoryTags && item.metadata.categoryTags.some(tag =>
          tag.toLowerCase().includes(query)
        ))
      );
    }

    // Filter by active filters
    if (activeFilters.category) {
      items = items.filter(item =>
        item.metadata?.categoryTags?.includes(activeFilters.category) ||
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

  // OPTIMIZED GRID CONFIGURATION
  const getGridColumns = useCallback(() => {
    const itemCount = filteredItems.length;
    if (itemCount === 0) return 'grid-cols-1';
    if (itemCount === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (itemCount === 2) return 'grid-cols-2 max-w-2xl mx-auto';

    // Simplified grid - fewer columns for better performance
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }, [filteredItems.length]);

  // MEMOIZED GRID CLASSES
  const gridClasses = useMemo(() => getGridColumns(), [getGridColumns]);

  // EVENT HANDLERS
  const handleCollectionChange = useCallback(async (collectionId) => {
    try {
      setActiveCollection(collectionId);
      setSelectedItems([]);
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
    if (item.dibbed_by && item.dibbed_by !== user?.id) {
      alert(`This item has been dibbed by someone else`);
      return;
    }

    if (item.link) {
      window.open(item.link, '_blank', 'noopener noreferrer');
    }
  }, [user]);

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
        metadata: {
          categoryTags: itemData.categoryTags || []
        }
      };

      const newItem = await createWishlistItem(wishlistData);

      // Update local state
      setWishlistItems(prev => [newItem, ...prev]);

      // Update collection counts
      const updatedCollections = collections.map(col => {
        if (col.id === 'all') {
          return { ...col, item_count: col.item_count + 1 };
        }
        if (itemData.collectionId && col.id === itemData.collectionId) {
          return { ...col, item_count: col.item_count + 1 };
        }
        return col;
      });
      setCollections(updatedCollections);

      console.log('Successfully added item:', newItem.name);

    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  }, [collections]);

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

      // Update collection counts
      const updatedCollections = collections.map(col => {
        if (col.id === 'all') {
          return { ...col, item_count: Math.max(0, col.item_count - 1) };
        }
        if (item.collection_ids?.includes(col.id)) {
          return { ...col, item_count: Math.max(0, col.item_count - 1) };
        }
        return col;
      });
      setCollections(updatedCollections);

      console.log('Successfully deleted item:', item.name);

    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Failed to delete item');
    } finally {
      setLoading(false);
    }
  }, [collections]);

  const handleBulkAction = useCallback(async (action, itemIds) => {
    try {
      setLoading(true);

      switch (action) {
        case 'delete':
          if (!window.confirm(`Delete ${itemIds.length} items?`)) return;

          await Promise.all(itemIds.map(id => deleteWishlistItem(id)));
          setWishlistItems(prev => prev.filter(item => !itemIds.includes(item.id)));

          // Refresh collections to update counts
          const { collections: refreshedCollections } = await getDashboardData();
          setCollections([
            { id: 'all', name: 'All Items', icon: '📋', isDefault: true, item_count: wishlistItems.length - itemIds.length },
            ...refreshedCollections
          ]);
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

  const handleAddCollection = useCallback(async (collectionData) => {
    try {
      setLoading(true);

      const newCollection = await createCollection({
        name: collectionData.name,
        description: collectionData.description || '',
        emoji: collectionData.emoji || '📋',
        color: collectionData.color || 'blue'
      });

      setCollections(prev => [...prev, newCollection]);
      setShowAddCollectionModal(false);

      console.log('Successfully created collection:', newCollection.name);

    } catch (err) {
      console.error('Error creating collection:', err);
      setError(err.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  }, []);

  // EMPTY STATE
  const EmptyState = useMemo(() => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🎁</span>
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchQuery ? 'No items found' : 'Your wishlist is empty'}
      </h3>
      <p className="text-sm text-gray-600 mb-4 max-w-md">
        {searchQuery ? 'Try adjusting your search terms' : 'Start building your wishlist by adding items'}
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

  // OPTIMIZED GRID CONTENT
  const GridContent = useMemo(() => {
    if (filteredItems.length === 0) {
      return <EmptyState />;
    }

    return filteredItems.map((item) => (
      <div key={item.id}>
        <WishCard
          item={item}
          mode={currentMode}
          selected={selectedItems.includes(item.id)}
          onSelect={handleItemSelect}
          onClick={handleItemClick}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          className="h-full"
          user={user}
        />
      </div>
    ));
  }, [filteredItems, currentMode, selectedItems, handleItemSelect, handleItemClick, handleEditItem, handleDeleteItem, user, EmptyState]);

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

  // MAIN RENDER
  return (
    <>
      <div className={cn('min-h-screen bg-white pt-16 pb-16', className)} {...props}>
        <div className="flex h-screen">
          {/* Fixed Sidebar */}
          <CollectionSidebar
            collections={collections}
            activeCollection={activeCollection}
            onCollectionChange={handleCollectionChange}
            onAddCollection={() => setShowAddCollectionModal(true)}
            className="flex-shrink-0"
            summary={dashboardSummary}
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
              onAddItem={() => setShowAddModal(true)}
              itemCount={filteredItems.length}
              totalItems={wishlistItems.length}
            />

            {/* Content Grid */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                <LoadingState isLoading={loading}>
                  {enableAnimations ? (
                    <motion.div
                      className={cn('grid gap-6', gridClasses)}
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
                                className="h-full"
                                user={user}
                              />
                            </motion.div>
                          ))
                        ) : (
                          <motion.div key="empty" variants={variants.item}>
                            <EmptyState />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    // No animations version for better performance
                    <div className={cn('grid gap-6', gridClasses)}>
                      {GridContent}
                    </div>
                  )}
                </LoadingState>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddWishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
        defaultCollection={activeCollection}
        collections={collections}
      />

      {/* Add Collection Modal - TODO: Create this component */}
      {showAddCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Collection</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleAddCollection({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  emoji: formData.get('emoji'),
                  color: formData.get('color')
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Collection name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Emoji</label>
                    <input
                      type="text"
                      name="emoji"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="📋"
                      maxLength="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Color</label>
                    <select
                      name="color"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="purple">Purple</option>
                      <option value="yellow">Yellow</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCollectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

UltraFastWishlistDesktop.displayName = 'UltraFastWishlistDesktop';

export default UltraFastWishlistDesktop;