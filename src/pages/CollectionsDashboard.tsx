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

export default function CollectionsDashboard() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingCollection, setEditingCollection] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const { user, signOut } = useAuth()

  // Fetch collections when user changes
  useEffect(() => {
    if (user) {
      fetchCollections()
    } else {
      setCollections([])
    }
  }, [user])

  const fetchCollections = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (err) {
      setError('Failed to fetch collections')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCollection = async () => {
    if (!newCollection.name.trim() || !user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('collections')
        .insert([
          {
            name: newCollection.name.trim(),
            description: newCollection.description.trim() || null,
            color: newCollection.color,
            user_id: user.id,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        setCollections([data[0], ...collections])
        setNewCollection({ name: '', description: '', color: '#3B82F6' })
      }
    } catch (err) {
      setError('Failed to add collection')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteCollection = async (id: number) => {
    try {
      setLoading(true)
      const { error } = await supabase.from('collections').delete().eq('id', id)

      if (error) throw error

      setCollections(collections.filter((collection) => collection.id !== id))
    } catch (err) {
      setError('Failed to delete collection')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (collection: Collection) => {
    setEditingId(collection.id)
    setEditingCollection({
      name: collection.name,
      description: collection.description || '',
      color: collection.color,
    })
  }

  const saveEdit = async () => {
    if (!editingCollection.name.trim() || !editingId) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from('collections')
        .update({
          name: editingCollection.name.trim(),
          description: editingCollection.description.trim() || null,
          color: editingCollection.color,
        })
        .eq('id', editingId)

      if (error) throw error

      setCollections(
        collections.map((collection) =>
          collection.id === editingId
            ? {
                ...collection,
                name: editingCollection.name.trim(),
                description: editingCollection.description.trim() || null,
                color: editingCollection.color,
              }
            : collection
        )
      )
      setEditingId(null)
      setEditingCollection({ name: '', description: '', color: '#3B82F6' })
    } catch (err) {
      setError('Failed to update collection')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingCollection({ name: '', description: '', color: '#3B82F6' })
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Collections</h1>
            <p className="text-gray-600">
              Organize your wishes into collections
            </p>
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
          <p className="mb-2">Please log in to view your collections</p>
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

          {/* Add new collection */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-medium mb-3">Create New Collection</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                  onKeyPress={(e) => handleKeyPress(e, addCollection)}
                  placeholder="Collection name..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="color"
                  value={newCollection.color}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      color: e.target.value,
                    })
                  }
                  disabled={loading}
                  className="w-12 h-10 border rounded cursor-pointer"
                />
              </div>
              <input
                type="text"
                value={newCollection.description}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    description: e.target.value,
                  })
                }
                onKeyPress={(e) => handleKeyPress(e, addCollection)}
                placeholder="Description (optional)..."
                disabled={loading}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addCollection}
                disabled={loading || !newCollection.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '...' : 'Create Collection'}
              </button>
            </div>
          </div>

          {/* Collections grid */}
          <div className="space-y-4">
            {loading && collections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : collections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">No collections yet</p>
                <p className="text-sm">Create your first collection above!</p>
              </div>
            ) : (
              collections.map((collection) => (
                <div
                  key={collection.id}
                  className="border rounded-lg p-4 hover:shadow-sm"
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: collection.color,
                  }}
                >
                  {editingId === collection.id ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingCollection.name}
                          onChange={(e) =>
                            setEditingCollection({
                              ...editingCollection,
                              name: e.target.value,
                            })
                          }
                          onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                          disabled={loading}
                          className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="color"
                          value={editingCollection.color}
                          onChange={(e) =>
                            setEditingCollection({
                              ...editingCollection,
                              color: e.target.value,
                            })
                          }
                          disabled={loading}
                          className="w-10 h-8 border rounded cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={editingCollection.description}
                        onChange={(e) =>
                          setEditingCollection({
                            ...editingCollection,
                            description: e.target.value,
                          })
                        }
                        onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                        disabled={loading}
                        placeholder="Description (optional)..."
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          disabled={loading || !editingCollection.name.trim()}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="px-3 py-1 text-gray-500 hover:bg-gray-50 rounded"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: collection.color }}
                          />
                          <h3 className="text-lg font-medium">
                            {collection.name}
                          </h3>
                        </div>
                        {collection.description && (
                          <p className="text-gray-600 text-sm">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Created{' '}
                          {new Date(
                            collection.created_at || ''
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button
                          onClick={() => startEdit(collection)}
                          disabled={loading}
                          className="px-2 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded text-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteCollection(collection.id)}
                          disabled={loading}
                          className="px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {collections.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              {collections.length}{' '}
              {collections.length === 1 ? 'collection' : 'collections'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
