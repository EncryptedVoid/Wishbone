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
  Settings,
  Download,
  Share2,
  TrendingUp,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * WishlistToolbar Component - Main toolbar with search, filters, and actions
 *
 * Features:
 * - Responsive design with mobile-optimized layout
 * - Real-time search with debouncing
 * - Advanced filtering with visual indicators
 * - Mode switching (view, edit, select)
 * - Role-based action visibility
 * - Smooth animations and state transitions
 * - Glassmorphism design with theme awareness
 *
 * @param {string} searchQuery - Current search query
 * @param {function} onSearchChange - Handler for search input changes
 * @param {Object} activeFilters - Currently active filters
 * @param {function} onFilterChange - Handler for filter changes
 * @param {string} currentMode - Current mode: 'view' | 'edit' | 'select'
 * @param {function} onModeChange - Handler for mode changes
 * @param {Array} selectedItems - Currently selected item IDs
 * @param {number} totalItems - Total number of items
 * @param {number} filteredItems - Number of items after filtering
 * @param {string} userRole - Current user's role: 'owner' | 'friend' | 'visitor'
 * @param {function} onAddItem - Handler for adding new item
 * @param {function} onSidebarToggle - Handler for toggling sidebar (mobile)
 * @param {function} onBulkAction - Handler for bulk actions
 * @param {function} onExport - Handler for exporting wishlist
 * @param {function} onShare - Handler for sharing wishlist
 * @param {function} onSettings - Handler for settings
 * @param {boolean} sidebarOpen - Whether sidebar is open (mobile)
 * @param {boolean} loading - Whether toolbar is in loading state
 * @param {string} className - Additional CSS classes
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
  onSettings,
  sidebarOpen = false,
  loading = false,
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
  const selectionText = hasSelection ? `${selectedItems.length} selected` : '';

  // Mode configurations
  const modes = {
    view: {
      icon: Eye,
      label: 'View',
      description: 'Browse and view items',
      color: 'text-blue-600'
    },
    edit: {
      icon: Edit3,
      label: 'Edit',
      description: 'Edit item details',
      color: 'text-green-600'
    },
    select: {
      icon: CheckSquare,
      label: 'Select',
      description: 'Select multiple items',
      color: 'text-purple-600'
    }
  };

  // Filter options
  const filterOptions = {
    category: {
      label: 'Category',
      options: [
        'Electronics', 'Fashion', 'Books', 'Home & Garden', 'Sports',
        'Music', 'Games', 'Art', 'Kitchen', 'Travel'
      ]
    },
    desireScore: {
      label: 'Desire Level',
      options: [
        { value: '8', label: '8+ (Must Have)' },
        { value: '6', label: '6+ (Strong Want)' },
        { value: '4', label: '4+ (Moderate)' },
        { value: '2', label: '2+ (Low Interest)' }
      ]
    },
    status: {
      label: 'Status',
      options: [
        { value: 'available', label: 'Available' },
        { value: 'reserved', label: 'Reserved' },
        { value: 'private', label: 'Private' },
        { value: 'public', label: 'Public' }
      ]
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...activeFilters };
    if (value === '' || value === null) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    onFilterChange?.(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange?.({});
    setShowFilters(false);
  };

  // Animation variants
  const toolbarVariants = {
    initial: { opacity: 0, y: -20, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    initial: { opacity: 0, x: -10 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const filterPanelVariants = {
    initial: { opacity: 0, height: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      height: 'auto',
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05
      }
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
        'sticky top-0 z-30 overflow-hidden',
        // Glassmorphism with theme awareness
        'bg-gradient-to-r from-background/90 via-background/95 to-background/90',
        'backdrop-blur-xl backdrop-saturate-150',
        'border-b border-border/50 shadow-lg shadow-primary-500/5',
        // Multi-layer texture
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-white/10 before:pointer-events-none',
        'after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:to-primary-500/5 after:pointer-events-none',
        className
      )}
      variants={toolbarVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      <div className="relative z-10 px-4 lg:px-6 py-4">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Section: Mobile Menu + Search + Stats */}
          <motion.div
            className="flex items-center gap-4 flex-1 min-w-0"
            variants={sectionVariants}
          >
            {/* Mobile sidebar toggle */}
            <motion.button
              onClick={onSidebarToggle}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-all duration-200',
                'bg-surface/80 hover:bg-surface border border-border/50',
                'text-foreground hover:text-primary-600',
                sidebarOpen && 'bg-primary-500/10 text-primary-600 border-primary-300'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search wishlist items..."
                  disabled={loading}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 border rounded-lg transition-all duration-300',
                    'bg-background/90 text-foreground placeholder:text-muted-foreground',
                    'border-border hover:border-primary-500/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                />

                {/* Search clear button */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      onClick={() => onSearchChange?.('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted/50 rounded"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Item count display */}
            <motion.div
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TrendingUp className="w-4 h-4" />
              <span>
                {filteredItems === totalItems
                  ? `${totalItems} items`
                  : `${filteredItems} of ${totalItems} items`
                }
              </span>
            </motion.div>
          </motion.div>

          {/* Right Section: Mode Buttons + Actions */}
          <motion.div
            className="flex items-center gap-2"
            variants={sectionVariants}
          >
            {/* Mode Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {Object.entries(modes).map(([mode, config]) => {
                const isActive = currentMode === mode;
                const IconComponent = config.icon;

                return (
                  <motion.button
                    key={mode}
                    onClick={() => onModeChange?.(mode)}
                    disabled={userRole === 'visitor' && mode !== 'view'}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      isActive && [
                        'bg-gradient-to-r from-primary-500/10 to-primary-600/15',
                        'text-primary-700 border border-primary-200',
                        'shadow-md shadow-primary-500/20'
                      ].join(' '),
                      !isActive && [
                        'text-foreground hover:bg-surface/80',
                        'border border-transparent hover:border-border/50'
                      ].join(' '),
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    whileHover={!isActive ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                    title={config.description}
                  >
                    <IconComponent className="w-4 h-4" />
                    {config.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Filter Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm',
                'min-w-[90px] justify-center', // Fixed width for alignment
                'transition-all duration-200 relative',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                activeFilterCount > 0
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-surface/80 hover:bg-surface text-foreground border border-border/50 hover:border-primary-300'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>

              {/* Active filter count badge */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    {activeFilterCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Add Item Button - Owner only */}
            {userRole === 'owner' && (
              <motion.button
                onClick={onAddItem}
                disabled={loading}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm',
                  'bg-gradient-to-r from-primary-500 to-primary-600',
                  'hover:from-primary-600 hover:to-primary-700',
                  'text-white shadow-lg shadow-primary-500/25',
                  'transition-all duration-200 relative overflow-hidden',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Item</span>

                {/* Sparkle animation */}
                <motion.div
                  className="absolute top-1 right-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-3 h-3 text-white/60" />
                </motion.div>
              </motion.button>
            )}

            {/* More Actions - Mobile */}
            <div className="md:hidden relative">
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-surface/80 hover:bg-surface border border-border/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>

              {/* Mobile menu dropdown */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                    variants={mobileMenuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {Object.entries(modes).map(([mode, config]) => (
                      <motion.button
                        key={mode}
                        onClick={() => {
                          onModeChange?.(mode);
                          setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                        variants={{
                          initial: { opacity: 0, x: -10 },
                          animate: { opacity: 1, x: 0 }
                        }}
                      >
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Selection Info Bar */}
        <AnimatePresence>
          {hasSelection && (
            <motion.div
              className="mt-4 p-3 bg-primary-50/80 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <motion.div
                  className="flex items-center gap-2 text-primary-700 dark:text-primary-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="font-medium">{selectionText}</span>
                </motion.div>

                <motion.div
                  className="text-sm text-primary-600 dark:text-primary-400"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Bulk actions available in bottom toolbar
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="mt-4 overflow-hidden"
              variants={filterPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="p-4 bg-gradient-to-br from-surface/90 to-background/80 rounded-lg border border-border/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  <motion.button
                    onClick={() => setShowFilters(false)}
                    className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(filterOptions).map(([filterKey, filter]) => (
                    <motion.div
                      key={filterKey}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {filter.label}
                      </label>
                      <select
                        value={activeFilters[filterKey] || ''}
                        onChange={(e) => handleFilterChange(filterKey, e.target.value)}
                        className={cn(
                          'w-full px-3 py-2 border rounded-lg text-sm',
                          'bg-background text-foreground border-border',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                          'hover:border-primary-500/50 transition-all duration-200'
                        )}
                      >
                        <option value="">All {filter.label}</option>
                        {filter.options.map((option) => (
                          <option
                            key={typeof option === 'string' ? option : option.value}
                            value={typeof option === 'string' ? option : option.value}
                          >
                            {typeof option === 'string' ? option : option.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  ))}
                </div>

                {/* Clear Filters */}
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-border/30"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <motion.button
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Clear All Filters
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
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