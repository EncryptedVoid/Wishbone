import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sparkles, Droplets, Flame, Leaf, Heart, Gem, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

// Enhanced color options with creative names and icons
const colorOptions = [
  {
    id: 'blue',
    name: 'Ocean Depths',
    preview: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    icon: Droplets,
    description: 'Calm and professional'
  },
  {
    id: 'purple',
    name: 'Mystic Violet',
    preview: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    icon: Gem,
    description: 'Creative and mysterious'
  },
  {
    id: 'green',
    name: 'Forest Whisper',
    preview: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    icon: Leaf,
    description: 'Natural and harmonious'
  },
  {
    id: 'red',
    name: 'Crimson Flame',
    preview: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    icon: Flame,
    description: 'Bold and energetic'
  },
  {
    id: 'orange',
    name: 'Sunset Glow',
    preview: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    icon: Sun,
    description: 'Warm and optimistic'
  },
  {
    id: 'pink',
    name: 'Cherry Bloom',
    preview: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600',
    icon: Heart,
    description: 'Gentle and expressive'
  },
  {
    id: 'indigo',
    name: 'Twilight Storm',
    preview: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-indigo-600',
    icon: Moon,
    description: 'Deep and sophisticated'
  },
  {
    id: 'emerald',
    name: 'Jade Mist',
    preview: 'bg-emerald-500',
    gradient: 'from-emerald-400 to-emerald-600',
    icon: Gem,
    description: 'Fresh and luxurious'
  },
];

/**
 * Enhanced ColorThemeSelector Component - Advanced color theme selection with creative naming
 *
 * Enhanced Features:
 * - Creative color names with contextual descriptions
 * - Sophisticated glassmorphism with theme-aware styling
 * - Advanced color preview with gradient backgrounds
 * - Enhanced micro-interactions with particle effects
 * - Contextual icons for each color theme
 * - Improved accessibility with better visual feedback
 * - Staggered animations for color options
 */
const ColorThemeSelector = ({ className, size = 'md', layout = 'grid' }) => {
  const { colorTheme, changeColorTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  // Size configurations
  const sizeClasses = {
    sm: {
      button: 'p-2',
      icon: 'w-4 h-4',
      colorDot: 'w-4 h-4',
      text: 'text-responsive-xs',
      dropdown: 'min-w-[200px]'
    },
    md: {
      button: 'p-2.5',
      icon: 'w-5 h-5',
      colorDot: 'w-5 h-5',
      text: 'text-responsive-sm',
      dropdown: 'min-w-[240px]'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      colorDot: 'w-6 h-6',
      text: 'text-responsive-base',
      dropdown: 'min-w-[280px]'
    }
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorOptions.find(color => color.id === colorTheme);

  // ENHANCED MOTION VARIANTS
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const dropdownVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      rotateX: -5
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      rotateX: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const colorItemVariants = {
    initial: {
      opacity: 0,
      x: -10,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    },
    hover: {
      x: 6,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const checkmarkVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    },
    exit: {
      scale: 0,
      rotate: 180,
      transition: { duration: 0.2 }
    }
  };

  const sparkleVariants = {
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Enhanced trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative rounded-xl border transition-all duration-300 overflow-hidden",
          currentSize.button,
          "bg-gradient-to-r from-surface/90 via-background/80 to-surface/90",
          "border-border/50 hover:border-primary-400/50",
          "backdrop-blur-md shadow-lg hover:shadow-xl",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none"
        )}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        aria-label="Select color theme"
      >
        <div className="flex items-center gap-2 relative z-10">
          <Palette className={cn(currentSize.icon, "text-foreground")} />

          {/* Current color indicator */}
          {currentColor && (
            <motion.div
              className={cn(
                "rounded-full border-2 border-white shadow-sm",
                currentSize.colorDot,
                `bg-gradient-to-br ${currentColor.gradient}`
              )}
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 2px 8px rgba(0,0,0,0.1)",
                  "0 4px 12px rgba(0,0,0,0.2)",
                  "0 2px 8px rgba(0,0,0,0.1)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>

        {/* Button glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 rounded-xl"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Enhanced dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown content */}
            <motion.div
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn(
                "absolute top-full right-0 mt-3 p-3 z-50",
                currentSize.dropdown,
                "bg-gradient-to-br from-background/95 via-background/90 to-surface/95",
                "backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-xl before:pointer-events-none"
              )}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Header */}
              <motion.div
                className="mb-3 pb-2 border-b border-border/30"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary-500" />
                  <span className={cn("font-medium text-foreground", currentSize.text)}>
                    Theme Colors
                  </span>

                  {/* Decorative sparkle */}
                  <motion.div
                    variants={sparkleVariants}
                    animate="animate"
                  >
                    <Sparkles className="w-3 h-3 text-primary-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Color options */}
              <div className={cn(
                layout === 'grid'
                  ? 'grid grid-cols-2 gap-2'
                  : 'space-y-1'
              )}>
                {colorOptions.map((option, index) => {
                  const isSelected = colorTheme === option.id;
                  const IconComponent = option.icon;

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => {
                        changeColorTheme(option.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                        "hover:bg-surface/80 backdrop-blur-sm relative overflow-hidden",
                        isSelected && "bg-gradient-to-r from-surface/60 to-background/40 border border-border/50"
                      )}
                      variants={colorItemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      custom={index}
                    >
                      {/* Color preview with enhanced styling */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          className={cn(
                            "rounded-full border-2 border-white shadow-md",
                            currentSize.colorDot,
                            `bg-gradient-to-br ${option.gradient}`
                          )}
                          animate={isSelected ? {
                            scale: [1, 1.1, 1],
                            boxShadow: [
                              "0 2px 8px rgba(0,0,0,0.2)",
                              "0 4px 16px rgba(0,0,0,0.3)",
                              "0 2px 8px rgba(0,0,0,0.2)"
                            ]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />

                        {/* Icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <IconComponent className="w-2.5 h-2.5 text-white/80" />
                        </div>
                      </div>

                      {/* Color info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium text-foreground truncate", currentSize.text)}>
                            {option.name}
                          </span>

                          {/* Selection indicator */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                variants={checkmarkVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="flex-shrink-0"
                              >
                                <Check className="w-3 h-3 text-primary-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <motion.p
                          className="text-responsive-xs text-muted/70 truncate"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {option.description}
                        </motion.p>
                      </div>

                      {/* Hover glow effect */}
                      <motion.div
                        className={cn(
                          "absolute inset-0 opacity-0 rounded-xl",
                          `bg-gradient-to-r ${option.gradient.replace('from-', 'from-').replace('to-', 'to-')}/10`
                        )}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer with current selection */}
              <motion.div
                className="mt-3 pt-2 border-t border-border/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-responsive-xs text-muted text-center">
                  Current: <span className="font-medium text-foreground">{currentColor?.name}</span>
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorThemeSelector;