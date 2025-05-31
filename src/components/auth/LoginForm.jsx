import { React, useState } from 'react';
import { supabase } from '../../lib/supabase';


function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      setRetryCount(prev => prev + 1)

      // Rate limiting after multiple failures
      if (retryCount >= 3) {
        setError('Too many failed attempts. Please wait before trying again.')
        setTimeout(() => setRetryCount(0), 30000) // Reset after 30 seconds
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button
        type="submit"
        disabled={loading || retryCount >= 3}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}