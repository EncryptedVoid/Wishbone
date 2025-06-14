import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday, format, isThisYear } from 'date-fns';
import { cn } from '../../../utils/cn';

// Import atoms
import SelectCheckbox from '../atoms/SelectCheckbox';
import WishBadge from '../atoms/WishBadge';
import WishScore from '../atoms/WishScore';
import DibsControl from '../atoms/DibsControl';

/**
 * Enhanced WishCard Component - Addresses all reported issues
 *
 * Fixes:
 * - Dark mode background properly adapts with bg-background
 * - Removed ExternalLink hyperlink logo
 * - Dynamic height based on image presence (no placeholder images)
 * - Generalized timestamps (Today, Yesterday, exact date, or years)
 * - Removed fractions from desire score
 * - Removed collection tags display
 * - Improved design with better styling
 * - Italicized and smaller description text
 * - Better theme-aware styling throughout
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
    created_at: createdAt,
    updated_at: updatedAt
  } = item;

  // State calculations
  const hasImage = imageUrl && !imageError;
  const isSelectMode = mode === 'select';
  const showDibs = userRole === 'friend';
  const showPrivacyBadge = isPrivate && (userRole === 'owner' || userRole === 'friend');
  const showReservedBadge = dibbedBy && userRole === 'friend';

  // Format timestamp intelligently
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();

    if (isToday(date)) {
      return 'Today';
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    // If more than a year ago, just show the year
    if (now.getFullYear() - date.getFullYear() >= 1) {
      return format(date, 'yyyy');
    }

    // Otherwise show the exact date
    return format(date, 'MMM d, yyyy');
  }, []);

  // Remove fractions from desire score
  const displayScore = useMemo(() => {
    return Math.floor(score || 0);
  }, [score]);

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

    // Removed automatic link opening - no more hyperlink behavior
    onClick?.(item);
  }, [isSelectMode, mode, userRole, onSelect, onClick, id, item]);

  // Handle selection in select mode
  const handleSelect = useCallback((e) => {
    e.stopPropagation();
    onSelect?.(id);
  }, [onSelect, id]);

  // Image loading handlers
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoading(false);
  }, []);

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    selected: {
      scale: 1.05,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base card styling with proper theme awareness
        'group relative overflow-hidden cursor-pointer',
        'bg-background border border-border/50 rounded-xl',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'backdrop-blur-sm',

        // Theme-aware hover effects
        'hover:border-primary-300/50 hover:bg-background/80',

        // Selection state
        selected && [
          'ring-2 ring-primary-500/50 border-primary-500/50',
          'bg-primary-50/50 dark:bg-primary-900/20'
        ],

        // Responsive height - dynamic based on image presence
        hasImage ? 'min-h-[320px]' : 'min-h-[160px]',

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
      {/* Image Section - Only render if image exists */}
      {hasImage && (
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

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          {/* Select checkbox - positioned on image */}
          {isSelectMode && (
            <div className="absolute top-3 left-3">
              <SelectCheckbox
                checked={selected}
                onChange={handleSelect}
                size="md"
              />
            </div>
          )}

          {/* Privacy and reserved badges */}
          <div className="absolute top-3 right-3 flex gap-2">
            {showPrivacyBadge && <WishBadge type="private" size="sm" />}
            {showReservedBadge && <WishBadge type="reserved" size="sm" />}
          </div>
        </div>
      )}

      {/* Content Section - Always present, adjusted spacing for no-image cards */}
      <div className={cn(
        'p-4 space-y-3 flex-1 flex flex-col',
        !hasImage && 'pt-6' // Extra padding if no image
      )}>

        {/* Header row - checkbox for no-image cards, title, and badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Select checkbox for no-image cards */}
            {isSelectMode && !hasImage && (
              <div className="pt-1 flex-shrink-0">
                <SelectCheckbox
                  checked={selected}
                  onChange={handleSelect}
                  size="sm"
                />
              </div>
            )}

            {/* Title */}
            <h3 className={cn(
              'font-semibold text-foreground leading-tight',
              'line-clamp-2 group-hover:text-primary-600',
              'transition-colors duration-200',
              hasImage ? 'text-lg' : 'text-base'
            )}>
              {name}
            </h3>
          </div>

          {/* Badges for no-image cards */}
          {!hasImage && (
            <div className="flex gap-1 flex-shrink-0">
              {showPrivacyBadge && <WishBadge type="private" size="sm" />}
              {showReservedBadge && <WishBadge type="reserved" size="sm" />}
            </div>
          )}
        </div>

        {/* Description - italicized and smaller */}
        {description && (
          <p className={cn(
            'text-muted-foreground italic leading-relaxed line-clamp-2',
            hasImage ? 'text-sm' : 'text-xs'
          )}>
            {description}
          </p>
        )}

        {/* Bottom section - Score, timestamp, and actions */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Desire Score - no fractions */}
          <div className="flex items-center gap-2">
            <WishScore
              score={displayScore}
              variant="hearts"
              size="sm"
              interactive={false}
              showLabel={false}
            />
            <span className="text-xs text-muted-foreground font-medium">
              {displayScore}/10
            </span>
          </div>

          {/* Timestamp - generalized format */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatTimestamp(createdAt)}</span>
          </div>
        </div>

        {/* Dibs Control for friends */}
        {showDibs && (
          <div className="pt-2 border-t border-border/30">
            <DibsControl
              item={item}
              currentUserId={currentUserId}
              onDibsChange={onDibsChange}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Link indicator - minimal, bottom-right corner */}
      {link && (
        <div className="absolute bottom-2 right-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full opacity-60"></div>
        </div>
      )}

      {/* Selection overlay */}
      {selected && (
        <div className="absolute inset-0 bg-primary-500/10 pointer-events-none" />
      )}
    </motion.div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;