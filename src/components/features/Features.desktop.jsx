import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Gift, Heart, Users, TrendingUp, Globe, ShoppingCart,
  Star, Shield, Sparkles, ExternalLink, Eye, Lock,
  Smartphone, Bell, Share2, Crown, Zap, Award,
  CheckCircle, ArrowRight, Play
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const FeaturesDesktop = () => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Main feature categories
  const featureTabs = [
    {
      id: 'wishlist',
      label: 'Create Wishlists',
      icon: Gift,
      description: 'Add items from any store'
    },
    {
      id: 'sharing',
      label: 'Share & Collaborate',
      icon: Users,
      description: 'Share with friends and family'
    },
    {
      id: 'gifting',
      label: 'Perfect Gifting',
      icon: Heart,
      description: 'Never give wrong gifts again'
    },
    {
      id: 'tracking',
      label: 'Smart Tracking',
      icon: TrendingUp,
      description: 'Price alerts and notifications'
    }
  ];

  // Detailed features for each category
  const featureDetails = {
    wishlist: {
      title: 'Create Your Perfect Wishlist',
      subtitle: 'Add items from any online store with our browser extension or direct links',
      features: [
        {
          icon: Globe,
          title: 'Universal Store Support',
          description: 'Amazon, Best Buy, Shein, Canada Computers, and 1000+ more stores supported',
          highlight: 'Works Everywhere'
        },
        {
          icon: Star,
          title: 'Desire Score Rating',
          description: 'Rate items 1-5 hearts to show how much you want them',
          highlight: 'Priority System'
        },
        {
          icon: Eye,
          title: 'Rich Descriptions',
          description: 'Add personal notes explaining why you want each item',
          highlight: 'Tell Your Story'
        },
        {
          icon: Crown,
          title: 'Categories & Tags',
          description: 'Organize items by occasion, priority, or custom categories',
          highlight: 'Stay Organized'
        }
      ],
      demo: {
        title: 'Real Wishlist Example',
        items: [
          { name: 'Sony WH-1000XM5', store: 'Best Buy', price: '$399', desire: 5, category: 'Electronics' },
          { name: 'Levi\'s 501 Jeans', store: 'Amazon', price: '$89', desire: 4, category: 'Clothing' },
          { name: 'The Psychology of Money', store: 'Indigo', price: '$24', desire: 3, category: 'Books' }
        ]
      }
    },
    sharing: {
      title: 'Share with Anyone, Anywhere',
      subtitle: 'Make your wishlists discoverable or keep them private - you control who sees what',
      features: [
        {
          icon: Share2,
          title: 'Flexible Privacy Controls',
          description: 'Public lists for birthdays, private lists for personal goals',
          highlight: 'Your Choice'
        },
        {
          icon: Users,
          title: 'Family & Friend Groups',
          description: 'Create groups for different occasions and events',
          highlight: 'Stay Connected'
        },
        {
          icon: Bell,
          title: 'Gift Coordination',
          description: 'Prevent duplicate gifts with purchase notifications',
          highlight: 'No Duplicates'
        },
        {
          icon: Smartphone,
          title: 'Easy Sharing',
          description: 'Share via link, QR code, or social media platforms',
          highlight: 'Multiple Ways'
        }
      ],
      demo: {
        title: 'Sarah\'s Birthday List',
        sharedWith: ['Mom', 'Dad', 'Best Friend', 'Boyfriend'],
        visibility: 'Friends & Family',
        items: 4
      }
    },
    gifting: {
      title: 'Perfect Gifts Every Time',
      subtitle: 'Turn gift-giving stress into joy with intelligent recommendations and coordination',
      features: [
        {
          icon: Award,
          title: 'Gift Recommendations',
          description: 'AI suggests similar items when wishlist items are unavailable',
          highlight: 'Smart Suggestions'
        },
        {
          icon: Shield,
          title: 'Purchase Protection',
          description: 'Mark items as "claimed" to prevent duplicate purchases',
          highlight: 'Conflict-Free'
        },
        {
          icon: Zap,
          title: 'Last-Minute Gifts',
          description: 'Find perfect gifts even when shopping last minute',
          highlight: 'Always Ready'
        },
        {
          icon: CheckCircle,
          title: 'Gift History',
          description: 'Track what gifts were given and received over time',
          highlight: 'Remember Everything'
        }
      ],
      demo: {
        title: 'Gift Giving Dashboard',
        upcoming: ['Sarah\'s Birthday (3 days)', 'Mom\'s Anniversary (2 weeks)'],
        budget: '$150 - $300',
        suggestions: 5
      }
    },
    tracking: {
      title: 'Smart Price & Availability Tracking',
      subtitle: 'Never miss a deal or restock with our intelligent monitoring system',
      features: [
        {
          icon: TrendingUp,
          title: 'Price Drop Alerts',
          description: 'Get notified when items go on sale or drop in price',
          highlight: 'Save Money'
        },
        {
          icon: Bell,
          title: 'Back in Stock Notifications',
          description: 'Know immediately when out-of-stock items become available',
          highlight: 'Never Miss Out'
        },
        {
          icon: Sparkles,
          title: 'Deal Discovery',
          description: 'Find similar items at better prices across different stores',
          highlight: 'Best Deals'
        },
        {
          icon: ShoppingCart,
          title: 'One-Click Purchasing',
          description: 'Buy items directly through our affiliate links',
          highlight: 'Quick & Easy'
        }
      ],
      demo: {
        title: 'Price Tracking Dashboard',
        tracked: 12,
        savings: '$156',
        alerts: 3
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const currentFeature = featureDetails[activeTab];

  return (
    <div className="py-24 bg-gradient-to-br from-background via-surface/30 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>

            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Gift Giving
              </span>
            </h2>

            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              From creating wishlists to coordinating gifts, EyeWantIt makes every occasion special
              with intelligent features designed for modern gift-giving.
            </p>
          </motion.div>

          {/* Feature Navigation Tabs */}
          <motion.div
            className="mb-16"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {featureTabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'p-6 rounded-2xl border-2 transition-all duration-300 text-left group',
                    activeTab === tab.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/50 shadow-lg'
                      : 'border-border bg-surface/50 hover:border-primary-300 hover:bg-primary-50/50'
                  )}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 text-primary-500'
                    )}>
                      <tab.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn(
                        'font-semibold mb-1 transition-colors',
                        activeTab === tab.id ? 'text-primary-700 dark:text-primary-300' : 'text-foreground'
                      )}>
                        {tab.label}
                      </h3>
                      <p className="text-sm text-muted">
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Feature Details */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left Column - Feature List */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  {currentFeature.title}
                </h3>
                <p className="text-lg text-muted mb-8">
                  {currentFeature.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                {currentFeature.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/50 hover:border-primary-500/50 transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                      <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                          {feature.highlight}
                        </span>
                      </div>
                      <p className="text-muted">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Interactive Demo/Preview */}
            <div className="flex justify-center">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-background/95 dark:bg-surface/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    {/* Demo content based on active tab */}
                    {activeTab === 'wishlist' && (
                      <div>
                        <div className="p-6 border-b border-border bg-gradient-to-r from-primary-500/5 to-pink-500/5">
                          <h4 className="font-bold text-foreground mb-2">{currentFeature.demo.title}</h4>
                          <p className="text-sm text-muted">Live wishlist demonstration</p>
                        </div>
                        <div className="p-4 space-y-3">
                          {currentFeature.demo.items.map((item, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center space-x-3 p-3 rounded-lg bg-surface/50 hover:bg-surface transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-surface to-surface/50 rounded-lg flex items-center justify-center text-lg">
                                🎁
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-sm">{item.name}</h5>
                                  <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                                    {item.store}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Heart
                                        key={i}
                                        className={cn(
                                          'w-3 h-3',
                                          i < item.desire ? 'text-red-500 fill-current' : 'text-border'
                                        )}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-semibold text-primary-600">{item.price}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <div className="p-4 bg-surface/50 border-t border-border">
                          <Button className="w-full" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Try Interactive Demo
                          </Button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'sharing' && (
                      <div>
                        <div className="p-6 border-b border-border bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                          <h4 className="font-bold text-foreground mb-2">{currentFeature.demo.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <span>👥 {currentFeature.demo.sharedWith.length} people</span>
                            <span>👀 {currentFeature.demo.visibility}</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                              <span className="text-sm font-medium">Shared with {currentFeature.demo.sharedWith.length} people</span>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {currentFeature.demo.sharedWith.map((person, index) => (
                                <div key={index} className="p-2 bg-surface rounded-lg text-center text-sm">
                                  {person}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-surface/50 border-t border-border">
                          <Button className="w-full" size="sm" variant="ghost">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share This List
                          </Button>
                        </div>
                      </div>
                    )}

                    {(activeTab === 'gifting' || activeTab === 'tracking') && (
                      <div>
                        <div className="p-6 border-b border-border bg-gradient-to-r from-purple-500/5 to-pink-500/5">
                          <h4 className="font-bold text-foreground mb-2">{currentFeature.demo.title}</h4>
                          <p className="text-sm text-muted">Smart insights and tracking</p>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-surface rounded-lg text-center">
                              <div className="text-2xl font-bold text-primary-600">
                                {activeTab === 'tracking' ? currentFeature.demo.tracked : '2'}
                              </div>
                              <div className="text-xs text-muted">
                                {activeTab === 'tracking' ? 'Items Tracked' : 'Upcoming Events'}
                              </div>
                            </div>
                            <div className="p-3 bg-surface rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {activeTab === 'tracking' ? currentFeature.demo.savings : '$245'}
                              </div>
                              <div className="text-xs text-muted">
                                {activeTab === 'tracking' ? 'Total Saved' : 'Budget Range'}
                              </div>
                            </div>
                          </div>
                          {activeTab === 'gifting' && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Upcoming Events:</h5>
                              {currentFeature.demo.upcoming.map((event, index) => (
                                <div key={index} className="p-2 bg-surface rounded text-sm flex items-center space-x-2">
                                  <Bell className="w-3 h-3 text-orange-500" />
                                  <span>{event}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="p-4 bg-surface/50 border-t border-border">
                          <Button className="w-full" size="sm">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            View Dashboard
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to transform your gift-giving experience?
            </h3>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of users who never give unwanted gifts again.
            </p>
            <Button
              size="lg"
              className="px-12 py-4 text-lg h-16"
              onClick={() => window.location.href = '/auth'}
            >
              <div className="flex items-center space-x-3">
                <Gift className="w-5 h-5" />
                <span>Start Your Free Wishlist</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesDesktop;