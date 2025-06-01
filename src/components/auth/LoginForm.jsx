import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, Shield, LogIn } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '../../utils/cn';

/**
 * EyeWantIt LoginForm Component
 *
 * Compact, professional login form with proper keyboard navigation
 * and improved dark mode support
 */
function LoginForm({ className }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [timeoutRemaining, setTimeoutRemaining] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle retry timeout
  useEffect(() => {
    let interval;
    if (timeoutRemaining > 0) {
      interval = setInterval(() => {
        setTimeoutRemaining(prev => {
          if (prev <= 1) {
            setRetryCount(0);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeoutRemaining]);

  // Validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;

      case 'password':
        if (!value) {
          errors.password = 'Password is required';
        } else if (value.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        } else {
          delete errors.password;
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (error) setError('');
    if (formData[field] !== '') {
      validateField(field, value);
    }
  };

  const handleInputBlur = (field) => (e) => {
    validateField(field, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);

    if (!emailValid || !passwordValid) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account first.');
        } else {
          setError(authError.message);
        }

        setRetryCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setError('Too many failed attempts. Please wait before trying again.');
            setTimeoutRemaining(30);
          }
          return newCount;
        });
      } else {
        setRetryCount(0);
        setError('');
        setValidationErrors({});
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setValidationErrors({ email: 'Please enter your email address first' });
      return;
    }

    if (validationErrors.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        setError(error.message);
      } else {
        setError('');
        alert('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  const isFormValid = formData.email &&
                     formData.password &&
                     Object.keys(validationErrors).length === 0;

  const isDisabled = loading || retryCount >= 3 || timeoutRemaining > 0;

  return (
    <motion.div
      className={cn('w-full max-w-sm mx-auto', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mb-4 p-3 rounded-xl border flex items-start space-x-3',
              'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800/50'
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {retryCount >= 3 ? (
                <Shield className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </p>
              {timeoutRemaining > 0 && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-300">
                  Try again in {timeoutRemaining} seconds
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          leftIcon={<Mail />}
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          onBlur={handleInputBlur('email')}
          error={validationErrors.email}
          disabled={isDisabled}
          required
          autoComplete="email"
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          leftIcon={<Lock />}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange('password')}
          onBlur={handleInputBlur('password')}
          error={validationErrors.password}
          disabled={isDisabled}
          required
          autoComplete="current-password"
        />

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isDisabled}
            className={cn(
              'text-sm text-primary-600 hover:text-primary-700',
              'dark:text-primary-400 dark:hover:text-primary-300',
              'transition-colors duration-200 focus:outline-none',
              'focus:ring-2 focus:ring-primary-500/30 rounded px-1 py-0.5',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            tabIndex={isDisabled ? -1 : 0}
          >
            Forgot your password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={!isFormValid || isDisabled}
          loading={loading}
          className="w-full"
        >
          <span className="flex items-center justify-center space-x-2">
            <LogIn className="w-4 h-4" />
            <span>
              {timeoutRemaining > 0 ? `Locked (${timeoutRemaining}s)` : 'Sign In'}
            </span>
          </span>
        </Button>
      </form>
    </motion.div>
  );
}

export default LoginForm;

/*
USAGE EXAMPLES:

// Basic usage
<LoginForm />

// With custom styling
<LoginForm className="max-w-md mx-auto" />

// In a card layout
<Card>
  <CardHeader>
    <CardTitle>Welcome Back</CardTitle>
    <CardDescription>Sign in to your account</CardDescription>
  </CardHeader>
  <CardContent>
    <LoginForm />
  </CardContent>
</Card>

FEATURES:
- Real-time form validation with helpful error messages
- Progressive security measures (retry limits, timeouts)
- Comprehensive error handling for different auth scenarios
- Smooth animations and micro-interactions
- Full accessibility support with proper labels and ARIA
- Responsive design using semantic sizing system
- Theme-aware styling that adapts to light/dark modes
- Password reset functionality
- Auto-complete support for better UX
- Loading states with proper disabled interactions
- Professional visual hierarchy and spacing
*/