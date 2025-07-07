import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const Profile: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Form fields
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('#3B82F6')
  const [darkMode, setDarkMode] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setNickname(profile.nickname || '')
      setFavoriteColor(profile.favorite_color || '#3B82F6')
      setDarkMode(profile.dark_mode || false)
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await updateProfile({
        username: username.trim(),
        nickname: nickname.trim() || null,
        favorite_color: favoriteColor,
        dark_mode: darkMode,
        avatar_url: avatarUrl.trim() || null,
      })
      setMessage('Profile updated successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: profile.dark_mode ? '#1f2937' : '#f9fafb',
        color: profile.dark_mode ? 'white' : 'black',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div
          className="p-6 border rounded-lg"
          style={{
            backgroundColor: profile.dark_mode ? '#374151' : 'white',
          }}
        >
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="p-3 border rounded-lg"
                style={{
                  backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                  color: profile.dark_mode ? 'white' : 'black',
                }}
              />

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname"
                className="p-3 border rounded-lg"
                style={{
                  backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                  color: profile.dark_mode ? 'white' : 'black',
                }}
              />
            </div>

            <div className="flex space-x-2">
              <input
                type="color"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                className="w-20 h-12 border rounded-lg"
              />
              <div className="flex-1">
                <label className="block text-sm mb-1">Favorite Color</label>
                <input
                  type="text"
                  value={favoriteColor}
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  style={{
                    backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                    color: profile.dark_mode ? 'white' : 'black',
                  }}
                />
              </div>
            </div>

            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="Avatar URL"
              className="w-full p-3 border rounded-lg"
              style={{
                backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                color: profile.dark_mode ? 'white' : 'black',
              }}
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span>Dark Mode</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
