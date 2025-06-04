import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Lock, Eye, MoreVertical, Edit, Trash2, Heart, Sparkles, Gift } from 'lucide-react';
import { cn } from '../../utils/cn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import TagChip, { TagGroup } from './TagChip';
import DesireScoreDisplay from './DesireScoreDisplay';

/**
 * Enhanced WishCard Component - Professional wish item card with advanced visual design
 *
 * Enhanced Features:
 * - Advanced multi-layer glassmorphism with dynamic shadows
 * - Sophisticated image loading with skeleton animations
 * - Enhanced dibs state with particle effects and visual storytelling
 * - Improved micro-interactions and hover feedback systems
 * - Dynamic color psychology based on desire scores
 * - Advanced animation orchestration for all interactive elements
 * - Enhanced visual hierarchy with improved spacing and typography
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
  const [isHovered, setIsHovered] = useState(false);

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

  // Enhanced color psychology based on desire score
  const getDesireColorTheme = (score) => {
    if (score <= 3) return {
      gradient: 'from-slate-500/20 to-slate-600/30',
      accent: 'slate-500',
      glow: 'slate-500/20'
    };
    if (score <= 6) return {
      gradient: 'from-amber-500/20 to-orange-600/30',
      accent: 'amber-500',
      glow: 'amber-500/20'
    };
    if (score <= 8) return {
      gradient: 'from-emerald-500/20 to-green-600/30',
      accent: 'emerald-500',
      glow: 'emerald-500/20'
    };
    return {
      gradient: 'from-rose-500/20 to-pink-600/30',
      accent: 'rose-500',
      glow: 'rose-500/20'
    };
  };

  const colorTheme = getDesireColorTheme(desireScore);

  // Handle card click with enhanced feedback
  const handleCardClick = () => {
    if (mode === 'select') {
      onSelect?.(id);
      return;
    }

    if (isDibbed) {
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

  // Enhanced image handlers
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // ENHANCED MOTION VARIANTS
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: 5
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { duration: 0.3 }
    },
    hover: !isDibbed && mode === 'view' ? {
      y: -8,
      scale: 1.03,
      rotateX: -2,
      rotateY: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.4
      }
    } : {},
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const imageVariants = {
    loading: {
      opacity: 0,
      scale: 1.1
    },
    loaded: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 5 },
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

  const dibsOverlayVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      backdrop: 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      backdrop: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const dibsIconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    }
  };

  const tooltipVariants = {
    initial: {
      opacity: 0,
      y: -15,
      scale: 0.9,
      rotateX: -10
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.9,
      rotateX: -10,
      transition: { duration: 0.2 }
    }
  };

  // Dynamic card styling based on state
  const cardClasses = cn(
    'group relative overflow-hidden cursor-pointer',
    // Enhanced glassmorphism with multi-layer effects
    'backdrop-blur-xl bg-gradient-to-br from-background/90 via-background/95 to-surface/80',
    'border border-border/40 shadow-xl',
    // Dynamic shadow based on hover state
    isHovered && !isDibbed && 'shadow-2xl shadow-primary-500/10',
    // Dibs state styling with sophisticated visual treatment
    isDibbed && [
      'border-dashed border-2 border-primary-300/60',
      'bg-gradient-to-br from-surface/60 via-background/70 to-surface/60',
      'backdrop-blur-md shadow-lg shadow-primary-500/20'
    ].join(' '),
    // Selection state with enhanced visual feedback
    mode === 'select' && selected && [
      'ring-2 ring-primary-500 ring-offset-2 ring-offset-background',
      'shadow-lg shadow-primary-500/25'
    ].join(' '),
    // Interactive states
    mode === 'view' && !isDibbed && 'hover:shadow-2xl transition-all duration-500',
    mode === 'select' && 'hover:ring-2 hover:ring-primary-300/50',
    className
  );

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={!isDibbed ? "hover" : undefined}
      whileTap={!isDibbed ? "tap" : undefined}
      className={cardClasses}
      onMouseEnter={() => {
        setIsHovered(true);
        if (isDibbed) setShowDibsTooltip(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowDibsTooltip(false);
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...props}
    >
      {/* Enhanced Dibs Tooltip with sophisticated styling */}
      <AnimatePresence>
        {showDibsTooltip && isDibbed && (
          <motion.div
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'absolute -top-4 left-1/2 transform -translate-x-1/2 -translate-y-full z-50',
              'bg-gradient-to-r from-background/95 via-background/98 to-background/95',
              'backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl',
              'px-4 py-3 text-center min-w-max max-w-xs',
              'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-xl before:pointer-events-none'
            )}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-1"
            >
              <Gift className="w-4 h-4 text-primary-600" />
              <p className="text-responsive-sm font-semibold text-foreground">
                Gift Reserved
              </p>
            </motion.div>
            <p className="text-responsive-xs text-muted">
              {dibbedBy} is planning to get this for you
            </p>

            {/* Enhanced tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-background/95" />
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-4 border-transparent border-t-border/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Card Content */}
      <Card
        variant="default"
        size="sm"
        className={cn(
          'h-full relative overflow-hidden border-0 shadow-none',
          // Advanced glassmorphism layers
          'bg-gradient-to-br from-background/95 via-surface/90 to-background/85',
          'backdrop-blur-md',
          // Subtle texture overlays
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/10 before:pointer-events-none',
          'after:absolute after:inset-0 after:bg-gradient-to-t after:from-transparent after:to-primary-500/5 after:pointer-events-none'
        )}
        onClick={handleCardClick}
      >
        {/* Enhanced Image Section */}
        <div className={cn(
          'relative aspect-[4/3] rounded-xl overflow-hidden mb-responsive-md',
          'bg-gradient-to-br from-surface/60 to-background/40',
          'backdrop-blur-sm border border-border/30',
          // Dynamic glow effect based on desire score
          isHovered && `shadow-lg shadow-${colorTheme.accent}/20`
        )}>
          {/* Skeleton Loading Animation */}
          {!imageLoaded && !imageError && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-surface/80 via-background/60 to-surface/80"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
          )}

          {/* Enhanced Image with loading states */}
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
              style={{
                filter: isDibbed ? 'grayscale(30%) brightness(70%)' : 'none'
              }}
            />
          ) : (
            /* Enhanced fallback with animated heart */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface/80 to-background/60">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-12 h-12 text-muted" />
              </motion.div>
            </div>
          )}

          {/* Enhanced Dibs Overlay with particle effects */}
          {isDibbed && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/90 to-surface/85 backdrop-blur-sm flex items-center justify-center"
              variants={dibsOverlayVariants}
              initial="initial"
              animate="animate"
            >
              <div className="text-center relative">
                {/* Floating particles effect */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary-500/40 rounded-full"
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.sin(i) * 10, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      left: `${20 + i * 10}%`,
                      top: '20%'
                    }}
                  />
                ))}

                <motion.div
                  variants={dibsIconVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Lock className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                </motion.div>
                <motion.p
                  className="text-responsive-sm text-primary-600 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Gift Reserved
                </motion.p>
                <motion.p
                  className="text-responsive-xs text-muted/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  by {dibbedBy}
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Enhanced Privacy indicator */}
          {isPrivate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-3 left-3"
            >
              <Badge
                variant="secondary"
                size="sm"
                className={cn(
                  'bg-background/95 backdrop-blur-md border border-border/60',
                  'shadow-lg hover:shadow-xl transition-all duration-300'
                )}
              >
                <Eye className="w-3 h-3 mr-1" />
                Private
              </Badge>
            </motion.div>
          )}

          {/* Enhanced External link button */}
          {!isDibbed && (
            <motion.button
              onClick={handleLinkClick}
              className={cn(
                'absolute top-3 right-3 p-2.5 rounded-xl',
                'bg-background/90 backdrop-blur-md border border-border/60',
                'text-muted hover:text-foreground hover:bg-background/95',
                'shadow-lg hover:shadow-xl transition-all duration-300',
                'opacity-0 group-hover:opacity-100'
              )}
              whileHover={{
                scale: 1.15,
                y: -3,
                rotate: 5,
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
              }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Open product link"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          )}

          {/* Enhanced Action menu */}
          {(mode === 'edit' || mode === 'delete') && (
            <div className="absolute top-3 right-3">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={cn(
                  'p-2.5 rounded-xl',
                  'bg-background/90 backdrop-blur-md border border-border/60',
                  'text-muted hover:text-foreground hover:bg-background/95',
                  'shadow-lg hover:shadow-xl transition-all duration-300'
                )}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MoreVertical className="w-4 h-4" />
              </motion.button>

              {/* Enhanced Action menu dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={cn(
                      'absolute top-full right-0 mt-2 py-2',
                      'bg-background/95 backdrop-blur-xl border border-border/60 rounded-xl shadow-2xl',
                      'min-w-[150px] z-10',
                      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-xl before:pointer-events-none'
                    )}
                  >
                    {mode === 'edit' && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          onEdit?.(item);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-foreground hover:bg-primary-50 transition-all duration-200"
                        whileHover={{ x: 6, backgroundColor: 'rgba(var(--color-primary-50), 0.8)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Edit className="w-4 h-4 mr-3 text-emerald-500" />
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
                        className="w-full flex items-center px-4 py-3 text-sm text-error hover:bg-error/10 transition-all duration-200"
                        whileHover={{ x: 6, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
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

          {/* Enhanced Selection indicator */}
          {mode === 'select' && (
            <motion.div
              className="absolute top-3 left-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                  'backdrop-blur-md shadow-lg transition-all duration-300',
                  selected
                    ? 'bg-primary-500 border-primary-500 shadow-primary-500/30'
                    : 'bg-background/80 border-border hover:border-primary-400'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="w-3 h-3 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Content Section */}
        <motion.div
          className="space-y-responsive-sm"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Enhanced Title */}
          <motion.h3
            className={cn(
              'text-responsive-lg font-bold leading-tight text-center',
              'bg-gradient-to-r from-foreground via-foreground to-foreground bg-clip-text',
              isDibbed ? 'text-muted' : 'text-foreground'
            )}
            variants={itemVariants}
          >
            {name}
          </motion.h3>

          {/* Enhanced Desire Score with contextual styling */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <div className={cn(
              'p-2 rounded-lg transition-all duration-300',
              `bg-gradient-to-r ${colorTheme.gradient}`,
              isHovered && `shadow-lg shadow-${colorTheme.glow}`
            )}>
              <DesireScoreDisplay
                score={desireScore}
                variant="hearts"
                size="sm"
                className={isDibbed ? 'opacity-60' : 'opacity-100'}
              />
            </div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            className={cn(
              'text-responsive-sm leading-relaxed line-clamp-2 italic text-center px-2',
              isDibbed ? 'text-muted/70' : 'text-muted'
            )}
            variants={itemVariants}
          >
            {description}
          </motion.p>

          {/* Enhanced Category Tags */}
          {categoryTags.length > 0 && (
            <motion.div variants={itemVariants}>
              <TagGroup className="flex-wrap justify-center">
                {categoryTags.slice(0, 3).map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05, y: -1 }}
                  >
                    <TagChip
                      variant="primary"
                      size="sm"
                      className={cn(
                        'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
                        'shadow-md hover:shadow-lg transition-all duration-300',
                        'border border-primary-400/20',
                        isDibbed && 'opacity-60 grayscale'
                      )}
                    >
                      {tag}
                    </TagChip>
                  </motion.div>
                ))}
                {categoryTags.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 400,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <TagChip
                      variant="outline"
                      size="sm"
                      className={cn(
                        'border-primary-500 text-primary-600 hover:bg-primary-50',
                        'transition-all duration-200',
                        isDibbed && 'opacity-60'
                      )}
                    >
                      +{categoryTags.length - 3}
                    </TagChip>
                  </motion.div>
                )}
              </TagGroup>
            </motion.div>
          )}

          {/* Sparkle effect for high desire items */}
          {desireScore >= 9 && !isDibbed && (
            <motion.div
              className="absolute top-4 right-4 pointer-events-none"
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;