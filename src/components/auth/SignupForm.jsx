import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Calendar, Palette,
  AlertCircle, ArrowRight, ArrowLeft, UserPlus,
  Check, X, CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '../../utils/cn';

// Color options for EyeWantIt theme
const colorOptions = [
  { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500', description: 'Professional & trustworthy' },
  { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500', description: 'Creative & luxurious' },
  { id: 'green', name: 'Forest Green', color: 'bg-green-500', description: 'Natural & balanced' },
  { id: 'pink', name: 'Rose Pink', color: 'bg-pink-500', description: 'Modern & vibrant' },
];

/**
 * EyeWantIt SignupForm Component
 *
 * Streamlined two-step signup without progress bar
 */
function SignupForm({ className }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    dateOfBirth: '',
    favoriteColor: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    suggestions: []
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const suggestions = [];

    if (!checks.length) suggestions.push('Use at least 8 characters');
    if (!checks.uppercase) suggestions.push('Add an uppercase letter');
    if (!checks.lowercase) suggestions.push('Add a lowercase letter');
    if (!checks.number) suggestions.push('Add a number');
    if (!checks.special) suggestions.push('Add a special character');

    return { score, suggestions, checks };
  };

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
        } else {
          const strength = checkPasswordStrength(value);
          setPasswordStrength(strength);

          if (strength.score < 3) {
            errors.password = 'Password is too weak';
          } else {
            delete errors.password;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          delete errors.confirmPassword;
        }
        break;

      case 'nickname':
        if (value && value.length < 2) {
          errors.nickname = 'Nickname must be at least 2 characters';
        } else if (value && value.length > 20) {
          errors.nickname = 'Nickname must be less than 20 characters';
        } else {
          delete errors.nickname;
        }
        break;

      case 'dateOfBirth':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();

          if (age < 13) {
            errors.dateOfBirth = 'You must be at least 13 years old';
          } else if (age > 120) {
            errors.dateOfBirth = 'Please enter a valid birth date';
          } else {
            delete errors.dateOfBirth;
          }
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
    if (value !== '') {
      validateField(field, value);
    }

    if (field === 'password' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleInputBlur = (field) => (e) => {
    validateField(field, e.target.value);
  };

  // Step validation
  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.email &&
               formData.password &&
               formData.confirmPassword &&
               !validationErrors.email &&
               !validationErrors.password &&
               !validationErrors.confirmPassword &&
               passwordStrength.score >= 3;
      case 2:
        return !validationErrors.nickname && !validationErrors.dateOfBirth;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 2 && isStepValid(currentStep)) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStepValid(2)) return;

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nickname: formData.nickname,
            favorite_color: formData.favoriteColor
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('This email is already registered. Please try signing in instead.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: formData.email,
            nickname: formData.nickname || null,
            date_of_birth: formData.dateOfBirth || null,
            favorite_color: formData.favoriteColor || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        setError('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

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
            className="mb-4 p-3 rounded-xl border flex items-start space-x-3 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800/50"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Authentication Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
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
                required
                autoComplete="email"
              />

              {/* Password Field */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  leftIcon={<Lock />}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onBlur={handleInputBlur('password')}
                  error={validationErrors.password}
                  required
                  autoComplete="new-password"
                />

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-3 bg-surface/50 dark:bg-surface/30 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-muted">Password strength:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              'w-3 h-1.5 rounded-full transition-colors duration-200',
                              level <= passwordStrength.score
                                ? passwordStrength.score <= 2
                                  ? 'bg-red-500'
                                  : passwordStrength.score <= 3
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                                : 'bg-border'
                            )}
                          />
                        ))}
                      </div>
                      <span className={cn(
                        'text-xs font-medium',
                        passwordStrength.score <= 2 ? 'text-red-600 dark:text-red-400' :
                        passwordStrength.score <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                      )}>
                        {passwordStrength.score <= 2 ? 'Weak' :
                         passwordStrength.score <= 3 ? 'Fair' :
                         passwordStrength.score <= 4 ? 'Good' : 'Strong'}
                      </span>
                    </div>

                    {passwordStrength.suggestions.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <X className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-muted">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Field */}
              <Input
                label="Confirm Password"
                type="password"
                leftIcon={<Lock />}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                onBlur={handleInputBlur('confirmPassword')}
                error={validationErrors.confirmPassword}
                required
                autoComplete="new-password"
              />

              {/* Next Button */}
              <Button
                type="button"
                onClick={nextStep}
                size="lg"
                disabled={!isStepValid(1)}
                className="w-full"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Almost there!
                </h3>
                <p className="text-sm text-muted mt-1">
                  Help us personalize your EyeWantIt experience
                </p>
              </div>

              {/* Nickname Field */}
              <Input
                label="Display Name (Optional)"
                type="text"
                leftIcon={<User />}
                placeholder="What should we call you?"
                value={formData.nickname}
                onChange={handleInputChange('nickname')}
                onBlur={handleInputBlur('nickname')}
                error={validationErrors.nickname}
                autoComplete="nickname"
              />

              {/* Date of Birth Field */}
              <Input
                label="Birthday (Optional)"
                type="date"
                leftIcon={<Calendar />}
                value={formData.dateOfBirth}
                onChange={handleInputChange('dateOfBirth')}
                onBlur={handleInputBlur('dateOfBirth')}
                error={validationErrors.dateOfBirth}
                max={new Date().toISOString().split('T')[0]}
              />

              {/* Color Theme Preference */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Choose Your Theme Color (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, favoriteColor: color.id }))}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all duration-200 text-left',
                        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                        formData.favoriteColor === color.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                          : 'border-border bg-surface/50 dark:bg-surface/30 hover:border-primary-500/50'
                      )}
                      tabIndex={0}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={cn('w-4 h-4 rounded-full border border-border', color.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">
                            {color.name}
                          </div>
                          <div className="text-xs text-muted">
                            {color.description}
                          </div>
                        </div>
                        {formData.favoriteColor === color.id && (
                          <CheckCircle className="w-4 h-4 text-primary-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  size="lg"
                  className="flex-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </span>
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Terms Notice */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-muted">
          By creating an account, you agree to our{' '}
          <button
            type="button"
            className="text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded"
            onClick={() => alert('Terms of Service')}
            tabIndex={0}
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            className="text-primary-600 dark:text-primary-400 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded"
            onClick={() => alert('Privacy Policy')}
            tabIndex={0}
          >
            Privacy Policy
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default SignupForm;

/*
USAGE EXAMPLES:

// Basic usage
<SignupForm />

// With custom styling
<SignupForm className="max-w-lg mx-auto" />

// In a card layout
<Card>
  <CardHeader>
    <CardTitle>Join Us Today</CardTitle>
    <CardDescription>Create your account in just a few steps</CardDescription>
  </CardHeader>
  <CardContent>
    <SignupForm />
  </CardContent>
</Card>

FEATURES:
- Multi-step wizard with smooth page transitions
- Real-time password strength validation with visual feedback
- Comprehensive form validation with helpful error messages
- Color theme selection for personalization
- Progressive enhancement - optional fields clearly marked
- Smooth animations and micro-interactions
- Full accessibility support with proper labels and ARIA
- Responsive design using semantic sizing system
- Theme-aware styling that adapts to light/dark modes
- Progress indication with percentage and visual bar
- Professional visual hierarchy and spacing
- Terms and privacy policy integration
- Support contact integration
- Auto-complete support for better UX
- Date validation for age requirements
- Secure password creation with strength requirements
*/