// services/collections.js
import { supabase } from '../lib/supabase';

/**
 * Collection Service - Handles all collection CRUD operations
 * Provides optimistic updates and proper error handling
 */
export class CollectionService {

  /**
   * Create a new collection
   * @param {Object} collectionData - Collection details
   * @param {string} collectionData.name - Collection name
   * @param {string} collectionData.emoji - Collection emoji
   * @param {string} collectionData.description - Collection description
   * @param {string} collectionData.color - Collection color theme
   * @param {boolean} collectionData.isPrivate - Whether collection is private
   * @returns {Promise<Object>} Created collection
   */
  static async createCollection(collectionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newCollection = {
        name: collectionData.name.trim(),
        emoji: collectionData.emoji || '📋',
        description: collectionData.description?.trim() || null,
        color: collectionData.color || 'blue',
        is_private: collectionData.isPrivate || false,
        user_id: user.id,
        is_default: false,
        item_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('collections')
        .insert([newCollection])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Collection created:', data);
      return data;

    } catch (error) {
      console.error('❌ Error creating collection:', error);
      throw new Error(error.message || 'Failed to create collection');
    }
  }

  /**
   * Update an existing collection
   * @param {string} collectionId - Collection ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated collection
   */
  static async updateCollection(collectionId, updates) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate ownership
      const { data: existing } = await supabase
        .from('collections')
        .select('user_id, is_default')
        .eq('id', collectionId)
        .single();

      if (!existing || existing.user_id !== user.id) {
        throw new Error('Collection not found or access denied');
      }

      if (existing.is_default && (updates.name || updates.emoji)) {
        throw new Error('Cannot modify default collection name or emoji');
      }

      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      const { data, error } = await supabase
        .from('collections')
        .update(updateData)
        .eq('id', collectionId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Collection updated:', data);
      return data;

    } catch (error) {
      console.error('❌ Error updating collection:', error);
      throw new Error(error.message || 'Failed to update collection');
    }
  }

  /**
   * Delete a collection and handle item associations
   * @param {string} collectionId - Collection ID to delete
   * @param {Object} options - Deletion options
   * @param {string} options.moveItemsToCollection - Collection ID to move items to (optional)
   * @returns {Promise<Object>} Deletion result with item update count
   */
  static async deleteCollection(collectionId, options = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if collection exists and get its details
      const { data: collection } = await supabase
        .from('collections')
        .select('user_id, is_default, name, item_count')
        .eq('id', collectionId)
        .single();

      if (!collection || collection.user_id !== user.id) {
        throw new Error('Collection not found or access denied');
      }

      if (collection.is_default) {
        throw new Error('Cannot delete default collection');
      }

      // Start transaction-like operations
      let updatedItemsCount = 0;

      // Step 1: Handle items in this collection
      if (collection.item_count > 0) {
        // Get all items in this collection
        const { data: items } = await supabase
          .from('wish_items')
          .select('id, collection_ids')
          .contains('collection_ids', [collectionId]);

        if (items && items.length > 0) {
          // Update each item to remove this collection ID
          const itemUpdates = items.map(item => {
            const updatedCollectionIds = item.collection_ids.filter(id => id !== collectionId);

            // If moving to another collection, add that ID
            if (options.moveItemsToCollection && !updatedCollectionIds.includes(options.moveItemsToCollection)) {
              updatedCollectionIds.push(options.moveItemsToCollection);
            }

            return {
              id: item.id,
              collection_ids: updatedCollectionIds,
              updated_at: new Date().toISOString()
            };
          });

          // Batch update items
          const { error: itemUpdateError } = await supabase
            .from('wish_items')
            .upsert(itemUpdates);

          if (itemUpdateError) throw itemUpdateError;
          updatedItemsCount = itemUpdates.length;

          // Update target collection item count if moving items
          if (options.moveItemsToCollection) {
            await supabase.rpc('increment_collection_count', {
              collection_id: options.moveItemsToCollection,
              increment_by: updatedItemsCount
            });
          }
        }
      }

      // Step 2: Delete the collection
      const { error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (deleteError) throw deleteError;

      console.log('✅ Collection deleted:', {
        collectionId,
        itemsUpdated: updatedItemsCount,
        movedTo: options.moveItemsToCollection
      });

      return {
        success: true,
        deletedCollectionId: collectionId,
        itemsUpdated: updatedItemsCount,
        moveTargetCollection: options.moveItemsToCollection
      };

    } catch (error) {
      console.error('❌ Error deleting collection:', error);
      throw new Error(error.message || 'Failed to delete collection');
    }
  }

  /**
   * Get all collections for the current user
   * @param {Object} options - Query options
   * @param {boolean} options.includeItemCounts - Include item counts
   * @returns {Promise<Array>} Array of collections
   */
  static async getUserCollections(options = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false }) // Default collection first
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      // Calculate item counts if requested
      if (options.includeItemCounts && data) {
        for (const collection of data) {
          if (collection.id === 'all') continue; // Skip virtual 'all' collection

          const { count } = await supabase
            .from('wish_items')
            .select('id', { count: 'exact', head: true })
            .contains('collection_ids', [collection.id])
            .eq('user_id', user.id);

          collection.item_count = count || 0;
        }
      }

      return data || [];

    } catch (error) {
      console.error('❌ Error fetching collections:', error);
      throw new Error(error.message || 'Failed to fetch collections');
    }
  }

  /**
   * Remove an item from a specific collection
   * @param {string} itemId - Item ID
   * @param {string} collectionId - Collection ID to remove from
   * @returns {Promise<Object>} Updated item
   */
  static async removeItemFromCollection(itemId, collectionId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current item
      const { data: item } = await supabase
        .from('wish_items')
        .select('collection_ids')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single();

      if (!item) throw new Error('Item not found or access denied');

      // Remove collection ID from array
      const updatedCollectionIds = item.collection_ids.filter(id => id !== collectionId);

      // Update item
      const { data: updatedItem, error } = await supabase
        .from('wish_items')
        .update({
          collection_ids: updatedCollectionIds,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      // Decrement collection count
      await supabase.rpc('increment_collection_count', {
        collection_id: collectionId,
        increment_by: -1
      });

      console.log('✅ Item removed from collection:', { itemId, collectionId });
      return updatedItem;

    } catch (error) {
      console.error('❌ Error removing item from collection:', error);
      throw new Error(error.message || 'Failed to remove item from collection');
    }
  }

  /**
   * Get collection by ID with error handling
   * @param {string} collectionId - Collection ID
   * @returns {Promise<Object>} Collection data
   */
  static async getCollectionById(collectionId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', collectionId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error('❌ Error fetching collection:', error);
      throw new Error(error.message || 'Failed to fetch collection');
    }
  }
}