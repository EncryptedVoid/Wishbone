import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Check,
  MoreHorizontal,
  Settings,
  Download,
  Share2,
  Refresh,
  Grid,
  List,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Toolbar Component - General-purpose toolbar for various pages
 *
 * Features:
 * - Flexible action configuration
 * - Search functionality with clear button
 * - Sort and view mode controls
 * - Filter panel with custom filters
 * - Responsive design with mobile menu
 * - Glassmorphism design with theme awareness
 * - Customizable left and right sections
 *
 * @param {string} title - Toolbar title
 * @param {string} subtitle - Optional subtitle
 * @param {string} searchQuery - Current search query
 * @param {function} onSearchChange - Handler for search changes
 * @param {Array} actions - Array of action button configurations
 * @param {Array} filters - Array of filter configurations
 * @param {Object} activeFilters - Currently active filters
 * @param {function} onFilterChange - Handler for filter changes
 * @param {string} sortBy - Current sort field
 * @param {string} sortOrder - Current sort order: 'asc' | 'desc'
 * @param {function} onSortChange - Handler for sort changes
 * @param {string} viewMode - Current view mode: 'grid' | 'list'
 * @param {function} onViewModeChange - Handler for view mode changes
 * @param {React.ReactNode} leftContent - Custom content for left section
 * @param {React.ReactNode} rightContent - Custom content for right section
 * @param {boolean} loading - Whether toolbar is in loading state
 * @param {boolean} showSearch - Whether to show search input
 * @param {boolean} showFilters - Whether to show filter button
 * @param {boolean} showSort - Whether to show sort controls
 * @param {boolean} showViewMode - Whether to show view mode toggle
 * @param {string} className - Additional CSS classes
 */
const Toolbar = React.forwardRef(({
  title,
  subtitle,
  searchQuery = '',
  onSearchChange,
  actions = [],
  filters = [],
  activeFilters = {},
  onFilterChange,
  sortBy = '',
  sortOrder = 'asc',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  leftContent,
  rightContent,
  loading = false,
  showSearch = true,
  showFilters = true,
  showSort = true,
  showViewMode = true,
  className,
  ...props
}, ref) => {

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Calculate active filter count
  const activeFilterCount = Object.values(activeFilters).filter(value =>
    value !== '' && value !== null && value !== undefined
  ).length;

  // Handle filter change
  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters };
    if (value === '' || value === null) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }
    onFilterChange?.(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange?.({});
    setShowFilterPanel(false);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle order if same field
      onSortChange?.(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending order
      onSortChange?.(field, 'asc');
    }
  };

  // Sort options (could be customized via props)
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created_at', label: 'Date Added' },
    { value: 'updated_at', label: 'Last Modified' },
    { value: 'score', label: 'Priority' }
  ];

  // Animation variants
  const toolbarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
        staggerChildren: 0.1
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
    initial: { opacity: 0, height: 0 },
    animate: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
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
        damping: 25
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
        // Glassmorphism design
        'bg-gradient-to-r from-background/90 via-background/95 to-background/90',
        'backdrop-blur-xl backdrop-saturate-150',
        'border-b border-border/50 shadow-lg shadow-primary-500/5',
        // Texture overlays
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-white/10 before:pointer-events-none',
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
          {/* Left Section */}
          <motion.div
            className="flex items-center gap-4 flex-1 min-w-0"
            variants={sectionVariants}
          >
            {/* Title/Custom Left Content */}
            {leftContent || (title && (
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            ))}

            {/* Search */}
            {showSearch && (
              <div className="flex-1 max-w-md relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search..."
                    disabled={loading}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 border rounded-lg transition-all duration-200',
                      'bg-background/90 text-foreground placeholder:text-muted-foreground',
                      'border-border hover:border-primary-500/50',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  />

                  {/* Clear search */}
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
            )}
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="flex items-center gap-2"
            variants={sectionVariants}
          >
            {/* Custom Right Content */}
            {rightContent}

            {/* Sort Control - Desktop */}
            {showSort && (
              <div className="hidden md:flex items-center gap-1">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="">Sort by...</option>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {sortBy && (
                  <motion.button
                    onClick={() => handleSortChange(sortBy)}
                    className="p-2 rounded-lg hover:bg-surface/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="w-4 h-4 text-foreground" />
                    ) : (
                      <SortDesc className="w-4 h-4 text-foreground" />
                    )}
                  </motion.button>
                )}
              </div>
            )}

            {/* View Mode Toggle - Desktop */}
            {showViewMode && (
              <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                <motion.button
                  onClick={() => onViewModeChange?.('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-surface/50 text-foreground'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => onViewModeChange?.('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list'
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-surface/50 text-foreground'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            )}

            {/* Filter Button */}
            {showFilters && filters.length > 0 && (
              <motion.button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm',
                  'transition-all duration-200 relative',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  activeFilterCount > 0
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-surface/80 hover:bg-surface text-foreground border border-border/50'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>

                {/* Filter count badge */}
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
            )}

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {actions.slice(0, 3).map((action, index) => (
                <motion.button
                  key={action.id || index}
                  onClick={action.onClick}
                  disabled={action.disabled || loading}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                    action.variant === 'primary' && 'bg-primary-500 text-white shadow-lg shadow-primary-500/25',
                    action.variant === 'secondary' && 'bg-surface/80 hover:bg-surface text-foreground border border-border/50',
                    action.variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  whileHover={!action.disabled ? { scale: 1.02 } : {}}
                  whileTap={!action.disabled ? { scale: 0.98 } : {}}
                  title={action.title}
                >
                  {action.icon && <action.icon className="w-4 h-4" />}
                  <span className="hidden lg:inline">{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden relative">
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-lg bg-surface/80 hover:bg-surface border border-border/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="w-4 h-4" />
              </motion.button>

              {/* Mobile dropdown */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                    variants={mobileMenuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {/* View mode options */}
                    {showViewMode && (
                      <>
                        <motion.button
                          onClick={() => {
                            onViewModeChange?.('grid');
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          variants={{
                            initial: { opacity: 0, x: -10 },
                            animate: { opacity: 1, x: 0 }
                          }}
                        >
                          <Grid className="w-4 h-4" />
                          Grid View
                          {viewMode === 'grid' && <Check className="w-4 h-4 ml-auto" />}
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            onViewModeChange?.('list');
                            setShowMobileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors"
                          variants={{
                            initial: { opacity: 0, x: -10 },
                            animate: { opacity: 1, x: 0 }
                          }}
                        >
                          <List className="w-4 h-4" />
                          List View
                          {viewMode === 'list' && <Check className="w-4 h-4 ml-auto" />}
                        </motion.button>
                        <hr className="my-2 border-border/50" />
                      </>
                    )}

                    {/* Actions */}
                    {actions.map((action, index) => (
                      <motion.button
                        key={action.id || index}
                        onClick={() => {
                          action.onClick?.();
                          setShowMobileMenu(false);
                        }}
                        disabled={action.disabled}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted/50 transition-colors disabled:opacity-50"
                        variants={{
                          initial: { opacity: 0, x: -10 },
                          animate: { opacity: 1, x: 0 }
                        }}
                      >
                        {action.icon && <action.icon className="w-4 h-4" />}
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilterPanel && filters.length > 0 && (
            <motion.div
              className="mt-4 overflow-hidden"
              variants={filterPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="p-4 bg-gradient-to-br from-surface/90 to-background/80 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  <motion.button
                    onClick={() => setShowFilterPanel(false)}
                    className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filters.map((filter, index) => (
                    <motion.div
                      key={filter.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {filter.label}
                      </label>
                      <select
                        value={activeFilters[filter.key] || ''}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
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

Toolbar.displayName = 'Toolbar';

export default Toolbar;