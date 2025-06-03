import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * ModalHeader Component - Header section for modals
 */
const ModalHeader = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-responsive-lg pt-responsive-lg pb-responsive-md',
      'border-b border-border',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ModalHeader.displayName = 'ModalHeader';

/**
 * ModalTitle Component - Title for modal headers
 */
const ModalTitle = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <h2
    ref={ref}
    className={cn(
      'text-responsive-xl font-semibold text-foreground leading-tight',
      'pr-8', // Space for close button
      className
    )}
    {...props}
  >
    {children}
  </h2>
));

ModalTitle.displayName = 'ModalTitle';

/**
 * ModalDescription Component - Description for modal headers
 */
const ModalDescription = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-responsive-sm text-muted mt-responsive-xs',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

ModalDescription.displayName = 'ModalDescription';

/**
 * ModalBody Component - Main content area of modals
 */
const ModalBody = React.forwardRef(({
  children,
  className,
  scrollable = false,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-responsive-lg py-responsive-md',
      scrollable && 'max-h-96 overflow-y-auto',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ModalBody.displayName = 'ModalBody';

/**
 * ModalFooter Component - Footer section for modals
 */
const ModalFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end gap-responsive-md',
      'px-responsive-lg pb-responsive-lg pt-responsive-md',
      'border-t border-border',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

ModalFooter.displayName = 'ModalFooter';

// Export all components
export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter };
export default Modal;