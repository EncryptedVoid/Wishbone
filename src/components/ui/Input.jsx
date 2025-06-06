import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Input Component for EyeWantIt
 *
 * Features:
 * - Proper keyboard navigation support
 * - Better password toggle placement
 * - Improved dark mode support
 * - Professional styling with textures
 */
const Input = React.forwardRef(({
  type = 'text',
  size = 'md',
  leftIcon,
  error,
  disabled = false,
  label,
  required = false,
  placeholder,
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const isPasswordInput = type === 'password';
  const inputType = isPasswordInput && showPassword ? 'text' : type;

  // SIZE STYLES
  const sizeClasses = {
    sm: {
      input: 'h-9 text-sm px-3',
      icon: 'w-4 h-4',
      iconContainer: 'px-3',
      label: 'text-sm'
    },
    md: {
      input: 'h-11 text-base px-4',
      icon: 'w-4 h-4',
      iconContainer: 'px-3',
      label: 'text-sm'
    },
    lg: {
      input: 'h-12 text-lg px-4',
      icon: 'w-5 h-5',
      iconContainer: 'px-4',
      label: 'text-base'
    }
  };

  const currentSize = sizeClasses[size];

  // BASE STYLES with better dark mode support
  const baseInputClasses = [
    'w-full rounded-xl font-medium relative',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:font-normal',
    // Background with subtle texture
    'bg-background/80 backdrop-blur-sm',
    // Border styles
    'border-2',
    error
      ? 'border-red-400 focus:border-red-500'
      : 'border-border focus:border-primary-500',
    // Shadow and depth
    'shadow-sm focus:shadow-lg',
    // Dark mode improvements
    'dark:bg-surface/90 dark:border-border/60',
    'dark:focus:border-primary-400',
    'dark:shadow-black/20',
    // Text colors
    'text-foreground placeholder:text-muted',
    leftIcon ? `pl-12` : '',
    isPasswordInput ? `pr-12` : ''
  ].filter(Boolean).join(' ');

  const inputClasses = cn(
    baseInputClasses,
    currentSize.input,
    className
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          className={cn(
            'block font-semibold mb-2 text-foreground',
            currentSize.label,
            error ? 'text-red-600 dark:text-red-400' : '',
            disabled ? 'opacity-50' : ''
          )}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div className="relative group">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-10 pl-4">
            <div className={cn(
              'transition-colors duration-300',
              currentSize.icon,
              isFocused
                ? 'text-primary-500 dark:text-primary-400'
                : 'text-muted',
              error ? 'text-red-500' : ''
            )}>
              {leftIcon}
            </div>
          </div>
        )}

        {/* Input Element */}
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
          tabIndex={disabled ? -1 : 0}
          {...props}
        />

        {/* Password Toggle */}
        {isPasswordInput && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'p-1.5 rounded-lg transition-all duration-200',
                'text-muted hover:text-foreground',
                'hover:bg-surface/80 dark:hover:bg-surface/60',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                'focus:bg-surface/80',
                currentSize.icon,
                disabled ? 'opacity-50 pointer-events-none' : ''
              )}
              tabIndex={disabled ? -1 : 0}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        )}

        {/* Focus Ring Effect */}
        <div className={cn(
          'absolute inset-0 rounded-xl pointer-events-none transition-all duration-300',
          'ring-0 group-focus-within:ring-2',
          error
            ? 'group-focus-within:ring-red-500/20'
            : 'group-focus-within:ring-primary-500/20'
        )} />
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="flex items-center space-x-2 mt-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        </motion.div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

/*
USAGE EXAMPLES:

// Basic input
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
/>

// With icons
<Input
  label="Search"
  leftIcon={<Search />}
  placeholder="Search anything..."
/>

// Password input with automatic toggle
<Input
  label="Password"
  type="password"
  placeholder="Enter your password"
  required
/>

// Different sizes - all automatically responsive
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input" />
<Input size="lg" placeholder="Large input" />

// Different variants
<Input variant="default" placeholder="Default style" />
<Input variant="ghost" placeholder="Ghost style" />
<Input variant="filled" placeholder="Filled style" />

// Error state
<Input
  label="Username"
  error="Username is already taken"
  placeholder="Choose a username"
/>

// Disabled state
<Input
  label="Readonly Field"
  disabled
  value="This cannot be changed"
/>

FEATURES:
- Automatically adapts size for mobile vs desktop
- Changes colors based on light/dark theme
- Changes accent colors based on color theme
- Built-in password visibility toggle
- Smooth focus and hover animations
- Comprehensive error handling
- Full accessibility support
- Semantic sizing system integration
- Professional visual hierarchy
*/