import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  MoreHorizontal,
  Edit3,
  Trash2,
  Sparkles,
  EyeOff,
  Eye,
  Lock
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import CollectionCount from '../atoms/CollectionCount';

/**
 * CollectionItem Component - FINAL WORKING VERSION with Portal
 * Uses React Portal to render dropdown outside all DOM stacking contexts
 */
const CollectionItem = React.forwardRef(({
  collection,
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  onTogglePrivacy,
  disabled = false,
  variant = 'default',
  className,
  ...props
}, ref) => {

  const [showActions, setShowActions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Portal container - renders at document.body level
  const portalContainer = typeof document !== 'undefined' ? document.body : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActions &&
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        console.log('🔧 Clicking outside dropdown, closing');
        setShowActions(false);
      }
    };

    if (showActions) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showActions]);

  // Calculate position when opening - WITH BETTER DEBUGGING
  useEffect(() => {
    if (showActions && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 176; // min-w-44 = 176px
      const dropdownHeight = 120; // estimated

      console.log('🔧 Button rect:', buttonRect);
      console.log('🔧 Window size:', { width: window.innerWidth, height: window.innerHeight });

      // Position dropdown to the right of button
      let left = buttonRect.right + 8; // 8px to the right of button
      let top = buttonRect.top; // Align with top of button

      // If dropdown would go off right edge, show on left side
      if (left + dropdownWidth > window.innerWidth) {
        left = buttonRect.left - dropdownWidth - 8;
        console.log('🔧 Dropdown would go off screen, moving to left side');
      }

      // If dropdown would go off bottom, move up
      if (top + dropdownHeight > window.innerHeight) {
        top = buttonRect.bottom - dropdownHeight;
        console.log('🔧 Dropdown would go off bottom, moving up');
      }

      console.log('🔧 Final dropdown position:', { top, left });
      setDropdownPosition({ top, left });
    }
  }, [showActions]);

  // Handle button click
  const handleActionsClick = (e) => {
    console.log('🔧 BUTTON CLICKED!');
    e.preventDefault();
    e.stopPropagation();

    setShowActions(prev => !prev);
  };

  // Handle action clicks
  const handleActionClick = async (action, e) => {
    console.log('🔧 ACTION CLICKED:', action);
    e.stopPropagation();
    setShowActions(false);

    try {
      switch (action) {
        case 'edit':
          console.log('🔧 Calling onEdit with collection:', collection);
          onEdit?.(collection);
          break;
        case 'privacy':
          console.log('🔧 Toggling privacy for collection:', collection.id);
          if (onTogglePrivacy) {
            await onTogglePrivacy(collection.id, !collection.is_private);
          }
          break;
        case 'delete':
          console.log('🔧 Delete confirmation for collection:', collection.name);
          const confirmMessage = `Are you sure you want to delete "${collection.name}"?\n\n` +
                                `This will remove the collection and unassign all ${itemCount} items from it. ` +
                                `This action cannot be undone.`;

          if (window.confirm(confirmMessage)) {
            console.log('🔧 User confirmed delete, calling onDelete with collection:', collection);
            // Try calling with both collection object and just ID to see which works
            await onDelete?.(collection);
          } else {
            console.log('🔧 User cancelled delete');
          }
          break;
      }
    } catch (error) {
      console.error(`❌ Error performing ${action} action:`, error);
    }
  };

  // Handle main collection click
  const handleCollectionClick = () => {
    if (disabled) return;
    onClick?.(collection.id);
  };

  // Destructure collection data
  const {
    id,
    name,
    description,
    emoji,
    icon,
    item_count: itemCount = 0,
    color = 'blue',
    is_default: isDefault = false,
    is_private: isPrivate = false
  } = collection;

  const isHighActivity = itemCount >= 10;
  const isEmpty = itemCount === 0;
  const displayIcon = emoji || icon || '📁';
  const IconComponent = !emoji && !icon ? (isActive ? FolderOpen : Folder) : null;

  // Get color classes
  const getColorClasses = () => {
    const colorMap = {
      blue: { bg: 'bg-blue-50/80', border: 'border-blue-300/60', text: 'text-blue-700', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-50/80', border: 'border-green-300/60', text: 'text-green-700', accent: 'bg-green-500' },
      purple: { bg: 'bg-purple-50/80', border: 'border-purple-300/60', text: 'text-purple-700', accent: 'bg-purple-500' },
      pink: { bg: 'bg-pink-50/80', border: 'border-pink-300/60', text: 'text-pink-700', accent: 'bg-pink-500' },
      yellow: { bg: 'bg-yellow-50/80', border: 'border-yellow-300/60', text: 'text-yellow-700', accent: 'bg-yellow-500' },
      red: { bg: 'bg-red-50/80', border: 'border-red-300/60', text: 'text-red-700', accent: 'bg-red-500' },
      gray: { bg: 'bg-gray-50/80', border: 'border-gray-300/60', text: 'text-gray-700', accent: 'bg-gray-500' },
      indigo: { bg: 'bg-indigo-50/80', border: 'border-indigo-300/60', text: 'text-indigo-700', accent: 'bg-indigo-500' }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses();

  // Portal dropdown component
  const DropdownPortal = () => {
    if (!showActions || !portalContainer) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-44 py-2 text-gray-900 dark:text-gray-100"
        style={{
          position: 'fixed',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          zIndex: 2147483647, // Maximum z-index value
          pointerEvents: 'auto'
        }}
      >

        {/* Edit Action */}
        {onEdit && (
          <button
            onClick={(e) => handleActionClick('edit', e)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Collection
          </button>
        )}

        {/* Privacy Toggle Action */}
        {onTogglePrivacy && (
          <button
            onClick={(e) => handleActionClick('privacy', e)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition-colors"
          >
            {isPrivate ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Make {isPrivate ? 'Public' : 'Private'}
          </button>
        )}

        {/* Separator before delete */}
        {(onEdit || onTogglePrivacy) && onDelete && (
          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
        )}

        {/* Delete Action */}
        {onDelete && (
          <button
            onClick={(e) => handleActionClick('delete', e)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Collection
          </button>
        )}
      </div>,
      portalContainer
    );
  };

  return (
    <>
      <div
        ref={ref}
        className={cn(
          'group relative w-full flex items-center p-3 rounded-xl cursor-pointer',
          'transition-all duration-300 backdrop-blur-sm border-2',

          // Active state
          isActive && [
            colors.bg,
            colors.border,
            'shadow-lg shadow-black/10',
            colors.text,
            'font-semibold',
            'before:absolute before:left-2 before:top-1/2 before:transform before:-translate-y-1/2',
            'before:w-2 before:h-2 before:rounded-full before:shadow-sm',
            `before:${colors.accent.replace('bg-', 'bg-')}`
          ],

          // Inactive state
          !isActive && [
            'text-foreground hover:bg-surface/80 border-transparent',
            'hover:border-border/50 hover:shadow-md hover:shadow-black/5',
            'hover:before:absolute hover:before:left-2 hover:before:top-1/2 hover:before:transform hover:before:-translate-y-1/2',
            'hover:before:w-1.5 hover:before:h-1.5 hover:before:bg-muted-foreground/40 hover:before:rounded-full',
            'hover:before:transition-all hover:before:duration-300'
          ],

          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          isEmpty && !isActive && 'opacity-75',
          className
        )}
        onClick={handleCollectionClick}
        {...props}
      >
        {/* Left side: Icon and Text */}
        <div className={cn('flex items-center gap-3 min-w-0 flex-1', isActive && 'pl-4')}>
          {/* Collection Icon */}
          <div className="flex-shrink-0 relative">
            {IconComponent ? (
              <IconComponent className={cn(
                'w-5 h-5 transition-colors duration-300',
                isActive ? colors.text : 'text-muted-foreground group-hover:text-primary-500'
              )} />
            ) : (
              <span className={cn(
                'text-lg select-none transition-all duration-300',
                isActive && 'filter brightness-110 saturate-110'
              )}>
                {displayIcon}
              </span>
            )}

            {/* High activity indicator */}
            {isHighActivity && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3 h-3 text-amber-400 drop-shadow-sm" />
              </div>
            )}

            {/* Private indicator */}
            {isPrivate && (
              <div className="absolute -bottom-1 -right-1">
                <Lock className="w-2.5 h-2.5 text-gray-500 bg-background rounded-full p-0.5" />
              </div>
            )}
          </div>

          {/* Collection Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                'font-medium text-sm truncate transition-all duration-300',
                isActive ? 'text-current font-semibold' : 'text-foreground group-hover:text-primary-600'
              )}>
                {name}
              </h3>

              {/* Private badge */}
              {isPrivate && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  Private
                </span>
              )}

              {/* Default badge */}
              {isDefault && (
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  Default
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Count and Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Item Count */}
          <CollectionCount
            count={itemCount}
            variant={isActive ? 'active' : 'default'}
            size="sm"
            animated={true}
            className={cn(
              isActive && colors.bg.replace('/80', '/20') + ' ' + colors.text + ' ' + colors.border.replace('/60', '/30')
            )}
          />

          {/* Actions Button - CLEAN VERSION */}
          {!isDefault && (onEdit || onDelete || onTogglePrivacy) && (
            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={handleActionsClick}
                className={cn(
                  'p-1.5 rounded-md transition-all duration-200',
                  'hover:bg-muted text-muted-foreground hover:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                  'border border-transparent hover:border-border/50',
                  'opacity-60 hover:opacity-100',
                  (isActive || showActions) && 'opacity-100 bg-muted/50',
                  showActions && 'bg-muted border-border/50'
                )}
                title="Collection options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Portal Dropdown - Renders at document.body level */}
      <DropdownPortal />
    </>
  );
});

CollectionItem.displayName = 'CollectionItem';

export default CollectionItem;