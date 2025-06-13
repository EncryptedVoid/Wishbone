import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Import organisms
import CollectionSidebar from '../../components/wishes/organisms/CollectionSidebar';
import WishlistToolbar from '../../components/wishes/organisms/WishlistToolbar';
import WishGrid from '../../components/wishes/organisms/WishGrid';
import WishModal from '../../components/wishes/organisms/WishModal';

// Import UI components
import LoadingState from '../../components/ui/LoadingState';

// Import services
import {
  getDashboardData,
  deleteWishlistItem,
  createWishlistItem,
  updateWishlistItem,
  createCollection
} from '../../lib/wishlistService';

import { getCurrentUser } from '../../lib/authService';

// Import performance utilities
import {
  ultraPerformanceManager,
  getMinimalVariants,
  useMinimalDebounce,
  useUltraFastFilter
} from '../../utils/aggressivePerformanceUtils';

/**
 * UltraFastWishlistDesktop - Redesigned desktop wishlist using atomic design
 * 
 * Features:
 * - Clean atomic design structure with organisms/molecules/atoms
 * - Fixed sidebar with dashboard summary
 * - Optimized grid layouts (1-3 columns based on content)
 * - Advanced filtering and search
 * - Bulk operations with intuitive UX
 * - Role-based access control
 * - Performance optimizations for large datasets
 * - Professional keyboard shortcuts
 */
const UltraFastWishlistDesktop = React.memo(({ className, ...props }) => {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  const [activeCollection, setActiveCollection] = useState('all');
  const [currentMode, setCurrentMode] = useState('view'); // 'view' | 'select' | 'edit'
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

  // ===============================
  // AUTHENTICATION & DATA LOADING
  // ===============================
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setError('Please log in to view your wishlist');
          return;
        }
        setUser(currentUser);

        // Load dashboard data
        const { collections: userCollections, items: userItems, summary } = await getDashboardData();

        // Set collections with default 'all' collection
        setCollections([
          { 
            id: 'all', 
            name: 'All Items', 
            icon: '📋', 
            isDefault: true, 
            item_count: userItems.length 
          },
          ...userCollections
        ]);
        
        setWishlistItems(userItems);
        setDashboardSummary(summary || {});

      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err.message || 'Failed to load wishlist data');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // ===============================
  // DEBOUNCED SEARCH
  // ===============================
  const debouncedSetSearch = useMinimalDebounce((query) => {
    setDebouncedSearchQuery(query);
  }, ultraPerformanceManager.settings.debounceDelay);

  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // ===============================
  // OPTIMIZED FILTERING
  // ===============================
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

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case 'category':
          items = items.filter(item =>
            item.metadata?.categoryTags?.includes(value) ||
            item.category_tags?.includes(value)
          );
          break;
        case 'minDesireScore':
          items = items.filter(item => item.score >= parseInt(value));
          break;
        case 'status':
          switch (value) {
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
          break;
      }
    });

    return items.slice(0, maxVisibleItems);
  }, [wishlistItems, activeCollection, debouncedSearchQuery, activeFilters, maxVisibleItems]);

  // ===============================
  // KEYBOARD SHORTCUTS
  // ===============================
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('[data-search-input]')?.focus();
      }

      // Cmd/Ctrl + N: New item
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowAddModal(true);
      }

      // Escape: Cancel selection/close modals
      if (e.key === 'Escape') {
        if (currentMode === 'select') {
          setCurrentMode('view');
          setSelectedItems([]);
        }
      }

      // Cmd/Ctrl + A: Select all (in select mode)
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && currentMode === 'select') {
        e.preventDefault();
        setSelectedItems(filteredItems.map(item => item.id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, filteredItems]);



  // ===============================
  // EVENT HANDLERS
  // ===============================
  const handleCollectionChange = useCallback((collectionId) => {
    setActiveCollection(collectionId);
    setSelectedItems([]);
  }, []);

  const handleModeChange = useCallback((mode) => {
    setCurrentMode(mode);
    if (mode !== 'select') setSelectedItems([]);
  }, []);

  const handleItemSelect = useCallback((itemId) => {
    setSelectedItems(prev => {
      const index = prev.indexOf(itemId);
      if (index > -1) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  }, []);

  const handleItemClick = useCallback((item) => {
    if (currentMode === 'select') {
      handleItemSelect(item.id);
      return;
    }

    if (item.dibbed_by && item.dibbed_by !== user?.id) {
      alert(`This item has been dibbed by someone else`);
      return;
    }

    if (item.link) {
      window.open(item.link, '_blank', 'noopener noreferrer');
    }
  }, [currentMode, handleItemSelect, user]);

  // ===============================
  // CRUD OPERATIONS
  // ===============================
  const handleAddItem = useCallback(async (itemData) => {
    try {
      setLoading(true);

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

  const handleEditItem = useCallback((item) => {
    // TODO: Open edit modal
    console.log('Edit item:', item);
  }, []);

  const handleDeleteItem = useCallback(async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteWishlistItem(item.id);
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
          const updates = itemIds.map(async (id) => {
            const item = wishlistItems.find(i => i.id === id);
            if (item) {
              return updateWishlistItem(id, { isPrivate: !item.is_private });
            }
          });
          await Promise.all(updates);
          
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

  // ===============================
  // ERROR BOUNDARY
  // ===============================
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

  // ===============================
  // MAIN RENDER
  // ===============================
  return (
    <>
      <div className={cn('min-h-screen bg-white', className)} {...props}>
        <div className="flex h-screen">
          {/* Fixed Sidebar */}
          <CollectionSidebar
            collections={collections}
            activeCollection={activeCollection}
            onCollectionChange={handleCollectionChange}
            onAddCollection={() => setShowAddCollectionModal(true)}
            className="flex-shrink-0"
            summary={dashboardSummary}
            userRole="owner"
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
              userRole="owner"
              itemCount={filteredItems.length}
              totalItems={wishlistItems.length}
              isMobile={false}
            />

            {/* Content Grid */}
            <main className="flex-1 overflow-y-auto">
              <div className="p-6">
                <LoadingState isLoading={loading}>
                  <WishGrid
                    items={filteredItems}
                    selectedItems={selectedItems}
                    userRole="owner"
                    mode={currentMode}
                    currentUserId={user?.id}
                    collections={collections}
                    onItemClick={handleItemClick}
                    onItemSelect={handleItemSelect}
                    onBulkAction={handleBulkAction}
                    onClearSelection={() => {
                      setSelectedItems([]);
                      setCurrentMode('view');
                    }}
                    onSelectAll={(itemIds) => setSelectedItems(itemIds)}
                    onAddItem={() => setShowAddModal(true)}
                    loading={loading}
                    searchQuery={searchQuery}
                    activeFilters={activeFilters}
                  />
                </LoadingState>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <WishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
        mode="add"
        defaultCollection={activeCollection}
        collections={collections}
        loading={loading}
      />

      {/* Add Collection Modal */}
      {showAddCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
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
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
});

UltraFastWishlistDesktop.displayName = 'UltraFastWishlistDesktop';

export default UltraFastWishlistDesktop;