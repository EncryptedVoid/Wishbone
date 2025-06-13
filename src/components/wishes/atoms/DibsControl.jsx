import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';
import DibsButton from './DibsButton';
import DibsIndicator from './DibsIndicator';

/**
 * DibsControl Component - Smart wrapper that shows appropriate dibs UI
 *
 * Features:
 * - Automatically switches between button and indicator based on context
 * - Handles different user roles (owner, friend, visitor)
 * - Manages dibs state transitions
 * - Provides unified API for dibs functionality
 * - Only visible to friends (hidden from item owners)
 *
 * @param {string} itemId - ID of the wish item
 * @param {string|null} dibbedBy - User ID who has dibbed this item
 * @param {string} currentUserId - Current user's ID
 * @param {string} userRole - User's role: 'owner' | 'friend' | 'visitor'
 * @param {function} onDibsChange - Callback when dibs status changes
 * @param {string} mode - Display mode: 'button' | 'indicator' | 'auto'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} disabled - Whether control is disabled
 * @param {string} className - Additional CSS classes
 */
const DibsControl = React.forwardRef(({
  itemId,
  dibbedBy = null,
  currentUserId,
  userRole = 'friend',
  onDibsChange,
  mode = 'auto',
  size = 'md',
  disabled = false,
  className,
  ...props
}, ref) => {

  // Don't show dibs controls to item owners
  if (userRole === 'owner') {
    return null;
  }

  // Don't show to visitors (read-only users)
  if (userRole === 'visitor') {
    return (
      <DibsIndicator
        dibbedBy={dibbedBy}
        currentUserId={currentUserId}
        variant="minimal"
        size={size}
        showLabel={false}
        className={className}
      />
    );
  }

  // Determine current state
  const isAvailable = !dibbedBy;
  const isReservedByMe = dibbedBy === currentUserId;
  const isReservedByOther = dibbedBy && dibbedBy !== currentUserId;

  // Auto mode logic
  const getDisplayMode = () => {
    if (mode !== 'auto') return mode;

    // Show button for available items or items reserved by current user
    if (isAvailable || isReservedByMe) {
      return 'button';
    }

    // Show indicator for items reserved by others
    return 'indicator';
  };

  const displayMode = getDisplayMode();

  // Animation variants for mode transitions
  const containerVariants = {
    initial: { opacity: 0, y: 5 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'flex items-center justify-center',
        className
      )}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      <AnimatePresence mode="wait">
        {displayMode === 'button' ? (
          <motion.div
            key="dibs-button"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DibsButton
              itemId={itemId}
              dibbedBy={dibbedBy}
              currentUserId={currentUserId}
              onDibsChange={onDibsChange}
              disabled={disabled}
              size={size}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dibs-indicator"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <DibsIndicator
              dibbedBy={dibbedBy}
              currentUserId={currentUserId}
              variant="subtle"
              size={size}
              showLabel={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

DibsControl.displayName = 'DibsControl';

export default DibsControl;