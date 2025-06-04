import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, FolderOpen, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';
import Badge from './Badge';

/**
 * Enhanced CollectionSidebar Component - Advanced navigation sidebar with sophisticated animations
 *
 * Enhanced Features:
 * - Advanced glassmorphism with multi-layer backdrop effects
 * - Sophisticated collection item animations with staggered reveals
 * - Enhanced hover states with elevation and glow effects
 * - Dynamic badges with contextual styling and animations
 * - Improved visual hierarchy with enhanced spacing and typography
 * - Smart collection organization with visual priority indicators
 * - Advanced mobile responsiveness with gesture support
 */
const CollectionSidebar = React.forwardRef(({
  collections = [],
  activeCollection = 'all',
  onCollectionChange,
  onAddCollection,
  isOpen = true,
  onClose,
  className,
  ...props
}, ref) => {

  // Enhanced collection selection with sophisticated feedback
  const handleCollectionSelect = (collectionId) => {
    onCollectionChange?.(collectionId);
    // Auto-close on mobile with improved timing
    if (window.innerWidth < 1024) {
      setTimeout(() => onClose?.(), 150);
    }
  };

  // Calculate collection statistics for enhanced display
  const totalItems = collections.reduce((total, col) => total + col.itemCount, 0);
  const getCollectionPriority = (collection) => {
    if (collection.itemCount === 0) return 'empty';
    if (collection.itemCount >= 10) return 'high';
    if (collection.itemCount >= 5) return 'medium';
    return 'low';
  };

  // ENHANCED MOTION VARIANTS
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
        ease: [0.25, 0.46, 0.45, 0.94]
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

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: {
      x: -30,
      opacity: 0,
      scale: 0.95
    },
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    hover: {
      x: 6,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15,
        duration: 0.3
      }
    },
    tap: {
      scale: 0.98,
      x: 2,
      transition: { duration: 0.1 }
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

  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    }
  };

  const footerVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <>
      {/* Enhanced Mobile backdrop with blur effect */}
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

      {/* Enhanced Sidebar */}
      <motion.aside
        ref={ref}
        variants={sidebarVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit"
        className={cn(
          // Base positioning and sizing
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-72 h-full flex flex-col',
          // Enhanced glassmorphism
          'bg-gradient-to-b from-background/95 via-background/90 to-surface/95',
          'backdrop-blur-xl border-r border-border/50',
          'shadow-2xl lg:shadow-xl',
          // Texture overlays
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:via-transparent before:to-white/10 before:pointer-events-none',
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-primary-500/5 after:via-transparent after:to-primary-500/5 after:pointer-events-none',
          className
        )}
        {...props}
      >
        {/* Enhanced Header */}
        <motion.div
          className="p-responsive-lg border-b border-border/50 relative z-10"
          variants={headerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center justify-between">
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
                <Folder className="w-5 h-5 text-primary-500" />
              </motion.div>
              <h2 className="text-responsive-lg font-semibold text-foreground">
                Collections
              </h2>
            </div>

            {/* Enhanced Add Collection Button */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddCollection}
                className={cn(
                  'p-2.5 rounded-xl relative overflow-hidden',
                  'bg-gradient-to-r from-surface/80 to-background/60',
                  'hover:from-primary-50 hover:to-primary-100/50',
                  'border border-border/50 hover:border-primary-300',
                  'shadow-sm hover:shadow-md transition-all duration-300'
                )}
                aria-label="Add new collection"
              >
                <Plus className="w-4 h-4" />

                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 opacity-0 rounded-xl"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </div>

          {/* Enhanced subtitle with statistics */}
          <motion.p
            className="text-responsive-xs text-muted mt-2 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp className="w-3 h-3" />
            {collections.length} collection{collections.length !== 1 ? 's' : ''} • {totalItems} items
          </motion.p>
        </motion.div>

        {/* Enhanced Collections List */}
        <motion.nav
          className="flex-1 overflow-y-auto p-responsive-md space-y-1 relative z-10"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {collections.map((collection, index) => {
            const isActive = collection.id === activeCollection;
            const IconComponent = isActive ? FolderOpen : Folder;
            const priority = getCollectionPriority(collection);

            return (
              <motion.button
                key={collection.id}
                onClick={() => handleCollectionSelect(collection.id)}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  // Base styles
                  'w-full flex items-center justify-between',
                  'p-3 rounded-xl text-left group relative overflow-hidden',
                  'transition-all duration-300 backdrop-blur-sm',

                  // Active state with enhanced styling
                  isActive ? [
                    'bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100',
                    'text-primary-700 border border-primary-200/80',
                    'shadow-lg shadow-primary-500/10',
                    'before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary-500/10 before:to-transparent before:pointer-events-none'
                  ].join(' ') : [
                    'text-foreground border border-transparent',
                    'hover:bg-gradient-to-r hover:from-surface/80 hover:via-background/70 hover:to-surface/80',
                    'hover:text-primary-600 hover:border-border/50',
                    'hover:shadow-md hover:backdrop-blur-md'
                  ].join(' ')
                )}
              >
                {/* Left side: Icon, Emoji, and Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Collection emoji/icon with enhanced animation */}
                  {collection.icon ? (
                    <motion.span
                      className="text-responsive-lg flex-shrink-0"
                      animate={isActive ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {collection.icon}
                    </motion.span>
                  ) : (
                    <motion.div
                      animate={isActive ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <IconComponent className={cn(
                        'w-5 h-5 flex-shrink-0 transition-colors duration-300',
                        isActive ? 'text-primary-600' : 'text-muted group-hover:text-primary-500'
                      )} />
                    </motion.div>
                  )}

                  {/* Collection name with truncation */}
                  <div className="min-w-0 flex-1">
                    <span className="text-responsive-sm font-medium truncate block">
                      {collection.name}
                    </span>

                    {/* Collection description if available */}
                    {collection.description && (
                      <motion.p
                        className="text-responsive-xs text-muted/70 truncate"
                        initial={{ opacity: 0, height: 0 }}
                        animate={isActive ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {collection.description}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Enhanced Right side: Item count with priority styling */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* High activity indicator */}
                  {priority === 'high' && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                    </motion.div>
                  )}

                  <motion.div
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Badge
                      variant={isActive ? "primary" : "secondary"}
                      size="sm"
                      className={cn(
                        'flex-shrink-0 font-medium transition-all duration-300',
                        priority === 'high' && !isActive && 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200',
                        priority === 'medium' && !isActive && 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
                        priority === 'empty' && 'opacity-50',
                        isActive && 'shadow-sm'
                      )}
                    >
                      {collection.itemCount}
                    </Badge>
                  </motion.div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-primary-500/10 to-primary-500/5 opacity-0 rounded-xl"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Enhanced Footer with statistics and sparkle effect */}
        <motion.div
          className="p-responsive-md border-t border-border/50 relative z-10"
          variants={footerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="text-center relative">
            <motion.p
              className="text-responsive-xs text-muted font-medium"
              key={totalItems}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {totalItems} total items across all collections
            </motion.p>

            {/* Decorative sparkle for milestone achievements */}
            {totalItems > 0 && totalItems % 10 === 0 && (
              <motion.div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
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
        </motion.div>
      </motion.aside>
    </>
  );
});

CollectionSidebar.displayName = 'CollectionSidebar';

/**
 * Enhanced CollectionSidebarToggle - Button to toggle sidebar with improved animations
 */
const CollectionSidebarToggle = React.forwardRef(({
  isOpen,
  onToggle,
  className,
  ...props
}, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={cn(
          'lg:hidden relative overflow-hidden',
          'bg-gradient-to-r from-surface/80 to-background/60',
          'hover:from-primary-50 hover:to-primary-100/50',
          'border border-border/50 hover:border-primary-300',
          'shadow-sm hover:shadow-md transition-all duration-300',
          className
        )}
        aria-label={isOpen ? 'Close collections' : 'Open collections'}
        {...props}
      >
        <motion.div
          animate={{
            rotate: isOpen ? 15 : 0,
            scale: isOpen ? 1.1 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15
          }}
        >
          <Folder className="w-4 h-4" />
        </motion.div>

        {/* Toggle glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 opacity-0 rounded-md"
          animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
});

CollectionSidebarToggle.displayName = 'CollectionSidebarToggle';

export { CollectionSidebar, CollectionSidebarToggle };
export default CollectionSidebar;