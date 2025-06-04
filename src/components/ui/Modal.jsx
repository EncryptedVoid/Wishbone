import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Enhanced Modal Component - Advanced modal system with sophisticated animations
 *
 * Enhanced Features:
 * - Multi-layer glassmorphism with dynamic blur effects
 * - Sophisticated entrance/exit animations with coordinated timing
 * - Enhanced backdrop with particle effects
 * - Advanced size variants with responsive scaling
 * - Improved accessibility with focus management
 * - Contextual animations based on modal content
 */
const Modal = React.forwardRef(({
  isOpen = false,
  onClose,
  size = 'md',
  className,
  children,
  backdrop = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  ...props
}, ref) => {

  const modalRef = useRef(null);

  // Enhanced size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    modalRef.current?.focus();

    return () => {
      previousFocus?.focus();
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // ENHANCED MOTION VARIANTS
  const backdropVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const modalVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      rotateX: -5
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      rotateX: 5,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced Backdrop */}
          {backdrop && (
            <motion.div
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
              onClick={handleBackdropClick}
            >
              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-500/30 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`
                  }}
                  variants={particleVariants}
                  animate="animate"
                  transition={{ delay: i * 0.5 }}
                />
              ))}
            </motion.div>
          )}

          {/* Enhanced Modal Container */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative w-full bg-background rounded-2xl shadow-2xl',
              'border border-border/50 overflow-hidden',
              'backdrop-blur-xl',
              // Multi-layer glassmorphism
              'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:pointer-events-none',
              'after:absolute after:inset-0 after:bg-gradient-to-t after:from-primary-500/5 after:via-transparent after:to-transparent after:pointer-events-none',
              sizeClasses[size],
              className
            )}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            {...props}
          >
            {/* Ambient glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 via-transparent to-primary-600/10 blur-2xl -z-10"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

/**
 * Enhanced ModalHeader Component
 */
const ModalHeader = React.forwardRef(({
  children,
  className,
  showClose = true,
  onClose,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      'px-6 pt-6 pb-4 border-b border-border/30 relative',
      'bg-gradient-to-r from-surface/50 to-background/30',
      className
    )}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
    {...props}
  >
    {children}

    {/* Enhanced close button */}
    {showClose && (
      <motion.button
        onClick={onClose}
        className={cn(
          'absolute top-4 right-4 p-2 rounded-xl',
          'bg-surface/80 hover:bg-surface border border-border/50',
          'text-muted hover:text-foreground transition-all duration-200',
          'backdrop-blur-sm shadow-sm hover:shadow-md'
        )}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Close modal"
      >
        <X className="w-4 h-4" />
      </motion.button>
    )}
  </motion.div>
));

ModalHeader.displayName = 'ModalHeader';

/**
 * Enhanced ModalTitle Component
 */
const ModalTitle = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <motion.h2
    ref={ref}
    className={cn(
      'text-xl font-semibold text-foreground leading-tight pr-12',
      'bg-gradient-to-r from-foreground to-foreground bg-clip-text',
      className
    )}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 20 }}
    {...props}
  >
    {children}
  </motion.h2>
));

ModalTitle.displayName = 'ModalTitle';

/**
 * Enhanced ModalDescription Component
 */
const ModalDescription = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <motion.p
    ref={ref}
    className={cn(
      'text-sm text-muted mt-2',
      className
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    {...props}
  >
    {children}
  </motion.p>
));

ModalDescription.displayName = 'ModalDescription';

/**
 * Enhanced ModalBody Component
 */
const ModalBody = React.forwardRef(({
  children,
  className,
  scrollable = false,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      'px-6 py-4',
      scrollable && 'max-h-96 overflow-y-auto',
      className
    )}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 20,
      staggerChildren: 0.1
    }}
    {...props}
  >
    {children}
  </motion.div>
));

ModalBody.displayName = 'ModalBody';

/**
 * Enhanced ModalFooter Component
 */
const ModalFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-3 px-6 pb-6 pt-4',
      'border-t border-border/30',
      'bg-gradient-to-r from-surface/30 to-background/20',
      className
    )}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 20,
      staggerChildren: 0.1
    }}
    {...props}
  >
    {children}
  </motion.div>
));

ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
export default Modal;