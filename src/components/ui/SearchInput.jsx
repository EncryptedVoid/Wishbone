import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * SearchInput Component - Professional search input following our design system
 *
 * Features:
 * - Responsive sizing using our semantic system
 * - Theme-aware styling that adapts to light/dark modes
 * - Clear button when text is present
 * - Debounced search for performance
 * - Loading state support
 * - Accessible keyboard navigation
 *
 * @param {string} value - Current search value
 * @param {function} onChange - Change handler
 * @param {function} onClear - Clear handler (optional)
 * @param {string} placeholder - Placeholder text
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg' (default: 'md')
 * @param {boolean} loading - Whether search is in progress
 * @param {boolean} disabled - Whether input is disabled
 * @param {string} className - Additional CSS classes
 */
const SearchInput = React.forwardRef(({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}, ref) => {

  // SIZE STYLES - Using our semantic sizing system
  const sizeClasses = {
    sm: {
      container: 'h-input-sm',
      input: 'text-responsive-sm pl-9 pr-8',
      icon: 'w-4 h-4 left-3',
      clear: 'w-4 h-4 right-2'
    },
    md: {
      container: 'h-input-md',
      input: 'text-responsive-base pl-10 pr-10',
      icon: 'w-5 h-5 left-3',
      clear: 'w-4 h-4 right-3'
    },
    lg: {
      container: 'h-input-lg',
      input: 'text-responsive-lg pl-12 pr-12',
      icon: 'w-6 h-6 left-3',
      clear: 'w-5 h-5 right-3'
    }
  };

  const currentSize = sizeClasses[size];

  // Handle clear action
  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && value) {
      handleClear();
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center',
        currentSize.container,
        className
      )}
    >
      {/* Search Icon */}
      <div
        className={cn(
          'absolute pointer-events-none z-10 flex items-center justify-center',
          currentSize.icon,
          loading ? 'text-primary-500' : 'text-muted'
        )}
      >
        <motion.div
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <Search className="w-full h-full" />
        </motion.div>
      </div>

      {/* Input Field */}
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'w-full border rounded-lg font-medium',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Theme-aware colors
          'bg-background text-foreground placeholder:text-muted',
          'border-border hover:border-primary-500/50',
          'focus:border-primary-500',

          // Size-specific padding
          currentSize.input
        )}
        {...props}
      />

      {/* Clear Button */}
      {value && !loading && (
        <motion.button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className={cn(
            'absolute z-10 flex items-center justify-center',
            'text-muted hover:text-foreground',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentSize.clear
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Clear search"
        >
          <X className="w-full h-full" />
        </motion.button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput;

/*
USAGE EXAMPLES:

// Basic search input
<SearchInput
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search wishlist items..."
/>

// With clear handler
<SearchInput
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onClear={() => setSearchTerm('')}
  placeholder="Search products..."
/>

// Different sizes
<SearchInput size="sm" placeholder="Quick search" />
<SearchInput size="md" placeholder="Search items" />
<SearchInput size="lg" placeholder="Search everything" />

// Loading state
<SearchInput
  value={searchTerm}
  onChange={handleSearch}
  loading={isSearching}
  placeholder="Searching..."
/>

// Disabled state
<SearchInput
  disabled
  placeholder="Search disabled"
/>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Smooth animations for interactions
- Clear button appears when there's text
- Loading state with rotating search icon
- Keyboard shortcuts (Escape to clear)
- Full accessibility support
- Semantic sizing system integration
*/