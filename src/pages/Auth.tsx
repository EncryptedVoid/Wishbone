// src/components/AuthPage.tsx
import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  email: string
  username: string
  nickname: string | null
  favorite_color: string
  dark_mode: boolean
  avatar_url: string | null
  created_at: string
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [favoriteColor, setFavoriteColor] = useState('#3B82F6')
  const [darkMode, setDarkMode] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        fetchProfile(user.id)
      }
    })
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) setProfile(data)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Create auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // 2. Create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email,
            username,
            nickname: nickname || null,
            favorite_color: favoriteColor,
            dark_mode: darkMode,
            avatar_url: avatarUrl || null,
          })

        if (profileError) throw profileError

        setMessage('Account created! Check your email to verify.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setUser(data.user)
        await fetchProfile(data.user.id)
        setMessage('Welcome back!')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setMessage('Signed out successfully')
  }

  const updateProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username,
          nickname: nickname || null,
          favorite_color: favoriteColor,
          dark_mode: darkMode,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id)

      if (error) throw error

      await fetchProfile(user.id)
      setMessage('Profile updated!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // If user is logged in, show dashboard
  if (user && profile) {
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
            <h1 className="text-3xl font-bold">
              Welcome, {profile.nickname || profile.username}!
            </h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>

          {/* Profile Info */}
          <div
            className="mb-8 p-6 border rounded-lg"
            style={{
              backgroundColor: profile.dark_mode ? '#374151' : 'white',
              borderColor: profile.favorite_color,
            }}
          >
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Email:</strong> {profile.email}
              </div>
              <div>
                <strong>Username:</strong> {profile.username}
              </div>
              <div>
                <strong>Nickname:</strong> {profile.nickname || 'Not set'}
              </div>
              <div className="flex items-center">
                <strong>Favorite Color:</strong>
                <div
                  className="w-6 h-6 ml-2 rounded border"
                  style={{ backgroundColor: profile.favorite_color }}
                />
                <span className="ml-2">{profile.favorite_color}</span>
              </div>
              <div>
                <strong>Theme:</strong> {profile.dark_mode ? 'Dark' : 'Light'}
              </div>
              <div>
                <strong>Avatar:</strong> {profile.avatar_url ? 'Set' : 'None'}
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: profile.dark_mode ? '#374151' : 'white',
            }}
          >
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="p-2 border rounded"
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
                className="p-2 border rounded"
                style={{
                  backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                  color: profile.dark_mode ? 'white' : 'black',
                }}
              />
              <input
                type="color"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                className="p-2 border rounded h-10"
              />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Avatar URL"
                className="p-2 border rounded"
                style={{
                  backgroundColor: profile.dark_mode ? '#4b5563' : 'white',
                  color: profile.dark_mode ? 'white' : 'black',
                }}
              />
              <label className="flex items-center col-span-2">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="mr-2"
                />
                Dark Mode
              </label>
            </div>
            <button
              onClick={updateProfile}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>

          {message && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Auth form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="mt-2 text-center text-gray-600">
            {isLogin ? 'Welcome back!' : 'Join us today'}
          </p>
        </div>

        <form
          onSubmit={isLogin ? handleSignIn : handleSignUp}
          className="space-y-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {!isLogin && (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Nickname (optional)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex space-x-2">
                <input
                  type="color"
                  value={favoriteColor}
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  className="w-20 h-12 border rounded-lg"
                />
                <div className="flex-1">
                  <label className="block text-sm text-gray-600">
                    Favorite Color
                  </label>
                  <input
                    type="text"
                    value={favoriteColor}
                    onChange={(e) => setFavoriteColor(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
              </div>

              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Avatar URL (optional)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span>Prefer dark mode</span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {message && (
          <div className="p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
