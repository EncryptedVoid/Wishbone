import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Import organisms
import CollectionSidebar from '../../components/wishes/organisms/CollectionSidebar';
import WishlistToolbar from '../../components/wishes/organisms/WishlistToolbar';
import WishGrid from '../../components/wishes/organisms/WishGrid';
import WishModal from '../../components/wishes/organisms/WishModal';

// Import UI components
import LoadingState from '../../components/ui/LoadingState';
import {
  X,
  Heart,
  Link,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Folder,
  Tag,
  Type,
  FileText
} from 'lucide-react';

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
 * Enhanced Wishlist Desktop Layout - Fixed all reported issues
 * 
 * FIXED ISSUES:
 * - Added proper top padding to prevent navbar overlap (pt-20)
 * - Added "All Items" collection as default option
 * - Redesigned toolbar with search on top, then controls
 * - Fixed dark mode styling throughout
 * - Fixed collection button responsiveness
 * - Better container layout structure
 */
const UltraFastWishlistDesktop = React.memo(({ className, ...props }) => {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  const [activeCollection, setActiveCollection] = useState('all');
  const [currentMode, setCurrentMode] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data state with caching
  const [wishlistItems, setWishlistItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    item: null,
    loading: false
  });

  // Performance and caching
  const [dataCache, setDataCache] = useState(new Map());
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutes cache

  // Refs for scroll restoration
  const scrollPositionRef = useRef(0);
  const gridRef = useRef(null);

  // ===============================
  // PERFORMANCE OPTIMIZATIONS
  // ===============================

  // Check if cached data is still valid
  const isCacheValid = useCallback(() => {
    return Date.now() - lastFetchTime < cacheTimeout;
  }, [lastFetchTime]);

  // Enhanced data loading with caching
  const loadData = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);

      // Use cache if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && dataCache.has('dashboardData')) {
        const cached = dataCache.get('dashboardData');
        setWishlistItems(cached.items);
        setCollections(cached.collections);
        setDashboardSummary(cached.summary);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch fresh data
      const [dashboardData, currentUser] = await Promise.all([
        getDashboardData(),
        getCurrentUser()
      ]);

      const { collections: userCollections, items: userItems, summary } = dashboardData;

      // FIXED: Always include "All Items" as first option
      const collectionsWithAll = [
        {
          id: 'all',
          name: 'All Items',
          emoji: '📋',
          item_count: userItems.length,
          isDefault: true
        },
        ...userCollections
      ];

      // Cache the data
      const cacheData = {
        items: userItems,
        collections: collectionsWithAll,
        summary
      };
      setDataCache(new Map([['dashboardData', cacheData]]));
      setLastFetchTime(Date.now());

      // Update state
      setCollections(collectionsWithAll);
      setWishlistItems(userItems);
      setDashboardSummary(summary || {});
      setUser(currentUser);

    } catch (err) {
      console.error('Error loading wishlist data:', err);
      setError(err.message || 'Failed to load wishlist data');
    } finally {
      setLoading(false);
    }
  }, [isCacheValid, dataCache]);

  // Initialize on mount with better error handling
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gridRef.current) {
        scrollPositionRef.current = gridRef.current.scrollTop;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Restore scroll position after data loads
  useEffect(() => {
    if (!loading && gridRef.current && scrollPositionRef.current > 0) {
      setTimeout(() => {
        gridRef.current.scrollTop = scrollPositionRef.current;
      }, 100);
    }
  }, [loading]);

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
  // OPTIMIZED FILTERING WITH CACHING
  // ===============================
  const filteredItems = useMemo(() => {
    const cacheKey = `filtered_${activeCollection}_${debouncedSearchQuery}_${JSON.stringify(activeFilters)}`;

    // Check cache first
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }

    let items = wishlistItems;

    // Collection filtering - FIXED: Handle "all" collection properly
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
            item.metadata?.categoryTags?.includes(value)
          );
          break;
        case 'score':
          const [min, max] = value.split('-').map(Number);
          items = items.filter(item => item.score >= min && item.score <= max);
          break;
        case 'private':
          items = items.filter(item => item.is_private === (value === 'true'));
          break;
        case 'dibbed':
          items = items.filter(item =>
            value === 'true' ? item.dibbed_by : !item.dibbed_by
          );
          break;
      }
    });

    // Cache the result
    const newCache = new Map(dataCache);
    newCache.set(cacheKey, items);
    setDataCache(newCache);

    return items;
  }, [wishlistItems, activeCollection, debouncedSearchQuery, activeFilters, dataCache]);

  // ===============================
  // ENHANCED EVENT HANDLERS
  // ===============================

  // Enhanced item creation with better error handling
  const handleAddItem = useCallback(async (itemData) => {
    try {
      setModalState(prev => ({ ...prev, loading: true }));
      setError(null);

      const newItem = await createWishlistItem(itemData);

      // Update local state immediately for better UX
      setWishlistItems(prev => [newItem, ...prev]);

      // Update collection counts
      if (itemData.collectionId) {
        setCollections(prev => prev.map(col =>
          col.id === itemData.collectionId
            ? { ...col, item_count: (col.item_count || 0) + 1 }
            : col.id === 'all'
            ? { ...col, item_count: (col.item_count || 0) + 1 }
            : col
        ));
      }

      // Clear cache to force refresh
      setDataCache(new Map());

      // Refresh data in background
      setTimeout(() => loadData(true), 1000);

      return newItem;
    } catch (err) {
      console.error('Error adding item:', err);
      setError(`Failed to add item: ${err.message}`);
      throw err;
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [loadData]);

  // Enhanced item updating
  const handleUpdateItem = useCallback(async (itemData) => {
    try {
      setModalState(prev => ({ ...prev, loading: true }));
      setError(null);

      const updatedItem = await updateWishlistItem(modalState.item.id, itemData);

      // Update local state
      setWishlistItems(prev => prev.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ));

      // Clear cache
      setDataCache(new Map());

      return updatedItem;
    } catch (err) {
      console.error('Error updating item:', err);
      setError(`Failed to update item: ${err.message}`);
      throw err;
    } finally {
      setModalState(prev => ({ ...prev, loading: false }));
    }
  }, [modalState.item]);

  // Modal handlers
  const handleOpenAddModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'add',
      item: null,
      loading: false
    });
  }, []);

  const handleOpenEditModal = useCallback((item) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      item,
      loading: false
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      item: null,
      loading: false
    });
    setError(null);
  }, []);

  const handleSaveModal = useCallback(async (itemData) => {
    if (modalState.mode === 'add') {
      await handleAddItem(itemData);
    } else {
      await handleUpdateItem(itemData);
    }
    handleCloseModal();
  }, [modalState.mode, handleAddItem, handleUpdateItem, handleCloseModal]);

  // Collection management
  const handleCollectionChange = useCallback((collectionId) => {
    setActiveCollection(collectionId);
    setSelectedItems([]);
  }, []);

  const handleAddCollection = useCallback(async () => {
    // Implementation for adding collection
    console.log('Add collection clicked');
  }, []);

  // Delete item handler
  const handleDeleteItem = useCallback(async (itemId) => {
    try {
      await deleteWishlistItem(itemId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setDataCache(new Map()); // Clear cache
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Failed to delete item: ${err.message}`);
    }
  }, []);

  // Dibs change handler
  const handleDibsChange = useCallback(async (itemId, dibbedBy) => {
    // Update local state immediately
    setWishlistItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, dibbed_by: dibbedBy } : item
    ));
  }, []);

  // ===============================
  // RENDER
  // ===============================

  if (loading && wishlistItems.length === 0) {
    return (
      <LoadingState
        isLoading={true}
        className="min-h-screen bg-background"
        fallback={
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading your wishlist...</p>
          </div>
        }
      />
    );
  }

  return (
    <div className={cn(
      // FIXED: Added proper top padding to prevent navbar overlap
      'min-h-screen bg-background text-foreground pt-20',
      'flex overflow-hidden',
      className
    )}>
      {/* Enhanced Sidebar */}
      <CollectionSidebar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={handleCollectionChange}
        onAddCollection={handleAddCollection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole="owner"
        summary={dashboardSummary}
        loading={loading}
        className="flex-shrink-0"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* FIXED: New Toolbar Design with Search on Top */}
        <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <WishlistToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            currentMode={currentMode}
            onModeChange={setCurrentMode}
            selectedItems={selectedItems}
            totalItems={wishlistItems.length}
            filteredItems={filteredItems.length}
            userRole="owner"
            onAddItem={handleOpenAddModal}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
            loading={loading}
            // FIXED: Pass current collection name for better UX
            currentCollection={collections.find(c => c.id === activeCollection)?.name || 'All Items'}
            className="px-6 py-4"
          />
        </div>

        {/* Scrollable Content Area */}
        <div
          ref={gridRef}
          className="flex-1 overflow-y-auto px-6 pb-6"
        >
          {/* Error Display with Dark Mode Support */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Error</span>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Wish Grid */}
          <WishGrid
            items={filteredItems}
            selectedItems={selectedItems}
            userRole="owner"
            mode={currentMode}
            currentUserId={user?.id}
            collections={collections}
            onItemClick={currentMode === 'edit' ? handleOpenEditModal : undefined}
            onItemSelect={(itemId) => {
              setSelectedItems(prev =>
                prev.includes(itemId)
                  ? prev.filter(id => id !== itemId)
                  : [...prev, itemId]
              );
            }}
            onDibsChange={handleDibsChange}
            onAddItem={handleOpenAddModal}
            loading={loading}
            searchQuery={debouncedSearchQuery}
            activeFilters={activeFilters}
            className="min-h-[400px]"
          />
        </div>
      </div>

      {/* Enhanced Modal with Dark Mode Support */}
      <WishModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveModal}
        mode={modalState.mode}
        item={modalState.item}
        collections={collections.filter(col => col.id !== 'all')}
        defaultCollection={activeCollection !== 'all' ? activeCollection : null}
        loading={modalState.loading}
      />
    </div>
  );
});

export default UltraFastWishlistDesktop;