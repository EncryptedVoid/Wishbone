import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const FooterMobile = () => {
  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B'],
      scalar: 0.8
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.footer
      className="relative overflow-hidden bg-gradient-to-b from-purple-600 via-pink-500 to-red-500"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Mobile-optimized background animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-16 left-8 w-4 h-4 bg-white rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="px-6 py-12">
        <motion.div
          className="flex flex-col items-center space-y-8 text-center"
          variants={containerVariants}
        >
          {/* Brand Section - Mobile Optimized */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                variants={pulseVariants}
                animate="animate"
              >
                <Zap className="w-10 h-10 text-yellow-300 fill-current" />
              </motion.div>
              <h2 className="text-5xl font-bold text-white tracking-tight">
                EyeWantIt
              </h2>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20"
              variants={itemVariants}
              whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                scale: 1.02
              }}
            >
              <p className="text-white text-lg font-semibold mb-2">
                Driving Education Excellence
              </p>
              <div className="flex items-center justify-center gap-2 text-white/80">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Since 2014</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>
          </motion.div>

          {/* Copyright Section - Mobile Card Style */}
          <motion.div
            className="w-full max-w-sm"
            variants={itemVariants}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30 shadow-lg"
              whileHover={{
                scale: 1.03,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-white text-xl font-bold mb-2">
                © {new Date().getFullYear()} EyeWantIt
              </div>
              <div className="text-white/80 text-sm font-medium">
                All rights reserved
              </div>
            </motion.div>
          </motion.div>

          {/* Credit Section - Mobile Stacked */}
          <motion.div
            className="w-full max-w-sm space-y-4"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center gap-2 text-white/90 text-lg"
              variants={itemVariants}
            >
              <span>Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-6 h-6 text-red-300 fill-current" />
              </motion.div>
              <span>by</span>
            </motion.div>

            <motion.a
              href="https://ashiq.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-white transition-all duration-300"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfetti}
              variants={itemVariants}
            >
              <motion.div
                className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </motion.div>

              <div className="text-2xl font-bold mb-2">Ashiq Gazi</div>
              <div className="text-white/80 text-sm font-medium">
                Software Engineer
              </div>

              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId="mobileHoverBackground"
              />
            </motion.a>
          </motion.div>

          {/* Bottom decorative element */}
          <motion.div
            className="flex items-center justify-center gap-3 pt-4"
            variants={itemVariants}
          >
            <motion.div
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-white/70 text-xs font-medium">
              Crafted with passion
            </span>
            <motion.div
              className="w-2 h-2 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.75
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default FooterMobile;