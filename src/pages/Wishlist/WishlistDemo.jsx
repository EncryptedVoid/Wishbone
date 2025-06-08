import React, { useState, useEffect } from 'react';
import {
  createWishlistItem,
  getMyWishlistItems,
  getAllWishlistItems,
  updateWishlistItem,
  deleteWishlistItem,
  dibsItem,
  undibsItem
} from '../../lib/wishlist';

const WishlistDemo = () => {
  // State for wishlist items
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  // State for adding new items
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    link: '',
    score: 5,
    is_private: false
  });

  // State for editing items
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load wishlist items when component mounts
  useEffect(() => {
    loadWishlist();
  }, [adminMode]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = adminMode ? await getAllWishlistItems() : await getMyWishlistItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new item
  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    try {
      const createdItem = await createWishlistItem(newItem);
      setItems([createdItem, ...items]);
      setNewItem({ name: '', description: '', link: '', score: 5, is_private: false });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // Handle editing item
  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({ ...item });
  };

  const handleEditSubmit = async () => {
    try {
      const updatedItem = await updateWishlistItem(editingItem, editForm);
      setItems(items.map(item => item.id === editingItem ? updatedItem : item));
      setEditingItem(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  // Handle deleting item
  const handleDelete = async (id) => {
    try {
      await deleteWishlistItem(id);
      setItems(items.filter(item => item.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Handle dibs
  const handleDibs = async (id) => {
    try {
      const updatedItem = await dibsItem(id);
      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      console.error('Error dibbing item:', error);
    }
  };

  const handleUndibs = async (id) => {
    try {
      const updatedItem = await undibsItem(id);
      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (error) {
      console.error('Error removing dibs:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pt-[20rem] mt-[20rem]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {adminMode ? 'All Wishlists (Admin View)' : 'My Wishlist'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAdminMode(!adminMode)}
            className={`px-4 py-2 rounded ${
              adminMode
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            {adminMode ? 'Exit Admin' : 'Admin Mode'}
          </button>
          {!adminMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          )}
        </div>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <div className="space-y-4">
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

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Want Score (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newItem.score}
                  onChange={(e) => setNewItem({ ...newItem, score: parseInt(e.target.value) })}
                  className="w-20 p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="private"
                  checked={newItem.is_private}
                  onChange={(e) => setNewItem({ ...newItem, is_private: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="private" className="text-sm font-medium text-gray-700">
                  Private Item
                </label>
              </div>
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
            <p className="text-gray-500 text-lg">No items in wishlist yet</p>
            {!adminMode && (
              <p className="text-gray-400">Click "Add Item" to get started!</p>
            )}
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
                        checked={editForm.is_private}
                        onChange={(e) => setEditForm({ ...editForm, is_private: e.target.checked })}
                        className="mr-2"
                      />
                      Private
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleEditSubmit} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
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
                      {adminMode && item.user && (
                        <p className="text-sm text-gray-500">User: {item.user.email}</p>
                      )}
                      {item.description && (
                        <p className="text-gray-600 mt-1">{item.description}</p>
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
                        Private
                      </span>
                    )}
                    {item.dibbed_by && (
                      <span className="bg-orange-200 text-orange-700 px-2 py-1 rounded text-xs">
                        Dibbed {adminMode && item.dibbed_user && `by ${item.dibbed_user.email}`}
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

                    {!adminMode && (
                      <>
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
                      </>
                    )}

                    {!item.dibbed_by ? (
                      <button
                        onClick={() => handleDibs(item.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Dibs!
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUndibs(item.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                      >
                        Remove Dibs
                      </button>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                    {item.dibbed_at && (
                      <span> • Dibbed: {new Date(item.dibbed_at).toLocaleDateString()}</span>
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