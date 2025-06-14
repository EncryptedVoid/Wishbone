import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Link,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Folder,
  Tag,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import WishScore from '../atoms/WishScore';

/**
 * WishModal Component - Universal modal for adding and editing wish items
 *
 * Features:
 * - Single modal for both add and edit modes
 * - Multi-step form with progress indication
 * - Real-time validation and feedback
 * - Image upload with drag & drop
 * - URL metadata extraction
 * - Category tag management
 * - Collection assignment
 * - Responsive design with mobile optimization
 * - No reload on typing (debounced updates)
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Handler to close modal
 * @param {function} onSave - Handler to save item data
 * @param {string} mode - Modal mode: 'add' | 'edit'
 * @param {Object} item - Item data for edit mode (null for add mode)
 * @param {Array} collections - Available collections
 * @param {string} defaultCollection - Default collection ID
 * @param {boolean} loading - Whether save operation is in progress
 * @param {string} className - Additional CSS classes
 */
const WishModal = React.forwardRef(({
  isOpen = false,
  onClose,
  onSave,
  mode = 'add',
  item = null,
  collections = [],
  defaultCollection = null,
  loading = false,
  className,
  ...props
}, ref) => {

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    imageUrl: '',
    score: 5,
    isPrivate: false,
    collectionIds: [],
    categoryTags: []
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [urlExtracting, setUrlExtracting] = useState(false);

  const totalSteps = 3;
  const isEditMode = mode === 'edit' && item;

  // Step titles
  const stepTitles = [
    'Basic Information',
    'Details & Scoring',
    'Organization'
  ];

  // Common category tags
  const commonTags = [
    'Electronics', 'Fashion', 'Books', 'Home & Garden', 'Sports', 'Music',
    'Games', 'Art', 'Kitchen', 'Travel', 'Health', 'Beauty', 'Toys',
    'Jewelry', 'Automotive', 'Office', 'Fitness', 'Movies', 'Food', 'Outdoor'
  ];

  // Initialize form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          link: item.link || '',
          imageUrl: item.image_url || '',
          score: item.score || 5,
          isPrivate: item.is_private || false,
          collectionIds: item.collection_ids || [],
          categoryTags: item.metadata?.categoryTags || []
        });
        setImagePreview(item.image_url || null);
      } else {
        setFormData({
          name: '',
          description: '',
          link: '',
          imageUrl: '',
          score: 5,
          isPrivate: false,
          collectionIds: defaultCollection ? [defaultCollection] : [],
          categoryTags: []
        });
        setImagePreview(null);
      }
      setErrors({});
      setTouched({});
      setCurrentStep(1);
    }
  }, [isOpen, isEditMode, item, defaultCollection]);

  // Validation functions
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Item name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'link':
        if (value && !isValidUrl(value)) {
          newErrors.link = 'Please enter a valid URL';
        } else {
          delete newErrors.link;
        }
        break;
      case 'score':
        if (value < 1 || value > 10) {
          newErrors.score = 'Score must be between 1 and 10';
        } else {
          delete newErrors.score;
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

    // Debounced validation to prevent constant re-renders
    setTimeout(() => validateField(field, value), 300);
  }, [validateField]);

  // Handle URL changes with metadata extraction
  const handleUrlChange = useCallback(async (url) => {
    handleInputChange('link', url);

    if (url && isValidUrl(url)) {
      setUrlExtracting(true);
      try {
        // Simulate metadata extraction - in real app, call actual service
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: Implement actual metadata extraction
        console.log('Extract metadata from:', url);

        // Example: could auto-fill name, description, imageUrl from URL

      } catch (error) {
        console.error('Failed to extract metadata:', error);
      } finally {
        setUrlExtracting(false);
      }
    }
  }, [handleInputChange]);

  // Handle image upload
  const handleImageUpload = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        handleInputChange('imageUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [handleInputChange]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  }, [handleImageUpload]);

  // Tag management
  const handleAddTag = useCallback((tag) => {
    if (!formData.categoryTags.includes(tag)) {
      handleInputChange('categoryTags', [...formData.categoryTags, tag]);
    }
  }, [formData.categoryTags, handleInputChange]);

  const handleRemoveTag = useCallback((tag) => {
    handleInputChange('categoryTags', formData.categoryTags.filter(t => t !== tag));
  }, [formData.categoryTags, handleInputChange]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.link && !isValidUrl(formData.link)) newErrors.link = 'Invalid URL';
    if (formData.score < 1 || formData.score > 10) newErrors.score = 'Score must be 1-10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      setCurrentStep(1); // Go back to first step with errors
      return;
    }

    try {
      const saveData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        imageUrl: formData.imageUrl,
        desireScore: formData.score,
        isPrivate: formData.isPrivate,
        collectionId: formData.collectionIds[0] || null,
        categoryTags: formData.categoryTags
      };

      await onSave?.(saveData);
      handleClose();
    } catch (error) {
      console.error('Error saving item:', error);
      setErrors({ submit: error.message || 'Failed to save item' });
    }
  }, [formData, validateForm, onSave]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Helper function
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Navigation functions
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && !errors.name && !errors.link;
      case 2:
        return !errors.score;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Animation variants
  const modalVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.3 }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          ref={ref}
          className={cn(
            'bg-background rounded-xl shadow-2xl border border-border',
            'w-full max-w-2xl max-h-[90vh] overflow-hidden',
            'backdrop-blur-xl',
            className
          )}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          {...props}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-surface/50 to-background/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary-500" />
                  {isEditMode ? 'Edit Wish Item' : 'Add New Wish Item'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {stepTitles[currentStep - 1]} - Step {currentStep} of {totalSteps}
                </p>
              </div>

              <motion.button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-surface/50 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-border/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Error Display */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Error saving item</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Item Name */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="What do you want?"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg transition-all duration-200',
                        'bg-background text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        errors.name ? 'border-red-300 focus:ring-red-500/50' : 'border-border hover:border-primary-500/50'
                      )}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  {/* Product Link */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://example.com/product"
                        className={cn(
                          'w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200',
                          'bg-background text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                          errors.link ? 'border-red-300 focus:ring-red-500/50' : 'border-border hover:border-primary-500/50'
                        )}
                      />
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                      {/* Loading indicator */}
                      {urlExtracting && (
                        <motion.div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full" />
                        </motion.div>
                      )}
                    </div>
                    {errors.link && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.link}
                      </p>
                    )}
                  </motion.div>

                  {/* Image Upload */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Product Image
                    </label>

                    {/* Image URL Input */}
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-border rounded-lg mb-3 text-sm"
                    />

                    {/* Drag & Drop Area */}
                    <motion.div
                      className={cn(
                        'relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300',
                        isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-border hover:border-primary-400',
                        'bg-gradient-to-br from-surface/50 to-background/30'
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.01 }}
                      animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drop an image here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </motion.div>

                    {/* Image Preview */}
                    <AnimatePresence>
                      {imagePreview && (
                        <motion.div
                          className="mt-3 relative inline-block"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl border border-border shadow-lg"
                          />
                          <motion.button
                            onClick={() => {
                              setImagePreview(null);
                              handleInputChange('imageUrl', '');
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 2: Details & Scoring */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Description */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Why do you want this item?"
                      rows={4}
                      className="w-full px-4 py-3 border border-border rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </motion.div>

                  {/* Desire Score */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      How much do you want this?
                    </label>
                    <div className="p-4 bg-gradient-to-r from-surface/50 to-background/30 rounded-xl border border-border/50">
                      <WishScore
                        score={formData.score}
                        variant="hearts"
                        size="md"
                        interactive={true}
                        onChange={(score) => handleInputChange('score', score)}
                        showLabel={true}
                      />
                    </div>
                    {errors.score && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.score}
                      </p>
                    )}
                  </motion.div>

                  {/* Privacy Setting */}
                  <motion.div variants={fieldVariants}>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-surface/50 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={formData.isPrivate}
                        onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                        className="w-4 h-4 text-primary-500 border-border rounded focus:ring-2 focus:ring-primary-500/50"
                      />
                      <div className="flex items-center gap-2">
                        {formData.isPrivate ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {formData.isPrivate ? 'Private item' : 'Public item'}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {formData.isPrivate
                              ? 'Only you can see this wish'
                              : 'Friends can see and reserve this wish'
                            }
                          </p>
                        </div>
                      </div>
                    </label>
                  </motion.div>
                </motion.div>
              )}

              {/* Step 3: Organization */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Category Tags */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Category Tags
                    </label>

                    {/* Selected Tags */}
                    {formData.categoryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.categoryTags.map((tag) => (
                          <motion.span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="p-0.5 hover:bg-primary-200 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Available Tags */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Choose from popular categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {commonTags
                          .filter(tag => !formData.categoryTags.includes(tag))
                          .slice(0, 12)
                          .map((tag) => (
                            <motion.button
                              key={tag}
                              onClick={() => handleAddTag(tag)}
                              className="px-3 py-1 text-sm border border-border rounded-full hover:bg-surface/50 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {tag}
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Collection Assignment */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Add to Collection
                    </label>
                    <select
                      value={formData.collectionIds[0] || ''}
                      onChange={(e) => handleInputChange('collectionIds', e.target.value ? [e.target.value] : [])}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="">No specific collection</option>
                      {collections
                        .filter(col => !col.isDefault)
                        .map(collection => (
                          <option key={collection.id} value={collection.id}>
                            {collection.emoji || '📁'} {collection.name}
                          </option>
                        ))}
                    </select>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 bg-gradient-to-r from-surface/30 to-background/20">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <div>
                {currentStep > 1 && (
                  <motion.button
                    onClick={handlePrevious}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous
                  </motion.button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <motion.button
                    onClick={handleNext}
                    disabled={!canGoNext() || loading}
                    className={cn(
                      'px-6 py-2 text-sm font-medium rounded-lg transition-colors',
                      'bg-primary-500 hover:bg-primary-600 text-white',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                    whileHover={canGoNext() ? { scale: 1.02 } : {}}
                    whileTap={canGoNext() ? { scale: 0.98 } : {}}
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSave}
                    disabled={loading || !canGoNext()}
                    className={cn(
                      'px-6 py-2 text-sm font-medium rounded-lg transition-colors',
                      'bg-primary-500 hover:bg-primary-600 text-white',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'flex items-center gap-2'
                    )}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {isEditMode ? 'Update Item' : 'Add to Wishlist'}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

WishModal.displayName = 'WishModal';

export default WishModal;