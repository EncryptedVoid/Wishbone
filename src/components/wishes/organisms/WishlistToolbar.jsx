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
      color: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
      onClick: () => onBulkAction?.('delete', selectedItems)
    },
    {
      key: 'archive',
      icon: Archive,
      label: 'Archive',
      color: 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20',
      onClick: () => onBulkAction?.('archive', selectedItems)
    },
    {
      key: 'duplicate',
      icon: Copy,
      label: 'Duplicate',
      color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      onClick: () => onBulkAction?.('duplicate', selectedItems)
    },
    {
      key: 'move',
      icon: FolderPlus,
      label: 'Move',
      color: 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20',
      onClick: () => onBulkAction?.('move', selectedItems)
    },
    {
      key: 'share',
      icon: Share2,
      label: 'Share',
      color: 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
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
        'bg-background/95 backdrop-blur-sm border-b border-border/50',
        // Enhanced dark mode support
        'dark:bg-background/90 dark:border-border/30',
        // Bulk mode styling
        isBulkMode && 'bg-primary-50/80 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800',
        className
      )}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="px-4 py-3 space-y-4">
        {/* TOP ROW: Search Bar */}
        <div className="w-full">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={`Search in ${currentCollection}...`}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200',
                'bg-background/90 text-foreground placeholder:text-muted-foreground',
                'border-border hover:border-primary-500/50',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                // Enhanced dark mode styling
                'dark:bg-background/95 dark:border-border/50 dark:hover:border-primary-400/50',
                'dark:focus:ring-primary-400/50 dark:focus:border-primary-400',
                // Bulk mode styling
                isBulkMode && 'border-primary-300 focus:ring-primary-500 bg-white dark:bg-background'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange?.('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Controls and Info */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title and Stats */}
          <div className="flex items-center gap-4">
            {/* Mobile sidebar toggle */}
            <button
              onClick={onSidebarToggle}
              className="md:hidden p-2 hover:bg-muted/50 dark:hover:bg-muted/30 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title and Selection Info */}
            <div className="flex items-center gap-3">
              <h1 className={cn(
                'text-lg font-semibold transition-colors',
                isBulkMode ? 'text-primary-700 dark:text-primary-300' : 'text-foreground'
              )}>
                {isBulkMode ? 'Bulk Operations' : currentCollection}
              </h1>

              {/* Selection counter and clear button */}
              {isBulkMode && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <span className={cn(
                    'text-sm font-medium px-2 py-1 rounded-full',
                    'bg-primary-100 text-primary-600',
                    'dark:bg-primary-900/30 dark:text-primary-300'
                  )}>
                    {selectedItems.length} selected
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className={cn(
                      'p-1 rounded-full transition-colors',
                      'hover:bg-primary-200 dark:hover:bg-primary-800/50'
                    )}
                    aria-label="Clear selection"
                  >
                    <X className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </button>
                </motion.div>
              )}

              {/* Normal mode stats */}
              {!isBulkMode && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {filteredItems} of {totalItems} items
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {isBulkMode ? (
                /* Bulk operation actions */
                <motion.div
                  key="bulk-actions"
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {bulkActions.map((action) => (
                    <motion.button
                      key={action.key}
                      onClick={action.onClick}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                        'border text-sm font-medium',
                        action.color || 'text-muted-foreground hover:bg-muted/50 dark:hover:bg-muted/30',
                        'hover:scale-105 active:scale-95'
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
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      'relative p-2 rounded-lg transition-colors',
                      showFilters || activeFilterCount > 0
                        ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'hover:bg-muted/50 dark:hover:bg-muted/30 text-muted-foreground'
                    )}
                    title="Filters"
                  >
                    <Filter className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                      <span className={cn(
                        'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium',
                        'bg-primary-500 text-white dark:bg-primary-400 dark:text-primary-900'
                      )}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Mode Toggle Buttons */}
                  <div className={cn(
                    'hidden md:flex items-center rounded-lg p-1',
                    'bg-muted/50 dark:bg-muted/30'
                  )}>
                    {normalActions
                      .filter(action => !action.ownerOnly || userRole === 'owner')
                      .map((action) => (
                        <button
                          key={action.key}
                          onClick={action.onClick}
                          className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200',
                            action.active
                              ? 'bg-background shadow-sm text-foreground dark:bg-background/80'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                          title={action.label}
                        >
                          <action.icon className="w-4 h-4" />
                          <span className="text-sm">{action.label}</span>
                        </button>
                      ))}
                  </div>

                  {/* Add Item Button */}
                  {userRole === 'owner' && (
                    <motion.button
                      onClick={onAddItem}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        'bg-primary-500 text-white hover:bg-primary-600',
                        'dark:bg-primary-600 dark:hover:bg-primary-700'
                      )}
                      whileHover={{ scale: 1.02 }}
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
                        'p-2 rounded-lg transition-colors',
                        'hover:bg-muted/50 dark:hover:bg-muted/30'
                      )}
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="w-4 h-4" />
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
                              'absolute right-0 top-full mt-2 w-48 z-20',
                              'bg-background border border-border rounded-lg shadow-lg',
                              'dark:bg-background/95 dark:border-border/50'
                            )}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  onExport?.();
                                  setShowMobileMenu(false);
                                }}
                                className={cn(
                                  'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                                  'hover:bg-muted/50 dark:hover:bg-muted/30'
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
                                  'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                                  'hover:bg-muted/50 dark:hover:bg-muted/30'
                                )}
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>

                              {/* Mobile mode toggles */}
                              <div className="md:hidden border-t border-border/50 dark:border-border/30 mt-1 pt-1">
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
                                        'w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors',
                                        action.active
                                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300'
                                          : 'hover:bg-muted/50 dark:hover:bg-muted/30'
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
                'p-4 rounded-lg border',
                'bg-muted/30 border-border/50',
                'dark:bg-muted/20 dark:border-border/30'
              )}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Category</label>
                  <select
                    value={activeFilters.category || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, category: e.target.value })}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg transition-colors',
                      'bg-background text-foreground border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'dark:bg-background/80 dark:border-border/50'
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
                  <label className="block text-sm font-medium mb-2 text-foreground">Status</label>
                  <select
                    value={activeFilters.status || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, status: e.target.value })}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg transition-colors',
                      'bg-background text-foreground border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'dark:bg-background/80 dark:border-border/50'
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
                  <label className="block text-sm font-medium mb-2 text-foreground">Min Desire Score</label>
                  <select
                    value={activeFilters.minDesireScore || ''}
                    onChange={(e) => onFilterChange?.({ ...activeFilters, minDesireScore: e.target.value })}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg transition-colors',
                      'bg-background text-foreground border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'dark:bg-background/80 dark:border-border/50'
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
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
                  </span>
                  <button
                    onClick={() => onFilterChange?.({})}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
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
              'p-3 rounded-lg border',
              'bg-primary-50 border-primary-200',
              'dark:bg-primary-900/20 dark:border-primary-800'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                  Bulk Operations Active
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
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