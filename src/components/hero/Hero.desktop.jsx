import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Star, ShoppingBag } from 'lucide-react';

const HeroDesktop = () => {
  const [scrolled, setScrolled] = useState(false);

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
        duration: 0.6,
        staggerChildren: 0.2
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

  const floatingVariants = {
    floating: {
      y: [-2, 2, -2],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-60 right-40 w-24 h-24 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-25 blur-3xl"></div>

        {/* Dot Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-600 rounded-full"
              style={{
                left: `${(i % 10) * 40}px`,
                top: `${Math.floor(i / 10) * 40}px`
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-32 left-1/4 w-8 h-8 border-2 border-purple-300 rotate-45 opacity-30"
          animate={{ rotate: [45, 405], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-pink-300 rounded-full opacity-25"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>


      {/* Main Hero Content */}
      <div className="pt-20 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid lg:grid-cols-5 gap-12 items-center min-h-[calc(100vh-5rem)]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - Primary Content */}
            <div className="lg:col-span-3 space-y-8">
              <motion.div variants={itemVariants}>
                <h1 className="text-6xl font-bold text-navy-900 leading-tight max-w-lg">
                  Your Wishlist,{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Their Perfect Gift
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                variants={itemVariants}
              >
                Create wishlists from any online store. Share with friends and family.
                Never get unwanted gifts again!
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Your Wishlist
                </motion.button>
                <motion.button
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg text-lg hover:bg-purple-50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  See How It Works
                </motion.button>
              </motion.div>

              <motion.div
                className="flex items-center space-x-4"
                variants={itemVariants}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-sm font-semibold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Join 12,000+</span> happy gift-givers and receivers
                </div>
              </motion.div>
            </div>

            {/* Right Column - Wishlist Card */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <motion.div
                className="relative"
                variants={itemVariants}
                animate="floating"
                variants={floatingVariants}
              >
                <div className="w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        S
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Sarah's Birthday Wishlist</h3>
                        <p className="text-sm text-gray-500">3 items • Updated today</p>
                      </div>
                    </div>
                  </div>

                  {/* Wishlist Items */}
                  <div className="p-4 space-y-4">
                    {/* Item 1 - iPhone */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">iPhone 15 Pro</h4>
                        <p className="text-sm text-gray-500 truncate">Latest model with amazing camera</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Heart
                              key={star}
                              className={`w-4 h-4 ${
                                star <= 5 ? 'text-red-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Item 2 - Nike Shoes */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        👟
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">Nike Air Max 270</h4>
                        <p className="text-sm text-gray-500 truncate">Comfortable running shoes</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Heart
                              key={star}
                              className={`w-4 h-4 ${
                                star <= 4 ? 'text-red-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Item 3 - Book */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">Atomic Habits</h4>
                        <p className="text-sm text-gray-500 truncate">Life-changing book about habits</p>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Heart
                              key={star}
                              className={`w-4 h-4 ${
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
                  className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Live
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