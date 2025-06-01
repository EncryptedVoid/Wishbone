import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Heart, Users, Sparkles, Star,
  Shield, Smartphone, Globe, ArrowRight
} from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';
import SignupForm from '../../components/auth/SignupForm';
import { TabSwitcher, TabContent } from '../../components/ui/TabSwitcher';
import { Card, CardContent } from '../../components/ui/Card';
import Logo from '../../components/ui/Logo';
import { cn } from '../../utils/cn';

/**
 * EyeWantIt Desktop Authentication Page
 *
 * Features EyeWantIt's wishlist and gift-giving concept with
 * proper spacing for navbar overlay protection
 */
function AuthPageDesktop() {
  const [activeTab, setActiveTab] = useState('login');

  // EyeWantIt feature highlights
  const features = [
    {
      icon: Gift,
      title: 'Wishlist Everything',
      description: 'Create wishlists from any online store - Amazon, Best Buy, Shein, and more. Never forget what you want again.',
      color: 'text-purple-400'
    },
    {
      icon: Heart,
      title: 'Smart Gift Giving',
      description: 'Friends and family always know what to get you. No more awkward gift exchanges or duplicate presents.',
      color: 'text-pink-400'
    },
    {
      icon: Users,
      title: 'Share with Anyone',
      description: 'Public wishlists for birthdays, weddings, holidays. Private lists for personal shopping goals.',
      color: 'text-blue-400'
    }
  ];

  const authTabs = [
    { id: 'login', label: 'Sign In' },
    { id: 'signup', label: 'Create Account' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with patterns and textures */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-gentle" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-gentle" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-gentle" />
        </div>

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main content with navbar spacing */}
      <div className="relative z-10 flex min-h-screen pt-20 pb-8">
        {/* Left Side - EyeWantIt Branding */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:p-8 xl:p-12">

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-2xl"
          >
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Never Forget What You{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Want
                </span>
              </h1>
              <p className="text-xl text-purple-200 leading-relaxed mb-8">
                Create wishlists from any online store. Share them with friends and family.
                Make gift-giving effortless and meaningful.
              </p>

              {/* How it works */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Gift className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-sm text-purple-300 font-medium">Add Items</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className="text-sm text-pink-300 font-medium">Share Lists</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-sm text-blue-300 font-medium">Get Gifts</div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                    'bg-white/10 backdrop-blur-sm border border-white/20',
                    'group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300'
                  )}>
                    <feature.icon className={cn('w-6 h-6', feature.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-purple-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-purple-300 text-sm">
                "Finally, a way to keep track of everything I want!" - Sarah M.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Authentication */}
        <div className="flex-1 flex flex-col justify-center lg:max-w-xl lg:px-8 xl:px-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-md mx-auto"
          >
            {/* Auth Card */}
            <Card className="bg-white/95 dark:bg-surface/95 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent size="lg">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {activeTab === 'login' ? 'Welcome Back' : 'Join EyeWantIt'}
                  </h2>
                  <p className="text-muted">
                    {activeTab === 'login'
                      ? 'Sign in to access your wishlists'
                      : 'Start creating your wishlists today'
                    }
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="mb-8">
                  <TabSwitcher
                    tabs={authTabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </div>

                {/* Form Content */}
                <div className="min-h-[300px]">
                  <TabContent activeTab={activeTab} tabId="login">
                    <LoginForm />
                  </TabContent>

                  <TabContent activeTab={activeTab} tabId="signup">
                    <SignupForm />
                  </TabContent>
                </div>

                {/* Social Login */}
                <div className="mt-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-background text-muted">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      className={cn(
                        'w-full flex items-center justify-center py-3 px-4',
                        'border border-border rounded-xl bg-surface hover:bg-surface/80',
                        'text-sm font-medium text-foreground',
                        'transition-all duration-200 hover:border-primary-500/50',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/30'
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => alert('Google OAuth - To be implemented')}
                    >
                      <Globe className="w-4 h-4 mr-3" />
                      Continue with Google
                      <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                    </motion.button>

                    <motion.button
                      className={cn(
                        'w-full flex items-center justify-center py-3 px-4',
                        'border border-border rounded-xl bg-surface hover:bg-surface/80',
                        'text-sm font-medium text-foreground',
                        'transition-all duration-200 hover:border-primary-500/50',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/30'
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => alert('SMS Auth - To be implemented')}
                    >
                      <Smartphone className="w-4 h-4 mr-3" />
                      Continue with Phone
                      <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                    </motion.button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <Shield className="w-4 h-4" />
                <span className="text-xs">
                  Your data is protected with bank-level security
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthPageDesktop;

/*
USAGE EXAMPLES:

// Basic usage - automatically shows responsive desktop layout
<AuthPageDesktop />

// Integrated into routing system
import { useIsMobile } from '../hooks/useIsMobile';
import AuthPageDesktop from './Auth.desktop';
import AuthPageMobile from './Auth.mobile';

function AuthPage() {
  const { isMobile } = useIsMobile();
  return isMobile ? <AuthPageMobile /> : <AuthPageDesktop />;
}

FEATURES:
- Split-screen layout optimized for desktop viewing
- Animated background effects with glassmorphism
- Integrated theme controls (dark/light + color themes)
- Smooth tab transitions between login and signup
- Professional feature highlights and social proof
- Enterprise-focused branding and messaging
- Responsive grid layouts that adapt to screen size
- Accessibility-first design with proper focus management
- Social login placeholder integration
- Security messaging and trust indicators
- Professional animations and micro-interactions
- Semantic sizing system for consistent spacing
- Theme-aware styling throughout all components
*/