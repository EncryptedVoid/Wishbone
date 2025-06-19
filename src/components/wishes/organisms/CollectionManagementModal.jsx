import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  Check,
  FolderPlus,
  Eye,
  EyeOff,
  ArrowRight
} from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * CollectionManagementModal - Collection CRUD interface (MVP Version)
 *
 * Features:
 * - Create new collections
 * - Edit existing collections
 * - Delete collections with item handling
 * - Private/public collection settings
 * - Confirmation dialogs for destructive actions
 * - Form validation and error handling
 */
const CollectionManagementModal = React.forwardRef(({
  isOpen = false,
  onClose,
  mode = 'create', // 'create' | 'edit' | 'delete'
  collection = null,
  collections = [],
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
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
  const [deleteOptions, setDeleteOptions] = useState({
    moveItemsToCollection: ''
  });
  const [confirmationStep, setConfirmationStep] = useState(false);

  // Available colors for collections
  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
    { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' }
  ];

  // Popular emoji options
  const emojiOptions = [
    '📋', '📁', '🎁', '💝', '🛍️', '🎯', '⭐', '💎',
    '🏠', '🚗', '📱', '💻', '👕', '👠', '📚', '🎮',
    '🍕', '☕', '🌟', '🔥', '❤️', '🎉', '🎨', '🏆'
  ];

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && collection) {
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
      setDeleteOptions({ moveItemsToCollection: '' });
      setConfirmationStep(false);
    }
  }, [isOpen, mode, collection]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Collection name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 30) {
      newErrors.name = 'Name must be 30 characters or less';
    }

    // Check for duplicate names (excluding current collection when editing)
    const duplicateName = collections.find(col =>
      col.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      (mode !== 'edit' || col.id !== collection?.id)
    );

    if (duplicateName) {
      newErrors.name = 'A collection with this name already exists';
    }

    if (formData.description.length > 100) {
      newErrors.description = 'Description must be 100 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, collections, mode, collection]);

  // Handle input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const collectionData = {
        name: formData.name.trim(),
        emoji: formData.emoji,
        description: formData.description.trim(),
        color: formData.color,
        isPrivate: formData.isPrivate
      };

      if (mode === 'create') {
        await onCreateCollection?.(collectionData);
      } else if (mode === 'edit') {
        await onUpdateCollection?.(collection.id, collectionData);
      }

      handleClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Operation failed' });
    }
  }, [formData, mode, collection, onCreateCollection, onUpdateCollection, validateForm]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!confirmationStep) {
      setConfirmationStep(true);
      return;
    }

    try {
      await onDeleteCollection?.(collection.id, deleteOptions);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to delete collection' });
    }
  }, [confirmationStep, collection, deleteOptions, onDeleteCollection]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose?.();
    setFormData({ name: '', emoji: '📋', description: '', color: 'blue', isPrivate: false });
    setErrors({});
    setDeleteOptions({ moveItemsToCollection: '' });
    setConfirmationStep(false);
  }, [onClose]);

  // Get modal configuration based on mode
  const getModalConfig = () => {
    switch (mode) {
      case 'create':
        return {
          title: 'Create New Collection',
          subtitle: 'Organize your wishes into collections',
          submitLabel: 'Create Collection',
          submitIcon: Plus,
          submitColor: 'bg-primary-500 hover:bg-primary-600'
        };
      case 'edit':
        return {
          title: 'Edit Collection',
          subtitle: `Editing "${collection?.name}"`,
          submitLabel: 'Update Collection',
          submitIcon: Check,
          submitColor: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'delete':
        return {
          title: confirmationStep ? 'Confirm Deletion' : 'Delete Collection',
          subtitle: confirmationStep
            ? `This will permanently delete "${collection?.name}"`
            : `Choose what to do with items in "${collection?.name}"`,
          submitLabel: confirmationStep ? 'Delete Forever' : 'Continue',
          submitIcon: confirmationStep ? Trash2 : ArrowRight,
          submitColor: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {};
    }
  };

  const modalConfig = getModalConfig();

  // Animation variants
  const modalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  const contentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          ref={ref}
          className={cn(
            'relative bg-background rounded-xl shadow-2xl border border-border',
            'w-full max-w-lg mx-auto',
            className
          )}
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {modalConfig.title}
              </h2>
              {modalConfig.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {modalConfig.subtitle}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Create/Edit Form */}
              {(mode === 'create' || mode === 'edit') && (
                <motion.div
                  key="form"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Collection Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Collection Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter collection name..."
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        errors.name ? 'border-red-300 bg-red-50' : 'border-border'
                      )}
                      maxLength={30}
                      disabled={collection?.is_default}
                    />
                    {errors.name && (
                      <span className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {errors.name}
                      </span>
                    )}
                    {collection?.is_default && (
                      <span className="text-sm text-muted-foreground mt-1">
                        Default collection name cannot be changed
                      </span>
                    )}
                  </div>

                  {/* Emoji Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Collection Emoji
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleInputChange('emoji', emoji)}
                          className={cn(
                            'w-10 h-10 rounded-lg border-2 transition-all duration-200',
                            'flex items-center justify-center text-lg',
                            formData.emoji === emoji
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-border hover:border-primary-300 hover:bg-muted/50'
                          )}
                          disabled={collection?.is_default}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {collection?.is_default && (
                      <span className="text-sm text-muted-foreground mt-2">
                        Default collection emoji cannot be changed
                      </span>
                    )}
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Collection Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => handleInputChange('color', color.value)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200',
                            formData.color === color.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-border hover:border-primary-300 hover:bg-muted/50'
                          )}
                        >
                          <div className={cn('w-4 h-4 rounded-full', color.class)} />
                          <span className="text-sm font-medium">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="What is this collection for?"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg transition-all duration-200 resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                        errors.description ? 'border-red-300 bg-red-50' : 'border-border'
                      )}
                      rows={3}
                      maxLength={100}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && (
                        <span className="text-sm text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.description}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formData.description.length}/100
                      </span>
                    </div>
                  </div>
                  {/* Privacy Setting */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Collection Privacy
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.isPrivate}
                        onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-2">
                        {formData.isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <div>
                          <span className="font-medium">
                            {formData.isPrivate ? 'Private collection' : 'Public collection'}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {formData.isPrivate
                              ? 'Only you can see this collection and its items'
                              : 'Friends can see this collection and its items'
                            }
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Delete Confirmation */}
              {mode === 'delete' && (
                <motion.div
                  key="delete"
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {!confirmationStep ? (
                    // Step 1: Choose what to do with items
                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-amber-800">
                              This collection contains {collection?.item_count || 0} items
                            </h3>
                            <p className="text-sm text-amber-700 mt-1">
                              Choose what happens to the items in this collection when it's deleted.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Option: Remove from collection only */}
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <input
                            type="radio"
                            name="deleteOption"
                            value="remove"
                            checked={deleteOptions.moveItemsToCollection === ''}
                            onChange={() => setDeleteOptions({ moveItemsToCollection: '' })}
                            className="w-4 h-4 text-primary-600 mt-1"
                          />
                          <div>
                            <span className="font-medium text-foreground">Remove from collection only</span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Items will remain in your wishlist but won't belong to any collection.
                            </p>
                          </div>
                        </label>

                        {/* Option: Move to another collection */}
                        <label className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <input
                            type="radio"
                            name="deleteOption"
                            value="move"
                            checked={deleteOptions.moveItemsToCollection !== ''}
                            onChange={() => setDeleteOptions({ moveItemsToCollection: 'placeholder' })}
                            className="w-4 h-4 text-primary-600 mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-foreground">Move to another collection</span>
                            <p className="text-sm text-muted-foreground mt-1 mb-3">
                              Transfer all items to a different collection.
                            </p>
                            {deleteOptions.moveItemsToCollection !== '' && (
                              <select
                                value={deleteOptions.moveItemsToCollection}
                                onChange={(e) => setDeleteOptions({ moveItemsToCollection: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="placeholder">Select a collection...</option>
                                {collections
                                  .filter(col => col.id !== collection?.id && !col.is_archived && !col.is_default)
                                  .map(col => (
                                    <option key={col.id} value={col.id}>
                                      {col.emoji} {col.name}
                                    </option>
                                  ))}
                              </select>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    // Step 2: Final confirmation
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="font-medium text-red-800">
                              This action cannot be undone
                            </h3>
                            <p className="text-sm text-red-700 mt-1">
                              The collection "{collection?.name}" will be permanently deleted.
                            </p>
                            {deleteOptions.moveItemsToCollection && (
                              <p className="text-sm text-red-700 mt-1">
                                All {collection?.item_count || 0} items will be moved to the selected collection.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-muted-foreground">
                          Type the collection name to confirm deletion:
                        </p>
                        <input
                          type="text"
                          placeholder={collection?.name}
                          className="mt-2 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.submit}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
            <div>
              {mode === 'delete' && confirmationStep && (
                <button
                  onClick={() => setConfirmationStep(false)}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={
                  mode === 'delete' ? handleDelete : handleSubmit
                }
                disabled={loading || (mode === 'delete' && deleteOptions.moveItemsToCollection === 'placeholder')}
                className={cn(
                  'flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  modalConfig.submitColor
                )}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <modalConfig.submitIcon className="w-4 h-4" />
                )}
                {modalConfig.submitLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

CollectionManagementModal.displayName = 'CollectionManagementModal';

export default CollectionManagementModal;