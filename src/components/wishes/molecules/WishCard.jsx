import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../../utils/cn';

// Import atoms
import SelectCheckbox from '../atoms/SelectCheckbox';
import WishBadge from '../atoms/WishBadge';
import WishScore from '../atoms/WishScore';
import DibsControl from '../atoms/DibsControl';

/**
 * WishCard Component - Main wish item card with role-based behavior
 *
 * Features:
 * - Adaptive height based on image presence
 * - Role-based rendering and interactions
 * - Mode-based click behavior (view/edit/select)
 * - Smooth animations and hover effects
 * - Theme-aware styling
 * - Optimized for touch and mouse interactions
 *
 * @param {Object} item - Wish item data
 * @param {string} userRole - User's role: 'owner' | 'friend' | 'visitor'
 * @param {string} mode - Current mode: 'view' | 'edit' | 'select'
 * @param {boolean} selected - Whether card is selected (for bulk operations)
 * @param {function} onSelect - Selection toggle handler
 * @param {function} onClick - Card click handler
 * @param {function} onDibsChange - Dibs change handler
 * @param {Array} collections - Available collections for mapping IDs to names
 * @param {string} currentUserId - Current user's ID
 * @param {string} className - Additional CSS classes
 */
const WishCard = React.forwardRef(({
  item,
  userRole = 'friend',
  mode = 'view',
  selected = false,
  onSelect,
  onClick,
  onDibsChange,
  collections = [],
  currentUserId,
  className,
  ...props
}, ref) => {

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Destructure item data
  const {
    id,
    name,
    description,
    link,
    image_url: imageUrl,
    score,
    is_private: isPrivate,
    dibbed_by: dibbedBy,
    collection_ids: collectionIds = [],
    created_at: createdAt,
    updated_at: updatedAt
  } = item;

  // State calculations
  const hasImage = imageUrl && !imageError;
  const isSelectMode = mode === 'select';
  const showDibs = userRole === 'friend';
  const showPrivacyBadge = isPrivate && (userRole === 'owner' || userRole === 'friend');
  const showReservedBadge = dibbedBy && userRole === 'friend';

  // Click behavior based on mode and role
  const handleCardClick = useCallback((e) => {
    // Don't trigger if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }

    if (isSelectMode) {
      onSelect?.(id);
      return;
    }

    if (mode === 'edit' && userRole === 'owner') {
      onClick?.(item); // Open edit modal
      return;
    }

    if (mode === 'view' && link) {
      window.open(link, '_blank', 'noopener noreferrer');
      return;
    }

    // Default: just highlight or show details
    onClick?.(item);
  }, [isSelectMode, mode, userRole, link, onSelect, onClick, id, item]);

  // Handle selection with event isolation
  const handleSelect = useCallback((e) => {
    e.stopPropagation();
    onSelect?.(id);
  }, [onSelect, id]);

  // Handle external link click
  const handleLinkClick = useCallback((e) => {
    e.stopPropagation();
    if (link) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  }, [link]);

  // Image handlers
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  // Get collection names from IDs
  const getCollectionNames = useCallback((ids) => {
    return ids
      .map(id => collections.find(c => c.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2); // Limit to 2 for space
  }, [collections]);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  // Animation variants
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.6
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    selected: {
      scale: 0.98,
      y: -2,
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
        // Base styles
        'bg-background border border-border rounded-xl overflow-hidden',
        'cursor-pointer transition-all duration-200',
        'hover:shadow-lg hover:shadow-primary-500/10',
        'focus-within:ring-2 focus-within:ring-primary-500/50',

        // Selection state
        selected && [
          'ring-2 ring-primary-500 shadow-lg shadow-primary-500/20',
          'bg-primary-50/50 dark:bg-primary-950/50'
        ].join(' '),

        // Mode-specific styles
        isSelectMode && 'hover:bg-primary-50/30 dark:hover:bg-primary-950/30',

        className
      )}
      variants={cardVariants}
      initial="initial"
      animate={selected ? "selected" : "animate"}
      whileHover={!selected ? "hover" : undefined}
      whileTap="tap"
      onClick={handleCardClick}
      {...props}
    >
      {/* Image Section */}
      {hasImage ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          <img
            src={imageUrl}
            alt={name}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              imageLoading && 'opacity-0',
              !imageLoading && 'opacity-100'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Image loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center">
              <span className="text-2xl opacity-50">🖼️</span>
            </div>
          )}

          {/* Overlay elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Select checkbox */}
          {isSelectMode && (
            <div className="absolute top-3 left-3">
              <SelectCheckbox
                checked={selected}
                onChange={handleSelect}
                size="md"
              />
            </div>
          )}

          {/* Privacy badge */}
          {showPrivacyBadge && (
            <div className="absolute top-3 right-3">
              <WishBadge type="private" size="sm" />
            </div>
          )}

          {/* Reserved badge */}
          {showReservedBadge && (
            <div className="absolute top-3 right-3 flex gap-2">
              {showPrivacyBadge && <WishBadge type="private" size="sm" />}
              <WishBadge type="reserved" size="sm" />
            </div>
          )}

          {/* External link button */}
          {link && !isSelectMode && (
            <button
              onClick={handleLinkClick}
              className={cn(
                'absolute bottom-3 right-3 p-2',
                'bg-background/90 hover:bg-background',
                'border border-border/50 rounded-lg',
                'text-foreground hover:text-primary-600',
                'backdrop-blur-sm shadow-sm hover:shadow-md',
                'transition-all duration-200'
              )}
              aria-label="Open product link"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* No Image - Compact header */
        <div className="relative h-16 bg-muted/30 flex items-center justify-center">
          <span className="text-2xl opacity-70">🎁</span>

          {/* Select checkbox */}
          {isSelectMode && (
            <div className="absolute top-2 left-3">
              <SelectCheckbox
                checked={selected}
                onChange={handleSelect}
                size="sm"
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-3 flex gap-1">
            {showPrivacyBadge && <WishBadge type="private" size="sm" />}
            {showReservedBadge && <WishBadge type="reserved" size="sm" />}
          </div>

          {/* External link */}
          {link && !isSelectMode && (
            <button
              onClick={handleLinkClick}
              className={cn(
                'absolute right-2 p-1.5',
                'bg-background/80 hover:bg-background',
                'border border-border/50 rounded-md',
                'text-muted-foreground hover:text-primary-600',
                'transition-all duration-200'
              )}
              aria-label="Open product link"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <h3 className={cn(
            'font-semibold text-foreground leading-tight',
            'line-clamp-2 text-sm md:text-base'
          )}>
            {name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Desire Score */}
        <WishScore
          score={score}
          variant="hearts"
          size="sm"
          showLabel={true}
          interactive={false}
        />

        {/* Dibs Control - Only for Friends */}
        {showDibs && (
          <DibsControl
            itemId={id}
            dibbedBy={dibbedBy}
            currentUserId={currentUserId}
            userRole={userRole}
            onDibsChange={onDibsChange}
            size="sm"
          />
        )}

        {/* Footer - Collections & Timestamp */}
        <div className={cn(
          'flex items-center justify-between text-xs text-muted-foreground',
          'pt-2 border-t border-border/50'
        )}>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Added {formatDate(createdAt)}</span>
          </div>

          {/* Collections */}
          {collectionIds.length > 0 && (
            <div className="flex items-center gap-1 max-w-[50%]">
              <span className="opacity-75">📁</span>
              <span className="truncate">
                {getCollectionNames(collectionIds).join(', ')}
                {collectionIds.length > 2 && ` +${collectionIds.length - 2}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;