import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, FolderOpen } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';
import Badge from './Badge';

/**
 * CollectionSidebar Component - Navigation sidebar for wishlist collections
 *
 * Features:
 * - Responsive design that adapts to mobile/desktop
 * - Theme-aware styling with hover states
 * - Active collection highlighting
 * - Item count badges
 * - Add new collection functionality
 * - Smooth animations for interactions
 * - Collapsible on mobile
 *
 * @param {Array} collections - Array of collection objects
 * @param {string} activeCollection - ID of currently active collection
 * @param {function} onCollectionChange - Handler for collection selection
 * @param {function} onAddCollection - Handler for adding new collection
 * @param {boolean} isOpen - Whether sidebar is open (mobile)
 * @param {function} onClose - Handler to close sidebar (mobile)
 * @param {string} className - Additional CSS classes
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

  // Handle collection selection
  const handleCollectionSelect = (collectionId) => {
    onCollectionChange?.(collectionId);
    // Auto-close on mobile after selection
    if (window.innerWidth < 1024) {
      onClose?.();
    }
  };

  // MOTION VARIANTS
  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      x: -280,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    },
    hover: {
      x: 4,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
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
          // Base styles
          'fixed lg:static inset-y-0 left-0 z-50',
          'w-64 h-full bg-background border-r border-border',
          'flex flex-col',
          // Mobile specific
          'lg:translate-x-0',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="p-responsive-lg border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-responsive-lg font-semibold text-foreground">
              Collections
            </h2>

            {/* Add Collection Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddCollection}
              className="p-2"
              aria-label="Add new collection"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Collections List */}
        <motion.nav
          className="flex-1 overflow-y-auto p-responsive-md space-y-1"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {collections.map((collection) => {
            const isActive = collection.id === activeCollection;
            const IconComponent = isActive ? FolderOpen : Folder;

            return (
              <motion.button
                key={collection.id}
                onClick={() => handleCollectionSelect(collection.id)}
                variants={itemVariants}
                whileHover="hover"
                className={cn(
                  // Base styles
                  'w-full flex items-center justify-between',
                  'p-responsive-sm rounded-lg',
                  'text-left transition-all duration-200',
                  'group',

                  // Active state
                  isActive ? [
                    'bg-primary-50 text-primary-600 border border-primary-200',
                    'shadow-sm'
                  ].join(' ') : [
                    'text-foreground hover:bg-surface hover:text-primary-600',
                    'border border-transparent hover:border-border'
                  ].join(' ')
                )}
              >
                {/* Left side: Icon, Emoji, and Name */}
                <div className="flex items-center gap-responsive-sm min-w-0">
                  {/* Collection emoji/icon */}
                  {collection.icon ? (
                    <span className="text-responsive-base flex-shrink-0">
                      {collection.icon}
                    </span>
                  ) : (
                    <IconComponent className={cn(
                      'w-4 h-4 flex-shrink-0',
                      isActive ? 'text-primary-600' : 'text-muted group-hover:text-primary-600'
                    )} />
                  )}

                  {/* Collection name */}
                  <span className="text-responsive-sm font-medium truncate">
                    {collection.name}
                  </span>
                </div>

                {/* Right side: Item count */}
                <Badge
                  variant={isActive ? "primary" : "secondary"}
                  size="sm"
                  className="flex-shrink-0 ml-auto"
                >
                  {collection.itemCount}
                </Badge>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Footer (optional - could show user info or settings) */}
        <div className="p-responsive-md border-t border-border">
          <p className="text-responsive-xs text-muted text-center">
            {collections.reduce((total, col) => total + col.itemCount, 0)} total items
          </p>
        </div>
      </motion.aside>
    </>
  );
});

CollectionSidebar.displayName = 'CollectionSidebar';

/**
 * CollectionSidebarToggle - Button to toggle sidebar on mobile
 */
const CollectionSidebarToggle = React.forwardRef(({
  isOpen,
  onToggle,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={cn('lg:hidden', className)}
      aria-label={isOpen ? 'Close collections' : 'Open collections'}
      {...props}
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Folder className="w-4 h-4" />
      </motion.div>
    </Button>
  );
});

CollectionSidebarToggle.displayName = 'CollectionSidebarToggle';

export { CollectionSidebar, CollectionSidebarToggle };
export default CollectionSidebar;