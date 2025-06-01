import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Sparkles, Code, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

const FooterDesktop = () => {
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#EF4444', '#F59E0B']
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.footer
      className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-10 left-20 w-4 h-4 bg-white rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 right-32 w-6 h-6 bg-white rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-3 h-3 bg-white rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 py-16">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"
          variants={containerVariants}
        >
          {/* Brand Section */}
          <motion.div
            className="text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="relative"
                variants={sparkleVariants}
                animate="animate"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white tracking-tight">
                EyeWantIt
              </h2>
            </motion.div>
            <motion.p
              className="text-white/90 text-lg font-medium"
              variants={itemVariants}
            >
              Driving Education Excellence Since 2014
            </motion.p>
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-2 mt-4 text-white/80"
              variants={itemVariants}
            >
              <Code className="w-5 h-5" />
              <span className="text-sm">Built with modern technology</span>
            </motion.div>
          </motion.div>

          {/* Copyright Section */}
          <motion.div
            className="text-center space-y-3"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Coffee className="w-5 h-5 text-white" />
              <span className="text-white text-lg font-semibold">
                © {new Date().getFullYear()} EyeWantIt
              </span>
            </motion.div>
            <p className="text-white/80 font-medium">
              All rights reserved
            </p>
          </motion.div>

          {/* Credit Section */}
          <motion.div
            className="text-center lg:text-right"
            variants={itemVariants}
          >
            <motion.div
              className="inline-flex flex-col items-center lg:items-end gap-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 text-white/90">
                <span className="text-lg">Made with</span>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="w-6 h-6 text-red-300 fill-current" />
                </motion.div>
                <span className="text-lg">by</span>
              </div>

              <motion.a
                href="https://ashiq.live/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white font-semibold text-lg transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConfetti}
              >
                <span>Ashiq Gazi</span>
                <motion.div
                  whileHover={{ rotate: 45 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId="hoverBackground"
                />
              </motion.a>

              <motion.span
                className="text-white/80 font-medium"
                variants={itemVariants}
              >
                (Software Engineer)
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/20"
          variants={itemVariants}
        >
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Crafted with passion and precision</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default FooterDesktop;