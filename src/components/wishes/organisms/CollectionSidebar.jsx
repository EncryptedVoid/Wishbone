import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Folder,
  X,
  TrendingUp,
  Settings,
  Search,
  Sparkles,
  Archive,
  Filter
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import molecules
import CollectionItem from '../molecules/CollectionItem';

/**
 * CollectionSidebar Component - Sidebar for collection navigation and management
 *
 * Features:
 * - Responsive sidebar (fixed on desktop, drawer on mobile)
 * - Collection filtering and search
 * - Real-time collection statistics
 * - Collection management (add, edit, delete)
 * - User role-based features
 * - Smooth animations and transitions
 * - Glassmorphism design with theme awareness
 *
 * @param {Array} collections - Array of collection objects
 * @param {string} activeCollection - Currently selected collection ID
 * @param {function} onCollectionChange - Handler for collection selection
 * @param {function} onAddCollection - Handler for adding new collection
 * @param {function} onEditCollection - Handler for editing collection
 * @param {function} onDeleteCollection - Handler for deleting collection
 * @param {function} onCollectionSettings - Handler for collection settings
 * @param {boolean} isOpen - Whether sidebar is open (mobile)
 * @param {function} onClose - Handler to close sidebar (mobile)
 * @param {string} userRole - Current user's role: 'owner' | 'friend' | 'visitor'
 * @param {Object} summary - Dashboard summary statistics
 * @param {boolean} loading - Whether collections are loading
 * @param {string} className - Additional CSS classes
 */
const CollectionSidebar = React.forwardRef(({
  collections = [],
  activeCollection = 'all',
  onCollectionChange,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  onCollectionSettings,
  isOpen = true,
  onClose,
  userRole = 'owner',
  summary = {},
  loading = false,
  className,
  ...props
}, ref) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchivedCollections, setShowArchivedCollections] = useState(false);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalCollections = collections.length;
    const totalItems = collections.reduce((sum, col) => sum + (col.item_count || 0), 0);
    const activeCollections = collections.filter(col => (col.item_count || 0) > 0);
    const highActivityCollections = collections.filter(col => (col.item_count || 0) >= 10);

    return {
      totalCollections,
      totalItems,
      activeCollections: activeCollections.length,
      highActivityCollections: highActivityCollections.length,
      averageItemsPerCollection: totalCollections > 0 ? Math.round(totalItems / totalCollections * 10) / 10 : 0
    };
  }, [collections]);

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;

    const query = searchQuery.toLowerCase();
    return collections.filter(collection =>
      collection.name.toLowerCase().includes(query) ||
      collection.description?.toLowerCase().includes(query)
    );
  }, [collections, searchQuery]);

  // Handle collection selection
  const handleCollectionSelect = (collectionId) => {
    onCollectionChange?.(collectionId);

    // Auto-close on mobile after selection
    if (window.innerWidth < 1024) {
      setTimeout(() => onClose?.(), 150);
    }
  };

  // Animation variants
  const sidebarVariants = {
    hidden: {
      x: -320,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      x: -320,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const statVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "keyframes",
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const listVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && window.innerWidth < 1024 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        ref={ref}
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        className={cn(
          // Base positioning and sizing
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-80 h-full flex flex-col',

          // Glassmorphism with theme awareness
          'bg-gradient-to-b from-background/95 via-background/90 to-surface/95',
          'backdrop-blur-xl border-r border-border/50',
          'shadow-2xl lg:shadow-xl',

          // Multi-layer texture overlays
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:via-transparent before:to-white/10 before:pointer-events-none',
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary-500/5 after:via-transparent after:to-primary-500/5 after:pointer-events-none',

          className
        )}
        {...props}
      >
        <motion.div
          className="flex flex-col h-full relative z-10"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <motion.div
            className="p-6 border-b border-border/50"
            variants={headerVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Folder className="w-6 h-6 text-primary-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground">
                  Collections
                </h2>
              </div>

              {/* Mobile close button */}
              <div className="flex items-center gap-2">
                {userRole === 'owner' && (
                  <motion.button
                    onClick={onAddCollection}
                    className={cn(
                      'p-2 rounded-xl relative overflow-hidden',
                      'bg-gradient-to-r from-surface/80 to-background/60',
                      'hover:from-primary-50 hover:to-primary-100/50',
                      'border border-border/50 hover:border-primary-300',
                      'shadow-sm hover:shadow-md transition-all duration-300'
                    )}
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add new collection"
                  >
                    <Plus className="w-4 h-4 text-foreground" />
                  </motion.button>
                )}

                <motion.button
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-xl bg-surface/80 hover:bg-surface border border-border/50"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className={cn(
                  'w-full pl-10 pr-4 py-2 bg-background/50 border border-border/50 rounded-lg',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
                  'transition-all duration-200'
                )}
              />
            </motion.div>

            {/* Statistics */}
            <motion.div
              className="mt-4 grid grid-cols-2 gap-3"
              variants={statVariants}
            >
              <div className="text-center p-3 bg-background/30 rounded-lg border border-border/30">
                <div className="text-lg font-bold text-foreground">{statistics.totalCollections}</div>
                <div className="text-xs text-muted-foreground">Collections</div>
              </div>
              <div className="text-center p-3 bg-background/30 rounded-lg border border-border/30">
                <div className="text-lg font-bold text-foreground">{statistics.totalItems}</div>
                <div className="text-xs text-muted-foreground">Total Items</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Collections List */}
          <motion.div
            className="flex-1 overflow-y-auto px-4 py-2"
            variants={listVariants}
          >
            {loading ? (
              /* Loading skeleton */
              <div className="space-y-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted/30 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : filteredCollections.length === 0 ? (
              /* Empty state */
              <motion.div
                className="flex flex-col items-center justify-center py-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <Filter className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">
                  {searchQuery ? 'No collections found' : 'No collections yet'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Create your first collection to organize items'
                  }
                </p>
                {!searchQuery && userRole === 'owner' && (
                  <motion.button
                    onClick={onAddCollection}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Collection
                  </motion.button>
                )}
              </motion.div>
            ) : (
              /* Collection items */
              <div className="space-y-2">
                {filteredCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
                  >
                    <CollectionItem
                      collection={collection}
                      isActive={collection.id === activeCollection}
                      onClick={handleCollectionSelect}
                      onEdit={userRole === 'owner' ? onEditCollection : undefined}
                      onDelete={userRole === 'owner' ? onDeleteCollection : undefined}
                      onSettings={userRole === 'owner' ? onCollectionSettings : undefined}
                      variant="default"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="p-4 border-t border-border/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Summary stats */}
            <div className="text-center relative">
              <motion.p
                className="text-sm text-muted-foreground font-medium"
                key={statistics.totalItems}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {statistics.activeCollections} active • {statistics.totalItems} total items
              </motion.p>

              {/* High activity collections indicator */}
              {statistics.highActivityCollections > 0 && (
                <motion.div
                  className="flex items-center justify-center gap-1 mt-1 text-xs text-amber-600"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{statistics.highActivityCollections} high activity</span>
                </motion.div>
              )}

              {/* Milestone celebration */}
              {statistics.totalItems > 0 && statistics.totalItems % 25 === 0 && (
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary-400" />
                </motion.div>
              )}
            </div>

            {/* Settings button for owners */}
            {userRole === 'owner' && (
              <motion.button
                onClick={() => console.log('Open sidebar settings')}
                className="w-full mt-3 p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface/50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="w-4 h-4" />
                Collection Settings
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.aside>
    </>
  );
});

CollectionSidebar.displayName = 'CollectionSidebar';

export default CollectionSidebar;