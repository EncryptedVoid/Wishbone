// components/DeleteConfirmModal.tsx
import React from 'react'
import Modal from './Modal'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title: string
  itemName: string
  itemType: 'wish' | 'basket'
  additionalWarning?: string
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  itemName,
  itemType,
  additionalWarning,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-primary mb-2">
            Are you sure you want to delete this {itemType}?
          </p>
          <p className="font-medium text-primary mb-2">"{itemName}"</p>
          <p className="text-sm text-muted">This action cannot be undone.</p>
          {additionalWarning && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              {additionalWarning}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-custom text-primary rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Delete ${itemType === 'wish' ? 'Wish' : 'Basket'}`
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal
