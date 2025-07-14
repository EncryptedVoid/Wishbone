import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Types
interface Collection {
  id: number
  name: string
  description: string | null
  color: string
  user_id: string
  created_at?: string
}

interface WishlistItem {
  id: number
  url: string
  user_id: string
  created_at?: string
  collections?: Collection[]
}

export default function WishlistDashboard() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [newLink, setNewLink] = useState<string>('')
  const [selectedCollections, setSelectedCollections] = useState<number[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState<string>('')
  const [editingCollections, setEditingCollections] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Filtering
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all')

  // Quick collection creation
  const [showQuickCollection, setShowQuickCollection] = useState<boolean>(false)
  const [quickCollectionName, setQuickCollectionName] = useState<string>('')
  const [quickCollectionColor, setQuickCollectionColor] =
    useState<string>('#3B82F6')

  const { user, signOut } = useAuth()

  // Fetch data when user changes
  useEffect(() => {
    if (user) {
      fetchCollections()
      fetchWishlist()
    } else {
      setWishlist([])
      setCollections([])
    }
  }, [user])

  const fetchCollections = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error
      setCollections(data || [])
    } catch (err) {
      console.error('Error fetching collections:', err)
    }
  }

  const fetchWishlist = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist')
        .select(
          `
          *,
          wishlist_collections(
            collection_id,
            collections(*)
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to include collections array
      const transformedData =
        data?.map((item) => ({
          ...item,
          collections:
            item.wishlist_collections
              ?.map((wc: any) => wc.collections)
              .filter(Boolean) || [],
        })) || []

      setWishlist(transformedData)
    } catch (err) {
      setError('Failed to fetch wishlist')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createQuickCollection = async () => {
    if (!quickCollectionName.trim() || !user) return

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([
          {
            name: quickCollectionName.trim(),
            color: quickCollectionColor,
            user_id: user.id,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        const newCollection = data[0]
        setCollections([...collections, newCollection])
        setSelectedCollections([...selectedCollections, newCollection.id])
        setQuickCollectionName('')
        setQuickCollectionColor('#3B82F6')
        setShowQuickCollection(false)
      }
    } catch (err) {
      setError('Failed to create collection')
      console.error('Error:', err)
    }
  }

  const addWish = async () => {
    if (!newLink.trim() || !user) return

    let url = newLink.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist')
        .insert([{ url, user_id: user.id }])
        .select()

      if (error) throw error

      if (data) {
        const newWish = data[0]

        // Add to collections if any selected
        if (selectedCollections.length > 0) {
          await addWishToCollections(newWish.id, selectedCollections)
        }

        // Refresh the wishlist to get updated data with collections
        await fetchWishlist()
        setNewLink('')
        setSelectedCollections([])
      }
    } catch (err) {
      setError('Failed to add item')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addWishToCollections = async (
    wishId: number,
    collectionIds: number[]
  ) => {
    if (collectionIds.length === 0) return

    const insertData = collectionIds.map((collectionId) => ({
      wishlist_id: wishId,
      collection_id: collectionId,
    }))

    const { error } = await supabase
      .from('wishlist_collections')
      .insert(insertData)

    if (error) throw error
  }

  const updateWishCollections = async (
    wishId: number,
    collectionIds: number[]
  ) => {
    // First, remove all existing connections
    await supabase
      .from('wishlist_collections')
      .delete()
      .eq('wishlist_id', wishId)

    // Then add new connections
    if (collectionIds.length > 0) {
      await addWishToCollections(wishId, collectionIds)
    }
  }

  const deleteWish = async (id: number) => {
    try {
      setLoading(true)
      const { error } = await supabase.from('wishlist').delete().eq('id', id)

      if (error) throw error

      setWishlist(wishlist.filter((wish) => wish.id !== id))
    } catch (err) {
      setError('Failed to delete item')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (wish: WishlistItem) => {
    setEditingId(wish.id)
    setEditingUrl(wish.url)
    setEditingCollections(wish.collections?.map((c) => c.id) || [])
  }

  const saveEdit = async () => {
    if (!editingUrl.trim() || !editingId) return

    let url = editingUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    try {
      setLoading(true)

      // Update the URL
      const { error } = await supabase
        .from('wishlist')
        .update({ url })
        .eq('id', editingId)

      if (error) throw error

      // Update collections
      await updateWishCollections(editingId, editingCollections)

      // Refresh the wishlist
      await fetchWishlist()

      setEditingId(null)
      setEditingUrl('')
      setEditingCollections([])
    } catch (err) {
      setError('Failed to update item')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingUrl('')
    setEditingCollections([])
  }

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  const toggleCollection = (
    collectionId: number,
    isEditing: boolean = false
  ) => {
    if (isEditing) {
      setEditingCollections((prev) =>
        prev.includes(collectionId)
          ? prev.filter((id) => id !== collectionId)
          : [...prev, collectionId]
      )
    } else {
      setSelectedCollections((prev) =>
        prev.includes(collectionId)
          ? prev.filter((id) => id !== collectionId)
          : [...prev, collectionId]
      )
    }
  }

  // Filter wishlist based on active filter
  const filteredWishlist =
    activeFilter === 'all'
      ? wishlist
      : wishlist.filter((wish) =>
          wish.collections?.some((collection) => collection.id === activeFilter)
        )

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
            <p className="text-gray-600">Keep track of things you want</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      {!user ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">Please log in to view your wishlist</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
              {error}
              <button
                onClick={() => setError('')}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Filter tabs */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 text-sm rounded border ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Items ({wishlist.length})
              </button>
              {collections.map((collection) => {
                const count = wishlist.filter((wish) =>
                  wish.collections?.some((c) => c.id === collection.id)
                ).length
                return (
                  <button
                    key={collection.id}
                    onClick={() => setActiveFilter(collection.id)}
                    className={`px-3 py-2 text-sm rounded border ${
                      activeFilter === collection.id
                        ? 'bg-blue-100 border-blue-300 text-blue-700 font-medium'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: collection.color }}
                    />
                    {collection.name} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add new link */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addWish)}
                  placeholder="Paste a link here..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addWish}
                  disabled={loading || !newLink.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '...' : 'Add'}
                </button>
              </div>

              {/* Collections selector */}
              {collections.length > 0 && (
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Add to collections:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => toggleCollection(collection.id)}
                        className={`px-3 py-1 text-sm rounded border ${
                          selectedCollections.includes(collection.id)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: collection.color }}
                        />
                        {collection.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick add collection */}
              <div>
                {!showQuickCollection ? (
                  <button
                    onClick={() => setShowQuickCollection(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Create new collection
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={quickCollectionName}
                      onChange={(e) => setQuickCollectionName(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, createQuickCollection)
                      }
                      placeholder="Collection name..."
                      className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="color"
                      value={quickCollectionColor}
                      onChange={(e) => setQuickCollectionColor(e.target.value)}
                      className="w-8 h-6 border rounded cursor-pointer"
                    />
                    <button
                      onClick={createQuickCollection}
                      disabled={!quickCollectionName.trim()}
                      className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickCollection(false)
                        setQuickCollectionName('')
                        setQuickCollectionColor('#3B82F6')
                      }}
                      className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wishlist items */}
          <div className="space-y-2">
            {loading && wishlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : filteredWishlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {activeFilter === 'all' ? (
                  <>
                    <p className="mb-2">Your wishlist is empty</p>
                    <p className="text-sm">Add your first link above!</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">No items in this collection</p>
                    <p className="text-sm">
                      Add items and assign them to this collection!
                    </p>
                  </>
                )}
              </div>
            ) : (
              filteredWishlist.map((wish) => (
                <div
                  key={wish.id}
                  className="border rounded p-3 hover:shadow-sm"
                >
                  {editingId === wish.id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={editingUrl}
                          onChange={(e) => setEditingUrl(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                          disabled={loading}
                          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={saveEdit}
                          disabled={loading}
                          className="px-2 py-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="px-2 py-1 text-gray-500 hover:bg-gray-50 rounded"
                        >
                          ×
                        </button>
                      </div>

                      {/* Edit collections */}
                      {collections.length > 0 && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Collections:
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {collections.map((collection) => (
                              <button
                                key={collection.id}
                                onClick={() =>
                                  toggleCollection(collection.id, true)
                                }
                                className={`px-2 py-1 text-xs rounded border ${
                                  editingCollections.includes(collection.id)
                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span
                                  className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                                  style={{ backgroundColor: collection.color }}
                                />
                                {collection.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <a
                          href={wish.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex-1 truncate"
                        >
                          🔗 {getDomain(wish.url)}
                        </a>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => startEdit(wish)}
                            disabled={loading}
                            className="px-2 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteWish(wish.id)}
                            disabled={loading}
                            className="px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {/* Show collections */}
                      {wish.collections && wish.collections.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {wish.collections.map((collection) => (
                            <span
                              key={collection.id}
                              className="px-2 py-1 text-xs rounded-full border"
                              style={{
                                backgroundColor: collection.color + '20',
                                borderColor: collection.color,
                                color: collection.color,
                              }}
                            >
                              {collection.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {wishlist.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {activeFilter === 'all' ? (
                <>
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}{' '}
                  total
                </>
              ) : (
                <>
                  {filteredWishlist.length} of {wishlist.length}{' '}
                  {wishlist.length === 1 ? 'item' : 'items'}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
