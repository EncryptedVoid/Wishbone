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
  ExternalLink,
  Plus,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Import atoms
import WishScore from '../atoms/WishScore';

/**
 * WishModal Component - Modal for adding and editing wish items with FIXED dark mode
 *
 * FIXED ISSUES:
 * - Enhanced dark mode support throughout all components
 * - Fixed input field styling for dark theme
 * - Improved backdrop and modal background for dark mode
 * - Better contrast and readability in dark theme
 * - Fixed collection modal styling for dark mode
 *
 * Features:
 * - Dual modal for add/edit and collection creation
 * - Two-step form with streamlined flow
 * - Real-time validation with word limits
 * - Side-by-side image upload and URL input
 * - Searchable category tag system
 * - Collection management integration
 * - Enhanced dark mode compatibility
 */
const WishModal = React.forwardRef(({
  isOpen = false,
  onClose,
  onSave,
  mode = 'add',
  item = null,
  collections = [],
  defaultCollection = null,
  onCreateCollection,
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
    score: 3, // Default to middle of 5-point scale
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

  // Collection creation modal state
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collectionFormData, setCollectionFormData] = useState({
    name: '',
    emoji: '📋',
    description: ''
  });

  // Category tags search state
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const totalSteps = 2;
  const isEditMode = mode === 'edit' && item;

  const stepTitles = [
    'Basic Information & Details',
    'Organization & Settings'
  ];

  // Common category tags for search
  const commonTags = [
    'Electronics', 'Fashion', 'Books', 'Home & Garden', 'Sports', 'Music',
    'Games', 'Art', 'Kitchen', 'Travel', 'Health', 'Beauty', 'Toys',
    'Jewelry', 'Automotive', 'Office', 'Fitness', 'Movies', 'Food', 'Outdoor',
    'Technology', 'Decor', 'Gadgets', 'Clothing', 'Accessories', 'Tools'
  ];

  const limits = {
    name: 20,
    description: 15
  };

  // Helper to check if URL is valid
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Initialize form data when modal opens or item changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          link: item.link || '',
          imageUrl: item.image_url || '',
          score: Math.round((item.score / 10) * 5) || 3,
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
          score: 3,
          isPrivate: false,
          collectionIds: defaultCollection ? [defaultCollection] : [],
          categoryTags: []
        });
        setImagePreview(null);
      }
      setErrors({});
      setTouched({});
      setCurrentStep(1);
      setShowCollectionModal(false);
      setTagSearchQuery('');
      setShowTagDropdown(false);
    }
  }, [isOpen, isEditMode, item, defaultCollection]);

  // Validation with word limits
  const validateField = useCallback((field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Item name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (getWordCount(value) > limits.name) {
          newErrors.name = `Name must be ${limits.name} words or less`;
        } else {
          delete newErrors.name;
        }
        break;
      case 'description':
        if (value && getWordCount(value) > limits.description) {
          newErrors.description = `Description must be ${limits.description} words or less`;
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
        if (value < 1 || value > 5) {
          newErrors.score = 'Score must be between 1 and 5';
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
    setTimeout(() => validateField(field, value), 300);
  }, [validateField]);

  // Handle URL changes with side-by-side layout
  const handleUrlChange = useCallback(async (url) => {
    handleInputChange('link', url);

    if (url && isValidUrl(url)) {
      setUrlExtracting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Extract metadata from:', url);
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

  // Tag management with search
  const filteredTags = commonTags.filter(tag =>
    tag.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
    !formData.categoryTags.includes(tag)
  );

  const handleAddTag = useCallback((tag) => {
    if (!formData.categoryTags.includes(tag)) {
      handleInputChange('categoryTags', [...formData.categoryTags, tag]);
      setTagSearchQuery('');
      setShowTagDropdown(false);
    }
  }, [formData.categoryTags, handleInputChange]);

  const handleRemoveTag = useCallback((tag) => {
    handleInputChange('categoryTags', formData.categoryTags.filter(t => t !== tag));
  }, [formData.categoryTags, handleInputChange]);

  // Collection creation
  const handleCreateCollection = useCallback(async () => {
    try {
      const newCollection = {
        name: collectionFormData.name.trim(),
        emoji: collectionFormData.emoji,
        description: collectionFormData.description.trim()
      };

      const created = await onCreateCollection?.(newCollection);
      if (created) {
        handleInputChange('collectionIds', [...formData.collectionIds, created.id]);
        setShowCollectionModal(false);
        setCollectionFormData({ name: '', emoji: '📋', description: '' });
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  }, [collectionFormData, onCreateCollection, formData.collectionIds, handleInputChange]);

  // Navigation helpers
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  const handleNext = () => {
    if (canGoNext) setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (canGoPrevious) setCurrentStep(prev => prev - 1);
  };

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (getWordCount(formData.name) > limits.name) newErrors.name = `Name must be ${limits.name} words or less`;
    if (formData.description && getWordCount(formData.description) > limits.description) {
      newErrors.description = `Description must be ${limits.description} words or less`;
    }
    if (formData.link && !isValidUrl(formData.link)) newErrors.link = 'Invalid URL';
    if (formData.score < 1 || formData.score > 5) newErrors.score = 'Score must be 1-5';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      setCurrentStep(1);
      return;
    }

    try {
      const saveData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        link: formData.link.trim(),
        imageUrl: formData.imageUrl,
        desireScore: Math.round((formData.score / 5) * 10),
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
    setFormData({
      name: '',
      description: '',
      link: '',
      imageUrl: '',
      score: 3,
      isPrivate: false,
      collectionIds: [],
      categoryTags: []
    });
    setErrors({});
    setTouched({});
    setCurrentStep(1);
    setImagePreview(null);
    setShowCollectionModal(false);
  }, [onClose]);

  // Animation variants
  const modalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const fieldVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* FIXED: Enhanced backdrop with better dark mode support */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm dark:bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Container for side-by-side modals */}
          <div className="relative z-10 flex gap-4 w-full max-w-4xl">
            {/* Collection Modal - Left Side */}
            <AnimatePresence>
              {showCollectionModal && (
                <motion.div
                  className={cn(
                    'flex-1 rounded-xl shadow-2xl border',
                    'bg-background border-border',
                    'dark:bg-background dark:border-border/50'
                  )}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-foreground">Create Collection</h3>
                      <button
                        onClick={() => setShowCollectionModal(false)}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          'hover:bg-muted/50 dark:hover:bg-muted/30'
                        )}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Collection Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Collection Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={collectionFormData.name}
                          onChange={(e) => setCollectionFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter collection name..."
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg transition-colors',
                            'bg-background text-foreground border-border',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                            'dark:bg-background/80 dark:border-border/50',
                            'dark:focus:ring-primary-400/50'
                          )}
                          maxLength={30}
                        />
                      </div>

                      {/* Collection Emoji */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Emoji <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={collectionFormData.emoji}
                          onChange={(e) => setCollectionFormData(prev => ({ ...prev, emoji: e.target.value }))}
                          placeholder="📋"
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg transition-colors',
                            'bg-background text-foreground border-border',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                            'dark:bg-background/80 dark:border-border/50',
                            'dark:focus:ring-primary-400/50'
                          )}
                          maxLength={2}
                        />
                      </div>

                      {/* Collection Description */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          Description <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <textarea
                          value={collectionFormData.description}
                          onChange={(e) => setCollectionFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="What is this collection for?"
                          className={cn(
                            'w-full px-3 py-2 border rounded-lg resize-none transition-colors',
                            'bg-background text-foreground border-border',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                            'dark:bg-background/80 dark:border-border/50',
                            'dark:focus:ring-primary-400/50'
                          )}
                          rows={3}
                          maxLength={100}
                        />
                      </div>

                      {/* Create Button */}
                      <button
                        onClick={handleCreateCollection}
                        disabled={!collectionFormData.name.trim()}
                        className={cn(
                          'w-full py-2 rounded-lg transition-colors',
                          'bg-primary-500 text-white hover:bg-primary-600',
                          'disabled:opacity-50 disabled:cursor-not-allowed',
                          'dark:bg-primary-600 dark:hover:bg-primary-700'
                        )}
                      >
                        Create Collection
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Modal - Right Side or Full Width */}
            <motion.div
              ref={ref}
              className={cn(
                'shadow-2xl border rounded-xl',
                'bg-background border-border',
                'dark:bg-background dark:border-border/50',
                showCollectionModal ? 'flex-1' : 'w-full max-w-2xl mx-auto',
                className
              )}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              {...props}
            >
              {/* Header */}
              <div className={cn(
                'flex items-center justify-between p-6 border-b',
                'border-border dark:border-border/50'
              )}>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {isEditMode ? 'Edit Wish' : 'Add New Wish'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stepTitles[currentStep - 1]} • Step {currentStep} of {totalSteps}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    'hover:bg-muted/50 dark:hover:bg-muted/30'
                  )}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className={cn(
                'px-6 py-3',
                'bg-muted/30 dark:bg-muted/20'
              )}>
                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex-1 h-2 rounded-full transition-all duration-300',
                        index < currentStep ? 'bg-primary-500' : 'bg-muted dark:bg-muted/50'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Step 1 - Basic Information & Details */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Item Name with word limit */}
                      <motion.div variants={fieldVariants}>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Item Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="What do you want?"
                          className={cn(
                            'w-full px-4 py-3 border rounded-lg transition-all duration-200',
                            'bg-background text-foreground border-border',
                            'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent',
                            'dark:bg-background/80 dark:border-border/50',
                            'dark:focus:ring-primary-400/50',
                            errors.name ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800' : ''
                          )}
                          maxLength={200}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {errors.name && (
                            <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.name}
                            </span>
                          )}
                          <span className={cn(
                            'text-xs ml-auto',
                            getWordCount(formData.name) > limits.name ? 'text-red-500' : 'text-muted-foreground'
                          )}>
                            {getWordCount(formData.name)}/{limits.name} words
                          </span>
                        </div>
                      </motion.div>

                      {/* Desire Score on main page (5-point scale) */}
                      <motion.div variants={fieldVariants}>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          How much do you want this? <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>
                        <div className="space-y-3">
                          <WishScore
                            score={formData.score}
                            maxScore={5}
                            variant="hearts"
                            size="lg"
                            interactive={true}
                            onChange={(score) => handleInputChange('score', score)}
                            showLabel={true}
                          />
                          {errors.score && (
                            <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.score}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 2: Organization & Settings */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Collection Selection with Create Option */}
                      <motion.div variants={fieldVariants}>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Collection <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>

                        <div className="flex gap-2">
                          <select
                            value={formData.collectionIds[0] || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange('collectionIds', value ? [value] : []);
                            }}
                            className={cn(
                              'flex-1 px-4 py-3 border rounded-lg transition-colors',
                              'bg-background text-foreground border-border',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                              'dark:bg-background/80 dark:border-border/50',
                              'dark:focus:ring-primary-400/50'
                            )}
                          >
                            <option value="">No collection</option>
                            {collections.filter(c => c.id !== 'all').map((collection) => (
                              <option key={collection.id} value={collection.id}>
                                {collection.emoji || '📋'} {collection.name}
                              </option>
                            ))}
                          </select>

                          {/* + icon to add collection */}
                          <button
                            type="button"
                            onClick={() => setShowCollectionModal(true)}
                            className={cn(
                              'px-4 py-3 border rounded-lg transition-colors flex items-center gap-2',
                              'border-border hover:bg-muted/50',
                              'dark:border-border/50 dark:hover:bg-muted/30'
                            )}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>

                      {/* Searchable Category Tags */}
                      <motion.div variants={fieldVariants}>
                        <label className="block text-sm font-medium text-foreground mb-3">
                          Category Tags <span className="text-muted-foreground text-xs">(optional)</span>
                        </label>

                        {/* Selected Tags */}
                        {formData.categoryTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.categoryTags.map((tag) => (
                              <motion.span
                                key={tag}
                                className={cn(
                                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm',
                                  'bg-primary-100 text-primary-700',
                                  'dark:bg-primary-900/30 dark:text-primary-300'
                                )}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                              >
                                {tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className={cn(
                                    'p-0.5 rounded-full transition-colors',
                                    'hover:bg-primary-200 dark:hover:bg-primary-800/50'
                                  )}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Tag Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            value={tagSearchQuery}
                            onChange={(e) => setTagSearchQuery(e.target.value)}
                            onFocus={() => setShowTagDropdown(true)}
                            placeholder="Search for tags..."
                            className={cn(
                              'w-full px-4 py-3 border rounded-lg transition-colors',
                              'bg-background text-foreground border-border',
                              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                              'dark:bg-background/80 dark:border-border/50',
                              'dark:focus:ring-primary-400/50'
                            )}
                          />

                          {/* Tag Dropdown */}
                          {showTagDropdown && filteredTags.length > 0 && (
                            <div className={cn(
                              'absolute top-full left-0 right-0 mt-1 z-10 max-h-48 overflow-y-auto',
                              'bg-background border border-border rounded-lg shadow-lg',
                              'dark:bg-background/95 dark:border-border/50'
                            )}>
                              {filteredTags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => handleAddTag(tag)}
                                  className={cn(
                                    'w-full px-4 py-2 text-left transition-colors flex items-center gap-2',
                                    'hover:bg-muted/50 dark:hover:bg-muted/30'
                                  )}
                                >
                                  <Tag className="w-4 h-4 text-muted-foreground" />
                                  {tag}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Click outside to close dropdown */}
                        {showTagDropdown && (
                          <div
                            className="fixed inset-0 z-5"
                            onClick={() => setShowTagDropdown(false)}
                          />
                        )}
                      </motion.div>

                      {/* Privacy Setting */}
                      <motion.div variants={fieldVariants}>
                        <label className={cn(
                          'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
                          'border-border hover:bg-muted/50',
                          'dark:border-border/50 dark:hover:bg-muted/30'
                        )}>
                          <input
                            type="checkbox"
                            checked={formData.isPrivate}
                            onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                            className={cn(
                              'w-4 h-4 rounded transition-colors',
                              'text-primary-600 focus:ring-primary-500',
                              'dark:focus:ring-primary-400'
                            )}
                          />
                          <div className="flex items-center gap-2">
                            {formData.isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <div>
                              <span className="font-medium text-foreground">
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
                </AnimatePresence>

                {/* Submit Error */}
                {errors.submit && (
                  <div className={cn(
                    'mt-4 p-3 rounded-lg border',
                    'bg-red-50 border-red-200',
                    'dark:bg-red-900/20 dark:border-red-800'
                  )}>
                    <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={cn(
                'flex items-center justify-between p-6 border-t',
                'border-border bg-muted/30',
                'dark:border-border/50 dark:bg-muted/20'
              )}>
                <div className="flex items-center gap-2">
                  {/* Previous button only shown after first page */}
                  {canGoPrevious && (
                    <motion.button
                      onClick={handlePrevious}
                      className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>

                  {canGoNext ? (
                    <button
                      onClick={handleNext}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
                        'bg-primary-500 text-white hover:bg-primary-600',
                        'dark:bg-primary-600 dark:hover:bg-primary-700'
                      )}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2 rounded-lg transition-colors',
                        'bg-primary-500 text-white hover:bg-primary-600',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'dark:bg-primary-600 dark:hover:bg-primary-700'
                      )}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {isEditMode ? 'Update Wish' : 'Add Wish'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});

WishModal.displayName = 'WishModal';

export default WishModal;