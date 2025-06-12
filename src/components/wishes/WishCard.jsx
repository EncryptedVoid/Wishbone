import React, { useState, useCallback } from 'react';
import { ExternalLink, Lock, Eye, Heart, Crown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { claimItem, unclaimItem } from '../../lib/wishlistService';

const WishCard = React.memo(({
  item,
  mode = 'view',
  selected = false,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  className,
  user // Current user for dibs functionality
}) => {
  const [imageError, setImageError] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Map service data to component expectations
  const {
    id,
    name,
    link,
    image_url: imageUrl,
    score: desireScore,
    is_private: isPrivate,
    dibbed_by: dibbedBy,
    dibbed_at: dibbedAt,
    description,
    collection_ids: collectionIds = [],
    // Category tags might be in metadata
    metadata = {}
  } = item;

  const categoryTags = metadata?.categoryTags || [];
  const isDibbed = Boolean(dibbedBy);
  const isMyItem = user && item.user_id === user.id;
  const canClaim = !isDibbed && !isMyItem;
  const canUnclaim = isDibbed && (dibbedBy === user?.id || isMyItem);

  // Minimal handlers
  const handleCardClick = useCallback(() => {
    if (mode === 'select') {
      onSelect?.(id);
      return;
    }
    if (mode === 'view' && onClick) {
      onClick(item);
    }
  }, [mode, onSelect, id, onClick, item]);

  const handleLinkClick = useCallback((e) => {
    e.stopPropagation();
    if (link) {
      window.open(link, '_blank', 'noopener noreferrer');
    }
  }, [link]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Dibs/Claim functionality
  const handleClaimToggle = useCallback(async (e) => {
    e.stopPropagation();

    if (claiming) return;

    try {
      setClaiming(true);

      if (isDibbed && canUnclaim) {
        await unclaimItem(id);
        // Update would be handled by parent component refresh
      } else if (canClaim) {
        await claimItem(id);
        // Update would be handled by parent component refresh
      }

    } catch (err) {
      console.error('Error toggling claim:', err);
      alert(err.message || 'Failed to update claim status');
    } finally {
      setClaiming(false);
    }
  }, [id, isDibbed, canClaim, canUnclaim, claiming]);

  // Simple desire score display
  const getDesireColor = (score) => {
    if (score <= 3) return 'bg-gray-400';
    if (score <= 6) return 'bg-yellow-400';
    if (score <= 8) return 'bg-green-400';
    return 'bg-red-400';
  };

  // Format dibs information
  const getDibbedByName = (dibbedBy) => {
    // If you have user data available, you could map user IDs to names
    // For now, just show the ID or a placeholder
    return dibbedBy === user?.id ? 'You' : 'Someone';
  };

  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-lg overflow-hidden',
        'hover:shadow-lg transition-shadow duration-200',
        'cursor-pointer',
        mode === 'select' && selected && 'ring-2 ring-blue-500',
        isDibbed && 'opacity-75 border-dashed',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">🎁</span>
          </div>
        )}

        {/* Dibs Overlay */}
        {isDibbed && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm font-medium">Reserved</p>
              <p className="text-xs">by {getDibbedByName(dibbedBy)}</p>
              {dibbedAt && (
                <p className="text-xs opacity-75">
                  {new Date(dibbedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Privacy Badge */}
        {isPrivate && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-black bg-opacity-75 text-white">
              <Eye className="w-3 h-3 mr-1" />
              Private
            </span>
          </div>
        )}

        {/* Owner Badge */}
        {isMyItem && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-500 bg-opacity-90 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Yours
            </span>
          </div>
        )}

        {/* Link Button */}
        {link && (
          <button
            onClick={handleLinkClick}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-75 text-white rounded hover:bg-opacity-90 transition-colors"
            aria-label="Open link"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        )}

        {/* Claim/Unclaim Button */}
        {(canClaim || canUnclaim) && (
          <button
            onClick={handleClaimToggle}
            disabled={claiming}
            className={cn(
              'absolute bottom-2 right-2 p-2 rounded text-white transition-colors',
              canClaim && 'bg-green-500 hover:bg-green-600',
              canUnclaim && 'bg-red-500 hover:bg-red-600',
              claiming && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={canClaim ? 'Claim item' : 'Remove claim'}
          >
            <Heart className={cn('w-4 h-4', isDibbed && 'fill-current')} />
          </button>
        )}

        {/* Selection Checkbox */}
        {mode === 'select' && (
          <div className="absolute top-2 left-2">
            <div className={cn(
              'w-5 h-5 rounded border-2 flex items-center justify-center',
              selected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
            )}>
              {selected && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>

        {/* Desire Score */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', getDesireColor(desireScore))}
              style={{ width: `${(desireScore / 10) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{desireScore}/10</span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {categoryTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categoryTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
              >
                {tag}
              </span>
            ))}
            {categoryTags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{categoryTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Collections */}
        {collectionIds.length > 0 && (
          <div className="text-xs text-gray-500">
            In {collectionIds.length} collection{collectionIds.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Action Buttons */}
        {(mode === 'edit' || mode === 'delete') && (
          <div className="flex gap-2 pt-2">
            {mode === 'edit' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(item);
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              >
                Edit
              </button>
            )}
            {mode === 'delete' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(item);
                }}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-gray-400 flex justify-between">
          <span>Added {new Date(item.created_at).toLocaleDateString()}</span>
          {item.updated_at !== item.created_at && (
            <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
});

WishCard.displayName = 'WishCard';

export default WishCard;