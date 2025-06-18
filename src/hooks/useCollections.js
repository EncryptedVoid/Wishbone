// hooks/useCollections.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { CollectionService } from '../services/collections';

/**
 * useCollections Hook - Manages collection state with optimistic updates
 *
 * Features:
 * - Optimistic updates for better UX
 * - Error handling with rollback
 * - Loading states for each operation
 * - Automatic refetching after mutations
 * - Archive filtering
 */
export const useCollections = (options = {}) => {
  const {
    includeArchived = false,
    includeItemCounts = true,
    autoRefetch = true
  } = options;

  // State management
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mutationLoading, setMutationLoading] = useState({});

  // Track component mount state for cleanup
  const isMountedRef = useRef(true);

  // Set mutation loading state
  const setMutationState = useCallback((operation, isLoading) => {
    setMutationLoading(prev => ({
      ...prev,
      [operation]: isLoading
    }));
  }, []);

  // Fetch collections
  const fetchCollections = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const data = await CollectionService.getUserCollections({
        includeArchived,
        includeItemCounts
      });

      if (isMountedRef.current) {
        setCollections(data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message);
        console.error('Error fetching collections:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [includeArchived, includeItemCounts]);

  // Initial fetch
  useEffect(() => {
    fetchCollections();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCollections]);

  // Create collection with optimistic update
  const createCollection = useCallback(async (collectionData) => {
    const operationId = 'create';

    try {
      setMutationState(operationId, true);
      setError(null);

      // Optimistic update - add temporary collection
      const tempId = `temp_${Date.now()}`;
      const optimisticCollection = {
        id: tempId,
        name: collectionData.name,
        emoji: collectionData.emoji || '📋',
        description: collectionData.description || '',
        color: collectionData.color || 'blue',
        is_default: false,
        is_archived: false,
        item_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _isOptimistic: true
      };

      setCollections(prev => [...prev, optimisticCollection]);

      // Perform actual creation
      const newCollection = await CollectionService.createCollection(collectionData);

      // Replace optimistic with real data
      setCollections(prev =>
        prev.map(col =>
          col.id === tempId ? { ...newCollection, _isOptimistic: false } : col
        )
      );

      console.log('✅ Collection created successfully:', newCollection);
      return newCollection;

    } catch (err) {
      // Rollback optimistic update
      setCollections(prev => prev.filter(col => !col._isOptimistic));
      setError(err.message);
      console.error('❌ Failed to create collection:', err);
      throw err;
    } finally {
      setMutationState(operationId, false);
    }
  }, [setMutationState]);

  // Update collection with optimistic update
  const updateCollection = useCallback(async (collectionId, updates) => {
    const operationId = `update_${collectionId}`;

    try {
      setMutationState(operationId, true);
      setError(null);

      // Store original for rollback
      const originalCollections = [...collections];

      // Optimistic update
      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? { ...col, ...updates, updated_at: new Date().toISOString() }
            : col
        )
      );

      // Perform actual update
      const updatedCollection = await CollectionService.updateCollection(collectionId, updates);

      // Replace with actual data
      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId ? updatedCollection : col
        )
      );

      console.log('✅ Collection updated successfully:', updatedCollection);
      return updatedCollection;

    } catch (err) {
      // Rollback optimistic update
      setCollections(originalCollections);
      setError(err.message);
      console.error('❌ Failed to update collection:', err);
      throw err;
    } finally {
      setMutationState(operationId, false);
    }
  }, [collections, setMutationState]);

  // Archive/Unarchive collection
  const archiveCollection = useCallback(async (collectionId, archived = true) => {
    const operationId = `archive_${collectionId}`;

    try {
      setMutationState(operationId, true);
      setError(null);

      // Store original for rollback
      const originalCollections = [...collections];

      // Optimistic update
      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? {
                ...col,
                is_archived: archived,
                archived_at: archived ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
              }
            : col
        )
      );

      // Perform actual archive
      const updatedCollection = await CollectionService.archiveCollection(collectionId, archived);

      // Replace with actual data
      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId ? updatedCollection : col
        )
      );

      console.log(`✅ Collection ${archived ? 'archived' : 'unarchived'} successfully:`, updatedCollection);
      return updatedCollection;

    } catch (err) {
      // Rollback optimistic update
      setCollections(originalCollections);
      setError(err.message);
      console.error(`❌ Failed to ${archived ? 'archive' : 'unarchive'} collection:`, err);
      throw err;
    } finally {
      setMutationState(operationId, false);
    }
  }, [collections, setMutationState]);

  // Delete collection with optimistic update
  const deleteCollection = useCallback(async (collectionId, options = {}) => {
    const operationId = `delete_${collectionId}`;

    try {
      setMutationState(operationId, true);
      setError(null);

      // Store original for rollback
      const originalCollections = [...collections];
      const collectionToDelete = collections.find(col => col.id === collectionId);

      if (!collectionToDelete) {
        throw new Error('Collection not found');
      }

      // Optimistic update - remove collection
      setCollections(prev => prev.filter(col => col.id !== collectionId));

      // If moving items to another collection, update that collection's count
      if (options.moveItemsToCollection) {
        setCollections(prev =>
          prev.map(col =>
            col.id === options.moveItemsToCollection
              ? { ...col, item_count: col.item_count + (collectionToDelete.item_count || 0) }
              : col
          )
        );
      }

      // Perform actual deletion
      const result = await CollectionService.deleteCollection(collectionId, options);

      console.log('✅ Collection deleted successfully:', result);

      // Refetch to ensure consistency
      if (autoRefetch) {
        setTimeout(fetchCollections, 500);
      }

      return result;

    } catch (err) {
      // Rollback optimistic update
      setCollections(originalCollections);
      setError(err.message);
      console.error('❌ Failed to delete collection:', err);
      throw err;
    } finally {
      setMutationState(operationId, false);
    }
  }, [collections, setMutationState, autoRefetch, fetchCollections]);

  // Remove item from collection
  const removeItemFromCollection = useCallback(async (itemId, collectionId) => {
    const operationId = `remove_item_${itemId}_${collectionId}`;

    try {
      setMutationState(operationId, true);
      setError(null);

      // Store original for rollback
      const originalCollections = [...collections];

      // Optimistic update - decrement collection count
      setCollections(prev =>
        prev.map(col =>
          col.id === collectionId
            ? { ...col, item_count: Math.max(0, (col.item_count || 0) - 1) }
            : col
        )
      );

      // Perform actual removal
      const updatedItem = await CollectionService.removeItemFromCollection(itemId, collectionId);

      console.log('✅ Item removed from collection successfully:', { itemId, collectionId });
      return updatedItem;

    } catch (err) {
      // Rollback optimistic update
      setCollections(originalCollections);
      setError(err.message);
      console.error('❌ Failed to remove item from collection:', err);
      throw err;
    } finally {
      setMutationState(operationId, false);
    }
  }, [collections, setMutationState]);

  // Utility functions
  const getCollectionById = useCallback((collectionId) => {
    return collections.find(col => col.id === collectionId);
  }, [collections]);

  const getActiveCollections = useCallback(() => {
    return collections.filter(col => !col.is_archived);
  }, [collections]);

  const getArchivedCollections = useCallback(() => {
    return collections.filter(col => col.is_archived);
  }, [collections]);

  const getDefaultCollection = useCallback(() => {
    return collections.find(col => col.is_default);
  }, [collections]);

  const isAnyLoading = Object.values(mutationLoading).some(Boolean);

  return {
    // Data
    collections,
    activeCollections: getActiveCollections(),
    archivedCollections: getArchivedCollections(),
    defaultCollection: getDefaultCollection(),

    // State
    loading,
    error,
    mutationLoading,
    isAnyLoading,

    // Operations
    createCollection,
    updateCollection,
    archiveCollection,
    deleteCollection,
    removeItemFromCollection,

    // Utilities
    getCollectionById,
    refetch: fetchCollections,
    clearError: () => setError(null)
  };
};