import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * SelectCheckbox Component - Checkbox for selecting items in bulk operations
 *
 * Features:
 * - Smooth check/uncheck animations
 * - Accessible keyboard navigation
 * - Theme-aware styling with glassmorphism
 * - Click event isolation (stops propagation)
 * - Hover and focus states
 *
 * @param {boolean} checked - Whether checkbox is checked
 * @param {function} onChange - Change handler
 * @param {boolean} disabled - Whether checkbox is disabled
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 */
const SelectCheckbox = React.forwardRef(({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className,
  ...props
}, ref) => {

  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const currentSize = sizeClasses[size];
  const currentIconSize = iconSizes[size];

  // Handle click with event isolation
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  // Handle keyboard interaction
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleClick(e);
    }
  };

  // Animation variants
  const checkboxVariants = {
    unchecked: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgb(209, 213, 219)',
      scale: 1
    },
    checked: {
      backgroundColor: 'rgb(59, 130, 246)',
      borderColor: 'rgb(59, 130, 246)',
      scale: 1
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const checkmarkVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -90
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 20,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      rotate: 90,
      transition: { duration: 0.15 }
    }
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles
        'relative flex items-center justify-center',
        'border-2 rounded',
        'cursor-pointer focus:outline-none',
        'transition-all duration-200',

        // Glassmorphism effect
        'backdrop-blur-sm shadow-sm',
        'hover:shadow-md',

        // Focus styles
        'focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2',
        'focus:ring-offset-white/50',

        // Disabled styles
        disabled && 'opacity-50 cursor-not-allowed',

        // Size
        currentSize,
        className
      )}
      variants={checkboxVariants}
      initial="unchecked"
      animate={checked ? "checked" : "unchecked"}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      {...props}
    >
      {/* Checkmark */}
      <AnimatePresence mode="wait">
        {checked && (
          <motion.div
            variants={checkmarkVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-center"
          >
            <Check
              className={cn(
                currentIconSize,
                'text-white stroke-[3]'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded bg-primary-500/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={checked ? {
          scale: [0, 1.2, 0],
          opacity: [0, 0.3, 0]
        } : {}}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
});

SelectCheckbox.displayName = 'SelectCheckbox';

export default SelectCheckbox;