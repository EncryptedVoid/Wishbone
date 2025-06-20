import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import WishlistDesktop from './Wishlist.desktop';
import WishlistMobile from './Wishlist.mobile';
import LoadingState from '../../components/ui/LoadingState';

/**
 * Main Wishlist Component - Responsive wishlist that switches between desktop and mobile layouts
 *
 * This component automatically detects the user's device and renders the appropriate
 * layout optimized for that platform. It follows our design system's responsive
 * philosophy of providing truly native experiences for each platform rather than
 * just scaling a single layout.
 *
 * Features:
 * - Automatic device detection with useIsMobile hook
 * - Platform-specific optimizations
 * - Smooth transitions between layouts
 * - Consistent data and functionality across platforms
 * - Professional loading states during detection
 *
 * @param {string} className - Additional CSS classes
 * @param {object} ...props - Additional props passed to the platform component
 */
const Wishlist = React.forwardRef(({
  className,
  ...props
}, ref) => {

  const { isMobile, isLoading } = useIsMobile();

  // Show loading state while detecting device type
  if (isLoading) {
    return (
      <LoadingState
        isLoading={true}
        className="min-h-screen bg-background pt-responsive-3xl pb-responsive-3xl"
        fallback={
          <div className="flex flex-col items-center justify-center py-responsive-3xl">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-responsive-lg" />
            <p className="text-responsive-sm text-muted">Loading your wishlist...</p>
          </div>
        }
      />
    );
  }

  // Render the appropriate platform component
  if (isMobile) {
    return (
      <WishlistMobile
        ref={ref}
        className={className}
        {...props}
      />
    );
  }

  return (
    <WishlistDesktop
      ref={ref}
      className={className}
      {...props}
    />
  );
});

Wishlist.displayName = 'Wishlist';

export default Wishlist;

/*
USAGE EXAMPLES:

// Basic responsive wishlist
<Wishlist />

// With custom styling (applied to both platforms)
<Wishlist className="custom-wishlist-styles" />

// The component automatically:
// - Detects mobile vs desktop devices
// - Renders the appropriate optimized layout
// - Maintains consistent functionality across platforms
// - Provides smooth loading transitions
// - Follows our design system principles

AUTOMATIC PLATFORM FEATURES:

DESKTOP (WishlistDesktop):
- Fixed sidebar navigation
- Multi-column grid layout (1-4 columns)
- Hover interactions and rich tooltips
- Keyboard navigation support
- Advanced filter panel
- Bulk selection with checkboxes
- Context menus and dropdowns

MOBILE (WishlistMobile):
- Collapsible drawer sidebar
- Single-column touch-optimized layout
- Swipe gestures and touch interactions
- Pull-to-refresh functionality
- Floating action buttons
- Mobile-friendly modals and sheets
- Touch-optimized spacing and sizing

SHARED FEATURES:
- Same data and business logic
- Consistent search and filtering
- Mode switching (view, edit, delete, select)
- Theme adaptation (light/dark modes)
- Color theme support
- Professional animations
- Loading and error states
- Empty state handling
*/