import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Lock, Eye, MoreVertical, Edit, Trash2, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import TagChip, { TagGroup } from './TagChip';
import DesireScoreDisplay from './DesireScoreDisplay';

/**
 * WishCard Component - Professional wish item card following our design system
 *
 * Features:
 * - Responsive design with mobile/desktop layouts
 * - Theme-aware styling that adapts to light/dark modes
 * - Interactive states (view, edit, delete modes)
 * - Dibs state handling with visual feedback
 * - Image loading with fallback
 * - Context menu for actions
 * - Smooth animations and hover effects
 *
 * @param {object} item - Wish item data
 * @param {string} mode - Current mode: 'view' | 'edit' | 'delete' | 'select'
 * @param {boolean} selected - Whether item is selected (in select mode)
 * @param {function} onSelect - Selection handler
 * @param {function} onClick - Click handler for viewing item
 * @param {function} onEdit - Edit handler
 * @param {function} onDelete - Delete handler
 * @param {function} onToggleDibs - Dibs toggle handler
 * @param {string} className - Additional CSS classes
 */
const WishCard = React.forwardRef(({
  item,
  mode = 'view',
  selected = false,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  onToggleDibs,
  className,
  ...props
}, ref) => {

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDibsTooltip, setShowDibsTooltip] = useState(false);

  // Destructure item properties
  const {
    id,
    name,
    link,
    imageUrl,
    desireScore,
    categoryTags = [],
    isPrivate,
    isDibbed,
    dibbedBy,
    description
  } = item;

  // Handle card click
  const handleCardClick = () => {
    if (mode === 'select') {
      onSelect?.(id);
      return;
    }

    if (isDibbed) {
      // Show dibs message - you could use a toast or modal here
      alert(`This item has been dibbed by ${dibbedBy}. You cannot view it.`);
      return;
    }

    if (mode === 'view' && onClick) {
      onClick(item);
    }
  };

  // Handle external link click
  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (!isDibbed) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // MOTION VARIANTS
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    hover: !isDibbed && mode === 'view' ? {
      y: -4,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    } : {}
  };

  const imageVariants = {
    loading: { opacity: 0 },
    loaded: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Style overrides for different states
  const cardClasses = cn(
    'group relative overflow-hidden',
    // Glassmorphism effect
    'backdrop-blur-sm bg-background/80',
    'border border-border/50 shadow-lg',
    // Dibs state styling with dotted border and animation
    isDibbed && [
      'border-dashed border-2 border-muted animate-pulse',
      'bg-surface/40 pointer-events-none cursor-not-allowed'
    ].join(' '),
    // Selection state
    mode === 'select' && selected && 'ring-2 ring-primary-500',
    // Interactive states
    mode === 'view' && !isDibbed && 'cursor-pointer hover:shadow-xl transition-all duration-300',
    mode === 'select' && 'cursor-pointer',
    className
  );

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className={cardClasses}
      onMouseEnter={() => isDibbed && setShowDibsTooltip(true)}
      onMouseLeave={() => setShowDibsTooltip(false)}
      {...props}
    >
      {/* Dibs Tooltip */}
      <AnimatePresence>
        {showDibsTooltip && isDibbed && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={cn(
              'absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-50',
              'bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl',
              'px-3 py-2 text-center min-w-max max-w-xs'
            )}
          >
            <p className="text-responsive-sm font-medium text-foreground">
              🎁 Gift Selected
            </p>
            <p className="text-responsive-xs text-muted">
              {dibbedBy} is planning to get this for you
            </p>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border/50" />
          </motion.div>
        )}
      </AnimatePresence>
      <Card
        variant="default"
        size="sm"
        className={cn(
          'h-full relative overflow-hidden',
          // Enhanced glassmorphism
          'bg-gradient-to-br from-background/90 to-surface/70',
          'backdrop-blur-md border border-border/30',
          'shadow-xl hover:shadow-2xl transition-all duration-300',
          // Subtle texture overlay
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50 before:pointer-events-none'
        )}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-surface/50 to-background/30 rounded-xl overflow-hidden mb-responsive-md backdrop-blur-sm border border-border/20">
          {/* Image */}
          {!imageError ? (
            <motion.img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="loading"
              animate={imageLoaded ? "loaded" : "loading"}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            /* Fallback when image fails */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface/60 to-background/40 text-muted">
              <Heart className="w-12 h-12 opacity-50" />
            </div>
          )}

          {/* Loading overlay */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-surface/80 to-background/60 animate-pulse backdrop-blur-sm" />
          )}

          {/* Dibs overlay with enhanced styling */}
          {isDibbed && (
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Lock className="w-8 h-8 mx-auto mb-2 text-muted" />
                </motion.div>
                <p className="text-responsive-sm text-muted font-medium">
                  Gift Reserved
                </p>
                <p className="text-responsive-xs text-muted/70">
                  by {dibbedBy}
                </p>
              </div>
            </motion.div>
          )}

          {/* Privacy indicator */}
          {isPrivate && (
            <Badge
              variant="secondary"
              size="sm"
              className="absolute top-3 left-3 bg-background/90 backdrop-blur-md border border-border/50 shadow-lg"
            >
              <Eye className="w-3 h-3 mr-1" />
              Private
            </Badge>
          )}

          {/* External link button */}
          {!isDibbed && (
            <motion.button
              onClick={handleLinkClick}
              className={cn(
                'absolute top-3 right-3 p-2.5 rounded-xl',
                'bg-background/90 backdrop-blur-md border border-border/50',
                'text-muted hover:text-foreground hover:bg-background/95',
                'shadow-lg hover:shadow-xl transition-all duration-300',
                'opacity-0 group-hover:opacity-100'
              )}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Open product link"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}

          {/* Action menu (edit/delete modes) */}
          {(mode === 'edit' || mode === 'delete') && (
            <div className="absolute top-3 right-3">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={cn(
                  'p-2.5 rounded-xl',
                  'bg-background/90 backdrop-blur-md border border-border/50',
                  'text-muted hover:text-foreground hover:bg-background/95',
                  'shadow-lg hover:shadow-xl transition-all duration-300'
                )}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>

              {/* Action menu dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className={cn(
                      'absolute top-full right-0 mt-2 py-2',
                      'bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-xl',
                      'min-w-[140px] z-10'
                    )}
                  >
                    {mode === 'edit' && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onEdit?.(item);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-foreground hover:bg-primary-50 transition-colors duration-200"
                        whileHover={{ x: 4 }}
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Edit Item
                      </motion.button>
                    )}
                    {mode === 'delete' && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onDelete?.(item);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors duration-200"
                        whileHover={{ x: 4 }}
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Item
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Selection indicator */}
          {mode === 'select' && (
            <div className="absolute top-2 left-2">
              <motion.div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  selected
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-background/80 border-border'
                )}
                whileHover={{ scale: 1.1 }}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-responsive-sm">
          {/* Title */}
          <h3 className={cn(
            'text-responsive-lg font-bold leading-tight text-center',
            isDibbed ? 'text-muted' : 'text-foreground'
          )}>
            {name}
          </h3>

          {/* Desire Score - Centered below title */}
          <div className="flex justify-center">
            <DesireScoreDisplay
              score={desireScore}
              variant="hearts"
              size="sm"
            />
          </div>

          {/* Description - Italic and smaller than title */}
          <p className={cn(
            'text-responsive-sm leading-relaxed line-clamp-2 italic text-center',
            isDibbed ? 'text-muted' : 'text-muted'
          )}>
            {description}
          </p>

          {/* Category Tags - More vibrant styling */}
          {categoryTags.length > 0 && (
            <TagGroup className="flex-wrap justify-center">
              {categoryTags.slice(0, 3).map((tag, index) => (
                <TagChip
                  key={index}
                  variant="primary"
                  size="sm"
                  className={cn(
                    'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md',
                    'hover:shadow-lg transition-all duration-200',
                    isDibbed && 'opacity-60'
                  )}
                >
                  {tag}
                </TagChip>
              ))}
              {categoryTags.length > 3 && (
                <TagChip
                  variant="outline"
                  size="sm"
                  className="border-primary-500 text-primary-600 hover:bg-primary-50"
                >
                  +{categoryTags.length - 3}
                </TagChip>
              )}
            </TagGroup>
          )}
        </div>
      </Card>
    </motion.div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;

/*
USAGE EXAMPLES:

// Basic wish card
<WishCard
  item={wishItem}
  onClick={(item) => navigateToProduct(item.link)}
/>

// In different modes
<WishCard
  item={wishItem}
  mode="select"
  selected={selectedItems.includes(item.id)}
  onSelect={handleSelect}
/>

<WishCard
  item={wishItem}
  mode="edit"
  onEdit={handleEdit}
/>

<WishCard
  item={wishItem}
  mode="delete"
  onDelete={handleDelete}
/>

// With all handlers
<WishCard
  item={wishItem}
  onClick={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleDibs={handleDibs}
/>

FEATURES:
- Automatically adapts layout for mobile vs desktop
- Changes colors based on light/dark theme
- Visual feedback for dibs state (dimmed, overlay)
- Interactive modes (view, edit, delete, select)
- Image loading with fallback
- External link button on hover
- Context menu for actions
- Smooth animations and micro-interactions
- Category tags with overflow handling
- Desire score display
- Privacy indicators
- Professional card layout
*/