import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Gift, Heart, Users, TrendingUp, Globe, ShoppingCart,
  Star, Shield, Sparkles, Eye, Bell, Share2, Crown,
  Zap, Award, CheckCircle, ArrowRight, ChevronDown, Play
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const FeaturesMobile = () => {
  const [expandedFeature, setExpandedFeature] = useState(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Mobile-optimized feature categories
  const features = [
    {
      id: 'wishlist',
      icon: Gift,
      title: 'Create Wishlists',
      subtitle: 'From any online store',
      color: 'purple',
      details: [
        {
          icon: Globe,
          title: 'Any Store Supported',
          description: 'Amazon, Best Buy, Shein, Canada Computers + 1000 more'
        },
        {
          icon: Star,
          title: 'Desire Score Rating',
          description: 'Rate items 1-5 hearts to show priority'
        },
        {
          icon: Eye,
          title: 'Rich Descriptions',
          description: 'Add notes explaining why you want each item'
        }
      ],
      demo: {
        type: 'wishlist',
        items: [
          { name: 'Sony Headphones', desire: 5, price: '$399' },
          { name: 'Nike Sneakers', desire: 4, price: '$120' },
          { name: 'iPhone 15 Pro', desire: 5, price: '$1199' }
        ]
      }
    },
    {
      id: 'sharing',
      icon: Users,
      title: 'Share & Collaborate',
      subtitle: 'With friends and family',
      color: 'blue',
      details: [
        {
          icon: Share2,
          title: 'Flexible Privacy',
          description: 'Public lists for events, private for personal goals'
        },
        {
          icon: Users,
          title: 'Family Groups',
          description: 'Create groups for different occasions'
        },
        {
          icon: Bell,
          title: 'Gift Coordination',
          description: 'Prevent duplicate gifts with notifications'
        }
      ],
      demo: {
        type: 'sharing',
        sharedWith: 4,
        visibility: 'Friends & Family'
      }
    },
    {
      id: 'gifting',
      icon: Heart,
      title: 'Perfect Gifting',
      subtitle: 'Never give wrong gifts',
      color: 'pink',
      details: [
        {
          icon: Award,
          title: 'Smart Recommendations',
          description: 'AI suggests alternatives when items unavailable'
        },
        {
          icon: Shield,
          title: 'Purchase Protection',
          description: 'Mark items as claimed to prevent duplicates'
        },
        {
          icon: CheckCircle,
          title: 'Gift History',
          description: 'Track what was given and received over time'
        }
      ],
      demo: {
        type: 'gifting',
        upcoming: 2,
        budget: '$150-300'
      }
    },
    {
      id: 'tracking',
      icon: TrendingUp,
      title: 'Smart Tracking',
      subtitle: 'Price alerts & notifications',
      color: 'green',
      details: [
        {
          icon: TrendingUp,
          title: 'Price Drop Alerts',
          description: 'Get notified when items go on sale'
        },
        {
          icon: Bell,
          title: 'Stock Notifications',
          description: 'Know when out-of-stock items return'
        },
        {
          icon: Sparkles,
          title: 'Deal Discovery',
          description: 'Find similar items at better prices'
        }
      ],
      demo: {
        type: 'tracking',
        tracked: 12,
        savings: '$156'
      }
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const colorClasses = {
    purple: {
      bg: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-500 text-white',
      accent: 'text-purple-600 dark:text-purple-400'
    },
    blue: {
      bg: 'from-blue-500/10 to-purple-500/10',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-500 text-white',
      accent: 'text-blue-600 dark:text-blue-400'
    },
    pink: {
      bg: 'from-pink-500/10 to-red-500/10',
      border: 'border-pink-200 dark:border-pink-800',
      icon: 'bg-pink-500 text-white',
      accent: 'text-pink-600 dark:text-pink-400'
    },
    green: {
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-500 text-white',
      accent: 'text-green-600 dark:text-green-400'
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-background via-surface/20 to-background relative overflow-hidden">
      {/* Mobile Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-4 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />

        {/* Mobile dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="max-w-lg mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Mobile Header */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </motion.div>

            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything for
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Gifts
              </span>
            </h2>

            <p className="text-lg text-muted leading-relaxed">
              From creating wishlists to coordinating gifts, we make every occasion special.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            {features.map((feature, index) => {
              const isExpanded = expandedFeature === feature.id;
              const colors = colorClasses[feature.color];

              return (
                <motion.div
                  key={feature.id}
                  className={cn(
                    'rounded-2xl border-2 overflow-hidden transition-all duration-300',
                    `bg-gradient-to-br ${colors.bg}`,
                    colors.border,
                    isExpanded ? 'shadow-lg' : 'shadow-sm'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Feature Header */}
                  <motion.button
                    onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                    className="w-full p-6 text-left"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center', colors.icon)}>
                        <feature.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                        <p className="text-sm text-muted">{feature.subtitle}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-muted" />
                      </motion.div>
                    </div>
                  </motion.button>

                  {/* Expanded Content */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4">
                      {/* Feature Details */}
                      <div className="space-y-3">
                        {feature.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            className="flex items-start space-x-3 p-3 rounded-xl bg-background/60 dark:bg-surface/40"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: isExpanded ? detailIndex * 0.1 : 0 }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                              <detail.icon className={cn('w-4 h-4', colors.accent)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground text-sm">{detail.title}</h4>
                              <p className="text-xs text-muted mt-1">{detail.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Mini Demo */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: isExpanded ? 0.3 : 0 }}
                      >
                        <Card className="bg-background/80 dark:bg-surface/60 border border-border/50">
                          <CardContent className="p-4">
                            {feature.demo.type === 'wishlist' && (
                              <div>
                                <h5 className="font-semibold text-sm mb-3 flex items-center">
                                  <Gift className="w-4 h-4 mr-2" />
                                  Sample Wishlist
                                </h5>
                                <div className="space-y-2">
                                  {feature.demo.items.slice(0, 2).map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center justify-between p-2 bg-surface/50 rounded-lg">
                                      <div className="flex items-center space-x-2">
                                        <div className="text-sm">🎁</div>
                                        <span className="text-xs font-medium">{item.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="flex">
                                          {[...Array(5)].map((_, i) => (
                                            <Heart
                                              key={i}
                                              className={cn(
                                                'w-2.5 h-2.5',
                                                i < item.desire ? 'text-red-500 fill-current' : 'text-border'
                                              )}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-xs font-semibold text-primary-600">{item.price}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {feature.demo.type === 'sharing' && (
                              <div>
                                <h5 className="font-semibold text-sm mb-3 flex items-center">
                                  <Users className="w-4 h-4 mr-2" />
                                  Sharing Status
                                </h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-2 bg-surface/50 rounded-lg text-center">
                                    <div className="text-lg font-bold text-blue-600">{feature.demo.sharedWith}</div>
                                    <div className="text-xs text-muted">People</div>
                                  </div>
                                  <div className="p-2 bg-surface/50 rounded-lg text-center">
                                    <div className="text-xs font-medium text-green-600">✓ Active</div>
                                    <div className="text-xs text-muted">Status</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(feature.demo.type === 'gifting' || feature.demo.type === 'tracking') && (
                              <div>
                                <h5 className="font-semibold text-sm mb-3 flex items-center">
                                  {feature.demo.type === 'gifting' ? (
                                    <><Heart className="w-4 h-4 mr-2" />Gift Dashboard</>
                                  ) : (
                                    <><TrendingUp className="w-4 h-4 mr-2" />Tracking Stats</>
                                  )}
                                </h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-2 bg-surface/50 rounded-lg text-center">
                                    <div className="text-lg font-bold text-primary-600">
                                      {feature.demo.type === 'tracking' ? feature.demo.tracked : feature.demo.upcoming}
                                    </div>
                                    <div className="text-xs text-muted">
                                      {feature.demo.type === 'tracking' ? 'Tracked' : 'Events'}
                                    </div>
                                  </div>
                                  <div className="p-2 bg-surface/50 rounded-lg text-center">
                                    <div className="text-lg font-bold text-green-600">
                                      {feature.demo.type === 'tracking' ? feature.demo.savings : '$245'}
                                    </div>
                                    <div className="text-xs text-muted">
                                      {feature.demo.type === 'tracking' ? 'Saved' : 'Budget'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button className="w-full mt-3" size="sm" variant="ghost">
                              <Play className="w-3 h-3 mr-2" />
                              Try Demo
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-foreground mb-3">
              Ready to get started?
            </h3>
            <p className="text-muted mb-6">
              Join thousands who never give unwanted gifts again.
            </p>
            <Button
              size="lg"
              className="w-full px-8 py-4 text-lg h-16"
              onClick={() => window.location.href = '/auth'}
            >
              <div className="flex items-center justify-center space-x-3">
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

export default FeaturesMobile;