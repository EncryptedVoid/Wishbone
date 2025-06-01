import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Menu, X } from 'lucide-react';

const HeroMobile = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    floating: {
      y: [-3, 3, -3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Mobile Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-8 w-20 h-20 bg-purple-200 rounded-full opacity-25 blur-2xl"></div>
        <div className="absolute top-40 left-4 w-16 h-16 bg-pink-200 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-32 right-12 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>

        {/* Mobile Dot Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gray-600 rounded-full"
              style={{
                left: `${(i % 4) * 8}px`,
                top: `${Math.floor(i / 4) * 8}px`
              }}
            />
          ))}
        </div>

        {/* Floating Shapes - Smaller for Mobile */}
        <motion.div
          className="absolute top-20 left-8 w-4 h-4 border border-purple-300 rotate-45 opacity-40"
          animate={{ rotate: [45, 405] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-8 w-3 h-3 bg-pink-300 rounded-full opacity-30"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Mobile Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">EyeWantIt</span>
            </div>
            <motion.button
              className="p-2 text-gray-700 hover:text-purple-600"
              onClick={() => setMenuOpen(!menuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Hero Content */}
      <div className="pt-16 pb-12 px-4">
        <motion.div
          className="max-w-md mx-auto text-center space-y-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Primary Content */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Your Wishlist,{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Their Perfect Gift
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed px-2"
              variants={itemVariants}
            >
              Create wishlists from any online store. Share with friends and family.
              Never get unwanted gifts again.
            </motion.p>

            <motion.div
              className="space-y-4 px-2"
              variants={itemVariants}
            >
              <motion.button
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg text-lg shadow-lg active:shadow-md transition-all duration-200"
                whileTap={{ scale: 0.98 }}
              >
                Start Your Wishlist
              </motion.button>
              <motion.button
                className="w-full px-6 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg text-lg active:bg-purple-50 transition-all duration-200"
                whileTap={{ scale: 0.98 }}
              >
                See How It Works
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-col items-center space-y-3"
              variants={itemVariants}
            >
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center">
                <span className="font-semibold">Join 12,000+</span><br />
                happy gift-givers and receivers
              </div>
            </motion.div>
          </div>

          {/* Mobile Wishlist Card */}
          <motion.div
            className="flex justify-center mt-12"
            variants={cardVariants}
            animate="floating"
            variants={floatingVariants}
          >
            <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">Sarah's Birthday Wishlist</h3>
                    <p className="text-xs text-gray-500">3 items • Updated today</p>
                  </div>
                </div>
              </div>

              {/* Compact Wishlist Items */}
              <div className="p-4 space-y-3">
                {/* Item 1 - iPhone */}
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    📱
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">iPhone 15 Pro</h4>
                    <p className="text-xs text-gray-500 truncate">Latest model with amazing camera</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Heart
                          key={star}
                          className={`w-3 h-3 ${
                            star <= 5 ? 'text-red-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Item 2 - Nike Shoes */}
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    👟
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">Nike Air Max 270</h4>
                    <p className="text-xs text-gray-500 truncate">Comfortable running shoes</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Heart
                          key={star}
                          className={`w-3 h-3 ${
                            star <= 4 ? 'text-red-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Item 3 - Book */}
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    📚
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">Atomic Habits</h4>
                    <p className="text-xs text-gray-500 truncate">Life-changing book about habits</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Heart
                          key={star}
                          className={`w-3 h-3 ${
                            star <= 3 ? 'text-red-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
                  View Full Wishlist
                </button>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Live
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroMobile;