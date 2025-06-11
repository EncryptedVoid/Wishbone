import React, { useState, useEffect } from 'react';
import {
  createWishlistItem,
  getMyWishlistItems,
  updateWishlistItem,
  deleteWishlistItem,
  claimItem,
  unclaimItem,
  createCollection,
  getMyCollections,
  addItemToCollections,
  removeItemFromCollections,
  getDashboardData
} from '../../lib/wishlistService';
import { getCurrentUser, isAuthenticated } from '../../lib/authService';

const WishlistDemo = () => {
  // === STATE MANAGEMENT ===
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Data state
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    link: '',
    score: 5,
    isPrivate: false,
    imageUrl: '',
    collectionIds: []
  });

  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    emoji: '📋',
    color: 'blue'
  });

  const [editForm, setEditForm] = useState({});

  // === AUTHENTICATION EFFECTS ===
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  // === AUTHENTICATION FUNCTIONS ===
  const checkAuthStatus = async () => {
    try {
      setAuthLoading(true);
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);

      if (authenticated) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setError('Failed to check authentication status');
    } finally {
      setAuthLoading(false);
    }
  };

  // === DATA LOADING FUNCTIONS ===
  const loadDashboardData = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      setError(null);

      const { items: dashboardItems, collections: dashboardCollections } = await getDashboardData();
      setItems(dashboardItems);
      setCollections(dashboardCollections);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load your wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadDashboardData();
  };

  // === ITEM MANAGEMENT FUNCTIONS ===
  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      setError('Item name is required');
      return;
    }

    try {
      setError(null);
      const createdItem = await createWishlistItem(newItem);
      setItems([createdItem, ...items]);

      // Reset form
      setNewItem({
        name: '',
        description: '',
        link: '',
        score: 5,
        isPrivate: false,
        imageUrl: '',
        collectionIds: []
      });
      setShowAddForm(false);

      // Show success message
      alert(`Successfully added "${createdItem.name}" to your wishlist!`);

    } catch (error) {
      console.error('Error adding item:', error);
      setError(`Failed to add item: ${error.message}`);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      description: item.description,
      link: item.link,
      score: item.score,
      isPrivate: item.is_private,
      imageUrl: item.image_url,
      collectionIds: item.collection_ids || []
    });
  };

  const handleEditSubmit = async () => {
    if (!editForm.name?.trim()) {
      setError('Item name is required');
      return;
    }

    try {
      setError(null);
      const updatedItem = await updateWishlistItem(editingItem, editForm);
      setItems(items.map(item => item.id === editingItem ? updatedItem : item));
      setEditingItem(null);
      setEditForm({});

      alert('Item updated successfully!');

    } catch (error) {
      console.error('Error updating item:', error);
      setError(`Failed to update item: ${error.message}`);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteWishlistItem(id);
      setItems(items.filter(item => item.id !== id));
      setDeleteConfirm(null);

      alert('Item deleted successfully!');

    } catch (error) {
      console.error('Error deleting item:', error);
      setError(`Failed to delete item: ${error.message}`);
    }
  };

  // === DIBS/CLAIMING FUNCTIONS ===
  const handleClaim = async (id) => {
    try {
      setError(null);
      const updatedItem = await claimItem(id);
      setItems(items.map(item => item.id === id ? updatedItem : item));

      alert(`You've claimed "${updatedItem.name}"!`);

    } catch (error) {
      console.error('Error claiming item:', error);
      setError(`Failed to claim item: ${error.message}`);
    }
  };

  const handleUnclaim = async (id) => {
    try {
      setError(null);
      const updatedItem = await unclaimItem(id);
      setItems(items.map(item => item.id === id ? updatedItem : item));

      alert('Claim removed successfully!');

    } catch (error) {
      console.error('Error removing claim:', error);
      setError(`Failed to remove claim: ${error.message}`);
    }
  };

  // === COLLECTION MANAGEMENT FUNCTIONS ===
  const handleAddCollection = async () => {
    if (!newCollection.name.trim()) {
      setError('Collection name is required');
      return;
    }

    try {
      setError(null);
      const createdCollection = await createCollection(newCollection);
      setCollections([createdCollection, ...collections]);

      // Reset form
      setNewCollection({
        name: '',
        description: '',
        emoji: '📋',
        color: 'blue'
      });
      setShowCollectionForm(false);

      alert(`Collection "${createdCollection.name}" created successfully!`);

    } catch (error) {
      console.error('Error creating collection:', error);
      setError(`Failed to create collection: ${error.message}`);
    }
  };

  const handleAddToCollection = async (itemId, collectionIds) => {
    try {
      setError(null);
      const updatedItem = await addItemToCollections(itemId, collectionIds);
      setItems(items.map(item => item.id === itemId ? updatedItem : item));

      // Refresh dashboard to update collection counts
      await refreshData();

    } catch (error) {
      console.error('Error adding to collection:', error);
      setError(`Failed to add to collection: ${error.message}`);
    }
  };

  // === LOADING AND ERROR STATES ===
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to view your wishlist.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading your wishlist...</div>
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          {user && (
            <p className="text-gray-600">Welcome back, {user.firstName || user.email}!</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCollectionForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Collection
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
          <button
            onClick={refreshData}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Collections Summary */}
      {collections.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">Your Collections</h2>
          <div className="flex flex-wrap gap-2">
            {collections.map((collection) => (
              <span
                key={collection.id}
                className="inline-flex items-center bg-white px-3 py-1 rounded-full text-sm border"
              >
                <span className="mr-1">{collection.emoji}</span>
                {collection.name}
                <span className="ml-1 text-gray-500">({collection.item_count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Collection Form */}
      {showCollectionForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="e.g., Electronics, Books, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emoji
              </label>
              <input
                type="text"
                value={newCollection.emoji}
                onChange={(e) => setNewCollection({ ...newCollection, emoji: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="📋"
                maxLength="2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="What is this collection for?"
                rows="2"
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={handleAddCollection}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create Collection
              </button>
              <button
                onClick={() => setShowCollectionForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="What do you want?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newItem.score}
                  onChange={(e) => setNewItem({ ...newItem, score: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Tell us more about it..."
                rows="2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="url"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://amazon.com/product..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Collections Selection */}
            {collections.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add to Collections
                </label>
                <div className="flex flex-wrap gap-2">
                  {collections.map((collection) => (
                    <label key={collection.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newItem.collectionIds.includes(collection.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewItem({
                              ...newItem,
                              collectionIds: [...newItem.collectionIds, collection.id]
                            });
                          } else {
                            setNewItem({
                              ...newItem,
                              collectionIds: newItem.collectionIds.filter(id => id !== collection.id)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">
                        {collection.emoji} {collection.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="private"
                checked={newItem.isPrivate}
                onChange={(e) => setNewItem({ ...newItem, isPrivate: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="private" className="text-sm font-medium text-gray-700">
                Private Item (only you can see it)
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Item</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{items.find(item => item.id === deleteConfirm)?.name}"?
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Items */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No items in your wishlist yet</h3>
            <p className="text-gray-500 mb-4">Start building your wishlist by adding items you want!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {editingItem === item.id ? (
                /* Edit Form */
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-semibold"
                    required
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="2"
                  />
                  <div className="flex gap-4">
                    <input
                      type="url"
                      value={editForm.link}
                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                      className="flex-1 p-2 border border-gray-300 rounded"
                      placeholder="Link"
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.score}
                      onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) })}
                      className="w-20 p-2 border border-gray-300 rounded"
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.isPrivate}
                        onChange={(e) => setEditForm({ ...editForm, isPrivate: e.target.checked })}
                        className="mr-2"
                      />
                      Private
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSubmit}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Display Item */
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      )}

                      {/* Collections */}
                      {item.collection_ids && item.collection_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.collection_ids.map((collectionId) => {
                            const collection = collections.find(c => c.id === collectionId);
                            return collection ? (
                              <span
                                key={collectionId}
                                className="inline-flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                {collection.emoji} {collection.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 text-lg">★</span>
                      <span className="font-medium">{item.score}/10</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-3">
                    {item.is_private && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        🔒 Private
                      </span>
                    )}
                    {item.dibbed_by && (
                      <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs">
                        🎯 Claimed
                      </span>
                    )}
                    {item.image_url && (
                      <span className="bg-green-200 text-green-700 px-2 py-1 rounded text-xs">
                        📷 Has Image
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View Item
                      </a>
                    )}

                    <button
                      onClick={() => startEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>

                    {!item.dibbed_by ? (
                      <button
                        onClick={() => handleClaim(item.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Claim It!
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnclaim(item.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                      >
                        Remove Claim
                      </button>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                    {item.updated_at !== item.created_at && (
                      <span> • Updated: {new Date(item.updated_at).toLocaleDateString()}</span>
                    )}
                    {item.dibbed_at && (
                      <span> • Claimed: {new Date(item.dibbed_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishlistDemo;