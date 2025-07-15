// components/AddWishModal.tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Modal from './Modal'
import { ExternalLink, Loader2 } from 'lucide-react'

interface Basket {
  id: number
  name: string
  description: string | null
  color: string
  user_id: string
}

interface WishlistItem {
  id?: number
  url: string
  name?: string
  description?: string
  cost?: number
  user_id: string
  baskets?: Basket[]
}

interface AddWishModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingWish?: WishlistItem | null
  availableBaskets: Basket[]
}

const AddWishModal: React.FC<AddWishModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingWish,
  availableBaskets,
}) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    description: '',
    cost: '',
  })
  const [selectedBaskets, setSelectedBaskets] = useState<number[]>([])

  // Initialize form data when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (editingWish) {
        setFormData({
          url: editingWish.url || '',
          name: editingWish.name || '',
          description: editingWish.description || '',
          cost: editingWish.cost ? editingWish.cost.toString() : '',
        })
        setSelectedBaskets(editingWish.baskets?.map((b) => b.id) || [])
      } else {
        // Reset form for new wish
        setFormData({
          url: '',
          name: '',
          description: '',
          cost: '',
        })
        setSelectedBaskets([])
      }
      setError('')
    }
  }, [isOpen, editingWish])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBasketToggle = (basketId: number) => {
    setSelectedBaskets((prev) =>
      prev.includes(basketId)
        ? prev.filter((id) => id !== basketId)
        : [...prev, basketId]
    )
  }

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.url.trim()) {
        throw new Error('URL is required')
      }

      if (!validateUrl(formData.url)) {
        throw new Error('Please enter a valid URL')
      }

      // Ensure URL has protocol
      const normalizedUrl = formData.url.startsWith('http')
        ? formData.url
        : `https://${formData.url}`

      // Prepare wish data
      const wishData = {
        url: normalizedUrl,
        name: formData.name.trim() || null,
        description: formData.description.trim() || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        user_id: user.id,
      }

      let wishId: number

      if (editingWish) {
        // Update existing wish
        const { error: updateError } = await supabase
          .from('wishlist')
          .update(wishData)
          .eq('id', editingWish.id)
          .eq('user_id', user.id)

        if (updateError) throw updateError
        wishId = editingWish.id!

        // Remove existing basket associations
        const { error: deleteError } = await supabase
          .from('wishlist_item_collections')
          .delete()
          .eq('wishlist_item_id', wishId)

        if (deleteError) throw deleteError
      } else {
        // Create new wish
        const { data, error: insertError } = await supabase
          .from('wishlist')
          .insert([wishData])
          .select()
          .single()

        if (insertError) throw insertError
        wishId = data.id
      }

      // Add basket associations
      if (selectedBaskets.length > 0) {
        const basketAssociations = selectedBaskets.map((basketId) => ({
          wishlist_item_id: wishId,
          collection_id: basketId,
        }))

        const { error: basketError } = await supabase
          .from('wishlist_item_collections')
          .insert(basketAssociations)

        if (basketError) throw basketError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getDomain = (url: string): string => {
    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`
      return new URL(normalizedUrl).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWish ? 'Edit Wish' : 'Add New Wish'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* URL Field */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-primary mb-1"
          >
            URL <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com or example.com"
              required
              className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
            {formData.url && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <ExternalLink className="w-4 h-4 text-muted" />
              </div>
            )}
          </div>
          {formData.url && (
            <p className="text-xs text-muted mt-1">
              Domain: {getDomain(formData.url)}
            </p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="What is this item? (optional)"
            className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
          />
          <p className="text-xs text-muted mt-1">
            If left empty, we'll use the domain name
          </p>
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-primary mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Why do you want this? Notes about the item..."
            rows={3}
            className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
          />
        </div>

        {/* Cost Field */}
        <div>
          <label
            htmlFor="cost"
            className="block text-sm font-medium text-primary mb-1"
          >
            Cost
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
              $
            </span>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
            />
          </div>
        </div>

        {/* Baskets Selection */}
        {availableBaskets.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Add to Baskets
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-custom rounded-lg p-2 bg-background">
              {availableBaskets.map((basket) => (
                <label
                  key={basket.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/10 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedBaskets.includes(basket.id)}
                    onChange={() => handleBasketToggle(basket.id)}
                    className="rounded border-custom text-primary focus:ring-primary/20"
                  />
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: basket.color }}
                    />
                    <span className="text-sm text-primary truncate">
                      {basket.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">
              Select which baskets should contain this wish
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-custom">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-custom text-primary rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.url.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingWish ? (
              'Update Wish'
            ) : (
              'Add Wish'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddWishModal
