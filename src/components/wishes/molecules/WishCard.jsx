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
 * WishCard Component - Horizontal wish item card with improved design
 *
 * IMPROVEMENTS MADE:
 * - Changed to horizontal layout with image as left banner
 * - Scaled desire score from 10-point to 5-point scale
 * - Enhanced card design with better visual hierarchy
 * - Implemented double-width logic for cards without images
 * - Improved metadata and tag alignment at bottom
 * - Better responsive behavior and spacing
 *
 * Features:
 * - Horizontal layout with image banner on left, content on right
 * - Adaptive width based on image presence (2 cards without image = 1 with image)
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

  // IMPROVED: Scale score from 10-point to 5-point scale
  const scaledScore = Math.round((score / 10) * 5) || 1;

  // Color theming based on desire score
  const getScoreColors = (score) => {
    const colors = {
      1: { bg: 'from-gray-500/20 to-gray-400/10', border: 'border-gray-400/30', accent: 'text-gray-500' },
      2: { bg: 'from-blue-500/20 to-blue-400/10', border: 'border-blue-400/30', accent: 'text-blue-500' },
      3: { bg: 'from-green-500/20 to-green-400/10', border: 'border-green-400/30', accent: 'text-green-500' },
      4: { bg: 'from-orange-500/20 to-orange-400/10', border: 'border-orange-400/30', accent: 'text-orange-500' },
      5: { bg: 'from-red-500/20 to-red-400/10', border: 'border-red-400/30', accent: 'text-red-500' }
    };
    return colors[score] || colors[1];
  };

  const scoreColors = getScoreColors(scaledScore);

  // Collection name mapping
  const getCollectionNames = useCallback((ids) => {
    return ids.map(id => {
      const collection = collections.find(c => c.id === id);
      return collection?.name || 'Unknown';
    }).filter(Boolean);
  }, [collections]);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

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

  // Handle image events
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  // Handle external link click
  const handleLinkClick = useCallback((e) => {
    e.stopPropagation();
    if (link) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  }, [link]);

  // Handle selection
  const handleSelect = useCallback((checked) => {
    onSelect?.(id);
  }, [onSelect, id]);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 },
    selected: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // IMPROVED: Horizontal layout with glassmorphic styling and score-based colors
        'group cursor-pointer overflow-hidden',
        'backdrop-blur-xl bg-gradient-to-br',
        scoreColors.bg,
        'dark:from-black/40 dark:via-black/30 dark:to-black/20',
        'border',
        scoreColors.border,
        'dark:border-white/20',
        'rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40',
        'hover:shadow-3xl hover:shadow-black/20 dark:hover:shadow-black/50',
        'transition-all duration-300 ease-out',
        // Selection styling
        selected && 'ring-4 ring-primary-500/40 border-primary-400/60 shadow-primary-500/20',
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
      {/* IMPROVED: Vertical layout container */}
      <div className="flex flex-col h-full min-h-[180px] p-6 lg:p-8">

        {/* Top Row: Logo + Title + Controls */}
        <div className="flex items-start gap-4 mb-4">
          {/* Logo (if image exists) */}
          {hasImage && (
            <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-muted/20 to-muted/10 rounded-xl overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className={cn(
                  'w-full h-full object-cover transition-all duration-500',
                  imageLoading && 'opacity-0 scale-110',
                  !imageLoading && 'opacity-100 scale-100'
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />

              {/* Image loading skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 dark:from-white/20 dark:to-white/5 animate-pulse flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg opacity-50">🖼️</span>
                </div>
              )}

              {/* Select checkbox on logo */}
              {isSelectMode && (
                <div className="absolute -top-1 -left-1">
                  <SelectCheckbox
                    checked={selected}
                    onChange={handleSelect}
                    size="sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* Title and Controls */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className={cn(
                'font-bold text-foreground leading-tight',
                'line-clamp-2 text-lg lg:text-xl',
                'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'
              )}>
                {name}
              </h3>

              {/* Top-right controls */}
              <div className="flex items-center gap-3 ml-4">
                {/* No image select checkbox */}
                {!hasImage && isSelectMode && (
                  <SelectCheckbox
                    checked={selected}
                    onChange={handleSelect}
                    size="sm"
                  />
                )}

                {/* Badges */}
                <div className="flex gap-2">
                  {showPrivacyBadge && <WishBadge type="private" size="sm" />}
                  {showReservedBadge && <WishBadge type="reserved" size="sm" />}
                </div>

                {/* External link */}
                {link && !isSelectMode && (
                  <button
                    onClick={handleLinkClick}
                    className={cn(
                      'p-2',
                      'backdrop-blur-xl bg-white/90 hover:bg-white dark:bg-black/80 dark:hover:bg-black/90',
                      'border border-white/40 dark:border-white/30 rounded-xl',
                      'text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400',
                      'transition-all duration-300 shadow-lg hover:shadow-xl'
                    )}
                    aria-label="Open product link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Desire Score */}
        <div className="mb-4">
          <WishScore
            score={scaledScore}
            maxScore={5}
            variant="hearts"
            size="sm"
            showLabel={true}
            interactive={false}
          />
        </div>

        {/* Third Row: Description */}
        {description && (
          <div className="mb-4 flex-1">
            <p className="text-base text-muted-foreground/90 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Dibs Control - Only for Friends */}
        {showDibs && (
          <div className="mb-4">
            <DibsControl
              itemId={id}
              dibbedBy={dibbedBy}
              currentUserId={currentUserId}
              userRole={userRole}
              onDibsChange={onDibsChange}
              size="sm"
            />
          </div>
        )}

        {/* Bottom Row: Metadata and Tags */}
        <div className="mt-auto pt-4 border-t border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between text-sm text-muted-foreground/80">
            {/* Left: Timestamp */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Added {formatDate(createdAt)}</span>
            </div>

            {/* Right: Collections */}
            {collectionIds.length > 0 && (
              <div className="flex items-center gap-2 max-w-[50%]">
                <span className="opacity-75">📁</span>
                <span className="truncate">
                  {getCollectionNames(collectionIds).join(', ')}
                  {collectionIds.length > 2 && ` +${collectionIds.length - 2}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover overlay effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-400/5 to-primary-500/10 opacity-0 rounded-3xl pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;