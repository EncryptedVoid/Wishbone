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
  Type,
  FileText
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import WishScore from '../atoms/WishScore';

/**
 * Enhanced WishModal Component - With word limits and improved validation
 *
 * New Features:
 * - Word limits for title (10 words) and description (50 words)
 * - Real-time character and word counting
 * - Better error handling and validation
 * - Improved performance with debounced validation
 * - Enhanced theme-aware styling
 * - Better form structure and accessibility
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

  // Form state with initial values
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

  // Word and character limits
  const LIMITS = {
    title: {
      maxWords: 10,
      maxChars: 80
    },
    description: {
      maxWords: 50,
      maxChars: 300
    }
  };

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

  // Word counting utility
  const countWords = useCallback((text) => {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, []);

  // Get word and character counts for validation display
  const getWordCount = useCallback((field) => {
    const text = formData[field] || '';
    return {
      words: countWords(text),
      chars: text.length,
      maxWords: LIMITS[field]?.maxWords || Infinity,
      maxChars: LIMITS[field]?.maxChars || Infinity
    };
  }, [formData, countWords]);

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

  // Enhanced validation with word limits
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Item name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (value.length > LIMITS.title.maxChars) {
          newErrors.name = `Name cannot exceed ${LIMITS.title.maxChars} characters`;
        } else if (countWords(value) > LIMITS.title.maxWords) {
          newErrors.name = `Name cannot exceed ${LIMITS.title.maxWords} words`;
        } else {
          delete newErrors.name;
        }
        break;

      case 'description':
        if (value && value.length > LIMITS.description.maxChars) {
          newErrors.description = `Description cannot exceed ${LIMITS.description.maxChars} characters`;
        } else if (value && countWords(value) > LIMITS.description.maxWords) {
          newErrors.description = `Description cannot exceed ${LIMITS.description.maxWords} words`;
        } else {
          delete newErrors.description;
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
  }, [errors, countWords]);

  // Handle input changes with debounced validation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Debounced validation for better UX
    setTimeout(() => validateField(field, value), 300);
  }, [validateField]);

  // Image upload handler
  const handleImageUpload = useCallback((file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5MB' }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      handleInputChange('imageUrl', e.target.result);
      setErrors(prev => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, [handleInputChange]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
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
    if (formData.name.length > LIMITS.title.maxChars) newErrors.name = `Name too long`;
    if (countWords(formData.name) > LIMITS.title.maxWords) newErrors.name = `Name has too many words`;

    if (formData.description.length > LIMITS.description.maxChars) newErrors.description = `Description too long`;
    if (countWords(formData.description) > LIMITS.description.maxWords) newErrors.description = `Description has too many words`;

    if (formData.link && !isValidUrl(formData.link)) newErrors.link = 'Invalid URL';
    if (formData.score < 1 || formData.score > 10) newErrors.score = 'Score must be 1-10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, countWords]);

  // Handle save with better error handling
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
        score: Math.floor(formData.score), // Remove fractions
        isPrivate: formData.isPrivate,
        collectionId: formData.collectionIds[0] || null,
        categoryTags: formData.categoryTags
      };

      await onSave?.(saveData);
      handleClose();
    } catch (error) {
      console.error('Error saving item:', error);
      setErrors({ submit: error.message || 'Failed to save item. Please try again.' });
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
        return formData.name.trim() &&
               !errors.name &&
               !errors.description &&
               !errors.link &&
               countWords(formData.name) <= LIMITS.title.maxWords &&
               countWords(formData.description) <= LIMITS.description.maxWords;
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

  // Word count display component
  const WordCountDisplay = ({ field, label }) => {
    const counts = getWordCount(field);
    const isOverLimit = counts.words > counts.maxWords || counts.chars > counts.maxChars;

    return (
      <div className={cn(
        'flex items-center justify-between text-xs mt-1',
        isOverLimit ? 'text-red-500' : 'text-muted-foreground'
      )}>
        <span>{label}</span>
        <div className="flex gap-3">
          <span className={counts.words > counts.maxWords ? 'text-red-500 font-medium' : ''}>
            {counts.words}/{counts.maxWords} words
          </span>
          <span className={counts.chars > counts.maxChars ? 'text-red-500 font-medium' : ''}>
            {counts.chars}/{counts.maxChars} chars
          </span>
        </div>
      </div>
    );
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
                  className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Error saving item</span>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">{errors.submit}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information with Word Limits */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Item Name with Word Count */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="What do you want?"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg',
                        'bg-background text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        errors.name ? 'border-red-500' : 'border-border',
                        (countWords(formData.name) > LIMITS.title.maxWords ||
                         formData.name.length > LIMITS.title.maxChars) && 'border-red-500'
                      )}
                    />
                    <WordCountDisplay field="name" label="Title" />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  {/* Description with Word Count */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell us more about this item..."
                      rows={4}
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg resize-none',
                        'bg-background text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        errors.description ? 'border-red-500' : 'border-border',
                        (countWords(formData.description) > LIMITS.description.maxWords ||
                         formData.description.length > LIMITS.description.maxChars) && 'border-red-500'
                      )}
                    />
                    <WordCountDisplay field="description" label="Description" />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </p>
                    )}
                  </motion.div>

                  {/* Product Link */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      Product Link
                    </label>
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      placeholder="https://example.com/product"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg',
                        'bg-background text-foreground placeholder:text-muted-foreground',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        errors.link ? 'border-red-500' : 'border-border'
                      )}
                    />
                    {errors.link && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.link}
                      </p>
                    )}
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
                  {/* Image Upload */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Product Image (Optional)
                    </label>

                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
                        isDragActive ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-border',
                        'hover:border-primary-400 hover:bg-surface/50'
                      )}
                    >
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              handleInputChange('imageUrl', '');
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Remove image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                          <div>
                            <p className="text-sm text-foreground">
                              Drag and drop an image here, or{' '}
                              <label className="text-primary-600 hover:text-primary-700 cursor-pointer underline">
                                browse files
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e.target.files[0])}
                                  className="hidden"
                                />
                              </label>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Maximum file size: 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.image}
                      </p>
                    )}
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
                              ? 'Only you can see this item'
                              : 'Friends can see and claim this item'}
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
                  {/* Collection Assignment */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      Collection (Optional)
                    </label>
                    <select
                      value={formData.collectionIds[0] || ''}
                      onChange={(e) => handleInputChange('collectionIds', e.target.value ? [e.target.value] : [])}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    >
                      <option value="">No collection</option>
                      {collections.map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  {/* Category Tags */}
                  <motion.div variants={fieldVariants}>
                    <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category Tags
                    </label>

                    {/* Selected tags */}
                    {formData.categoryTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.categoryTags.map(tag => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-primary-900 dark:hover:text-primary-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Available tags */}
                    <div className="grid grid-cols-3 gap-2">
                      {commonTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          disabled={formData.categoryTags.includes(tag)}
                          className={cn(
                            'px-3 py-2 text-sm rounded-lg border transition-all duration-200',
                            formData.categoryTags.includes(tag)
                              ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 cursor-default'
                              : 'bg-background border-border hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-foreground hover:text-primary-600'
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Navigation */}
          <div className="px-6 py-4 border-t border-border/50 bg-surface/30">
            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  currentStep === 1
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-surface border border-border hover:border-primary-300'
                )}
              >
                Previous
              </button>

              {/* Step Indicators */}
              <div className="flex gap-2">
                {Array.from({ length: totalSteps }, (_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-200',
                      index + 1 === currentStep
                        ? 'bg-primary-500 scale-125'
                        : index + 1 < currentStep
                        ? 'bg-primary-300 dark:bg-primary-700'
                        : 'bg-border'
                    )}
                  />
                ))}
              </div>

              {/* Next/Save Button */}
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className={cn(
                    'px-6 py-2 rounded-lg font-medium transition-all duration-200',
                    canGoNext()
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading || !canGoNext()}
                  className={cn(
                    'px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
                    canGoNext() && !loading
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {isEditMode ? 'Update Item' : 'Add Item'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

WishModal.displayName = 'WishModal';

export default WishModal;