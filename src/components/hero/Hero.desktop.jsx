import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Gift, Heart, Star, ShoppingBag, ArrowRight,
  ExternalLink, Sparkles, Users, TrendingUp,
  Amazon, Globe, ShoppingCart
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const HeroDesktop = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-8, 8, -8],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic gradient orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 100%)',
            x: mousePosition.x * -0.015,
            y: mousePosition.y * -0.015,
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* dot pattern with gradient */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
            backgroundPosition: `${mousePosition.x * 0.1}px ${mousePosition.y * 0.1}px`
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-32 left-1/3 w-6 h-6 border-2 border-primary-400/30 rotate-45"
          animate={{
            rotate: [45, 405],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-1/2 right-1/3 w-4 h-4 bg-pink-400/40 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/4 w-8 h-1 bg-purple-400/30 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main Hero Content */}
      <div className="pt-24 pb-16 px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-6rem)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Primary Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                variants={itemVariants}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>The Future of Gift Giving</span>
                </motion.div>

                <h1 className="text-7xl lg:text-8xl font-bold text-foreground leading-[0.9] tracking-tight">
                  Never Get
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent relative">
                    Unwanted Gifts
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
                      animate={{
                        scaleX: [0, 1],
                        opacity: [0, 1]
                      }}
                      transition={{ delay: 1.5, duration: 1 }}
                    />
                  </span>
                  <br />
                  Again
                </h1>
              </motion.div>

              <motion.p
                className="text-xl lg:text-2xl text-muted leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                Create wishlists from <strong>any online store</strong> - Amazon, Best Buy, Shein,
                Canada Computers. Share with friends and family. Make every gift perfect.
              </motion.p>

              {/* Feature highlights */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
                variants={itemVariants}
              >
                {[
                  { icon: Globe, text: "Any Store", desc: "Link from anywhere" },
                  { icon: Users, text: "Share Lists", desc: "Private or public" },
                  { icon: TrendingUp, text: "Desire Score", desc: "Rate your wants" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/50"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: 'rgba(var(--color-primary-500), 0.05)'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{feature.text}</div>
                      <div className="text-xs text-muted">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 max-w-3xl"
                variants={itemVariants}
              >
                <Button
                  size="lg"
                  className="group text-lg px-16 py-5 shadow-lg hover:shadow-xl w-full sm:w-auto sm:min-w-[280px] h-16"
                  onClick={() => window.location.href = '/auth'}
                >
                  <div className="flex items-center justify-center space-x-3 w-full">
                    <Gift className="w-5 h-5" />
                    <span>Start Your Wishlist</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="text-lg px-16 py-5 border-2 border-border hover:border-primary-500 w-full sm:w-auto sm:min-w-[220px] h-16"
                  onClick={() => window.location.href = '/features'}
                >
                  <div className="flex items-center justify-center space-x-3 w-full">
                    <ExternalLink className="w-5 h-5" />
                    <span>See Demo</span>
                  </div>
                </Button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="flex items-center space-x-6"
                variants={itemVariants}
              >
                <div className="flex -space-x-3">
                  {[
                    { bg: 'from-purple-400 to-pink-400', letter: 'S' },
                    { bg: 'from-blue-400 to-purple-400', letter: 'M' },
                    { bg: 'from-green-400 to-blue-400', letter: 'J' },
                    { bg: 'from-yellow-400 to-orange-400', letter: 'K' },
                    { bg: 'from-pink-400 to-red-400', letter: 'L' }
                  ].map((user, i) => (
                    <motion.div
                      key={i}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${user.bg} border-3 border-background flex items-center justify-center text-white font-bold shadow-lg`}
                      whileHover={{ scale: 1.1, z: 10 }}
                      style={{ zIndex: 5 - i }}
                    >
                      {user.letter}
                    </motion.div>
                  ))}
                </div>
                <div className="text-muted">
                  <div className="flex items-center space-x-1 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-foreground ml-2">4.9</span>
                  </div>
                  <div className="text-sm">
                    <strong>15,000+</strong> happy gift-givers
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Interactive Wishlist Preview */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div
                className="relative"
                variants={itemVariants}
                style={{ y: y1 }}
              >
                <motion.div
                  className="w-96 bg-background/95 dark:bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
                  animate="floating"
                  variants={floatingVariants}
                  whileHover={{
                    scale: 1.02,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-border/50 bg-gradient-to-r from-primary-500/5 to-pink-500/5">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        A
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">Alex's Birthday List</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted">
                          <span>5 items</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wishlist Items */}
                  <div className="p-4 space-y-3">
                    {[
                      {
                        emoji: '🎧',
                        name: 'Sony WH-1000XM5',
                        store: 'Best Buy',
                        description: 'Industry-leading noise cancellation',
                        desire: 5,
                        price: '$399'
                      },
                      {
                        emoji: '👟',
                        name: 'Nike Air Max 90',
                        store: 'Amazon',
                        description: 'Classic comfort meets modern style',
                        desire: 4,
                        price: '$120'
                      },
                      {
                        emoji: '📱',
                        name: 'iPhone 15 Pro Max',
                        store: 'Apple',
                        description: 'Latest flagship with titanium design',
                        desire: 5,
                        price: '$1199'
                      },
                      {
                        emoji: '🎮',
                        name: 'Steam Deck OLED',
                        store: 'Steam',
                        description: 'Portable gaming powerhouse',
                        desire: 3,
                        price: '$549'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-surface/50 dark:hover:bg-surface/30 transition-all duration-200 cursor-pointer group"
                        whileHover={{ scale: 1.02, x: 4 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-surface to-surface/50 rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-shadow">
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                            <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                              {item.store}
                            </span>
                          </div>
                          <p className="text-sm text-muted truncate">{item.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Heart
                                  key={star}
                                  className={cn(
                                    'w-3 h-3 transition-all duration-200',
                                    star <= item.desire
                                      ? 'text-red-500 fill-current scale-110'
                                      : 'text-border'
                                  )}
                                />
                              ))}
                              <span className="text-xs text-muted ml-1">Desire</span>
                            </div>
                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 bg-gradient-to-r from-surface/80 to-surface/40 border-t border-border/50">
                    <motion.button
                      className="w-full py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Full Wishlist →
                    </motion.button>
                  </div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 4px 14px 0 rgba(0, 255, 0, 0.39)',
                      '0 6px 20px 0 rgba(0, 255, 0, 0.45)',
                      '0 4px 14px 0 rgba(0, 255, 0, 0.39)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎉 Live Updates
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg"
                  animate={{
                    y: [-2, 2, -2],
                    rotate: [-1, 1, -1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  💝 Gift Ready
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroDesktop;