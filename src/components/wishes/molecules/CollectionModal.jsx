import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  AlertCircle,
  Folder,
  Hash,
  Type,
  FileText,
  Palette
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * CollectionModal Component - Modern glassmorphic redesign
 * Beautiful, clean modal with enhanced visual hierarchy and smooth interactions
 */
const CollectionModal = React.forwardRef(({
  isOpen = false,
  onClose,
  onSave,
  mode = 'add',
  collection = null,
  loading = false,
  className,
  ...props
}, ref) => {

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    emoji: '📋',
    description: '',
    color: 'blue',
    isPrivate: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditMode = mode === 'edit' && collection;

  // Common emojis for collections
  const commonEmojis = [
    '📋', '📁', '🗂️', '📦', '🎯', '⭐', '❤️', '🎁', '🏠', '🎮',
    '📚', '🎵', '🎨', '💻', '📱', '👕', '🍕', '🚗', '✈️', '🏃',
    '💼', '🎭', '🌟', '🔥', '💎', '🎪', '🎊', '🎈', '🎂', '🎄'
  ];

  // Enhanced color themes with better gradients
  const colorThemes = [
    {
      id: 'blue',
      name: 'Ocean',
      class: 'bg-gradient-to-br from-blue-500 to-blue-600',
      preview: 'from-blue-100 via-blue-50 to-cyan-100',
      ring: 'ring-blue-500/30'
    },
    {
      id: 'green',
      name: 'Forest',
      class: 'bg-gradient-to-br from-emerald-500 to-green-600',
      preview: 'from-emerald-100 via-green-50 to-emerald-100',
      ring: 'ring-emerald-500/30'
    },
    {
      id: 'purple',
      name: 'Galaxy',
      class: 'bg-gradient-to-br from-purple-500 to-violet-600',
      preview: 'from-purple-100 via-violet-50 to-purple-100',
      ring: 'ring-purple-500/30'
    },
    {
      id: 'pink',
      name: 'Bloom',
      class: 'bg-gradient-to-br from-pink-500 to-rose-600',
      preview: 'from-pink-100 via-rose-50 to-pink-100',
      ring: 'ring-pink-500/30'
    },
    {
      id: 'orange',
      name: 'Sunset',
      class: 'bg-gradient-to-br from-orange-500 to-amber-600',
      preview: 'from-orange-100 via-amber-50 to-orange-100',
      ring: 'ring-orange-500/30'
    },
    {
      id: 'red',
      name: 'Fire',
      class: 'bg-gradient-to-br from-red-500 to-rose-600',
      preview: 'from-red-100 via-rose-50 to-red-100',
      ring: 'ring-red-500/30'
    },
    {
      id: 'indigo',
      name: 'Midnight',
      class: 'bg-gradient-to-br from-indigo-500 to-blue-600',
      preview: 'from-indigo-100 via-blue-50 to-indigo-100',
      ring: 'ring-indigo-500/30'
    },
    {
      id: 'gray',
      name: 'Stone',
      class: 'bg-gradient-to-br from-gray-500 to-slate-600',
      preview: 'from-gray-100 via-slate-50 to-gray-100',
      ring: 'ring-gray-500/30'
    }
  ];

  // Initialize form data when modal opens or collection changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: collection.name || '',
          emoji: collection.emoji || '📋',
          description: collection.description || '',
          color: collection.color || 'blue',
          isPrivate: collection.is_private || false
        });
      } else {
        setFormData({
          name: '',
          emoji: '📋',
          description: '',
          color: 'blue',
          isPrivate: false
        });
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, isEditMode, collection]);

  // Validation
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Collection name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (value.length > 50) {
          newErrors.name = 'Name must be 50 characters or less';
        } else {
          delete newErrors.name;
        }
        break;
      case 'description':
        if (value && value.length > 200) {
          newErrors.description = 'Description must be 200 characters or less';
        } else {
          delete newErrors.description;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // Handle input changes with validation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    setTimeout(() => validateField(field, value), 300);
  }, [validateField]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (formData.name.length > 50) newErrors.name = 'Name must be 50 characters or less';
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const saveData = {
        name: formData.name.trim(),
        emoji: formData.emoji,
        description: formData.description.trim(),
        color: formData.color,
        isPrivate: formData.isPrivate
      };

      await onSave?.(saveData);
      handleClose();
    } catch (error) {
      console.error('Error saving collection:', error);
      setErrors({ submit: error.message || 'Failed to save collection' });
    }
  }, [formData, validateForm, onSave]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose?.();
    setFormData({
      name: '',
      emoji: '📋',
      description: '',
      color: 'blue',
      isPrivate: false
    });
    setErrors({});
    setTouched({});
  }, [onClose]);

  // Animation variants
  const modalVariants = {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Enhanced backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md dark:bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal with glassmorphic design */}
          <motion.div
            ref={ref}
            className={cn(
              'relative z-10 w-full max-w-lg mx-auto overflow-hidden',
              'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
              'border border-white/30 dark:border-gray-700/40',
              'rounded-2xl shadow-2xl shadow-black/20',
              className
            )}
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            {...props}
          >
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/10" />

            {/* Header with enhanced styling */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/30 dark:border-gray-700/40">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {isEditMode ? 'Edit Collection' : 'Create Collection'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isEditMode ? 'Update your collection details' : 'Organize your ideas beautifully'}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Form Content with enhanced styling */}
            <div className="relative z-10 p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Collection Name */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Type className="w-4 h-4 inline mr-2" />
                  Collection Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter collection name..."
                    className={cn(
                      'w-full px-4 py-3.5 rounded-xl transition-all duration-300',
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                      'border border-white/40 dark:border-gray-700/50',
                      'text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
                      'hover:bg-white/80 dark:hover:bg-gray-800/80',
                      errors.name ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-700' : ''
                    )}
                    maxLength={50}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                    {formData.name.length}/50
                  </div>
                </div>
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </motion.div>
                )}
              </motion.div>

              {/* Emoji Selection with enhanced grid */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  <Hash className="w-4 h-4 inline mr-2" />
                  Choose an Emoji
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {commonEmojis.map((emoji, index) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      onClick={() => handleInputChange('emoji', emoji)}
                      className={cn(
                        'w-10 h-10 rounded-lg text-lg transition-all duration-200',
                        'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
                        'border border-white/30 dark:border-gray-700/40',
                        'hover:bg-white/70 dark:hover:bg-gray-800/70',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                        formData.emoji === emoji
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500/50 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                          : ''
                      )}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { delay: 0.2 + (index * 0.02) }
                      }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Color Theme Selection with enhanced cards */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Color Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {colorThemes.map((theme, index) => (
                    <motion.button
                      key={theme.id}
                      type="button"
                      onClick={() => handleInputChange('color', theme.id)}
                      className={cn(
                        'relative p-4 rounded-xl border transition-all duration-300 group',
                        'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
                        'hover:bg-white/60 dark:hover:bg-gray-800/60',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                        formData.color === theme.id
                          ? `border-blue-500/50 ${theme.ring} shadow-lg shadow-blue-500/20`
                          : 'border-white/30 dark:border-gray-700/40'
                      )}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.3 + (index * 0.05) }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-lg shadow-md',
                          theme.class
                        )} />
                        <div className="text-left">
                          <span className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                            {theme.name}
                          </span>
                          <div className={cn(
                            'w-16 h-2 rounded-full mt-1 bg-gradient-to-r',
                            theme.preview,
                            'dark:from-gray-700 dark:to-gray-600'
                          )} />
                        </div>
                      </div>
                      {formData.color === theme.id && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Description with enhanced styling */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description <span className="text-gray-500 text-xs font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="What makes this collection special?"
                    className={cn(
                      'w-full px-4 py-3.5 rounded-xl resize-none transition-all duration-300',
                      'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm',
                      'border border-white/40 dark:border-gray-700/50',
                      'text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
                      'hover:bg-white/80 dark:hover:bg-gray-800/80',
                      errors.description ? 'border-red-300 bg-red-50/50 dark:bg-red-900/20 dark:border-red-700' : ''
                    )}
                    rows={3}
                    maxLength={200}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                    {formData.description.length}/200
                  </div>
                </div>
                {errors.description && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </motion.div>
                )}
              </motion.div>

              {/* Privacy Setting with enhanced card */}
              <motion.div
                variants={fieldVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
              >
                <motion.label
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300',
                    'bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm',
                    'border border-white/30 dark:border-gray-700/40',
                    'hover:bg-white/60 dark:hover:bg-gray-800/60',
                    formData.isPrivate && 'bg-purple-50/50 dark:bg-purple-900/20 border-purple-300/50 dark:border-purple-700/50'
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={cn(
                      'w-5 h-5 rounded-md border-2 transition-all duration-200',
                      'flex items-center justify-center',
                      formData.isPrivate
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-gray-300 dark:border-gray-600'
                    )}>
                      {formData.isPrivate && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Private Collection
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Only you can see and access this collection
                    </p>
                  </div>
                </motion.label>
              </motion.div>

              {/* Submit Error with enhanced styling */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50"
                >
                  <div className="flex items-center gap-3 text-sm text-red-700 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{errors.submit}</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer with enhanced buttons */}
            <div className="relative z-10 flex items-center justify-end gap-3 p-6 border-t border-white/30 dark:border-gray-700/40 bg-gradient-to-t from-white/30 to-transparent dark:from-gray-800/30 dark:to-transparent backdrop-blur-sm">
              <motion.button
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 hover:bg-white/40 dark:hover:bg-gray-800/40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={loading || !formData.name.trim()}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300',
                  'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
                  'hover:from-blue-600 hover:to-purple-600',
                  'shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
                  'backdrop-blur-sm'
                )}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {isEditMode ? 'Update Collection' : 'Create Collection'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

CollectionModal.displayName = 'CollectionModal';

export default CollectionModal;