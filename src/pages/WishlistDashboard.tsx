import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Types
interface WishlistItem {
  id: number
  url: string
  user_id: string
  created_at?: string
}

export default function WishlistDashboard() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [newLink, setNewLink] = useState<string>('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Use the AuthContext instead of managing our own auth state
  const { user, signOut } = useAuth()

  // Fetch wishlist when user changes
  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlist([])
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setWishlist(data || [])
    } catch (err) {
      setError('Failed to fetch wishlist')
      console.error('Error:', err)
    } finally {
      setLoading(false)
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
        setWishlist([data[0], ...wishlist])
        setNewLink('')
      }
    } catch (err) {
      setError('Failed to add item')
      console.error('Error:', err)
    } finally {
      setLoading(false)
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
  }

  const saveEdit = async () => {
    if (!editingUrl.trim() || !editingId) return

    let url = editingUrl.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    try {
      setLoading(true)
      const { error } = await supabase
        .from('wishlist')
        .update({ url })
        .eq('id', editingId)

      if (error) throw error

      setWishlist(
        wishlist.map((wish) =>
          wish.id === editingId ? { ...wish, url } : wish
        )
      )
      setEditingId(null)
      setEditingUrl('')
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

          {/* Add new link */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
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
          </div>

          {/* Wishlist items */}
          <div className="space-y-2">
            {loading && wishlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : wishlist.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">Your wishlist is empty</p>
                <p className="text-sm">Add your first link above!</p>
              </div>
            ) : (
              wishlist.map((wish) => (
                <div
                  key={wish.id}
                  className="border rounded p-3 hover:shadow-sm"
                >
                  {editingId === wish.id ? (
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
                  ) : (
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
                  )}
                </div>
              ))
            )}
          </div>

          {wishlist.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
