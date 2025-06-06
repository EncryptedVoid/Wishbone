// lib/wishlist.js
// This file contains all the database operations for our wishlist feature
// CRUD stands for Create, Read, Update, Delete - the basic operations you can do with data

// Import our database connection from the supabase configuration file
import { supabase } from './supabase'

/**
 * CREATE OPERATION
 * Creates a new wishlist item in the database
 *
 * @param {Object} itemData - The data for the new wishlist item
 * @param {string} itemData.name - Required: The name of the item
 * @param {string} [itemData.description] - Optional: Description of the item
 * @param {string} [itemData.link] - Optional: URL link to the item
 * @param {number} [itemData.score] - Optional: Priority score (1-10, defaults to 5)
 * @param {boolean} [itemData.is_private] - Optional: Whether item is private (defaults to false)
 * @returns {Promise<Object>} The created wishlist item object
 * @throws {Error} If user is not logged in or database operation fails
 */
export const createWishlistItem = async (itemData) => {
  try {
    // Validate required fields before making database call
    if (!itemData?.name?.trim()) {
      throw new Error('Item name is required')
    }

    // Get the currently logged-in user from Supabase authentication
    // This returns an object with user data if someone is logged in, or null if not
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Check if there was an error getting user info
    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }

    // If no user is logged in, we can't create items (security measure)
    if (!user) {
      throw new Error('Must be logged in to add items')
    }

    // Insert the new item into the 'wishlist_items' table in our database
    const { data, error } = await supabase
      .from('wishlist_items') // Specify which table to insert into
      .insert([{ // Insert an array with one object (the new item)
        name: itemData.name.trim(), // Remove extra spaces from name
        description: itemData.description?.trim() || '', // Use provided description or empty string
        link: itemData.link?.trim() || '', // Use provided link or empty string
        score: itemData.score || 5, // Use provided score or default to 5
        is_private: itemData.is_private || false, // Use provided privacy setting or default to false
        user_id: user.id // Associate this item with the current user's ID
      }])
      .select() // Tell Supabase to return the created item data

    // If there was an error with the database operation, throw it
    if (error) {
      console.error('Database error creating item:', error)
      throw new Error(`Failed to create item: ${error.message}`)
    }

    // Return the first (and only) item that was created
    return data[0]

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error in createWishlistItem:', error)
    // Re-throw the error so the calling code can handle it
    throw error
  }
}

/**
 * READ OPERATION - Get current user's items
 * Retrieves all wishlist items that belong to the currently logged-in user
 *
 * @returns {Promise<Array>} Array of wishlist items belonging to current user
 * @throws {Error} If user is not logged in or database operation fails
 */
export const getMyWishlistItems = async () => {
  try {
    // Get the current user to ensure they're logged in
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Must be logged in to view items')
    }

    // Query the database for items belonging to this user
    const { data, error } = await supabase
      .from('wishlist_items') // From the wishlist_items table
      .select('*') // Select all columns (* means "everything")
      .eq('user_id', user.id) // Only get items where user_id equals current user's id
      .order('created_at', { ascending: false }) // Sort by creation date, newest first

    if (error) {
      console.error('Database error fetching user items:', error)
      throw new Error(`Failed to fetch items: ${error.message}`)
    }

    // Return the array of items (could be empty if user has no items)
    return data || []

  } catch (error) {
    console.error('Error in getMyWishlistItems:', error)
    throw error
  }
}

/**
 * READ OPERATION - Get all items (Admin view)
 * Retrieves ALL wishlist items from all users - typically used for admin purposes
 * This also includes user email information through database joins
 *
 * @returns {Promise<Array>} Array of all wishlist items with user information
 * @throws {Error} If database operation fails
 */
export const getAllWishlistItems = async () => {
  try {
    // This is a more complex query that joins multiple tables
    const { data, error } = await supabase
      .from('wishlist_items') // Main table we're querying
      .select(`
        *,
        user:auth.users!user_id(email),
        dibbed_user:auth.users!dibbed_by(email)
      `) // This syntax joins with the auth.users table to get email addresses
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error fetching all items:', error)
      throw new Error(`Failed to fetch all items: ${error.message}`)
    }

    return data || []

  } catch (error) {
    console.error('Error in getAllWishlistItems:', error)
    throw error
  }
}

/**
 * UPDATE OPERATION
 * Updates an existing wishlist item with new data
 *
 * @param {string|number} id - The unique ID of the item to update
 * @param {Object} updates - Object containing the fields to update
 * @returns {Promise<Object>} The updated wishlist item object
 * @throws {Error} If item doesn't exist or database operation fails
 */
export const updateWishlistItem = async (id, updates) => {
  try {
    // Validate that we have an ID to work with
    if (!id) {
      throw new Error('Item ID is required for updates')
    }

    // Validate that we have something to update
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No updates provided')
    }

    // Get current user for security check
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Must be logged in to update items')
    }

    // Clean up the updates object to remove any undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    // Update the item in the database
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        ...cleanUpdates, // Spread all the updates
        updated_at: new Date().toISOString() // Add timestamp of when update happened
      })
      .eq('id', id) // Only update the item with this specific ID
      .eq('user_id', user.id) // Security: only allow users to update their own items
      .select() // Return the updated item

    if (error) {
      console.error('Database error updating item:', error)
      throw new Error(`Failed to update item: ${error.message}`)
    }

    // If no data returned, the item probably doesn't exist or doesn't belong to this user
    if (!data || data.length === 0) {
      throw new Error('Item not found or you do not have permission to update it')
    }

    return data[0]

  } catch (error) {
    console.error('Error in updateWishlistItem:', error)
    throw error
  }
}

/**
 * DELETE OPERATION
 * Permanently removes a wishlist item from the database
 *
 * @param {string|number} id - The unique ID of the item to delete
 * @returns {Promise<void>} Nothing returned on success
 * @throws {Error} If item doesn't exist or database operation fails
 */
export const deleteWishlistItem = async (id) => {
  try {
    // Validate that we have an ID
    if (!id) {
      throw new Error('Item ID is required for deletion')
    }

    // Get current user for security check
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Must be logged in to delete items')
    }

    // Delete the item from the database
    const { error } = await supabase
      .from('wishlist_items')
      .delete() // This is the DELETE operation
      .eq('id', id) // Only delete the item with this ID
      .eq('user_id', user.id) // Security: only allow users to delete their own items

    if (error) {
      console.error('Database error deleting item:', error)
      throw new Error(`Failed to delete item: ${error.message}`)
    }

    // No return value needed for delete operations

  } catch (error) {
    console.error('Error in deleteWishlistItem:', error)
    throw error
  }
}

/**
 * SPECIAL OPERATION - Claim an item
 * Marks an item as "dibbed" (claimed) by the current user
 * This is like calling dibs on something - you're saying you plan to buy/get it
 *
 * @param {string|number} itemId - The ID of the item to claim
 * @returns {Promise<Object>} The updated item with dibs information
 * @throws {Error} If user is not logged in or database operation fails
 */
export const dibsItem = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error('Item ID is required to claim an item')
    }

    // Get current user information
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      throw new Error(`Authentication error: ${authError.message}`)
    }

    if (!user) {
      throw new Error('Must be logged in to claim an item')
    }

    // Update the item to mark it as claimed by this user
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        dibbed_by: user.id, // Record who claimed it
        dibbed_at: new Date().toISOString() // Record when it was claimed
      })
      .eq('id', itemId) // Only update this specific item
      .select() // Return the updated item

    if (error) {
      console.error('Database error claiming item:', error)
      throw new Error(`Failed to claim item: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Item not found')
    }

    return data[0]

  } catch (error) {
    console.error('Error in dibsItem:', error)
    throw error
  }
}

/**
 * SPECIAL OPERATION - Remove claim from an item
 * Removes the "dibs" (claim) from an item, making it available for others to claim
 *
 * @param {string|number} itemId - The ID of the item to unclaim
 * @returns {Promise<Object>} The updated item with dibs removed
 * @throws {Error} If database operation fails
 */
export const undibsItem = async (itemId) => {
  try {
    if (!itemId) {
      throw new Error('Item ID is required to remove claim')
    }

    // Note: We might want to add a check here to ensure only the person who dibbed
    // can undibs, or the item owner can undibs. For now, anyone can undibs.

    // Remove the dibs information from the item
    const { data, error } = await supabase
      .from('wishlist_items')
      .update({
        dibbed_by: null, // Clear who claimed it
        dibbed_at: null  // Clear when it was claimed
      })
      .eq('id', itemId)
      .select()

    if (error) {
      console.error('Database error removing claim:', error)
      throw new Error(`Failed to remove claim: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Item not found')
    }

    return data[0]

  } catch (error) {
    console.error('Error in undibsItem:', error)
    throw error
  }
}

// Additional utility functions that might be useful:

/**
 * UTILITY FUNCTION - Get items by user ID
 * Useful for viewing someone else's public wishlist items
 *
 * @param {string} userId - The ID of the user whose items to fetch
 * @param {boolean} includePrivate - Whether to include private items (default: false)
 * @returns {Promise<Array>} Array of wishlist items for the specified user
 */
export const getUserWishlistItems = async (userId, includePrivate = false) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    let query = supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // If we don't want private items, filter them out
    if (!includePrivate) {
      query = query.eq('is_private', false)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error fetching user items:', error)
      throw new Error(`Failed to fetch user items: ${error.message}`)
    }

    return data || []

  } catch (error) {
    console.error('Error in getUserWishlistItems:', error)
    throw error
  }
}

/**
 * UTILITY FUNCTION - Search wishlist items
 * Searches through wishlist items by name or description
 *
 * @param {string} searchTerm - The term to search for
 * @param {string} [userId] - Optional: limit search to specific user's items
 * @returns {Promise<Array>} Array of matching wishlist items
 */
export const searchWishlistItems = async (searchTerm, userId = null) => {
  try {
    if (!searchTerm?.trim()) {
      throw new Error('Search term is required')
    }

    let query = supabase
      .from('wishlist_items')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('is_private', false) // Only search public items
      .order('created_at', { ascending: false })

    // If userId provided, limit to that user's items
    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error searching items:', error)
      throw new Error(`Failed to search items: ${error.message}`)
    }

    return data || []

  } catch (error) {
    console.error('Error in searchWishlistItems:', error)
    throw error
  }
}