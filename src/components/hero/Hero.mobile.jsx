import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Gift, Heart, Star, ExternalLink, Sparkles,
  Users, TrendingUp, Globe, ArrowRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

const HeroMobile = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 200], [0, -30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.12
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-background relative overflow-hidden">
      {/* Mobile Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs optimized for mobile */}
        <motion.div
          className="absolute top-1/4 right-8 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-1/3 left-4 w-48 h-48 rounded-full opacity-15 blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(147, 51, 234) 100%)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Mobile dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Floating shapes for mobile */}
        <motion.div
          className="absolute top-32 right-12 w-4 h-4 border border-primary-400/40 rotate-45"
          animate={{
            rotate: [45, 405],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-1/2 left-8 w-3 h-3 bg-pink-400/40 rounded-full"
          animate={{
            y: [-15, 15, -15],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Hero Content with proper navbar spacing */}
      <div className="pt-24 pb-12 px-4 relative z-10">
        <motion.div
          className="max-w-lg mx-auto text-center space-y-8 min-h-[calc(100vh-8rem)] flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>The Future of Gift Giving</span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold text-foreground leading-[1.1] tracking-tight">
              Never Get
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent relative">
                Unwanted Gifts
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full"
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
            className="text-lg text-muted leading-relaxed px-2"
            variants={itemVariants}
          >
            Create wishlists from <strong>any online store</strong> - Amazon, Best Buy, Shein.
            Share with friends and family. Make every gift perfect.
          </motion.p>

          {/* Feature highlights - mobile optimized */}
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={itemVariants}
          >
            {[
              { icon: Globe, text: "Any Store" },
              { icon: Users, text: "Share Lists" },
              { icon: TrendingUp, text: "Rate Items" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-surface/50 dark:bg-surface/30 border border-border/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                  <feature.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-xs font-medium text-foreground text-center">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button - Single button for mobile */}
          <motion.div
            className="px-2"
            variants={itemVariants}
          >
            <Button
              size="lg"
              className="w-full group text-lg px-12 py-5 shadow-lg h-16"
              onClick={() => window.location.href = '/auth'}
            >
              <div className="flex items-center justify-center space-x-3 w-full">
                <Gift className="w-5 h-5" />
                <span>Start Your Wishlist</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="flex flex-col items-center space-y-3"
            variants={itemVariants}
          >
            <div className="flex -space-x-2">
              {[
                { bg: 'from-purple-400 to-pink-400', letter: 'S' },
                { bg: 'from-blue-400 to-purple-400', letter: 'M' },
                { bg: 'from-green-400 to-blue-400', letter: 'J' },
                { bg: 'from-yellow-400 to-orange-400', letter: 'K' },
                { bg: 'from-pink-400 to-red-400', letter: 'L' }
              ].map((user, i) => (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.bg} border-2 border-background flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {user.letter}
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-foreground ml-2">4.9</span>
              </div>
              <div className="text-sm text-muted">
                <strong>15,000+</strong> happy gift-givers
              </div>
            </div>
          </motion.div>

          {/* Mobile Wishlist Preview */}
          <motion.div
            className="mt-12"
            variants={cardVariants}
            style={{ y: y1 }}
          >
            <motion.div
              className="w-full max-w-sm mx-auto bg-background/95 dark:bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-border/50 bg-gradient-to-r from-primary-500/5 to-pink-500/5">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    A
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">Alex's Birthday List</h3>
                    <div className="flex items-center space-x-3 text-xs text-muted">
                      <span>4 items</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wishlist Items - Mobile Optimized */}
              <div className="p-4 space-y-3">
                {[
                  {
                    emoji: '🎧',
                    name: 'Sony WH-1000XM5',
                    store: 'Best Buy',
                    description: 'Noise cancellation headphones',
                    desire: 5,
                    price: '$399'
                  },
                  {
                    emoji: '👟',
                    name: 'Nike Air Max 90',
                    store: 'Amazon',
                    description: 'Classic comfort sneakers',
                    desire: 4,
                    price: '$120'
                  },
                  {
                    emoji: '📱',
                    name: 'iPhone 15 Pro Max',
                    store: 'Apple',
                    description: 'Latest flagship phone',
                    desire: 5,
                    price: '$1199'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-surface/50 dark:hover:bg-surface/30 transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-surface to-surface/50 rounded-xl flex items-center justify-center text-xl shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-foreground text-sm truncate">{item.name}</h4>
                        <span className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full flex-shrink-0">
                          {item.store}
                        </span>
                      </div>
                      <p className="text-xs text-muted truncate">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Heart
                              key={star}
                              className={cn(
                                'w-3 h-3 transition-all duration-200',
                                star <= item.desire
                                  ? 'text-red-500 fill-current'
                                  : 'text-border'
                              )}
                            />
                          ))}
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

            {/* Floating Mobile Badges */}
            <motion.div
              className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
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
              🎉 Live
            </motion.div>

            <motion.div
              className="absolute -bottom-3 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              animate={{
                y: [-1, 1, -1],
                rotate: [-0.5, 0.5, -0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              💝 Gift Ready
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default HeroMobile;