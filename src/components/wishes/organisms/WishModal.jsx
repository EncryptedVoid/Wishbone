import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  ArrowRight,
  Globe,
  Image as ImageIcon,
  FileText,
  Trash2,
  Palette
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../contexts/ThemeContext';

// Import atoms
import WishScore from '../atoms/WishScore';

/**
 * WishModal Component - Fixed infinite loop and enhanced collections modal
 *
 * Key Fixes:
 * - Resolved infinite re-render loop in validation system
 * - Updated collections modal with proper theme integration
 * - Improved validation dependency management
 * - Enhanced UX consistency across both modals
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

  // Get theme context for proper theming
  const { theme, colorTheme, isDark } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    imageUrl: '',
    score: 3,
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
    description: '',
    color: 'blue'
  });
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionErrors, setCollectionErrors] = useState({});

  // Category tags search state
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const totalSteps = 2;
  const isEditMode = mode === 'edit' && item;

  const stepTitles = [
    'Item Details & Media',
    'Organization & Privacy'
  ];

  // Common category tags for search
  const commonTags = [
    'Electronics', 'Fashion', 'Books', 'Home & Garden', 'Sports', 'Music',
    'Games', 'Art', 'Kitchen', 'Travel', 'Health', 'Beauty', 'Toys',
    'Jewelry', 'Automotive', 'Office', 'Fitness', 'Movies', 'Food', 'Outdoor',
    'Technology', 'Decor', 'Gadgets', 'Clothing', 'Accessories', 'Tools'
  ];

  // Collection color themes
  const collectionColorThemes = [
    { id: 'blue', name: 'Ocean', class: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'purple', name: 'Galaxy', class: 'from-purple-500 to-pink-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: 'green', name: 'Forest', class: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'orange', name: 'Sunset', class: 'from-orange-500 to-amber-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'red', name: 'Fire', class: 'from-red-500 to-rose-500', bg: 'bg-red-100 dark:bg-red-900/30' },
    { id: 'indigo', name: 'Midnight', class: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' }
  ];

  const limits = {
    name: 20,
    description: 15
  };

  // Helper functions - memoized to prevent recreation
  const isValidUrl = useMemo(() => (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const getWordCount = useMemo(() => (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, []);

  // FIXED: Validation function without error state dependency
  const validateField = useCallback((field, value, currentErrors = {}) => {
    const newErrors = { ...currentErrors };

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
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (getWordCount(value) > limits.description) {
          newErrors.description = `Description must be ${limits.description} words or less`;
        } else {
          delete newErrors.description;
        }
        break;
      case 'link':
        if (!value.trim()) {
          newErrors.link = 'Product link is required';
        } else if (!isValidUrl(value)) {
          newErrors.link = 'Please enter a valid URL';
        } else {
          delete newErrors.link;
        }
        break;
      case 'imageUrl':
        if (!value.trim()) {
          newErrors.imageUrl = 'Product image is required';
        } else {
          delete newErrors.imageUrl;
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

    return newErrors;
  }, [getWordCount, isValidUrl]); // Only stable dependencies

  // FIXED: Handle input changes without causing infinite loops
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Use functional state update to avoid dependency on errors
    setErrors(currentErrors => validateField(field, value, currentErrors));
  }, [validateField]);

  // Validate step 1 required fields
  const validateStep1 = useCallback(() => {
    const step1Fields = ['name', 'description', 'link', 'imageUrl'];
    let tempErrors = {};

    step1Fields.forEach(field => {
      tempErrors = validateField(field, formData[field], tempErrors);
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData, validateField]);

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
      setCollectionFormData({ name: '', emoji: '📋', description: '', color: 'blue' });
      setCollectionErrors({});
      setTagSearchQuery('');
      setShowTagDropdown(false);
    }
  }, [isOpen, isEditMode, item, defaultCollection]);

  // Handle URL changes
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
  }, [handleInputChange, isValidUrl]);

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

  // Handle image URL input
  const handleImageUrlChange = useCallback((url) => {
    handleInputChange('imageUrl', url);
    if (url && isValidUrl(url)) {
      setImagePreview(url);
    }
  }, [handleInputChange, isValidUrl]);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    handleInputChange('imageUrl', '');
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
  const filteredTags = useMemo(() =>
    commonTags.filter(tag =>
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
      !formData.categoryTags.includes(tag)
    ).slice(0, 8)
  , [tagSearchQuery, formData.categoryTags]);

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

  // Collection validation
  const validateCollectionField = useCallback((field, value) => {
    const newErrors = { ...collectionErrors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Collection name is required';
        } else if (value.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;
      default:
        break;
    }

    setCollectionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [collectionErrors]);

  // Handle collection input changes
  const handleCollectionInputChange = useCallback((field, value) => {
    setCollectionFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name') {
      setTimeout(() => validateCollectionField(field, value), 300);
    }
  }, [validateCollectionField]);

  // Enhanced collection creation with proper state management
  const handleCreateCollection = useCallback(async () => {
    if (!collectionFormData.name.trim()) {
      validateCollectionField('name', collectionFormData.name);
      return;
    }

    setCollectionLoading(true);
    try {
      const newCollection = {
        name: collectionFormData.name.trim(),
        emoji: collectionFormData.emoji,
        description: collectionFormData.description.trim(),
        color: collectionFormData.color
      };

      const created = await onCreateCollection?.(newCollection);
      if (created) {
        handleInputChange('collectionIds', [created.id]);
        setShowCollectionModal(false);
        setCollectionFormData({ name: '', emoji: '📋', description: '', color: 'blue' });
        setCollectionErrors({});
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      setCollectionErrors({ submit: error.message || 'Failed to create collection' });
    } finally {
      setCollectionLoading(false);
    }
  }, [collectionFormData, onCreateCollection, handleInputChange, validateCollectionField]);

  // Navigation helpers with validation
  const canGoNext = currentStep < totalSteps;
  const canGoPrevious = currentStep > 1;

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) setCurrentStep(prev => prev - 1);
  };

  // Form validation
  const validateForm = useCallback(() => {
    const step1Fields = ['name', 'description', 'link', 'imageUrl'];
    let tempErrors = {};

    step1Fields.forEach(field => {
      tempErrors = validateField(field, formData[field], tempErrors);
    });

    if (formData.score < 1 || formData.score > 5) {
      tempErrors.score = 'Score must be 1-5';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [formData, validateField]);

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
    setCollectionFormData({ name: '', emoji: '📋', description: '', color: 'blue' });
    setCollectionErrors({});
  }, [onClose]);

  // Theme-aware styles
  const getThemeStyles = useMemo(() => {
    const baseStyles = {
      backdrop: isDark
        ? 'bg-gradient-to-br from-slate-900/95 via-gray-900/90 to-black/95'
        : 'bg-gradient-to-br from-slate-100/95 via-white/90 to-gray-100/95',
      modal: isDark
        ? 'bg-slate-900/95 border-slate-700/50'
        : 'bg-white/95 border-gray-200/50',
      input: isDark
        ? 'bg-slate-800/80 border-slate-700/50 text-white placeholder-slate-400'
        : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500'
    };

    const colorStyles = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-emerald-500 to-teal-500'
    };

    return { ...baseStyles, gradient: colorStyles[colorTheme] || colorStyles.blue };
  }, [isDark, colorTheme]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Theme-aware backdrop */}
          <motion.div
            className={cn('absolute inset-0 backdrop-blur-xl', getThemeStyles.backdrop)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Container for side-by-side modals */}
          <div className="relative z-10 flex gap-6 w-full max-w-6xl">
            {/* UPDATED: Enhanced Collections Modal */}
            <AnimatePresence>
              {showCollectionModal && (
                <motion.div
                  className={cn(
                    'w-96 rounded-2xl shadow-2xl border backdrop-blur-2xl',
                    getThemeStyles.modal
                  )}
                  initial={{ opacity: 0, x: -100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* Enhanced Header */}
                  <div className="relative overflow-hidden">
                    <div className={cn('absolute inset-0 bg-gradient-to-r opacity-20', getThemeStyles.gradient)} />
                    <div className={cn('relative p-6 border-b', isDark ? 'border-slate-700/50' : 'border-gray-200/50')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r', getThemeStyles.gradient)}>
                            <Folder className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className={cn('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Create Collection</h3>
                            <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-600')}>Organize your wishes beautifully</p>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setShowCollectionModal(false)}
                          className={cn('p-3 rounded-xl transition-all duration-200', getThemeStyles.input)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Collection Name */}
                    <div>
                      <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                        <FileText className="w-4 h-4 text-blue-500" />
                        Collection Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={collectionFormData.name}
                        onChange={(e) => handleCollectionInputChange('name', e.target.value)}
                        placeholder="Enter collection name..."
                        className={cn(
                          'w-full px-4 py-3 rounded-xl transition-all duration-200',
                          getThemeStyles.input,
                          collectionErrors.name && 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                        )}
                        maxLength={50}
                      />
                      {collectionErrors.name && (
                        <span className="text-sm text-red-500 flex items-center gap-1 mt-2">
                          <AlertCircle className="w-4 h-4" />
                          {collectionErrors.name}
                        </span>
                      )}
                    </div>

                    {/* Enhanced Emoji Selection */}
                    <div>
                      <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Choose an Emoji
                      </label>
                      <div className="grid grid-cols-8 gap-2">
                        {['📋', '📁', '🗂️', '📦', '🎯', '⭐', '❤️', '🎁', '🏠', '🎮', '📚', '🎵', '🎨', '💻', '📱', '👕'].map((emoji) => (
                          <motion.button
                            key={emoji}
                            type="button"
                            onClick={() => handleCollectionInputChange('emoji', emoji)}
                            className={cn(
                              'w-10 h-10 rounded-lg text-lg transition-all duration-200 border',
                              getThemeStyles.input,
                              collectionFormData.emoji === emoji && 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/30'
                            )}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Color Theme Selection */}
                    <div>
                      <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                        <Palette className="w-4 h-4 text-purple-500" />
                        Color Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {collectionColorThemes.map((theme) => (
                          <motion.button
                            key={theme.id}
                            type="button"
                            onClick={() => handleCollectionInputChange('color', theme.id)}
                            className={cn(
                              'p-3 rounded-xl border transition-all duration-300 text-center',
                              getThemeStyles.input,
                              collectionFormData.color === theme.id && 'ring-2 ring-blue-500'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={cn('w-6 h-6 rounded-lg mx-auto mb-1 bg-gradient-to-r', theme.class)} />
                            <span className={cn('text-xs font-medium', isDark ? 'text-white' : 'text-gray-900')}>{theme.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Collection Description */}
                    <div>
                      <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                        <FileText className="w-4 h-4 text-green-500" />
                        Description <span className={cn('text-xs font-normal', isDark ? 'text-slate-400' : 'text-gray-500')}>(optional)</span>
                      </label>
                      <textarea
                        value={collectionFormData.description}
                        onChange={(e) => handleCollectionInputChange('description', e.target.value)}
                        placeholder="What makes this collection special?"
                        className={cn('w-full px-4 py-3 rounded-xl resize-none transition-all duration-200', getThemeStyles.input)}
                        rows={3}
                        maxLength={200}
                      />
                    </div>

                    {/* Error Display */}
                    {collectionErrors.submit && (
                      <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {collectionErrors.submit}
                        </span>
                      </div>
                    )}

                    {/* Enhanced Create Button */}
                    <motion.button
                      onClick={handleCreateCollection}
                      disabled={!collectionFormData.name.trim() || collectionLoading}
                      className={cn(
                        'w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2',
                        'bg-gradient-to-r', getThemeStyles.gradient,
                        'disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl'
                      )}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {collectionLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                      {collectionLoading ? 'Creating Collection...' : 'Create Collection'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Modal - Same as before but with fixed validation */}
            <motion.div
              ref={ref}
              className={cn(
                'shadow-2xl border rounded-2xl backdrop-blur-2xl',
                getThemeStyles.modal,
                showCollectionModal ? 'flex-1' : 'w-full max-w-4xl mx-auto',
                className
              )}
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              {...props}
            >
              {/* Header */}
              <div className="relative overflow-hidden">
                <div className={cn('absolute inset-0 bg-gradient-to-r opacity-20', getThemeStyles.gradient)} />
                <div className={cn('relative flex items-center justify-between p-6 border-b', isDark ? 'border-slate-700/50' : 'border-gray-200/50')}>
                  <div className="flex items-center gap-4">
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-r', getThemeStyles.gradient)}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                        {isEditMode ? 'Edit Wish' : 'Add New Wish'}
                      </h2>
                      <p className={cn('text-sm mt-1', isDark ? 'text-slate-400' : 'text-gray-600')}>
                        {stepTitles[currentStep - 1]} • Step {currentStep} of {totalSteps}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleClose}
                    className={cn('p-3 rounded-xl transition-all duration-200', getThemeStyles.input)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={cn('px-6 py-4', isDark ? 'bg-slate-800/50' : 'bg-gray-50/50')}>
                <div className="flex space-x-3">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex-1 h-2.5 rounded-full transition-all duration-500',
                        index < currentStep
                          ? `bg-gradient-to-r ${getThemeStyles.gradient} shadow-lg`
                          : isDark ? 'bg-slate-700' : 'bg-gray-300'
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Form Content - Grid Layout for Better Space Usage */}
              <div className="p-6 h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* Step 1 - Item Details & Media */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* Left Column - Basic Info */}
                      <div className="space-y-6">
                        {/* Item Name */}
                        <div>
                          <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                            <Heart className="w-4 h-4 text-red-500" />
                            Item Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="What do you want?"
                            className={cn(
                              'w-full px-4 py-3 rounded-xl transition-all duration-200',
                              getThemeStyles.input,
                              errors.name && 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                            )}
                            maxLength={200}
                          />
                          <div className="flex justify-between items-center mt-2">
                            {errors.name && (
                              <span className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.name}
                              </span>
                            )}
                            <span className={cn('text-xs ml-auto', isDark ? 'text-slate-400' : 'text-gray-500')}>
                              {getWordCount(formData.name)}/{limits.name} words
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                            <FileText className="w-4 h-4 text-blue-500" />
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Tell us more about this item..."
                            className={cn(
                              'w-full px-4 py-3 rounded-xl resize-none transition-all duration-200',
                              getThemeStyles.input,
                              errors.description && 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                            )}
                            rows={4}
                          />
                          <div className="flex justify-between items-center mt-2">
                            {errors.description && (
                              <span className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.description}
                              </span>
                            )}
                            <span className={cn('text-xs ml-auto', isDark ? 'text-slate-400' : 'text-gray-500')}>
                              {getWordCount(formData.description)}/{limits.description} words
                            </span>
                          </div>
                        </div>

                        {/* Product Link */}
                        <div>
                          <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                            <Globe className="w-4 h-4 text-green-500" />
                            Product Link <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formData.link}
                              onChange={(e) => handleUrlChange(e.target.value)}
                              placeholder="https://example.com/item"
                              className={cn(
                                'w-full px-12 py-3 rounded-xl transition-all duration-200',
                                getThemeStyles.input,
                                errors.link && 'border-red-500 bg-red-50/50 dark:bg-red-900/20'
                              )}
                            />
                            <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {urlExtracting && (
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                          {errors.link && (
                            <span className="text-sm text-red-500 flex items-center gap-1 mt-2">
                              <AlertCircle className="w-4 h-4" />
                              {errors.link}
                            </span>
                          )}
                        </div>

                        {/* Desire Score */}
                        <div>
                          <label className={cn('block text-sm font-bold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            How much do you want this?
                          </label>
                          <div className={cn('rounded-2xl p-4 border', getThemeStyles.input)}>
                            <WishScore
                              score={formData.score}
                              maxScore={5}
                              variant="hearts"
                              size="lg"
                              interactive={true}
                              onChange={(score) => handleInputChange('score', score)}
                              showLabel={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Media */}
                      <div className="space-y-6">
                        {/* Image Upload/Preview */}
                        <div>
                          <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                            <ImageIcon className="w-4 h-4 text-purple-500" />
                            Product Image <span className="text-red-500">*</span>
                          </label>

                          {/* Image Preview */}
                          {imagePreview ? (
                            <div className="relative">
                              <div className={cn('rounded-2xl p-4 border', getThemeStyles.input)}>
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-48 object-cover rounded-xl"
                                />
                              </div>
                              <motion.button
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ) : (
                            <div
                              className={cn(
                                'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer',
                                isDragActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-slate-600',
                                'hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
                              )}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              onClick={() => document.getElementById('image-upload').click()}
                            >
                              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                              <p className={cn('text-lg font-medium mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                                Drop image here or click to upload
                              </p>
                              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>
                                Supports JPG, PNG, GIF up to 10MB
                              </p>
                            </div>
                          )}

                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            className="hidden"
                          />

                          {/* Image URL Input Alternative */}
                          <div className="mt-4">
                            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-slate-300' : 'text-gray-700')}>
                              Or enter image URL:
                            </label>
                            <input
                              type="url"
                              value={formData.imageUrl}
                              onChange={(e) => handleImageUrlChange(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className={cn('w-full px-4 py-3 rounded-xl transition-all duration-200', getThemeStyles.input)}
                            />
                          </div>

                          {errors.imageUrl && (
                            <span className="text-sm text-red-500 flex items-center gap-1 mt-2">
                              <AlertCircle className="w-4 h-4" />
                              {errors.imageUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Organization & Privacy */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Collection Selection */}
                      <div>
                        <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                          <Folder className="w-4 h-4 text-purple-500" />
                          Collection
                        </label>
                        <div className="flex gap-3">
                          <select
                            value={formData.collectionIds[0] || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleInputChange('collectionIds', value ? [value] : []);
                            }}
                            className={cn('flex-1 px-4 py-3 rounded-xl transition-all duration-200', getThemeStyles.input)}
                          >
                            <option value="">No collection</option>
                            {collections.filter(c => c.id !== 'all').map((collection) => (
                              <option key={collection.id} value={collection.id}>
                                {collection.emoji || '📋'} {collection.name}
                              </option>
                            ))}
                          </select>
                          <motion.button
                            type="button"
                            onClick={() => setShowCollectionModal(true)}
                            className={cn(
                              'px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200',
                              'bg-gradient-to-r', getThemeStyles.gradient
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Category Tags - Horizontal Layout */}
                      <div>
                        <label className={cn('block text-sm font-bold mb-3 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                          <Tag className="w-4 h-4 text-orange-500" />
                          Category Tags
                        </label>

                        {/* Selected Tags */}
                        {formData.categoryTags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.categoryTags.map((tag) => (
                              <motion.span
                                key={tag}
                                className={cn(
                                  'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                                  'bg-gradient-to-r', getThemeStyles.gradient, 'text-white'
                                )}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {tag}
                                <motion.button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-3 h-3" />
                                </motion.button>
                              </motion.span>
                            ))}
                          </div>
                        )}

                        {/* Tag Search and Quick Add */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="relative">
                            <input
                              type="text"
                              value={tagSearchQuery}
                              onChange={(e) => setTagSearchQuery(e.target.value)}
                              onFocus={() => setShowTagDropdown(true)}
                              placeholder="Search tags..."
                              className={cn('w-full px-4 py-3 rounded-xl transition-all duration-200', getThemeStyles.input)}
                            />
                            {/* Horizontal dropdown */}
                            {showTagDropdown && filteredTags.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                  'absolute top-full left-0 right-0 mt-2 z-20 rounded-xl shadow-xl border backdrop-blur-xl',
                                  getThemeStyles.modal
                                )}
                              >
                                <div className="grid grid-cols-2 gap-1 p-2">
                                  {filteredTags.map((tag) => (
                                    <motion.button
                                      key={tag}
                                      onClick={() => handleAddTag(tag)}
                                      className={cn(
                                        'px-3 py-2 text-left rounded-lg transition-all duration-200 text-sm',
                                        'hover:bg-gradient-to-r', `hover:${getThemeStyles.gradient}`, 'hover:text-white'
                                      )}
                                      whileHover={{ x: 4 }}
                                    >
                                      {tag}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Quick add popular tags */}
                          <div className="flex flex-wrap gap-2">
                            {['Electronics', 'Fashion', 'Books', 'Home'].map((tag) => (
                              !formData.categoryTags.includes(tag) && (
                                <motion.button
                                  key={tag}
                                  onClick={() => handleAddTag(tag)}
                                  className={cn(
                                    'px-3 py-1 rounded-full text-sm transition-all duration-200 border',
                                    isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-100'
                                  )}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  + {tag}
                                </motion.button>
                              )
                            ))}
                          </div>
                        </div>

                        {/* Click outside handler */}
                        {showTagDropdown && (
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowTagDropdown(false)}
                          />
                        )}
                      </div>

                      {/* Enhanced Privacy Toggle */}
                      <div>
                        <label className={cn('block text-sm font-bold mb-3', isDark ? 'text-white' : 'text-gray-900')}>
                          Privacy Setting
                        </label>
                        <div className={cn('flex items-center justify-between p-4 rounded-xl border', getThemeStyles.input)}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center',
                              formData.isPrivate ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
                            )}>
                              {formData.isPrivate ? (
                                <EyeOff className="w-5 h-5 text-red-600 dark:text-red-400" />
                              ) : (
                                <Eye className="w-5 h-5 text-green-600 dark:text-green-400" />
                              )}
                            </div>
                            <div>
                              <p className={cn('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                                {formData.isPrivate ? 'Private Wish' : 'Public Wish'}
                              </p>
                              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-600')}>
                                {formData.isPrivate
                                  ? 'Only you can see this wish'
                                  : 'Friends can see and reserve this wish'
                                }
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                            className={cn(
                              'relative w-14 h-8 rounded-full transition-all duration-200',
                              formData.isPrivate ? 'bg-red-500' : 'bg-green-500'
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                              animate={{
                                x: formData.isPrivate ? 24 : 4
                              }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 rounded-xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.submit}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className={cn('flex items-center justify-between p-6 border-t', isDark ? 'border-slate-700/50' : 'border-gray-200/50')}>
                <div>
                  {canGoPrevious && (
                    <motion.button
                      onClick={handlePrevious}
                      className={cn('flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200', getThemeStyles.input)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </motion.button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleClose}
                    className={cn('px-6 py-2 rounded-xl transition-all duration-200', getThemeStyles.input)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>

                  {canGoNext ? (
                    <motion.button
                      onClick={handleNext}
                      disabled={!validateStep1()}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-200',
                        'bg-gradient-to-r', getThemeStyles.gradient,
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleSave}
                      disabled={loading}
                      className={cn(
                        'flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-200',
                        'bg-gradient-to-r from-emerald-500 to-teal-500',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {isEditMode ? 'Update Wish' : 'Add Wish'}
                    </motion.button>
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