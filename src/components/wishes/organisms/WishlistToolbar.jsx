import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Menu,
  MoreHorizontal,
  Eye,
  Edit3,
  CheckSquare,
  Download,
  Share2,
  TrendingUp,
  X,
  Sparkles,
  Trash2,
  Archive,
  Copy,
  FolderPlus
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * WishlistToolbar Component - Redesigned with search on top
 *
 * NEW DESIGN:
 * - Search bar on top row (full width)
 * - Tool items and count on second row
 * - Collection-specific search (searches current collection only)
 * - Enhanced dark mode support
 * - Better visual hierarchy
 *
 * Features:
 * - Two-tier layout design
 * - Collection-aware search
 * - Enhanced bulk operations
 * - Improved dark mode styling
 * - Better responsive behavior
 */
const WishlistToolbar = React.forwardRef(({
  searchQuery = '',
  onSearchChange,
  activeFilters = {},
  onFilterChange,
  currentMode = 'view',
  onModeChange,
  selectedItems = [],
  totalItems = 0,
  filteredItems = 0,
  userRole = 'owner',
  onAddItem,
  onSidebarToggle,
  onBulkAction,
  onExport,
  onShare,
  sidebarOpen = false,
  loading = false,
  currentCollection = 'All Items',
  className,
  ...props
}, ref) => {

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate filter statistics
  const activeFilterCount = Object.values(activeFilters).filter(value =>
    value !== '' && value !== null && value !== undefined
  ).length;

  const hasSelection = selectedItems.length > 0;
  const isBulkMode = hasSelection && currentMode === 'select';

  // Normal mode actions
  const normalActions = [
    {
      key: 'view',
      icon: Eye,
      label: 'View',
      active: currentMode === 'view',
      onClick: () => onModeChange?.('view')
    },
    {
      key: 'edit',
      icon: Edit3,
      label: 'Edit',
      active: currentMode === 'edit',
      onClick: () => onModeChange?.('edit'),
      ownerOnly: true
    },
    {
      key: 'select',
      icon: CheckSquare,
      label: 'Select',
      active: currentMode === 'select',
      onClick: () => onModeChange?.('select'),
      ownerOnly: true
    }
  ];

  // Bulk operation actions
  const bulkActions = [
    {
      key: 'delete',
      icon: Trash2,
      label: 'Delete',
      color: 'text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 border-red-200/50 dark:border-red-400/30',
      onClick: () => onBulkAction?.('delete', selectedItems)
    },
    {
      key: 'archive',
      icon: Archive,
      label: 'Archive',
      color: 'text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 border-amber-200/50 dark:border-amber-400/30',
      onClick: () => onBulkAction?.('archive', selectedItems)
    },
    {
      key: 'duplicate',
      icon: Copy,
      label: 'Duplicate',
      color: 'text-blue-600 hover:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border-blue-200/50 dark:border-blue-400/30',
      onClick: () => onBulkAction?.('duplicate', selectedItems)
    },
    {
      key: 'move',
      icon: FolderPlus,
      label: 'Move',
      color: 'text-violet-600 hover:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 border-violet-200/50 dark:border-violet-400/30',
      onClick: () => onBulkAction?.('move', selectedItems)
    },
    {
      key: 'share',
      icon: Share2,
      label: 'Share',
      color: 'text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border-emerald-200/50 dark:border-emerald-400/30',
      onClick: () => onBulkAction?.('share', selectedItems)
    }
  ];

  // Clear selection handler
  const handleClearSelection = () => {
    onModeChange?.('view');
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base glassmorphic container
        'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80',
        'border-b border-white/20 dark:border-gray-700/30',
        'shadow-lg shadow-black/5 dark:shadow-black/20',
        // Enhanced bulk mode styling with gradient overlay
        isBulkMode && [
          'relative overflow-hidden',
          'before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/10 before:to-pink-500/10',
          'before:dark:from-blue-400/20 before:dark:via-purple-400/20 before:dark:to-pink-400/20',
          'border-blue-200/50 dark:border-blue-400/30'
        ],
        className
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="relative z-10 px-6 py-5 space-y-5">
        {/* TOP ROW: Search Bar */}
        <div className="w-full">
          <div className="relative max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors duration-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={`Search in ${currentCollection}...`}
                className={cn(
                  'w-full pl-12 pr-12 py-4 rounded-xl transition-all duration-300',
                  'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                  'border border-white/30 dark:border-gray-700/50',
                  'text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400',
                  'hover:bg-white/80 dark:hover:bg-gray-800/80',
                  'hover:border-white/50 dark:hover:border-gray-600/50',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30',
                  'focus:border-blue-300/50 dark:focus:border-blue-400/50',
                  'focus:bg-white/90 dark:focus:bg-gray-800/90',
                  'shadow-sm hover:shadow-md focus:shadow-lg',
                  'text-lg',
                  // Enhanced bulk mode styling
                  isBulkMode && [
                    'border-blue-300/60 dark:border-blue-400/40',
                    'bg-blue-50/80 dark:bg-blue-900/30',
                    'focus:ring-blue-500/40 dark:focus:ring-blue-400/40'
                  ]
                )}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
              {/* Search glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Controls and Info */}
        <div className="flex items-center justify-between gap-6">
          {/* Left: Title and Stats */}
          <div className="flex items-center gap-5">
            {/* Mobile sidebar toggle */}
            <button
              onClick={onSidebarToggle}
              className="md:hidden p-2.5 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Title and Selection Info */}
            <div className="flex items-center gap-4">
              <h1 className={cn(
                'text-xl font-bold transition-all duration-300',
                isBulkMode
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400'
                  : 'text-gray-900 dark:text-gray-100'
              )}>
                {isBulkMode ? 'Bulk Operations' : currentCollection}
              </h1>

              {/* Selection counter and clear button */}
              {isBulkMode && (
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <span className={cn(
                    'text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm',
                    'bg-gradient-to-r from-blue-500/20 to-purple-500/20',
                    'dark:from-blue-400/30 dark:to-purple-400/30',
                    'text-blue-700 dark:text-blue-300',
                    'border border-blue-200/50 dark:border-blue-400/30'
                  )}>
                    {selectedItems.length} selected
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className={cn(
                      'p-2 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm',
                      'hover:bg-blue-500/20 dark:hover:bg-blue-400/20',
                      'border border-blue-200/50 dark:border-blue-400/30'
                    )}
                    aria-label="Clear selection"
                  >
                    <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                </motion.div>
              )}

              {/* Normal mode stats */}
              {!isBulkMode && (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white/40 dark:bg-gray-800/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {filteredItems} of {totalItems} items
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isBulkMode ? (
                /* Bulk operation actions */
                <motion.div
                  key="bulk-actions"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {bulkActions.map((action) => (
                    <motion.button
                      key={action.key}
                      onClick={action.onClick}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200',
                        'backdrop-blur-sm border text-sm font-medium',
                        'hover:scale-105 active:scale-95 hover:shadow-md',
                        action.color
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={action.label}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{action.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                /* Normal operation actions */
                <motion.div
                  key="normal-actions"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      'relative p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border',
                      'hover:scale-105 hover:shadow-md',
                      showFilters || activeFilterCount > 0
                        ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-400/30 dark:text-blue-300 border-blue-200/50 dark:border-blue-400/30'
                        : 'bg-white/40 hover:bg-white/60 dark:bg-gray-800/40 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/30'
                    )}
                    title="Filters"
                  >
                    <Filter className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                      <span className={cn(
                        'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                        'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                      )}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Mode Toggle Buttons */}
                  <div className={cn(
                    'hidden md:flex items-center rounded-xl p-1 backdrop-blur-sm border',
                    'bg-white/40 dark:bg-gray-800/40 border-white/20 dark:border-gray-700/30'
                  )}>
                    {normalActions
                      .filter(action => !action.ownerOnly || userRole === 'owner')
                      .map((action) => (
                        <button
                          key={action.key}
                          onClick={action.onClick}
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                            action.active
                              ? 'bg-white/80 dark:bg-gray-800/80 shadow-md text-gray-900 dark:text-gray-100 scale-105'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                          )}
                          title={action.label}
                        >
                          <action.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </button>
                      ))}
                  </div>

                  {/* Add Item Button */}
                  {userRole === 'owner' && (
                    <motion.button
                      onClick={onAddItem}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200',
                        'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                        'text-white font-medium shadow-lg hover:shadow-xl',
                        'backdrop-blur-sm border border-white/20',
                        'hover:scale-105 active:scale-95'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Item</span>
                    </motion.button>
                  )}

                  {/* More Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className={cn(
                        'p-3 rounded-xl transition-all duration-200 backdrop-blur-sm border',
                        'bg-white/40 hover:bg-white/60 dark:bg-gray-800/40 dark:hover:bg-gray-800/60',
                        'border-white/20 dark:border-gray-700/30',
                        'hover:scale-105 hover:shadow-md'
                      )}
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>

                    <AnimatePresence>
                      {showMobileMenu && (
                        <>
                          <motion.div
                            className="fixed inset-0 z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileMenu(false)}
                          />
                          <motion.div
                            className={cn(
                              'absolute right-0 top-full mt-2 w-56 z-20',
                              'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl',
                              'border border-white/20 dark:border-gray-700/30',
                              'rounded-xl shadow-xl'
                            )}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          >
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  onExport?.();
                                  setShowMobileMenu(false);
                                }}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                                  'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                )}
                              >
                                <Download className="w-4 h-4" />
                                Export
                              </button>
                              <button
                                onClick={() => {
                                  onShare?.();
                                  setShowMobileMenu(false);
                                }}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                                  'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                )}
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>

                              {/* Mobile mode toggles */}
                              <div className="md:hidden border-t border-white/10 dark:border-gray-700/20 mt-2 pt-2">
                                {normalActions
                                  .filter(action => !action.ownerOnly || userRole === 'owner')
                                  .map((action) => (
                                    <button
                                      key={action.key}
                                      onClick={() => {
                                        action.onClick();
                                        setShowMobileMenu(false);
                                      }}
                                      className={cn(
                                        'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                                        action.active
                                          ? 'bg-blue-500/20 text-blue-700 dark:bg-blue-400/30 dark:text-blue-300'
                                          : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                      )}
                                    >
                                      <action.icon className="w-4 h-4" />
                                      {action.label}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && !isBulkMode && (
            <motion.div
              className={cn(
                'p-6 rounded-xl backdrop-blur-sm border',
                'bg-white/50 dark:bg-gray-800/50',
                'border-white/20 dark:border-gray-700/30',
                'shadow-lg'
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Category</label>
                  <select
                    value={activeFilters.category || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, category: e.target.value })}
                    className={cn(
                      'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                      'text-gray-900 dark:text-gray-100 border-white/30 dark:border-gray-700/50',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30',
                      'hover:bg-white/80 dark:hover:bg-gray-800/80'
                    )}
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Status</label>
                  <select
                    value={activeFilters.status || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, status: e.target.value })}
                    className={cn(
                      'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                      'text-gray-900 dark:text-gray-100 border-white/30 dark:border-gray-700/50',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30',
                      'hover:bg-white/80 dark:hover:bg-gray-800/80'
                    )}
                  >
                    <option value="">All Items</option>
                    <option value="available">Available</option>
                    <option value="dibbed">Reserved</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                {/* Desire Score Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-800 dark:text-gray-200">Min Desire Score</label>
                  <select
                    value={activeFilters.minDesireScore || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, minDesireScore: e.target.value })}
                    className={cn(
                      'w-full px-4 py-3 border rounded-xl transition-all duration-200',
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                      'text-gray-900 dark:text-gray-100 border-white/30 dark:border-gray-700/50',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30',
                      'hover:bg-white/80 dark:hover:bg-gray-800/80'
                    )}
                  >
                    <option value="">Any Score</option>
                    <option value="1">⭐ 1+ Stars</option>
                    <option value="2">⭐⭐ 2+ Stars</option>
                    <option value="3">⭐⭐⭐ 3+ Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                  </span>
                  <button
                    onClick={() => onFilterChange?.({})}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-3 py-1 rounded-lg hover:bg-blue-500/10"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Operations Help Text */}
        {isBulkMode && (
          <motion.div
            className={cn(
              'p-5 rounded-xl backdrop-blur-sm border',
              'bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80',
              'dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30',
              'border-blue-200/50 dark:border-blue-400/30'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
                  Bulk Operations Active
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2 leading-relaxed">
                  Use the actions above to perform operations on {selectedItems.length} selected item{selectedItems.length > 1 ? 's' : ''}.
                  You can continue selecting more items or search to find additional items to include.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

WishlistToolbar.displayName = 'WishlistToolbar';

export default WishlistToolbar;