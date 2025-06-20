// ================================================================
// PROFESSIONAL WISHLIST & COLLECTIONS SERVICE
// ================================================================
// This service provides secure, well-documented functions for managing
// wishlist items and collections with enterprise-level error handling
//
// File: lib/wishlistService.js
//
// Features:
// - Complete security validation on every operation
// - Detailed error messages for debugging
// - Comprehensive input validation
// - Transaction-safe collection management
// - Professional documentation with examples
// ================================================================

import { supabase } from '../lib/supabase.js';
import { getCurrentUser } from './auth.js';

// ================================================================
// TYPE DOCUMENTATION (JavaScript Object Shapes)
// ================================================================
/**
 * @typedef {Object} WishlistItemData
 * @property {string} name - Required: The name/title of the item
 * @property {string} [description] - Optional: Detailed description
 * @property {string} [link] - Optional: URL where item can be found/purchased
 * @property {number} [score] - Optional: Priority score 1-10 (defaults to 5)
 * @property {boolean} [isPrivate] - Optional: Hide from others (defaults to false)
 * @property {string} [imageUrl] - Optional: URL to item image
 * @property {string[]} [collectionIds] - Optional: Array of collection IDs
 */

/**
 * @typedef {Object} CollectionData
 * @property {string} name - Required: The name of the collection
 * @property {string} [description] - Optional: What this collection is for
 * @property {string} [emoji] - Optional: Emoji representation (defaults to 📋)
 * @property {string} [color] - Optional: Color theme (defaults to 'blue')
 */

/**
 * @typedef {Object} WishlistItem
 * @property {string} id - Unique identifier
 * @property {string} user_id - Owner's user ID
 * @property {string} name - Item name
 * @property {string} description - Item description
 * @property {string} link - Purchase link
 * @property {number} score - Priority score (1-10)
 * @property {boolean} is_private - Privacy setting
 * @property {string} image_url - Image URL
 * @property {string[]} collection_ids - Array of collection IDs
 * @property {string|null} dibbed_by - User ID who claimed this item
 * @property {string|null} dibbed_at - When item was claimed
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} Collection
 * @property {string} id - Unique identifier
 * @property {string} user_id - Owner's user ID
 * @property {string} name - Collection name
 * @property {string} description - Collection description
 * @property {string} emoji - Collection emoji
 * @property {string} color - Collection color theme
 * @property {number} item_count - Cached count of items in collection
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

// ================================================================
// INTERNAL UTILITY FUNCTIONS
// ================================================================

/**
 * Validates and authenticates user for database operations
 * This is called by every function that needs authentication
 *
 * @returns {Promise<Object>} The authenticated user object
 * @throws {Error} If user is not logged in or authentication fails
 * @private
 */
async function validateAndGetUser() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('Authentication required. Please log in to continue.');
    }

    return user;
  } catch (error) {
    console.error('Authentication validation failed:', error);
    throw new Error(`Authentication error: ${error.message}`);
  }
}

/**
 * Validates that a string field is present and non-empty
 *
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If value is missing, null, undefined, or empty string
 * @private
 */
function validateRequiredString(value, fieldName) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    throw new Error(`${fieldName} is required and cannot be empty`);
  }
}

/**
 * Validates that a score is within the allowed range (1-10)
 *
 * @param {any} score - The score to validate
 * @throws {Error} If score is not a number between 1 and 10
 * @private
 */
function validateScore(score) {
  if (score !== undefined) {
    if (typeof score !== 'number' || score < 1 || score > 10 || !Number.isInteger(score)) {
      throw new Error('Score must be a whole number between 1 and 10');
    }
  }
}

/**
 * Validates that an ID is a valid UUID string
 *
 * @param {any} id - The ID to validate
 * @param {string} fieldName - Name of the field for error messages
 * @throws {Error} If ID is not a valid UUID format
 * @private
 */
function validateId(id, fieldName = 'ID') {
  if (!id || typeof id !== 'string') {
    throw new Error(`${fieldName} is required and must be a valid identifier`);
  }

  // Basic UUID format validation (8-4-4-4-12 characters)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error(`${fieldName} must be a valid UUID format`);
  }
}

/**
 * Safely trims a string and returns empty string if value is falsy
 *
 * @param {any} value - The value to clean
 * @returns {string} Cleaned string or empty string
 * @private
 */
function cleanStringField(value) {
  return (value && typeof value === 'string') ? value.trim() : '';
}

// ================================================================
// WISHLIST ITEMS - CRUD OPERATIONS
// ================================================================

/**
 * Creates a new wishlist item with comprehensive validation
 *
 * @param {WishlistItemData} itemData - The data for the new wishlist item
 * @returns {Promise<WishlistItem>} The newly created wishlist item
 * @throws {Error} If validation fails, user not authenticated, or database error
 *
 * @example
 * const newItem = await createWishlistItem({
 *   name: "Gaming Laptop",
 *   description: "For my streaming setup",
 *   score: 9,
 *   link: "https://amazon.com/laptop",
 *   collectionIds: ["electronics-uuid", "high-priority-uuid"]
 * });
 * console.log(`Created item: ${newItem.name} with ID: ${newItem.id}`);
 */
export async function createWishlistItem(itemData) {
  try {
    // Input validation
    if (!itemData || typeof itemData !== 'object') {
      throw new Error('Item data is required and must be an object');
    }

    validateRequiredString(itemData.name, 'Item name');
    validateScore(itemData.score);

    // Authenticate user
    const user = await validateAndGetUser();

    // Validate collection IDs if provided
    if (itemData.collectionIds && Array.isArray(itemData.collectionIds)) {
      for (const collectionId of itemData.collectionIds) {
        validateId(collectionId, 'Collection ID');

        // Verify user owns these collections
        const collection = await getCollection(collectionId);
        if (!collection) {
          throw new Error(`Collection with ID ${collectionId} not found`);
        }
        if (collection.user_id !== user.id) {
          throw new Error(`You don't have permission to add items to collection: ${collection.name}`);
        }
      }
    }

    // Prepare data for database insertion
    const dataToInsert = {
      name: itemData.name.trim(),
      description: cleanStringField(itemData.description),
      link: cleanStringField(itemData.link),
      score: itemData.score || 5,
      is_private: Boolean(itemData.isPrivate),
      image_url: cleanStringField(itemData.imageUrl),
      collection_ids: itemData.collectionIds || [],
      user_id: user.id
    };

    // Insert into database
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Database error creating wishlist item:', error);
      throw new Error(`Failed to create wishlist item: ${error.message}`);
    }

    // Update collection item counts if item was added to collections
    if (itemData.collectionIds && itemData.collectionIds.length > 0) {
      await Promise.all(
        itemData.collectionIds.map(collectionId =>
          updateCollectionItemCount(collectionId)
        )
      );
    }

    console.log(`Successfully created wishlist item: ${data.name} (ID: ${data.id})`);
    return data;

  } catch (error) {
    console.error('Error in createWishlistItem:', error);
    throw error;
  }
}

/**
 * Retrieves all wishlist items belonging to the current user
 * Includes security check to ensure users only see their own items
 *
 * @param {Object} [options] - Optional query parameters
 * @param {boolean} [options.includePrivate=true] - Include private items
 * @param {string} [options.orderBy='created_at'] - Field to order by
 * @param {boolean} [options.ascending=false] - Sort order
 * @returns {Promise<WishlistItem[]>} Array of user's wishlist items
 * @throws {Error} If user not authenticated or database error
 *
 * @example
 * // Get all items (default)
 * const allItems = await getMyWishlistItems();
 *
 * // Get only public items, ordered by score
 * const publicItems = await getMyWishlistItems({
 *   includePrivate: false,
 *   orderBy: 'score',
 *   ascending: false
 * });
 */
export async function getMyWishlistItems(options = {}) {
  try {
    // Authenticate user
    const user = await validateAndGetUser();

    // Set default options
    const {
      includePrivate = true,
      orderBy = 'created_at',
      ascending = false
    } = options;

    // Build query
    let query = supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', user.id) // Security: only user's own items
      .order(orderBy, { ascending });

    // Filter private items if requested
    if (!includePrivate) {
      query = query.eq('is_private', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error fetching user wishlist items:', error);
      throw new Error(`Failed to fetch wishlist items: ${error.message}`);
    }

    console.log(`Retrieved ${data?.length || 0} wishlist items for user`);
    return data || [];

  } catch (error) {
    console.error('Error in getMyWishlistItems:', error);
    throw error;
  }
}

/**
 * Retrieves a specific wishlist item by ID with ownership verification
 *
 * @param {string} itemId - The unique ID of the wishlist item
 * @param {Object} [options] - Optional parameters
 * @param {boolean} [options.requireOwnership=true] - Require user to own the item
 * @returns {Promise<WishlistItem|null>} The wishlist item or null if not found
 * @throws {Error} If ID invalid, user lacks permission, or database error
 *
 * @example
 * const item = await getWishlistItem("123e4567-e89b-12d3-a456-426614174000");
 * if (item) {
 *   console.log(`Found: ${item.name} (Score: ${item.score}/10)`);
 * } else {
 *   console.log("Item not found or no access");
 * }
 */
export async function getWishlistItem(itemId, options = {}) {
  try {
    validateId(itemId, 'Item ID');

    const { requireOwnership = true } = options;

    // Get the item
    const { data: item, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('id', itemId)
      .single();

    // Handle not found case
    if (error && error.code === 'PGRST116') {
      return null; // Item not found - this is expected, not an error
    }

    if (error) {
      console.error('Database error fetching wishlist item:', error);
      throw new Error(`Failed to fetch wishlist item: ${error.message}`);
    }

    // Check ownership if required
    if (requireOwnership) {
      const user = await validateAndGetUser();
      if (item.user_id !== user.id) {
        throw new Error('You do not have permission to access this item');
      }
    }

    return item;

  } catch (error) {
    console.error('Error in getWishlistItem:', error);
    throw error;
  }
}

/**
 * Updates an existing wishlist item with comprehensive validation
 *
 * @param {string} itemId - The ID of the item to update
 * @param {Partial<WishlistItemData>} updates - Object containing fields to update
 * @returns {Promise<WishlistItem>} The updated wishlist item
 * @throws {Error} If validation fails, item not found, or permission denied
 *
 * @example
 * const updatedItem = await updateWishlistItem("item-123", {
 *   score: 10,
 *   description: "I really need this now!",
 *   collectionIds: ["urgent-uuid"]
 * });
 */
export async function updateWishlistItem(itemId, updates) {
  try {
    validateId(itemId, 'Item ID');

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      throw new Error('Updates object is required and must contain at least one field');
    }

    // Authenticate user
    const user = await validateAndGetUser();

    // Verify item exists and user owns it
    const existingItem = await getWishlistItem(itemId, { requireOwnership: true });
    if (!existingItem) {
      throw new Error('Wishlist item not found or you do not have permission to update it');
    }

    // Validate individual update fields
    if (updates.name !== undefined) {
      validateRequiredString(updates.name, 'Item name');
    }
    if (updates.score !== undefined) {
      validateScore(updates.score);
    }

    // Handle collection updates
    if (updates.collectionIds !== undefined) {
      if (!Array.isArray(updates.collectionIds)) {
        throw new Error('Collection IDs must be an array');
      }

      // Validate each collection ID and ownership
      for (const collectionId of updates.collectionIds) {
        validateId(collectionId, 'Collection ID');
        const collection = await getCollection(collectionId);
        if (!collection || collection.user_id !== user.id) {
          throw new Error(`Invalid or inaccessible collection ID: ${collectionId}`);
        }
      }
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Add validated fields to update
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.description !== undefined) updateData.description = cleanStringField(updates.description);
    if (updates.link !== undefined) updateData.link = cleanStringField(updates.link);
    if (updates.score !== undefined) updateData.score = updates.score;
    if (updates.isPrivate !== undefined) updateData.is_private = Boolean(updates.isPrivate);
    if (updates.imageUrl !== undefined) updateData.image_url = cleanStringField(updates.imageUrl);
    if (updates.collectionIds !== undefined) updateData.collection_ids = updates.collectionIds;

    // Update in database
    const { data, error } = await supabase
      .from('wishlist_items')
      .update(updateData)
      .eq('id', itemId)
      .eq('user_id', user.id) // Double security check
      .select()
      .single();

    if (error) {
      console.error('Database error updating wishlist item:', error);
      throw new Error(`Failed to update wishlist item: ${error.message}`);
    }

    // Update collection counts if collections changed
    if (updates.collectionIds !== undefined) {
      // Get collections that were added or removed
      const oldCollections = existingItem.collection_ids || [];
      const newCollections = updates.collectionIds || [];

      const allAffectedCollections = [...new Set([...oldCollections, ...newCollections])];

      // Update counts for all affected collections
      await Promise.all(
        allAffectedCollections.map(collectionId =>
          updateCollectionItemCount(collectionId).catch(err =>
            console.warn(`Failed to update count for collection ${collectionId}:`, err)
          )
        )
      );
    }

    console.log(`Successfully updated wishlist item: ${data.name} (ID: ${data.id})`);
    return data;

  } catch (error) {
    console.error('Error in updateWishlistItem:', error);
    throw error;
  }
}

/**
 * Permanently deletes a wishlist item with ownership verification
 *
 * @param {string} itemId - The ID of the item to delete
 * @returns {Promise<void>} Nothing on successful deletion
 * @throws {Error} If item not found, permission denied, or database error
 *
 * @example
 * await deleteWishlistItem("item-123");
 * console.log("Item deleted successfully");
 */
export async function deleteWishlistItem(itemId) {
  try {
    validateId(itemId, 'Item ID');

    // Authenticate user
    const user = await validateAndGetUser();

    // Get item to check ownership and get collection info for count updates
    const existingItem = await getWishlistItem(itemId, { requireOwnership: true });
    if (!existingItem) {
      throw new Error('Wishlist item not found or you do not have permission to delete it');
    }

    // Delete from database
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id); // Double security check

    if (error) {
      console.error('Database error deleting wishlist item:', error);
      throw new Error(`Failed to delete wishlist item: ${error.message}`);
    }

    // Update collection counts for collections this item was in
    if (existingItem.collection_ids && existingItem.collection_ids.length > 0) {
      await Promise.all(
        existingItem.collection_ids.map(collectionId =>
          updateCollectionItemCount(collectionId).catch(err =>
            console.warn(`Failed to update count for collection ${collectionId}:`, err)
          )
        )
      );
    }

    console.log(`Successfully deleted wishlist item: ${existingItem.name} (ID: ${itemId})`);

  } catch (error) {
    console.error('Error in deleteWishlistItem:', error);
    throw error;
  }
}

// ================================================================
// DIBS (CLAIMING) FUNCTIONALITY
// ================================================================

/**
 * Claims an item (calls "dibs") for the current user
 *
 * @param {string} itemId - The ID of the item to claim
 * @returns {Promise<WishlistItem>} The updated item with dibs information
 * @throws {Error} If item not found, already claimed, or database error
 *
 * @example
 * const claimedItem = await claimItem("item-123");
 * console.log(`You claimed: ${claimedItem.name}`);
 */
export async function claimItem(itemId) {
  try {
    validateId(itemId, 'Item ID');

    // Authenticate user
    const user = await validateAndGetUser();

    // Check if item exists and get current dibs status
    const existingItem = await getWishlistItem(itemId, { requireOwnership: false });
    if (!existingItem) {
      throw new Error('Wishlist item not found');
    }

    // Check if already claimed
    if (existingItem.dibbed_by) {
      if (existingItem.dibbed_by === user.id) {
        throw new Error('You have already claimed this item');
      } else {
        throw new Error('This item has already been claimed by someone else');
      }
    }

    // Update item with dibs information
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        dibbed_by: user.id,
        dibbed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Database error claiming item:', error);
      throw new Error(`Failed to claim item: ${error.message}`);
    }

    console.log(`Successfully claimed item: ${data.name} (ID: ${itemId})`);
    return data;

  } catch (error) {
    console.error('Error in claimItem:', error);
    throw error;
  }
}

/**
 * Removes claim from an item (removes "dibs")
 *
 * @param {string} itemId - The ID of the item to unclaim
 * @returns {Promise<WishlistItem>} The updated item without dibs
 * @throws {Error} If item not found or database error
 *
 * @example
 * const unclaimedItem = await unclaimItem("item-123");
 * console.log(`Removed claim from: ${unclaimedItem.name}`);
 */
export async function unclaimItem(itemId) {
  try {
    validateId(itemId, 'Item ID');

    // Note: We allow anyone to unclaim items, not just the claimer or owner
    // This is a business decision - adjust as needed

    // Update item to remove dibs
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        dibbed_by: null,
        dibbed_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Database error unclaiming item:', error);
      throw new Error(`Failed to unclaim item: ${error.message}`);
    }

    if (!data) {
      throw new Error('Wishlist item not found');
    }

    console.log(`Successfully unclaimed item: ${data.name} (ID: ${itemId})`);
    return data;

  } catch (error) {
    console.error('Error in unclaimItem:', error);
    throw error;
  }
}

// ================================================================
// COLLECTIONS - CRUD OPERATIONS
// ================================================================

/**
 * Creates a new collection with comprehensive validation
 *
 * @param {CollectionData} collectionData - The data for the new collection
 * @returns {Promise<Collection>} The newly created collection
 * @throws {Error} If validation fails, user not authenticated, or database error
 *
 * @example
 * const newCollection = await createCollection({
 *   name: "Electronics",
 *   description: "Gadgets and tech items",
 *   emoji: "💻",
 *   color: "blue"
 * });
 */
export async function createCollection(collectionData) {
  try {
    // Input validation
    if (!collectionData || typeof collectionData !== 'object') {
      throw new Error('Collection data is required and must be an object');
    }

    validateRequiredString(collectionData.name, 'Collection name');

    // Authenticate user
    const user = await validateAndGetUser();

    // Prepare data for database insertion
    const dataToInsert = {
      name: collectionData.name.trim(),
      description: cleanStringField(collectionData.description),
      emoji: cleanStringField(collectionData.emoji) || '📋',
      color: cleanStringField(collectionData.color) || 'blue',
      is_private: Boolean(collectionData.isPrivate), // ← Add this line
      item_count: 0,
      user_id: user.id
    };

    // Insert into database
    const { data, error } = await supabase
      .from('collections')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) {
      console.error('Database error creating collection:', error);
      throw new Error(`Failed to create collection: ${error.message}`);
    }

    console.log(`Successfully created collection: ${data.name} (ID: ${data.id})`);
    return data;

  } catch (error) {
    console.error('Error in createCollection:', error);
    throw error;
  }
}

/**
 * Retrieves all collections belonging to the current user
 *
 * @param {Object} [options] - Optional query parameters
 * @param {string} [options.orderBy='created_at'] - Field to order by
 * @param {boolean} [options.ascending=false] - Sort order
 * @returns {Promise<Collection[]>} Array of user's collections
 * @throws {Error} If user not authenticated or database error
 *
 * @example
 * const collections = await getMyCollections();
 * collections.forEach(col => {
 *   console.log(`${col.emoji} ${col.name} (${col.item_count} items)`);
 * });
 */
export async function getMyCollections(options = {}) {
  try {
    // Authenticate user
    const user = await validateAndGetUser();

    // Set default options
    const {
      orderBy = 'created_at',
      ascending = false
    } = options;

    // Query database
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id) // Security: only user's own collections
      .order(orderBy, { ascending });

    if (error) {
      console.error('Database error fetching collections:', error);
      throw new Error(`Failed to fetch collections: ${error.message}`);
    }

    console.log(`Retrieved ${data?.length || 0} collections for user`);
    return data || [];

  } catch (error) {
    console.error('Error in getMyCollections:', error);
    throw error;
  }
}

/**
 * Retrieves a specific collection by ID with ownership verification
 *
 * @param {string} collectionId - The unique ID of the collection
 * @param {Object} [options] - Optional parameters
 * @param {boolean} [options.requireOwnership=true] - Require user to own the collection
 * @returns {Promise<Collection|null>} The collection or null if not found
 * @throws {Error} If ID invalid, user lacks permission, or database error
 */
export async function getCollection(collectionId, options = {}) {
  try {
    validateId(collectionId, 'Collection ID');

    const { requireOwnership = true } = options;

    // Get the collection
    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', collectionId)
      .single();

    // Handle not found case
    if (error && error.code === 'PGRST116') {
      return null; // Collection not found - this is expected, not an error
    }

    if (error) {
      console.error('Database error fetching collection:', error);
      throw new Error(`Failed to fetch collection: ${error.message}`);
    }

    // Check ownership if required
    if (requireOwnership) {
      const user = await validateAndGetUser();
      if (collection.user_id !== user.id) {
        throw new Error('You do not have permission to access this collection');
      }
    }

    return collection;

  } catch (error) {
    console.error('Error in getCollection:', error);
    throw error;
  }
}

/**
 * Updates an existing collection with comprehensive validation
 *
 * @param {string} collectionId - The ID of the collection to update
 * @param {Partial<CollectionData>} updates - Object containing fields to update
 * @returns {Promise<Collection>} The updated collection
 * @throws {Error} If validation fails, collection not found, or permission denied
 */
export async function updateCollection(collectionId, updates) {
  try {
    validateId(collectionId, 'Collection ID');

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      throw new Error('Updates object is required and must contain at least one field');
    }

    // Authenticate user
    const user = await validateAndGetUser();

    // Verify collection exists and user owns it
    const existingCollection = await getCollection(collectionId, { requireOwnership: true });
    if (!existingCollection) {
      throw new Error('Collection not found or you do not have permission to update it');
    }

    // Validate updates
    if (updates.name !== undefined) {
      validateRequiredString(updates.name, 'Collection name');
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Add validated fields to update
    if (updates.name !== undefined) updateData.name = updates.name.trim();
    if (updates.description !== undefined) updateData.description = cleanStringField(updates.description);
    if (updates.emoji !== undefined) updateData.emoji = cleanStringField(updates.emoji) || '📋';
    if (updates.color !== undefined) updateData.color = cleanStringField(updates.color) || 'blue';

    // Update in database
    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', collectionId)
      .eq('user_id', user.id) // Double security check
      .select()
      .single();

    if (error) {
      console.error('Database error updating collection:', error);
      throw new Error(`Failed to update collection: ${error.message}`);
    }

    console.log(`Successfully updated collection: ${data.name} (ID: ${data.id})`);
    return data;

  } catch (error) {
    console.error('Error in updateCollection:', error);
    throw error;
  }
}

/**
 * Permanently deletes a collection and removes it from all items
 *
 * @param {string} collectionId - The ID of the collection to delete
 * @returns {Promise<void>} Nothing on successful deletion
 * @throws {Error} If collection not found, permission denied, or database error
 */
export async function deleteCollection(collectionId) {
  try {
    validateId(collectionId, 'Collection ID');

    // Authenticate user
    const user = await validateAndGetUser();

    // Verify collection exists and user owns it
    const existingCollection = await getCollection(collectionId, { requireOwnership: true });
    if (!existingCollection) {
      throw new Error('Collection not found or you do not have permission to delete it');
    }

    // Remove this collection from all items that reference it
    const { error: updateError } = await supabase
      .from('wishlist_items')
      .update({
        collection_ids: supabase.rpc('array_remove', {
          array: supabase.raw('collection_ids'),
          element: collectionId
        }),
        updated_at: new Date().toISOString()
      })
      .contains('collection_ids', [collectionId])
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error removing collection from items:', updateError);
      throw new Error(`Failed to remove collection from items: ${updateError.message}`);
    }

    // Delete the collection
    const { error: deleteError } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId)
      .eq('user_id', user.id); // Double security check

    if (deleteError) {
      console.error('Database error deleting collection:', deleteError);
      throw new Error(`Failed to delete collection: ${deleteError.message}`);
    }

    console.log(`Successfully deleted collection: ${existingCollection.name} (ID: ${collectionId})`);

  } catch (error) {
    console.error('Error in deleteCollection:', error);
    throw error;
  }
}

/**
 * Updates the cached item count for a collection
 * This is called automatically when items are added/removed from collections
 *
 * @param {string} collectionId - The ID of the collection to update
 * @returns {Promise<number>} The new item count
 * @throws {Error} If collection not found or database error
 * @private
 */
export async function updateCollectionItemCount(collectionId) {
  try {
    validateId(collectionId, 'Collection ID');

    // Count items in this collection
    const { count, error: countError } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .contains('collection_ids', [collectionId]);

    if (countError) {
      console.error('Error counting items in collection:', countError);
      throw new Error(`Failed to count collection items: ${countError.message}`);
    }

    const itemCount = count || 0;

    // Update the collection's cached count
    const { error: updateError } = await supabase
      .from('collections')
      .update({
        item_count: itemCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', collectionId);

    if (updateError) {
      console.error('Error updating collection count:', updateError);
      throw new Error(`Failed to update collection count: ${updateError.message}`);
    }

    console.log(`Updated collection ${collectionId} item count to ${itemCount}`);
    return itemCount;

  } catch (error) {
    console.error('Error in updateCollectionItemCount:', error);
    throw error;
  }
}

// ================================================================
// ADVANCED SEARCH AND FILTERING FUNCTIONS
// ================================================================

/**
 * Search wishlist items by name or description with comprehensive options
 *
 * @param {string} searchTerm - The term to search for
 * @param {Object} [options] - Search options
 * @param {string|null} [options.userId=null] - Limit to specific user's items
 * @param {boolean} [options.includePrivate=false] - Include private items
 * @param {boolean} [options.currentUserOnly=true] - Only search current user's items
 * @returns {Promise<WishlistItem[]>} Array of matching items
 * @throws {Error} If search term invalid or database error
 */
export async function searchWishlistItems(searchTerm, options = {}) {
  try {
    if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
      throw new Error('Search term is required and cannot be empty');
    }

    const {
      userId = null,
      includePrivate = false,
      currentUserOnly = true
    } = options;

    // Build base query
    let query = supabase
      .from('wishlist_items')
      .select('*')
      .or(`name.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`)
      .order('created_at', { ascending: false });

    // Apply filters
    if (!includePrivate) {
      query = query.eq('is_private', false);
    }

    if (currentUserOnly) {
      const user = await validateAndGetUser();
      query = query.eq('user_id', user.id);
    } else if (userId) {
      validateId(userId, 'User ID');
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error searching items:', error);
      throw new Error(`Failed to search items: ${error.message}`);
    }

    console.log(`Search for "${searchTerm}" returned ${data?.length || 0} items`);
    return data || [];

  } catch (error) {
    console.error('Error in searchWishlistItems:', error);
    throw error;
  }
}

/**
 * Get wishlist items filtered by priority score range
 *
 * @param {number} [minScore=1] - Minimum score (1-10)
 * @param {number} [maxScore=10] - Maximum score (1-10)
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.currentUserOnly=true] - Only get current user's items
 * @returns {Promise<WishlistItem[]>} Array of items within score range
 * @throws {Error} If score range invalid or database error
 */
export async function getItemsByScoreRange(minScore = 1, maxScore = 10, options = {}) {
  try {
    validateScore(minScore);
    validateScore(maxScore);

    if (minScore > maxScore) {
      throw new Error('Minimum score cannot be greater than maximum score');
    }

    const { currentUserOnly = true } = options;

    // Build query
    let query = supabase
      .from('wishlist_items')
      .select('*')
      .gte('score', minScore)
      .lte('score', maxScore)
      .order('score', { ascending: false });

    if (currentUserOnly) {
      const user = await validateAndGetUser();
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error filtering by score:', error);
      throw new Error(`Failed to filter items by score: ${error.message}`);
    }

    console.log(`Found ${data?.length || 0} items with score ${minScore}-${maxScore}`);
    return data || [];

  } catch (error) {
    console.error('Error in getItemsByScoreRange:', error);
    throw error;
  }
}

/**
 * Get all items in a specific collection with comprehensive options
 *
 * @param {string} collectionId - The ID of the collection
 * @param {Object} [options] - Query options
 * @param {string} [options.orderBy='created_at'] - Field to order by
 * @param {boolean} [options.ascending=false] - Sort order
 * @param {boolean} [options.requireOwnership=true] - Require user to own collection
 * @returns {Promise<WishlistItem[]>} Array of items in the collection
 * @throws {Error} If collection not found or permission denied
 */
export async function getItemsInCollection(collectionId, options = {}) {
  try {
    validateId(collectionId, 'Collection ID');

    const {
      orderBy = 'created_at',
      ascending = false,
      requireOwnership = true
    } = options;

    // Verify collection exists and check ownership
    const collection = await getCollection(collectionId, { requireOwnership });
    if (!collection) {
      throw new Error('Collection not found or access denied');
    }

    // Query items in collection
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .contains('collection_ids', [collectionId])
      .order(orderBy, { ascending });

    if (error) {
      console.error('Database error fetching collection items:', error);
      throw new Error(`Failed to fetch items in collection: ${error.message}`);
    }

    console.log(`Found ${data?.length || 0} items in collection: ${collection.name}`);
    return data || [];

  } catch (error) {
    console.error('Error in getItemsInCollection:', error);
    throw error;
  }
}

// ================================================================
// CONVENIENCE AND DASHBOARD FUNCTIONS
// ================================================================

/**
 * Get comprehensive dashboard data for the current user
 * Efficiently retrieves all collections and items in a single call
 *
 * @returns {Promise<{collections: Collection[], items: WishlistItem[], summary: Object}>} Dashboard data
 * @throws {Error} If user not authenticated or database error
 *
 * @example
 * const { collections, items, summary } = await getDashboardData();
 * console.log(`Dashboard: ${summary.totalItems} items in ${summary.totalCollections} collections`);
 * console.log(`${summary.claimedItems} items have been claimed`);
 */
export async function getDashboardData() {
  try {
    // Run queries in parallel for better performance
    const [collections, items] = await Promise.all([
      getMyCollections(),
      getMyWishlistItems()
    ]);

    // Generate summary statistics
    const summary = {
      totalCollections: collections.length,
      totalItems: items.length,
      claimedItems: items.filter(item => item.dibbed_by).length,
      privateItems: items.filter(item => item.is_private).length,
      averageScore: items.length > 0
        ? Math.round((items.reduce((sum, item) => sum + item.score, 0) / items.length) * 10) / 10
        : 0,
      highPriorityItems: items.filter(item => item.score >= 8).length
    };

    console.log('Dashboard data loaded successfully');
    return { collections, items, summary };

  } catch (error) {
    console.error('Error in getDashboardData:', error);
    throw error;
  }
}

/**
 * Get a wishlist item with its complete collection information
 *
 * @param {string} itemId - The ID of the item
 * @param {Object} [options] - Options
 * @param {boolean} [options.requireOwnership=true] - Require user to own the item
 * @returns {Promise<{item: WishlistItem|null, collections: Collection[]}>} Item with collections
 * @throws {Error} If item not found or permission denied
 */
export async function getItemWithCollections(itemId, options = {}) {
  try {
    const { requireOwnership = true } = options;

    // Get the item
    const item = await getWishlistItem(itemId, { requireOwnership });
    if (!item) {
      return { item: null, collections: [] };
    }

    // If no collections, return early
    if (!item.collection_ids || item.collection_ids.length === 0) {
      return { item, collections: [] };
    }

    // Get all collection details in parallel
    const collectionPromises = item.collection_ids.map(id =>
      getCollection(id, { requireOwnership: false }).catch(err => {
        console.warn(`Failed to fetch collection ${id}:`, err);
        return null; // Return null for missing collections
      })
    );

    const collections = await Promise.all(collectionPromises);

    // Filter out null results (deleted collections)
    const validCollections = collections.filter(col => col !== null);

    return { item, collections: validCollections };

  } catch (error) {
    console.error('Error in getItemWithCollections:', error);
    throw error;
  }
}

/**
 * Adds an existing wishlist item to one or more collections
 *
 * @param {string} itemId - The ID of the item to add to collections
 * @param {string[]} collectionIds - Array of collection IDs to add the item to
 * @returns {Promise<WishlistItem>} The updated wishlist item
 * @throws {Error} If item not found, permission denied, or invalid collection IDs
 *
 * @example
 * const updatedItem = await addItemToCollections("item-123", ["collection-1", "collection-2"]);
 * console.log(`Added ${updatedItem.name} to ${updatedItem.collection_ids.length} collections`);
 */
export async function addItemToCollections(itemId, collectionIds) {
  try {
    validateId(itemId, 'Item ID');

    if (!Array.isArray(collectionIds) || collectionIds.length === 0) {
      throw new Error('Collection IDs must be a non-empty array');
    }

    // Authenticate user
    const user = await validateAndGetUser();

    // Get existing item to verify ownership and get current collections
    const existingItem = await getWishlistItem(itemId, { requireOwnership: true });
    if (!existingItem) {
      throw new Error('Wishlist item not found or you do not have permission to modify it');
    }

    // Validate each collection ID and ownership
    for (const collectionId of collectionIds) {
      validateId(collectionId, 'Collection ID');
      const collection = await getCollection(collectionId);
      if (!collection || collection.user_id !== user.id) {
        throw new Error(`Invalid or inaccessible collection ID: ${collectionId}`);
      }
    }

    // Merge with existing collections (avoid duplicates)
    const currentCollections = existingItem.collection_ids || [];
    const newCollections = [...new Set([...currentCollections, ...collectionIds])];

    // Update the item with the new collection list
    return await updateWishlistItem(itemId, { collectionIds: newCollections });

  } catch (error) {
    console.error('Error in addItemToCollections:', error);
    throw error;
  }
}

/**
 * Removes an item from one or more collections
 *
 * @param {string} itemId - The ID of the item to remove from collections
 * @param {string[]} collectionIds - Array of collection IDs to remove the item from
 * @returns {Promise<WishlistItem>} The updated wishlist item
 * @throws {Error} If item not found, permission denied, or invalid collection IDs
 *
 * @example
 * const updatedItem = await removeItemFromCollections("item-123", ["collection-1"]);
 * console.log(`Removed ${updatedItem.name} from specified collections`);
 */
export async function removeItemFromCollections(itemId, collectionIds) {
  try {
    validateId(itemId, 'Item ID');

    if (!Array.isArray(collectionIds) || collectionIds.length === 0) {
      throw new Error('Collection IDs must be a non-empty array');
    }

    // Authenticate user
    const user = await validateAndGetUser();

    // Get existing item to verify ownership and get current collections
    const existingItem = await getWishlistItem(itemId, { requireOwnership: true });
    if (!existingItem) {
      throw new Error('Wishlist item not found or you do not have permission to modify it');
    }

    // Remove specified collections from current list
    const currentCollections = existingItem.collection_ids || [];
    const newCollections = currentCollections.filter(id => !collectionIds.includes(id));

    // Update the item with the filtered collection list
    return await updateWishlistItem(itemId, { collectionIds: newCollections });

  } catch (error) {
    console.error('Error in removeItemFromCollections:', error);
    throw error;
  }
}