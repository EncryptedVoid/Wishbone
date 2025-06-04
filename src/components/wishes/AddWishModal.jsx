import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Upload, X, Check, AlertCircle, Sparkles, Heart, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter
} from '../ui/Modal';
import Button from '../ui/Button';
import DesireScoreDisplay from './DesireScoreDisplay';
import TagChip, { TagGroup } from './TagChip';
import { mockCategories, mockCollections } from '../data/mockData';

/**
 * Enhanced AddWishModal Component - Modal for adding new wish items with advanced UX
 *
 * Enhanced Features:
 * - Progressive disclosure with animated section reveals
 * - Sophisticated form validation with real-time visual feedback
 * - Enhanced drag-and-drop interface with visual state indicators
 * - Advanced micro-interactions for all form elements
 * - Contextual animations that guide user attention
 * - Improved visual hierarchy with enhanced spacing and typography
 * - Smart form flow with contextual help and guidance
 * - Advanced loading states with meaningful progress indicators
 */
const AddWishModal = React.forwardRef(({
  isOpen = false,
  onClose,
  onSave,
  defaultCollection = 'all',
  ...props
}, ref) => {

  // Enhanced form state management
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    imageUrl: '',
    desireScore: 5,
    categoryTags: [],
    isPrivate: false,
    description: '',
    collectionId: defaultCollection === 'all' ? '' : defaultCollection
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragActive, setIsDragActive] = useState(false);
  const [urlExtracting, setUrlExtracting] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState({});

  // Enhanced form progression logic
  const totalSteps = 4;
  const stepTitles = [
    'Basic Information',
    'Visual Content',
    'Personal Details',
    'Organization'
  ];

  // Real-time form validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    const newSuccess = { ...validationSuccess };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Item name is required';
          delete newSuccess.name;
        } else if (value.length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
          delete newSuccess.name;
        } else {
          delete newErrors.name;
          newSuccess.name = true;
        }
        break;
      case 'link':
        if (!value.trim()) {
          newErrors.link = 'Product link is required';
          delete newSuccess.link;
        } else if (!isValidUrl(value)) {
          newErrors.link = 'Please enter a valid URL';
          delete newSuccess.link;
        } else {
          delete newErrors.link;
          newSuccess.link = true;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
          delete newSuccess.description;
        } else if (value.length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
          delete newSuccess.description;
        } else {
          delete newErrors.description;
          newSuccess.description = true;
        }
        break;
    }

    setErrors(newErrors);
    setValidationSuccess(newSuccess);
  };

  // Enhanced input handlers with validation
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleUrlChange = async (url) => {
    handleInputChange('link', url);

    if (url && isValidUrl(url)) {
      setUrlExtracting(true);
      try {
        // Simulate metadata extraction
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('TODO: Extract metadata from:', url);
      } catch (error) {
        console.error('Failed to extract metadata:', error);
      } finally {
        setUrlExtracting(false);
      }
    }
  };

  // Enhanced image upload with drag and drop
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        handleInputChange('imageUrl', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  // Enhanced tag management
  const handleAddTag = (tag) => {
    if (!formData.categoryTags.includes(tag)) {
      handleInputChange('categoryTags', [...formData.categoryTags, tag]);
    }
  };

  const handleRemoveTag = (tag) => {
    handleInputChange('categoryTags', formData.categoryTags.filter(t => t !== tag));
  };

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.link.trim()) newErrors.link = 'Product link is required';
    else if (!isValidUrl(formData.link)) newErrors.link = 'Please enter a valid URL';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.desireScore < 1 || formData.desireScore > 10) {
      newErrors.desireScore = 'Desire score must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced save handler
  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const wishData = {
        ...formData,
        id: `wish-${Date.now()}`,
        dateAdded: new Date(),
        isDibbed: false,
        dibbedBy: null
      };

      await onSave?.(wishData);
      handleClose();
    } catch (error) {
      console.error('Failed to save wish item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced close handler
  const handleClose = () => {
    setFormData({
      name: '',
      link: '',
      imageUrl: '',
      desireScore: 5,
      categoryTags: [],
      isPrivate: false,
      description: '',
      collectionId: defaultCollection === 'all' ? '' : defaultCollection
    });
    setErrors({});
    setValidationSuccess({});
    setImagePreview(null);
    setCurrentStep(1);
    onClose?.();
  };

  // Helper function
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // ENHANCED MOTION VARIANTS
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
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
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
      scale: 0.95,
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

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${(currentStep / totalSteps) * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  // Enhanced form field component
  const FormField = ({ label, error, success, required = false, children, description }) => (
    <motion.div variants={fieldVariants} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-responsive-sm font-medium text-foreground">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center text-success"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {description && (
        <p className="text-responsive-xs text-muted">{description}</p>
      )}
      {children}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1 text-responsive-xs text-error"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <Modal
      ref={ref}
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      className="max-w-2xl"
      {...props}
    >
      <motion.div
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Enhanced Header with Progress */}
        <ModalHeader className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <ModalTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary-500" />
                Add New Wish Item
              </ModalTitle>
              <ModalDescription>
                {stepTitles[currentStep - 1]} - Step {currentStep} of {totalSteps}
              </ModalDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-border/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* Sparkle effect */}
          <motion.div
            className="absolute top-4 right-16"
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
          </motion.div>
        </ModalHeader>

        <ModalBody scrollable className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-responsive-lg"
              >
                <FormField
                  label="Product Link"
                  required
                  error={errors.link}
                  success={validationSuccess.link}
                  description="Enter the URL where this item can be purchased"
                >
                  <div className="relative">
                    <motion.input
                      type="url"
                      value={formData.link}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://example.com/product"
                      className={cn(
                        'w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-300',
                        'bg-background text-foreground placeholder:text-muted',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        'hover:border-primary-500/50',
                        errors.link ? 'border-error focus:ring-error/50' : 'border-border',
                        validationSuccess.link && 'border-success focus:ring-success/50'
                      )}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />

                    {/* URL extraction loading */}
                    <AnimatePresence>
                      {urlExtracting && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FormField>

                <FormField
                  label="Item Name"
                  required
                  error={errors.name}
                  success={validationSuccess.name}
                  description="What would you like to call this item?"
                >
                  <motion.input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter a memorable name for this item"
                    className={cn(
                      'w-full px-4 py-3 border rounded-lg transition-all duration-300',
                      'bg-background text-foreground placeholder:text-muted',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'hover:border-primary-500/50',
                      errors.name ? 'border-error focus:ring-error/50' : 'border-border',
                      validationSuccess.name && 'border-success focus:ring-success/50'
                    )}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </FormField>
              </motion.div>
            )}

            {/* Step 2: Visual Content */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-responsive-lg"
              >
                <FormField
                  label="Product Image"
                  description="Add an image URL or upload a file to help visualize your wish"
                >
                  <div className="space-y-4">
                    {/* Image URL Input */}
                    <motion.input
                      type="url"
                      value={formData.imageUrl && !imagePreview ? formData.imageUrl : ''}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg transition-all duration-300',
                        'bg-background text-foreground placeholder:text-muted',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                        'hover:border-primary-500/50 border-border'
                      )}
                      whileFocus={{ scale: 1.02 }}
                    />

                    {/* Enhanced Drag and Drop Upload */}
                    <motion.div
                      className={cn(
                        'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
                        isDragActive ? 'border-primary-500 bg-primary-50/50' : 'border-border hover:border-primary-400',
                        'bg-gradient-to-br from-surface/50 to-background/30'
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.02 }}
                      animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />

                      <motion.div
                        animate={isDragActive ? { scale: 1.2 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <Upload className="w-8 h-8 mx-auto mb-3 text-muted" />
                      </motion.div>

                      <p className="text-responsive-sm font-medium text-foreground mb-1">
                        Drop an image here or click to browse
                      </p>
                      <p className="text-responsive-xs text-muted">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </motion.div>

                    {/* Image Preview */}
                    <AnimatePresence>
                      {(imagePreview || formData.imageUrl) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative inline-block"
                        >
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl border border-border shadow-lg"
                          />
                          <motion.button
                            onClick={() => {
                              setImagePreview(null);
                              handleInputChange('imageUrl', '');
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FormField>
              </motion.div>
            )}

            {/* Step 3: Personal Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-responsive-lg"
              >
                <FormField
                  label="Why do you want this?"
                  required
                  error={errors.description}
                  success={validationSuccess.description}
                  description="Describe what makes this item special to you"
                >
                  <motion.textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Share what draws you to this item and why it's meaningful..."
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 border rounded-lg resize-none transition-all duration-300',
                      'bg-background text-foreground placeholder:text-muted',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'hover:border-primary-500/50',
                      errors.description ? 'border-error focus:ring-error/50' : 'border-border',
                      validationSuccess.description && 'border-success focus:ring-success/50'
                    )}
                    whileFocus={{ scale: 1.02 }}
                  />
                </FormField>

                <FormField
                  label="Desire Level"
                  description="How much do you want this item? This helps prioritize your wishlist"
                >
                  <div className="p-4 bg-gradient-to-r from-surface/50 to-background/30 rounded-xl border border-border/50">
                    <DesireScoreDisplay
                      score={formData.desireScore}
                      variant="hearts"
                      size="md"
                      interactive
                      onChange={(score) => handleInputChange('desireScore', score)}
                      showLabel={false}
                    />
                    <motion.div
                      className="mt-3 text-center"
                      key={formData.desireScore}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-responsive-sm font-medium text-foreground">
                        {formData.desireScore <= 3 && "Mild Interest"}
                        {formData.desireScore > 3 && formData.desireScore <= 6 && "Moderate Desire"}
                        {formData.desireScore > 6 && formData.desireScore <= 8 && "Strong Want"}
                        {formData.desireScore > 8 && "Must Have!"}
                      </p>
                    </motion.div>
                  </div>
                </FormField>
              </motion.div>
            )}

            {/* Step 4: Organization */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-responsive-lg"
              >
                <FormField
                  label="Category Tags"
                  description="Add tags to help organize and filter your wishes"
                >
                  <div className="space-y-4">
                    {/* Selected Tags */}
                    <AnimatePresence>
                      {formData.categoryTags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <TagGroup>
                            {formData.categoryTags.map((tag, index) => (
                              <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <TagChip
                                  variant="primary"
                                  removable
                                  onRemove={() => handleRemoveTag(tag)}
                                >
                                  {tag}
                                </TagChip>
                              </motion.div>
                            ))}
                          </TagGroup>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Available Tags */}
                    <div>
                      <p className="text-responsive-xs text-muted mb-2">Choose from popular tags:</p>
                      <TagGroup>
                        {mockCategories
                          .filter(tag => !formData.categoryTags.includes(tag))
                          .slice(0, 12)
                          .map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <TagChip
                                variant="outline"
                                clickable
                                onClick={() => handleAddTag(tag)}
                              >
                                {tag}
                              </TagChip>
                            </motion.div>
                          ))}
                      </TagGroup>
                    </div>
                  </div>
                </FormField>

                <FormField
                  label="Collection"
                  description="Organize this wish into a specific collection"
                >
                  <motion.select
                    value={formData.collectionId}
                    onChange={(e) => handleInputChange('collectionId', e.target.value)}
                    className={cn(
                      'w-full px-4 py-3 border rounded-lg transition-all duration-300',
                      'bg-background text-foreground border-border',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                      'hover:border-primary-500/50'
                    )}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="">No specific collection</option>
                    {mockCollections
                      .filter(col => !col.isDefault)
                      .map(collection => (
                        <option key={collection.id} value={collection.id}>
                          {collection.icon} {collection.name}
                        </option>
                      ))}
                  </motion.select>
                </FormField>

                <FormField
                  label="Privacy Settings"
                  description="Control who can see this wish item"
                >
                  <motion.label
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-surface/50 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.input
                      type="checkbox"
                      checked={formData.isPrivate}
                      onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                      className="w-4 h-4 text-primary-500 border-border rounded focus:ring-2 focus:ring-primary-500/50"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <span className="text-responsive-sm font-medium text-foreground">
                        Make this item private
                      </span>
                      <p className="text-responsive-xs text-muted">
                        Only you will be able to see this wish
                      </p>
                    </div>
                  </motion.label>
                </FormField>
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {currentStep > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={loading}
                  >
                    Previous
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>

            {currentStep < totalSteps ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary-500 to-primary-600"
                >
                  Continue
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={loading}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg"
                >
                  Add to Wishlist
                </Button>
              </motion.div>
            )}
          </div>
        </ModalFooter>
      </motion.div>
    </Modal>
  );
});

AddWishModal.displayName = 'AddWishModal';

export default AddWishModal;