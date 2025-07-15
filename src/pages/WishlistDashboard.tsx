// Updated WishlistDashboard.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Heart,
  Calendar,
  Users,
  Search,
  User,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Filter,
  ChevronDown,
  GripVertical,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AddWishModal from '../components/AddWishModal'
import AddBasketModal from '../components/AddBasketModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'

// Types
interface Basket {
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
  name?: string
  description?: string
  cost?: number
  user_id: string
  created_at?: string
  baskets?: Basket[]
}

type SortField = 'name' | 'cost' | 'created_at'
type SortOrder = 'asc' | 'desc'

const WishlistDashboard = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [baskets, setBaskets] = useState<Basket[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(256)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  // Filtering and UI
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchFocused, setSearchFocused] = useState<boolean>(false)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Modal states
  const [showAddWishModal, setShowAddWishModal] = useState(false)
  const [showAddBasketModal, setShowAddBasketModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingWish, setEditingWish] = useState<WishlistItem | null>(null)
  const [editingBasket, setEditingBasket] = useState<Basket | null>(null)
  const [deletingItem, setDeletingItem] = useState<{
    type: 'wish' | 'basket'
    item: WishlistItem | Basket
    name: string
  } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { user, profile } = useAuth()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)

  // Theme colors - now properly typed as CSSProperties
  const theme: React.CSSProperties = isDarkMode
    ? ({
        '--primary': '#E57373',
        '--secondary': '#D4A574',
        '--accent': '#C9A96E',
        '--background': '#2A2A2A',
        '--card-bg': '#333333',
        '--text': '#F5F1EB',
        '--success': '#7A9B6C',
        '--alert': '#A68BB5',
        '--border': '#D4A57440',
      } as React.CSSProperties)
    : ({
        '--primary': '#FF8A80',
        '--secondary': '#FFCC9C',
        '--accent': '#E6B377',
        '--background': '#FEF9F3',
        '--card-bg': '#FFFFFF',
        '--text': '#3A3A3A',
        '--success': '#A8C09A',
        '--alert': '#C8A8D8',
        '--border': '#FFCC9C40',
      } as React.CSSProperties)

  // Fetch baskets from database
  const fetchBaskets = async () => {
    if (!user) return

    try {
      console.log('Fetching baskets for user:', user.id)

      const { data, error } = await supabase
        .from('collections')
        .select('id, name, description, color, user_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Baskets error details:', error)
        throw error
      }

      console.log('Baskets data fetched:', data)
      setBaskets(data || [])
    } catch (err: any) {
      console.error('Error fetching baskets:', err)
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
      })

      if (err.code === 'PGRST106' || err.message?.includes('404')) {
        setError(
          'Collections table not found. Please check your database setup.'
        )
      } else {
        setError(`Failed to load baskets: ${err.message || 'Unknown error'}`)
      }
    }
  }

  // Fetch wishlist items from database
  const fetchWishlist = async () => {
    if (!user) return

    try {
      console.log('Fetching wishlist for user:', user.id)

      // First get wishlist items - let's check if the table exists
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (wishlistError) {
        console.error('Wishlist error details:', wishlistError)
        throw wishlistError
      }

      console.log('Wishlist data fetched:', wishlistData)

      if (!wishlistData) {
        setWishlist([])
        return
      }

      // Then get baskets for each item
      const wishlistWithBaskets = await Promise.all(
        (wishlistData || []).map(async (item) => {
          try {
            const { data: itemBaskets, error: basketsError } = await supabase
              .from('wishlist_item_collections')
              .select(
                `
                collections (
                  id,
                  name,
                  color,
                  description,
                  user_id
                )
              `
              )
              .eq('wishlist_item_id', item.id)

            if (basketsError) {
              console.error(
                'Error fetching item baskets for item',
                item.id,
                ':',
                basketsError
              )
              return { ...item, baskets: [] }
            }

            const baskets =
              itemBaskets?.map((ic) => ic.collections).filter(Boolean) || []
            return { ...item, baskets }
          } catch (err) {
            console.error('Error processing item', item.id, ':', err)
            return { ...item, baskets: [] }
          }
        })
      )

      setWishlist(wishlistWithBaskets)
    } catch (err: any) {
      console.error('Error fetching wishlist:', err)
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint,
      })

      // Check if it's a table not found error
      if (err.code === 'PGRST106' || err.message?.includes('404')) {
        setError('Wishlist table not found. Please check your database setup.')
      } else {
        setError(`Failed to load wishlist: ${err.message || 'Unknown error'}`)
      }
    }
  }

  // Sidebar resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  // Load data on component mount and user change
  useEffect(() => {
    if (user) {
      setLoading(true)
      Promise.all([fetchBaskets(), fetchWishlist()]).finally(() =>
        setLoading(false)
      )
    }
  }, [user])

  // Update dark mode based on profile
  useEffect(() => {
    if (profile) {
      setIsDarkMode(profile.dark_mode)
    }
  }, [profile])

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const sortWishlist = (items: WishlistItem[]): WishlistItem[] => {
    return [...items].sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case 'name':
          aValue = (a.name || getDomain(a.url)).toLowerCase()
          bValue = (b.name || getDomain(b.url)).toLowerCase()
          break
        case 'cost':
          aValue = a.cost || 0
          bValue = b.cost || 0
          break
        case 'created_at':
          aValue = new Date(a.created_at || 0).getTime()
          bValue = new Date(b.created_at || 0).getTime()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  const filteredWishlist = React.useMemo(() => {
    let filtered = wishlist

    // Filter by basket
    if (activeFilter !== 'all') {
      filtered = filtered.filter((wish) =>
        wish.baskets?.some((basket) => basket.id === activeFilter)
      )
    }

    // Filter by search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (wish) =>
          wish.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          wish.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getDomain(wish.url).toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort the filtered results
    return sortWishlist(filtered)
  }, [wishlist, activeFilter, searchQuery, sortField, sortOrder])

  // Modal handlers
  const handleAddWish = () => {
    setEditingWish(null)
    setShowAddWishModal(true)
  }

  const handleEditWish = (wish: WishlistItem) => {
    setEditingWish(wish)
    setShowAddWishModal(true)
  }

  const handleDeleteWish = (wish: WishlistItem) => {
    setDeletingItem({
      type: 'wish',
      item: wish,
      name: wish.name || getDomain(wish.url),
    })
    setShowDeleteModal(true)
  }

  const handleAddBasket = () => {
    setEditingBasket(null)
    setShowAddBasketModal(true)
  }

  const handleEditBasket = (basket: Basket) => {
    setEditingBasket(basket)
    setShowAddBasketModal(true)
  }

  const handleDeleteBasket = (basket: Basket) => {
    const wishCount = wishlist.filter((wish) =>
      wish.baskets?.some((b) => b.id === basket.id)
    ).length

    setDeletingItem({
      type: 'basket',
      item: basket,
      name: basket.name,
    })
    setShowDeleteModal(true)
  }

  // Handle successful modal operations
  const handleWishSuccess = () => {
    fetchWishlist()
  }

  const handleBasketSuccess = () => {
    fetchBaskets()
    fetchWishlist() // Also refresh wishlist to update basket associations
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return

    setDeleteLoading(true)
    try {
      if (deletingItem.type === 'wish') {
        const wish = deletingItem.item as WishlistItem

        // Delete wishlist item associations first
        const { error: associationError } = await supabase
          .from('wishlist_item_collections')
          .delete()
          .eq('wishlist_item_id', wish.id)

        if (associationError) throw associationError

        // Delete the wishlist item
        const { error: wishError } = await supabase
          .from('wishlist')
          .delete()
          .eq('id', wish.id)
          .eq('user_id', user?.id)

        if (wishError) throw wishError

        fetchWishlist()
      } else {
        const basket = deletingItem.item as Basket

        // Delete basket associations first
        const { error: associationError } = await supabase
          .from('wishlist_item_collections')
          .delete()
          .eq('collection_id', basket.id)

        if (associationError) throw associationError

        // Delete the basket
        const { error: basketError } = await supabase
          .from('collections')
          .delete()
          .eq('id', basket.id)
          .eq('user_id', user?.id)

        if (basketError) throw basketError

        fetchBaskets()
        fetchWishlist()

        // Reset filter if the deleted basket was active
        if (activeFilter === basket.id) {
          setActiveFilter('all')
        }
      }

      setShowDeleteModal(false)
      setDeletingItem(null)
    } catch (err: any) {
      console.error('Error deleting item:', err)
      setError(`Failed to delete ${deletingItem.type}: ${err.message}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Handle sort change
  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={theme}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200 overflow-hidden"
      style={theme}
    >
      {/* Add CSS custom properties styles */}
      <style>
        {`
          .bg-background {
            background-color: var(--background);
          }
          .bg-card {
            background-color: var(--card-bg);
          }
          .bg-primary {
            background-color: var(--primary);
          }
          .bg-secondary {
            background-color: var(--secondary);
          }
          .bg-accent {
            background-color: var(--accent);
          }
          .text-primary {
            color: var(--text);
          }
          .text-muted {
            color: var(--text);
            opacity: 0.7;
          }
          .border-custom {
            border-color: var(--border);
          }
          .hover-primary:hover {
            background-color: var(--primary);
            opacity: 0.9;
          }
          .content-gradient::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            background: linear-gradient(to top, var(--background), transparent);
            pointer-events: none;
          }
          .search-expanded {
            width: 400px;
          }
          .search-normal {
            width: 240px;
          }
          .truncate-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: var(--background);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--secondary);
          }
          .resize-handle {
            width: 4px;
            background: transparent;
            cursor: col-resize;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .resize-handle:hover {
            background: var(--primary);
            opacity: 0.5;
          }
          .resize-handle:active {
            background: var(--primary);
            opacity: 0.8;
          }
          .resize-handle::before {
            content: '';
            width: 2px;
            height: 20px;
            background: var(--text);
            opacity: 0.3;
            border-radius: 1px;
            box-shadow: 4px 0 0 var(--text), -4px 0 0 var(--text);
          }
          .resize-handle:hover::before {
            opacity: 1;
            background: white;
            box-shadow: 4px 0 0 white, -4px 0 0 white;
          }
        `}
      </style>

      {/* Main Content */}
      <div className="flex flex-1 h-screen">
        {/* Baskets Sidebar */}
        <aside
          ref={sidebarRef}
          className="bg-background border-r border-custom fixed left-0 top-0 bottom-0 overflow-hidden flex flex-col"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Resize handle */}
          <div
            ref={resizerRef}
            className="resize-handle"
            onMouseDown={handleMouseDown}
          />

          {/* Header */}
          <div className="p-4 border-b border-custom">
            <h2 className="text-xl font-bold text-primary">
              Wishlist Dashboard
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              {/* Basket Filters */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-primary">Baskets</h3>
                  <button
                    onClick={handleAddBasket}
                    className="p-1 hover:bg-secondary/20 rounded transition-colors"
                    title="Add Basket"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeFilter === 'all'
                        ? 'text-white'
                        : 'text-primary hover:bg-secondary/20'
                    }`}
                    style={{
                      backgroundColor:
                        activeFilter === 'all'
                          ? 'var(--primary)'
                          : 'transparent',
                    }}
                  >
                    <span className="truncate-title">
                      All Wishes ({wishlist.length})
                    </span>
                  </button>

                  {baskets.length === 0 ? (
                    // Show message when no baskets exist
                    <div className="px-3 py-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-muted" />
                      </div>
                      <p className="text-sm text-muted mb-2">No baskets yet</p>
                      <p className="text-xs text-muted mb-3">
                        Create baskets to organize your wishes by category,
                        project, or any way you like!
                      </p>
                      <button
                        onClick={handleAddBasket}
                        className="px-3 py-1 bg-primary text-white text-xs rounded hover:opacity-90 transition-opacity"
                      >
                        Create First Basket
                      </button>
                    </div>
                  ) : (
                    baskets.map((basket) => {
                      const count = wishlist.filter((wish) =>
                        wish.baskets?.some((b) => b.id === basket.id)
                      ).length

                      return (
                        <div key={basket.id} className="group">
                          <button
                            onClick={() => setActiveFilter(basket.id)}
                            className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                              activeFilter === basket.id
                                ? 'text-white'
                                : 'text-primary hover:bg-secondary/20'
                            }`}
                            style={{
                              backgroundColor:
                                activeFilter === basket.id
                                  ? basket.color
                                  : 'transparent',
                            }}
                            title={basket.description || basket.name}
                          >
                            <span className="truncate-title flex-1">
                              {basket.name} ({count})
                            </span>
                          </button>

                          {/* Basket action buttons */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 mt-1 flex gap-1">
                            <button
                              onClick={() => handleEditBasket(basket)}
                              className="p-1 text-xs text-muted hover:text-primary hover:bg-secondary/20 rounded"
                              title="Edit basket"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteBasket(basket)}
                              className="p-1 text-xs text-muted hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete basket"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </nav>
              </div>
            </div>
          </div>

          {/* Fixed Add Wish Button */}
          <div className="p-4 border-t border-custom">
            <button
              onClick={handleAddWish}
              className="w-full py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Wish
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className="flex-1 bg-background"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {/* Content Header with Search */}
          <div className="bg-background border-b border-custom px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {activeFilter === 'all'
                    ? 'All Wishes'
                    : baskets.find((b) => b.id === activeFilter)?.name}
                </h2>
                <p className="text-muted text-sm">
                  {filteredWishlist.length}{' '}
                  {filteredWishlist.length === 1 ? 'item' : 'items'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
                {/* Show basket description */}
                {activeFilter !== 'all' &&
                  (() => {
                    const currentBasket = baskets.find(
                      (b) => b.id === activeFilter
                    )
                    return currentBasket?.description ? (
                      <p className="text-muted text-sm mt-1 italic">
                        {currentBasket.description}
                      </p>
                    ) : null
                  })()}
              </div>
              <div className="flex items-center space-x-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search wishes..."
                    className={`pl-10 pr-4 py-2 bg-card border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
                      searchFocused ? 'search-expanded' : 'search-normal'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    className="px-3 py-2 bg-card border border-custom rounded-lg text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none pr-8"
                    value={`${sortField}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      handleSortChange(field as SortField, order as SortOrder)
                    }}
                  >
                    <option value="created_at-desc">Recently Added</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="cost-desc">Highest Cost</option>
                    <option value="cost-asc">Lowest Cost</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Wishes Grid - Scrollable with Gradient */}
          <div className="relative">
            <div className="p-6 h-[calc(100vh-120px)] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg">
                  <div className="font-medium">Database Error:</div>
                  <div>{error}</div>
                  <div className="mt-2 text-sm">
                    <strong>Debug Info:</strong>
                    <ul className="list-disc ml-4 mt-1">
                      <li>User ID: {user?.id}</li>
                      <li>
                        Expected tables: 'wishlist', 'collections',
                        'wishlist_item_collections'
                      </li>
                      <li>
                        Make sure these tables exist in your Supabase database
                      </li>
                      <li>Check Row Level Security (RLS) policies</li>
                    </ul>
                  </div>
                </div>
              )}

              {filteredWishlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-2">
                    {searchQuery ? 'No wishes found' : 'No wishes yet'}
                  </h3>
                  <p className="text-muted mb-4">
                    {searchQuery
                      ? 'Try a different search term'
                      : activeFilter === 'all'
                        ? 'Start building your wishlist by adding your first wish!'
                        : 'No wishes in this basket yet'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={handleAddWish}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Add Your First Wish
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Instructional banner for All Wishes */}
                  {activeFilter === 'all' && (
                    <div className="mb-6 p-4 bg-card border border-custom rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-primary mb-1">
                            Welcome to Your Wishlist!
                          </h4>
                          <p className="text-sm text-muted mb-2">
                            <strong>Wishes</strong> are items you want to save
                            for later - anything from products you're
                            considering buying, gifts you'd like to receive, or
                            goals you want to achieve.
                          </p>
                          <p className="text-sm text-muted mb-2">
                            <strong>Baskets</strong> help you organize wishes by
                            category (like "Home Decor", "Birthday Ideas", or
                            "Tech Gadgets"). Create baskets to keep your wishes
                            organized and easily findable.
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button
                              onClick={handleAddWish}
                              className="px-3 py-1 bg-primary text-white text-sm rounded hover:opacity-90 transition-opacity"
                            >
                              Add a Wish
                            </button>
                            <button
                              onClick={handleAddBasket}
                              className="px-3 py-1 border border-primary text-primary text-sm rounded hover:bg-primary/10 transition-colors"
                            >
                              Create a Basket
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                    {filteredWishlist.map((wish) => (
                      <div
                        key={wish.id}
                        className="bg-card border border-custom rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group max-w-full"
                      >
                        {/* Image Placeholder */}
                        <div className="h-48 bg-secondary/30 flex items-center justify-center relative">
                          <span className="text-muted">Preview Loading...</span>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditWish(wish)}
                                className="p-1 bg-black/20 backdrop-blur-sm rounded hover:bg-black/40 transition-colors"
                                title="Edit wish"
                              >
                                <Edit className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() => handleDeleteWish(wish)}
                                className="p-1 bg-black/20 backdrop-blur-sm rounded hover:bg-black/40 transition-colors"
                                title="Delete wish"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4">
                          <h3 className="font-medium text-primary mb-1 truncate-title">
                            {wish.name || getDomain(wish.url)}
                          </h3>
                          {wish.description && (
                            <p className="text-sm text-muted mb-2 line-clamp-2">
                              {wish.description}
                            </p>
                          )}
                          {wish.cost && (
                            <p className="text-sm font-medium text-primary mb-2">
                              ${wish.cost.toFixed(2)}
                            </p>
                          )}
                          <a
                            href={wish.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary/70 hover:text-primary flex items-center mb-3 truncate-title"
                          >
                            <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {getDomain(wish.url)}
                            </span>
                          </a>

                          {/* Basket Tags */}
                          {wish.baskets && wish.baskets.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {wish.baskets.map((basket) => (
                                <span
                                  key={basket.id}
                                  className="px-2 py-1 text-xs rounded-full border truncate-title max-w-full"
                                  style={{
                                    backgroundColor: basket.color + '20',
                                    borderColor: basket.color,
                                    color: basket.color,
                                  }}
                                  title={basket.description || basket.name}
                                >
                                  {basket.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Bottom Gradient */}
            <div className="content-gradient"></div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddWishModal
        isOpen={showAddWishModal}
        onClose={() => {
          setShowAddWishModal(false)
          setEditingWish(null)
        }}
        onSuccess={handleWishSuccess}
        editingWish={editingWish}
        availableBaskets={baskets}
      />

      <AddBasketModal
        isOpen={showAddBasketModal}
        onClose={() => {
          setShowAddBasketModal(false)
          setEditingBasket(null)
        }}
        onSuccess={handleBasketSuccess}
        editingBasket={editingBasket}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingItem(null)
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={`Delete ${deletingItem?.type === 'wish' ? 'Wish' : 'Basket'}`}
        itemName={deletingItem?.name || ''}
        itemType={deletingItem?.type || 'wish'}
        additionalWarning={
          deletingItem?.type === 'basket'
            ? `This will also remove the basket from all wishes that contain it.`
            : undefined
        }
      />
    </div>
  )
}

export default WishlistDashboard
