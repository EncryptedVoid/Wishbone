// src/components/ProfileSettings.tsx
import React, { useState } from 'react'
import { UserAuth } from '../contexts/AuthContext'

const ProfileSettings = () => {
  const { userProfile, updateProfile } = UserAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    nickname: userProfile?.nickname || '',
    favorite_color: userProfile?.favorite_color || '#3B82F6',
    dark_mode: userProfile?.dark_mode || false,
    avatar_url: userProfile?.avatar_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await updateProfile(formData)

      if (result.success) {
        setMessage('Profile updated successfully!')
        setEditing(false)
      } else {
        setMessage(result.error || 'Failed to update profile')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    }

    setLoading(false)

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000)
  }

  const handleCancel = () => {
    // Reset form to current profile values
    setFormData({
      username: userProfile?.username || '',
      nickname: userProfile?.nickname || '',
      favorite_color: userProfile?.favorite_color || '#3B82F6',
      dark_mode: userProfile?.dark_mode || false,
      avatar_url: userProfile?.avatar_url || '',
    })
    setEditing(false)
    setMessage('')
  }

  if (!userProfile) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Profile Settings</h2>

      {!editing ? (
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-700">Email:</strong>
            <span className="ml-2">{userProfile.email}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-700">Username:</strong>
            <span className="ml-2">{userProfile.username}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-700">Nickname:</strong>
            <span className="ml-2">{userProfile.nickname || 'Not set'}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded flex items-center">
            <strong className="text-gray-700">Favorite Color:</strong>
            <span
              className="inline-block w-8 h-8 ml-2 rounded border-2 border-gray-300"
              style={{ backgroundColor: userProfile.favorite_color }}
            ></span>
            <span className="ml-2 font-mono text-sm">
              {userProfile.favorite_color}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-700">Theme:</strong>
            <span className="ml-2">
              {userProfile.dark_mode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded">
            <strong className="text-gray-700">Avatar URL:</strong>
            <span className="ml-2 text-sm break-all">
              {userProfile.avatar_url || 'Not set'}
            </span>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Nickname/Call-sign:
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Favorite Color:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={formData.favorite_color}
                onChange={(e) =>
                  setFormData({ ...formData, favorite_color: e.target.value })
                }
                className="w-16 h-12 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.favorite_color}
                onChange={(e) =>
                  setFormData({ ...formData, favorite_color: e.target.value })
                }
                className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Avatar URL:
            </label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) =>
                setFormData({ ...formData, avatar_url: e.target.value })
              }
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Link to your profile picture (optional)
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dark_mode}
                onChange={(e) =>
                  setFormData({ ...formData, dark_mode: e.target.checked })
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium text-gray-700">
                {formData.dark_mode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </span>
            </label>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white px-4 py-3 rounded disabled:opacity-50 hover:bg-green-600 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 text-white px-4 py-3 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes('success')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default ProfileSettings
