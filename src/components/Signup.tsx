// src/components/Signup.tsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../contexts/AuthContext'

const Signup = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [nickname, setNickname] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showEmailConfirmation, setShowEmailConfirmation] =
    useState<boolean>(false)

  const { signUpNewUser } = UserAuth()
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic validation
    if (!username.trim()) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      console.log('Starting signup process...')
      const result = await signUpNewUser(email, password, username, nickname)
      console.log('Signup result:', result)

      if (result.success) {
        if (result.needsEmailConfirmation) {
          // Show email confirmation message instead of navigating
          setShowEmailConfirmation(true)
        } else {
          // Direct login (email confirmation disabled)
          navigate('/dashboard')
        }
      } else {
        setError(result.error || 'An error occurred during sign up')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Show email confirmation message
  if (showEmailConfirmation) {
    return (
      <div className="max-w-md m-auto pt-24 text-center">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Check Your Email!
          </h2>
          <p className="text-green-700 mb-4">
            We've sent a confirmation link to <strong>{email}</strong>
          </p>
          <p className="text-green-600 text-sm mb-4">
            Click the link in your email to activate your account, then come
            back and sign in.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2 text-2xl">Sign up today!</h2>
        <p className="mb-4">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            required
          />
        </div>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            required
          />
        </div>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setNickname(e.target.value)}
            className="p-3 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="nickname"
            id="nickname"
            placeholder="Nickname/Call-sign (optional)"
            value={nickname}
          />
        </div>

        <div className="flex flex-col py-2">
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            id="password"
            placeholder="Password (min 6 characters)"
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 p-3 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>
            After signing up, you'll be able to customize your profile with
            favorite colors, dark mode preferences, and avatar.
          </p>
        </div>
      </form>
    </div>
  )
}

export default Signup
