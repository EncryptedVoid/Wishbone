import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Folder,
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';

// Import molecules
import CollectionItem from '../molecules/CollectionItem';
import CollectionModal from '../molecules/CollectionModal';

/**
 * CollectionSidebar Component - Modern glassmorphic redesign
 * Beautiful, clean interface with enhanced visual hierarchy
 */

// Mobile wrapper component - defined outside main component
const MobileSidebarWrapper = ({ children, isOpen, onClose }) => (
  <>
    {/* Mobile backdrop */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-md z-40 dark:bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
    </AnimatePresence>

    {/* Mobile sidebar with glassmorphic design */}
    <motion.div
      className={cn(
        'md:hidden fixed left-0 top-0 bottom-0 z-50 w-80',
        'transform transition-transform duration-300 ease-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
      initial={false}
      animate={{
        x: isOpen ? 0 : -320
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </>
);

const CollectionSidebar = React.forwardRef(({
  collections = [],
  activeCollection = 'all',
  onCollectionChange,
  onAddCollection,
  onEditCollection,
  onDeleteCollection,
  isOpen = true,
  onClose,
  userRole = 'owner',
  summary = {},
  loading = false,
  className,
  ...props
}, ref) => {
  const { colorTheme } = useTheme();

  // Color theme mappings for dynamic sidebar theming based on global theme
  const sidebarColorThemes = {
    blue: {
      headerGradient: 'from-blue-50/60 to-blue-100/40 dark:from-blue-900/30 dark:to-blue-800/20',
      addButtonGradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      addButtonShadow: 'shadow-blue-500/30 hover:shadow-blue-500/40',
      accentColor: 'bg-blue-400',
      createButtonGradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    },
    green: {
      headerGradient: 'from-emerald-50/60 to-emerald-100/40 dark:from-emerald-900/30 dark:to-emerald-800/20',
      addButtonGradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      addButtonShadow: 'shadow-emerald-500/30 hover:shadow-emerald-500/40',
      accentColor: 'bg-emerald-400',
      createButtonGradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
    },
    purple: {
      headerGradient: 'from-purple-50/60 to-purple-100/40 dark:from-purple-900/30 dark:to-purple-800/20',
      addButtonGradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      addButtonShadow: 'shadow-purple-500/30 hover:shadow-purple-500/40',
      accentColor: 'bg-purple-400',
      createButtonGradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
    },
    pink: {
      headerGradient: 'from-pink-50/60 to-pink-100/40 dark:from-pink-900/30 dark:to-pink-800/20',
      addButtonGradient: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      addButtonShadow: 'shadow-pink-500/30 hover:shadow-pink-500/40',
      accentColor: 'bg-pink-400',
      createButtonGradient: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
    },
    orange: {
      headerGradient: 'from-orange-50/60 to-orange-100/40 dark:from-orange-900/30 dark:to-orange-800/20',
      addButtonGradient: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      addButtonShadow: 'shadow-orange-500/30 hover:shadow-orange-500/40',
      accentColor: 'bg-orange-400',
      createButtonGradient: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
    },
    red: {
      headerGradient: 'from-red-50/60 to-red-100/40 dark:from-red-900/30 dark:to-red-800/20',
      addButtonGradient: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      addButtonShadow: 'shadow-red-500/30 hover:shadow-red-500/40',
      accentColor: 'bg-red-400',
      createButtonGradient: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    },
    indigo: {
      headerGradient: 'from-indigo-50/60 to-indigo-100/40 dark:from-indigo-900/30 dark:to-indigo-800/20',
      addButtonGradient: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      addButtonShadow: 'shadow-indigo-500/30 hover:shadow-indigo-500/40',
      accentColor: 'bg-indigo-400',
      createButtonGradient: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700'
    },
    emerald: {
      headerGradient: 'from-emerald-50/60 to-emerald-100/40 dark:from-emerald-900/30 dark:to-emerald-800/20',
      addButtonGradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      addButtonShadow: 'shadow-emerald-500/30 hover:shadow-emerald-500/40',
      accentColor: 'bg-emerald-400',
      createButtonGradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
    }
  };

  const currentSidebarTheme = sidebarColorThemes[colorTheme] || sidebarColorThemes.blue;

  // Collection modal state
  const [collectionModalState, setCollectionModalState] = useState({
    isOpen: false,
    mode: 'add',
    collection: null,
    loading: false
  });

  // Calculate statistics - ONLY COLLECTIONS COUNT
  const statistics = useMemo(() => {
    const totalCollections = collections.length;
    const activeCollections = collections.filter(col => (col.item_count || 0) > 0);
    const highActivityCollections = collections.filter(col => (col.item_count || 0) >= 10);

    return {
      totalCollections,
      activeCollections: activeCollections.length,
      highActivityCollections: highActivityCollections.length
    };
  }, [collections]);

  // Sort collections alphabetically
  const sortedCollections = useMemo(() => {
    return [...collections].sort((a, b) => a.name.localeCompare(b.name));
  }, [collections]);

  // Handle collection selection
  const handleCollectionSelect = (collectionId) => {
    onCollectionChange?.(collectionId);
    // Auto-close on mobile after selection
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  // Collection modal handlers
  const handleOpenAddModal = () => {
    setCollectionModalState({
      isOpen: true,
      mode: 'add',
      collection: null,
      loading: false
    });
  };

  const handleOpenEditModal = (collection) => {
    setCollectionModalState({
      isOpen: true,
      mode: 'edit',
      collection,
      loading: false
    });
  };

  const handleCloseModal = () => {
    setCollectionModalState({
      isOpen: false,
      mode: 'add',
      collection: null,
      loading: false
    });
  };

  const handleSaveCollection = async (collectionData) => {
    try {
      setCollectionModalState(prev => ({ ...prev, loading: true }));

      if (collectionModalState.mode === 'add') {
        await onAddCollection?.(collectionData);
      } else {
        await onEditCollection?.(collectionModalState.collection.id, collectionData);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving collection:', error);
      // Error handling could be improved with toast notifications
    } finally {
      setCollectionModalState(prev => ({ ...prev, loading: false }));
    }
  };

  // Animation variants for performance optimization
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.06
      }
    }
  };

  // Main sidebar content
  const sidebarContent = (
    <motion.aside
      ref={ref}
      className={cn(
        // Modern glassmorphic container - REMOVE HEIGHT RESTRICTIONS
        'flex flex-col relative overflow-hidden',
        'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl',
        'border-r border-white/20 dark:border-gray-700/30',
        'shadow-2xl shadow-black/10 dark:shadow-black/30',
        // Desktop - relative positioning within container - MUCH TALLER
        'w-80 flex-shrink-0',
        // Mobile - still use positioning for overlay behavior
        'md:relative md:translate-x-0',
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {/* Background gradient overlay - reactive to global theme color */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSidebarTheme.headerGradient}`} />

      {/* Header with modern styling */}
      <motion.div
        className="relative z-10 p-6 border-b border-white/30 dark:border-gray-700/40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Header background blur - reactive to global theme color */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSidebarTheme.headerGradient} backdrop-blur-sm`} />

        <div className="relative flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Collections
            </h2>

            <motion.div
              className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`w-2 h-2 rounded-full ${currentSidebarTheme.accentColor} animate-pulse`} />
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-medium">
                {statistics.totalCollections} collection{statistics.totalCollections !== 1 ? 's' : ''}
              </span>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Collection Button - reactive to global theme color */}
            {userRole === 'owner' && (
              <motion.button
                onClick={handleOpenAddModal}
                className={cn(
                  'relative group p-3 rounded-xl overflow-hidden',
                  'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
                  'border border-white/40 dark:border-gray-700/50',
                  `shadow-lg ${currentSidebarTheme.addButtonShadow}`,
                  'hover:shadow-xl',
                  'transition-all duration-300'
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Add new collection"
                title="Create new collection"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${currentSidebarTheme.addButtonGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <Plus className={`relative w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors`} />
              </motion.button>
            )}

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-700/40 hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-600 dark:text-gray-400 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Collections List with enhanced styling */}
      <motion.div
        className="relative z-10 flex-1 overflow-y-auto p-5 space-y-3"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            /* Enhanced loading state */
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-16 rounded-xl overflow-hidden relative',
                    'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
                    'border border-white/30 dark:border-gray-700/30'
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-gray-700/50 to-transparent animate-pulse" />
                </div>
              ))}
            </motion.div>
          ) : sortedCollections.length === 0 ? (
            /* Enhanced empty state */
            <motion.div
              className="text-center py-12 px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full backdrop-blur-sm" />
                <div className="absolute inset-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <Folder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                No collections yet
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
                Create your first collection to organize and discover amazing items
              </p>

              {userRole === 'owner' && (
                <motion.button
                  onClick={handleOpenAddModal}
                  className={cn(
                    'px-6 py-3 rounded-xl font-medium text-sm text-white',
                    `bg-gradient-to-r ${currentSidebarTheme.createButtonGradient}`,
                    `shadow-lg ${currentSidebarTheme.addButtonShadow}`,
                    'hover:shadow-xl',
                    'transition-all duration-300'
                  )}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Your First Collection
                </motion.button>
              )}
            </motion.div>
          ) : (
            /* Collection items with enhanced container */
            <div className="space-y-2">
              {sortedCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      delay: index * 0.05,
                      duration: 0.4,
                      ease: "easeOut"
                    }
                  }}
                >
                  <CollectionItem
                    collection={collection}
                    isActive={collection.id === activeCollection}
                    onClick={handleCollectionSelect}
                    onEdit={userRole === 'owner' ? handleOpenEditModal : undefined}
                    onDelete={userRole === 'owner' ? onDeleteCollection : undefined}
                    variant="prominent"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  );

  // Conditional rendering for mobile vs desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <>
        <MobileSidebarWrapper isOpen={isOpen} onClose={onClose}>
          {sidebarContent}
        </MobileSidebarWrapper>

        {/* Collection Modal */}
        <CollectionModal
          isOpen={collectionModalState.isOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCollection}
          mode={collectionModalState.mode}
          collection={collectionModalState.collection}
          loading={collectionModalState.loading}
        />
      </>
    );
  }

  // Desktop: render directly in container
  return (
    <>
      {sidebarContent}

      {/* Collection Modal */}
      <CollectionModal
        isOpen={collectionModalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCollection}
        mode={collectionModalState.mode}
        collection={collectionModalState.collection}
        loading={collectionModalState.loading}
      />
    </>
  );
});

CollectionSidebar.displayName = 'CollectionSidebar';

export default CollectionSidebar;