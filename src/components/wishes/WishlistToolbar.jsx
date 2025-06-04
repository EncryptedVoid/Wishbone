import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, CheckSquare, Filter,
  MoreHorizontal, Eye, EyeOff, X, Search, Sparkles
} from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import SearchInput from '../ui/SearchInput';
import Badge from '../ui/Badge';
import { CollectionSidebarToggle } from '../ui/CollectionSidebar';

/**
 * Enhanced WishlistToolbar Component - Top toolbar for wishlist management
 *
 * Enhanced Features:
 * - Advanced glassmorphism with multi-layer backdrop effects
 * - Sophisticated micro-animations for all interactive elements
 * - Improved visual hierarchy with enhanced spacing and typography
 * - Staggered animation sequences for better user experience
 * - Enhanced color transitions and hover states
 * - Real-time visual feedback for all user interactions
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
  const [searchFocused, setSearchFocused] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  // Enhanced mode configurations with improved styling
  const modes = {
    view: {
      label: 'View',
      icon: Eye,
      variant: 'ghost',
      description: 'Browse and view items',
      color: 'from-blue-500/20 to-blue-600/30',
      hoverColor: 'hover:from-blue-500/30 hover:to-blue-600/40'
    },
    edit: {
      label: 'Edit',
      icon: Edit,
      variant: 'secondary',
      description: 'Edit item details',
      color: 'from-emerald-500/20 to-emerald-600/30',
      hoverColor: 'hover:from-emerald-500/30 hover:to-emerald-600/40'
    },
    delete: {
      label: 'Delete',
      icon: Trash2,
      variant: 'outline',
      description: 'Delete items',
      color: 'from-red-500/20 to-red-600/30',
      hoverColor: 'hover:from-red-500/30 hover:to-red-600/40'
    },
    select: {
      label: 'Select',
      icon: CheckSquare,
      variant: 'primary',
      description: 'Select multiple items',
      color: 'from-purple-500/20 to-purple-600/30',
      hoverColor: 'hover:from-purple-500/30 hover:to-purple-600/40'
    }
  };

  // Handle mode change with improved feedback
  const handleModeChange = (newMode) => {
    if (currentMode === newMode) {
      onModeChange?.('view');
    } else {
      onModeChange?.(newMode);
    }
  };

  // Enhanced search handlers
  const handleSearchChange = (e) => {
    onSearchChange?.(e.target.value);
  };

  const handleSearchClear = () => {
    onSearchChange?.('');
  };

  const handleSearchFocus = () => setSearchFocused(true);
  const handleSearchBlur = () => setSearchFocused(false);

  // ENHANCED MOTION VARIANTS
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const modeButtonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20,
        delay: index * 0.1,
        duration: 0.5
      }
    }),
    hover: {
      scale: 1.05,
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15,
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95,
      y: 0,
      transition: { duration: 0.1 }
    }
  };

  const searchVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { 
        delay: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    focus: {
      scale: 1.02,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };

  const bulkActionsVariants = {
    initial: { opacity: 0, scale: 0.9, y: -20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 350, 
        damping: 25,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const bulkActionItemVariants = {
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
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const filterItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'sticky top-0 z-30 overflow-hidden',
        // Enhanced glassmorphism with multiple layers
        'bg-gradient-to-r from-background/85 via-background/90 to-background/85',
        'backdrop-blur-xl backdrop-saturate-150',
        'border-b border-gradient-to-r from-border/20 via-border/40 to-border/20',
        'shadow-lg shadow-primary-500/5',
        // Multi-layer texture overlay
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-white/5 before:to-white/10 before:pointer-events-none',
        'after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:via-transparent after:to-primary-500/5 after:pointer-events-none',
        'p-responsive-lg',
        className
      )}
      variants={toolbarVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      <div className="space-y-responsive-md relative z-10">
        {/* Main Toolbar */}
        <div className="flex items-center justify-between gap-responsive-md">
          {/* Left Section: Sidebar Toggle + Search */}
          <div className="flex items-center gap-responsive-md flex-1 min-w-0">
            {/* Enhanced Mobile sidebar toggle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
            >
              <CollectionSidebarToggle
                isOpen={sidebarOpen}
                onToggle={onSidebarToggle}
              />
            </motion.div>

            {/* Enhanced Search with real-time visual feedback */}
            <motion.div 
              className="flex-1 max-w-md relative"
              variants={searchVariants}
              initial="initial"
              animate="animate"
              whileFocus="focus"
            >
              <div className={cn(
                'relative transition-all duration-300',
                searchFocused && 'drop-shadow-lg'
              )}>
                <SearchInput
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onClear={handleSearchClear}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search wishlist items..."
                  size="md"
                  className={cn(
                    'transition-all duration-300',
                    searchFocused && [
                      'ring-2 ring-primary-500/30 border-primary-500/50',
                      'shadow-lg shadow-primary-500/10',
                      'bg-background/95'
                    ].join(' ')
                  )}
                />
                
                {/* Search glow effect */}
                <AnimatePresence>
                  {searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg blur-xl -z-10"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Section: Enhanced Mode Buttons + Actions */}
          <div className="flex items-center gap-responsive-sm">
            {/* Enhanced Mode Buttons with staggered animations */}
            <div className="hidden md:flex items-center gap-responsive-xs">
              {Object.entries(modes).map(([mode, config], index) => {
                const isActive = currentMode === mode;
                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={mode}
                    custom={index}
                    variants={modeButtonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant={isActive ? config.variant : 'ghost'}
                      size="sm"
                      onClick={() => handleModeChange(mode)}
                      className={cn(
                        'relative overflow-hidden transition-all duration-300',
                        'hover:shadow-lg hover:shadow-primary-500/10',
                        isActive && [
                          'shadow-md shadow-primary-500/20',
                          'bg-gradient-to-r from-primary-500/10 to-primary-600/15',
                          'border-primary-500/30'
                        ].join(' '),
                        !isActive && [
                          'hover:bg-gradient-to-r hover:from-surface/80 hover:to-background/60',
                          'hover:border-primary-500/20'
                        ].join(' ')
                      )}
                      title={config.description}
                    >
                      <motion.div
                        className="flex items-center relative z-10"
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <IconComponent className="w-4 h-4 mr-1" />
                        {config.label}
                      </motion.div>
                      
                      {/* Animated background gradient */}
                      <motion.div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-r opacity-0',
                          config.color,
                          'transition-opacity duration-300'
                        )}
                        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                      />
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Enhanced Mobile mode dropdown */}
            <motion.div 
              className="md:hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gradient-to-r hover:from-surface/80 hover:to-background/60 transition-all duration-200"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Enhanced Filter Button with animated badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeFilterCount > 0 ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'relative transition-all duration-300',
                  activeFilterCount > 0 && [
                    'shadow-lg shadow-primary-500/20',
                    'bg-gradient-to-r from-primary-500 to-primary-600'
                  ].join(' ')
                )}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filter
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge
                        variant="error"
                        size="sm"
                        className={cn(
                          'w-5 h-5 text-xs flex items-center justify-center',
                          'animate-pulse shadow-lg shadow-error/30'
                        )}
                      >
                        {activeFilterCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Enhanced Add Item Button with sparkle effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="sm"
                onClick={onAddItem}
                className={cn(
                  'relative overflow-hidden',
                  'bg-gradient-to-r from-primary-500 to-primary-600',
                  'hover:from-primary-600 hover:to-primary-700',
                  'shadow-lg shadow-primary-500/25',
                  'hover:shadow-xl hover:shadow-primary-500/30',
                  'transition-all duration-300'
                )}
              >
                <motion.div
                  className="flex items-center relative z-10"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Add Item</span>
                </motion.div>
                
                {/* Sparkle animation effect */}
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
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Bulk Actions Bar with staggered animations */}
        <AnimatePresence>
          {currentMode === 'select' && selectedItems.length > 0 && (
            <motion.div
              variants={bulkActionsVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                'relative overflow-hidden',
                'p-responsive-md rounded-xl',
                'bg-gradient-to-r from-primary-50/80 via-primary-50/90 to-primary-50/80',
                'border border-primary-200/50 backdrop-blur-sm',
                'shadow-lg shadow-primary-500/10',
                'dark:from-primary-900/30 dark:via-primary-900/40 dark:to-primary-900/30',
                'dark:border-primary-800/50'
              )}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"
                animate={{
                  x: ['0%', '100%', '0%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <div className="flex items-center justify-between relative z-10">
                {/* Enhanced Selection Info */}
                <motion.div
                  className="flex items-center gap-responsive-sm"
                  variants={bulkActionItemVariants}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CheckSquare className="w-4 h-4 text-primary-600" />
                  </motion.div>
                  <span className="text-responsive-sm font-medium text-primary-600">
                    <motion.span
                      key={selectedItems.length}
                      initial={{ scale: 1.3, color: 'rgb(var(--color-primary-500))' }}
                      animate={{ scale: 1, color: 'rgb(var(--color-primary-600))' }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {selectedItems.length}
                    </motion.span>
                    {' '}item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </motion.div>

                {/* Enhanced Bulk Actions with staggered animations */}
                <motion.div 
                  className="flex items-center gap-responsive-sm"
                  variants={bulkActionItemVariants}
                >
                  {[
                    { icon: Edit, label: 'Edit', action: 'edit', delay: 0 },
                    { icon: Trash2, label: 'Delete', action: 'delete', delay: 0.1 },
                    { icon: EyeOff, label: 'Privacy', action: 'privacy', delay: 0.2 }
                  ].map(({ icon: Icon, label, action, delay }) => (
                    <motion.div
                      key={action}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onBulkAction?.(action, selectedItems)}
                        disabled={selectedItems.length === 0}
                        className="hover:bg-white/50 transition-all duration-200"
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {label}
                      </Button>
                    </motion.div>
                  ))}

                  {/* Enhanced Clear Selection */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onModeChange?.('view')}
                      className="border-primary-300 hover:bg-white/70 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Filter Panel with sophisticated animations */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              variants={filterPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              <div className={cn(
                'p-responsive-md rounded-xl border border-border/50',
                'bg-gradient-to-br from-surface/90 via-background/80 to-surface/90',
                'backdrop-blur-md shadow-lg',
                'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none'
              )}>
                <motion.div 
                  className="flex items-center justify-between mb-responsive-sm"
                  variants={filterItemVariants}
                >
                  <h3 className="text-responsive-sm font-medium text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="hover:bg-surface/60 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Filter Controls with staggered animations */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-responsive-md"
                  variants={filterItemVariants}
                >
                  {[
                    {
                      label: 'Category',
                      value: activeFilters.category || '',
                      onChange: (value) => onFilterChange?.({ ...activeFilters, category: value }),
                      options: [
                        { value: '', label: 'All Categories' },
                        { value: 'Electronics', label: 'Electronics' },
                        { value: 'Fashion', label: 'Fashion' },
                        { value: 'Books', label: 'Books' },
                        { value: 'Home', label: 'Home' }
                      ]
                    },
                    {
                      label: 'Minimum Desire Score',
                      value: activeFilters.minDesireScore || '',
                      onChange: (value) => onFilterChange?.({ ...activeFilters, minDesireScore: value }),
                      options: [
                        { value: '', label: 'Any Score' },
                        { value: '7', label: '7+ (High)' },
                        { value: '5', label: '5+ (Medium)' },
                        { value: '3', label: '3+ (Low)' }
                      ]
                    },
                    {
                      label: 'Status',
                      value: activeFilters.status || '',
                      onChange: (value) => onFilterChange?.({ ...activeFilters, status: value }),
                      options: [
                        { value: '', label: 'All Items' },
                        { value: 'available', label: 'Available' },
                        { value: 'dibbed', label: 'Dibbed' },
                        { value: 'private', label: 'Private' },
                        { value: 'public', label: 'Public' }
                      ]
                    }
                  ].map((filter, index) => (
                    <motion.div
                      key={filter.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <label className="block text-responsive-xs font-medium text-muted mb-1">
                        {filter.label}
                      </label>
                      <motion.select
                        className={cn(
                          'w-full p-2 border border-border rounded-md',
                          'bg-background/80 text-foreground backdrop-blur-sm',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                          'hover:border-primary-500/50 transition-all duration-200',
                          'focus:bg-background/95'
                        )}
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {filter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </motion.select>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Clear Filters with animation */}
                <AnimatePresence>
                  {activeFilterCount > 0 && (
                    <motion.div
                      className="mt-responsive-md pt-responsive-md border-t border-border/30"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFilterChange?.({})}
                          className="hover:bg-surface/60 transition-all duration-200"
                        >
                          Clear All Filters
                        </Button>
                      </motion.div>
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