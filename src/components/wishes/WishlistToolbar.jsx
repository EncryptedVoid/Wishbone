import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, CheckSquare, Filter,
  MoreHorizontal, Eye, EyeOff, X, Search
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import Badge from '../ui/Badge';
import { CollectionSidebarToggle } from '../ui/CollectionSidebar';

/**
 * WishlistToolbar Component - Top toolbar for wishlist management
 *
 * Features:
 * - Mode switching (view, edit, delete, select, add)
 * - Search functionality with real-time filtering
 * - Filter controls with active filter indicators
 * - Bulk action buttons (appears in select mode)
 * - Responsive design with mobile adaptations
 * - Theme-aware styling
 *
 * @param {string} currentMode - Current mode: 'view' | 'edit' | 'delete' | 'select' | 'add'
 * @param {function} onModeChange - Mode change handler
 * @param {string} searchQuery - Current search query
 * @param {function} onSearchChange - Search change handler
 * @param {object} activeFilters - Active filter object
 * @param {function} onFilterChange - Filter change handler
 * @param {Array} selectedItems - Array of selected item IDs (select mode)
 * @param {function} onBulkAction - Bulk action handler
 * @param {function} onAddItem - Add new item handler
 * @param {boolean} sidebarOpen - Whether sidebar is open (mobile)
 * @param {function} onSidebarToggle - Sidebar toggle handler
 * @param {string} className - Additional CSS classes
 */
const WishlistToolbar = React.forwardRef(({
  currentMode = 'view',
  onModeChange,
  searchQuery = '',
  onSearchChange,
  activeFilters = {},
  onFilterChange,
  selectedItems = [],
  onBulkAction,
  onAddItem,
  sidebarOpen = false,
  onSidebarToggle,
  className,
  ...props
}, ref) => {

  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // Mode configurations
  const modes = {
    view: {
      label: 'View',
      icon: Eye,
      variant: 'ghost',
      description: 'Browse and view items'
    },
    edit: {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary',
      description: 'Edit item details'
    },
    delete: {
      label: 'Delete',
      icon: Trash2,
      variant: 'outline',
      description: 'Delete items'
    },
    select: {
      label: 'Select',
      icon: CheckSquare,
      variant: 'primary',
      description: 'Select multiple items'
    }
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    if (currentMode === newMode) {
      onModeChange?.('view'); // Toggle off if same mode
    } else {
      onModeChange?.(newMode);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    onSearchChange?.(e.target.value);
  };

  // Clear search
  const handleSearchClear = () => {
    onSearchChange?.('');
  };

  // MOTION VARIANTS
  const toolbarVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const bulkActionsVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'sticky top-0 z-30',
        // Enhanced glassmorphism
        'bg-background/70 backdrop-blur-xl border-b border-border/30',
        'shadow-lg',
        // Subtle texture overlay
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none',
        'p-responsive-lg',
        className
      )}
      variants={toolbarVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      <div className="space-y-responsive-md">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between gap-responsive-md">
          {/* Left Section: Sidebar Toggle + Search */}
          <div className="flex items-center gap-responsive-md flex-1 min-w-0">
            {/* Mobile sidebar toggle */}
            <CollectionSidebarToggle
              isOpen={sidebarOpen}
              onToggle={onSidebarToggle}
            />

            {/* Search */}
            <div className="flex-1 max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                placeholder="Search wishlist items..."
                size="md"
              />
            </div>
          </div>

          {/* Right Section: Mode Buttons + Actions */}
          <div className="flex items-center gap-responsive-sm">
            {/* Mode Buttons - Hidden on mobile, show in dropdown */}
            <div className="hidden md:flex items-center gap-responsive-xs">
              {Object.entries(modes).map(([mode, config]) => {
                const isActive = currentMode === mode;
                const IconComponent = config.icon;

                return (
                  <Button
                    key={mode}
                    variant={isActive ? config.variant : 'ghost'}
                    size="sm"
                    onClick={() => handleModeChange(mode)}
                    className={cn(
                      'transition-all duration-200',
                      isActive && 'shadow-sm'
                    )}
                    title={config.description}
                  >
                    <IconComponent className="w-4 h-4 mr-1" />
                    {config.label}
                  </Button>
                );
              })}
            </div>

            {/* Mobile mode dropdown */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Button
              variant={activeFilterCount > 0 ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
              {activeFilterCount > 0 && (
                <Badge
                  variant="error"
                  size="sm"
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {/* Add Item Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={onAddItem}
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Add Item</span>
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar (Select Mode) */}
        <AnimatePresence>
          {currentMode === 'select' && selectedItems.length > 0 && (
            <motion.div
              variants={bulkActionsVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'flex items-center justify-between',
                'p-responsive-md rounded-lg',
                'bg-primary-50 border border-primary-200',
                'dark:bg-primary-900/20 dark:border-primary-800'
              )}
            >
              {/* Selection Info */}
              <div className="flex items-center gap-responsive-sm">
                <CheckSquare className="w-4 h-4 text-primary-600" />
                <span className="text-responsive-sm font-medium text-primary-600">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-responsive-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction?.('edit', selectedItems)}
                  disabled={selectedItems.length === 0}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction?.('delete', selectedItems)}
                  disabled={selectedItems.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onBulkAction?.('privacy', selectedItems)}
                  disabled={selectedItems.length === 0}
                >
                  <EyeOff className="w-4 h-4 mr-1" />
                  Privacy
                </Button>

                {/* Clear Selection */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onModeChange?.('view')}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={cn(
                'p-responsive-md rounded-lg border border-border',
                'bg-surface'
              )}>
                <div className="flex items-center justify-between mb-responsive-sm">
                  <h3 className="text-responsive-sm font-medium text-foreground">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-responsive-md">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-responsive-xs font-medium text-muted mb-1">
                      Category
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      value={activeFilters.category || ''}
                      onChange={(e) => onFilterChange?.({ ...activeFilters, category: e.target.value })}
                    >
                      <option value="">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Books">Books</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>

                  {/* Desire Score Filter */}
                  <div>
                    <label className="block text-responsive-xs font-medium text-muted mb-1">
                      Minimum Desire Score
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      value={activeFilters.minDesireScore || ''}
                      onChange={(e) => onFilterChange?.({ ...activeFilters, minDesireScore: e.target.value })}
                    >
                      <option value="">Any Score</option>
                      <option value="7">7+ (High)</option>
                      <option value="5">5+ (Medium)</option>
                      <option value="3">3+ (Low)</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-responsive-xs font-medium text-muted mb-1">
                      Status
                    </label>
                    <select
                      className="w-full p-2 border border-border rounded-md bg-background text-foreground"
                      value={activeFilters.status || ''}
                      onChange={(e) => onFilterChange?.({ ...activeFilters, status: e.target.value })}
                    >
                      <option value="">All Items</option>
                      <option value="available">Available</option>
                      <option value="dibbed">Dibbed</option>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <div className="mt-responsive-md pt-responsive-md border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFilterChange?.({})}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

WishlistToolbar.displayName = 'WishlistToolbar';

export default WishlistToolbar;

/*
USAGE EXAMPLES:

// Basic toolbar
<WishlistToolbar
  currentMode={mode}
  onModeChange={setMode}
  searchQuery={search}
  onSearchChange={setSearch}
  onAddItem={handleAddItem}
/>

// With filtering
<WishlistToolbar
  currentMode={mode}
  onModeChange={setMode}
  searchQuery={search}
  onSearchChange={setSearch}
  activeFilters={filters}
  onFilterChange={setFilters}
  onAddItem={handleAddItem}
/>

// With bulk actions (select mode)
<WishlistToolbar
  currentMode="select"
  onModeChange={setMode}
  selectedItems={selectedItems}
  onBulkAction={handleBulkAction}
  searchQuery={search}
  onSearchChange={setSearch}
  onAddItem={handleAddItem}
/>

// Mobile with sidebar
<WishlistToolbar
  currentMode={mode}
  onModeChange={setMode}
  sidebarOpen={sidebarOpen}
  onSidebarToggle={setSidebarOpen}
  searchQuery={search}
  onSearchChange={setSearch}
  onAddItem={handleAddItem}
/>

FEATURES:
- Automatically adapts layout for mobile vs desktop
- Changes colors based on light/dark theme
- Mode switching with visual feedback
- Real-time search with clear functionality
- Advanced filtering with active filter indicators
- Bulk actions that appear in select mode
- Sticky positioning for always-accessible controls
- Professional animations and micro-interactions
- Responsive design patterns
- Semantic sizing system integration
*/