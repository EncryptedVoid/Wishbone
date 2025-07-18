// components/AddBasketModal.tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Modal from './Modal'
import { Loader2, Palette } from 'lucide-react'

interface Basket {
  id?: number
  name: string
  description: string | null
  color: string
  user_id: string
}

interface AddBasketModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingBasket?: Basket | null
}

const AddBasketModal: React.FC<AddBasketModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingBasket,
}) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#FF8A80',
  })

  // Predefined color palette
  const colorPalette = [
    '#FF8A80',
    '#FFCC9C',
    '#E6B377',
    '#A8C09A',
    '#C8A8D8',
    '#87CEEB',
    '#FFB6C1',
    '#DDA0DD',
    '#98FB98',
    '#F0E68C',
    '#FFA07A',
    '#20B2AA',
    '#9370DB',
    '#32CD32',
    '#FF6347',
  ]

  // Initialize form data when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (editingBasket) {
        setFormData({
          name: editingBasket.name || '',
          description: editingBasket.description || '',
          color: editingBasket.color || '#FF8A80',
        })
      } else {
        // Reset form for new basket
        setFormData({
          name: '',
          description: '',
          color: '#FF8A80',
        })
      }
      setError('')
    }
  }, [isOpen, editingBasket])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Basket name is required')
      }

      // Prepare basket data
      const basketData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        color: formData.color,
        user_id: user.id,
      }

      if (editingBasket) {
        // Update existing basket
        const { error: updateError } = await supabase
          .from('baskets')
          .update(basketData)
          .eq('id', editingBasket.id)
          .eq('user_id', user.id)

        if (updateError) throw updateError
      } else {
        // Create new basket
        const { error: insertError } = await supabase
          .from('baskets')
          .insert([basketData])

        if (insertError) throw insertError
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBasket ? 'Edit Basket' : 'Create New Basket'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1"
          >
            Basket Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Home Decor, Birthday Ideas, Tech Gadgets"
            required
            className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
          />
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
            placeholder="What kind of wishes will go in this basket?"
            rows={3}
            className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
          />
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            <Palette className="w-4 h-4 inline mr-1" />
            Basket Color
          </label>

          {/* Color Palette */}
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                  formData.color === color
                    ? 'border-primary shadow-lg'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-10 h-10 border border-custom rounded cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleColorSelect(e.target.value)}
                placeholder="#FF8A80"
                className="w-full px-3 py-2 border border-custom rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-sm"
              />
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-2 p-2 border border-custom rounded-lg bg-background">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-primary">
                {formData.name || 'Basket Name'} preview
              </span>
            </div>
          </div>
        </div>

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
            disabled={loading || !formData.name.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editingBasket ? (
              'Update Basket'
            ) : (
              'Create Basket'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddBasketModal
