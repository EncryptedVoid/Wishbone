import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../contexts/AuthContext'

const Signin = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const { signInUser } = UserAuth()
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signInUser(email, password) // Use your signIn function

      if (result.success) {
        navigate('/dashboard')
        setError(null) // Reset the error on success
      } else {
        setError(result.error || 'An error occurred during sign in') // Set the error message if sign-in fails

        // Set a timeout to clear the error message after a specific duration (e.g., 3 seconds)
        setTimeout(() => {
          setError(null)
        }, 3000) // 3000 milliseconds = 3 seconds
      }
    } catch (err) {
      setError('An unexpected error occurred.')

      // Clear error after 3 seconds
      setTimeout(() => {
        setError(null)
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSignIn} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Sign in</h2>
        <p>
          Don't have an account yet? <Link to="/signup">Sign up</Link>
        </p>
        <div className="flex flex-col py-4">
          {/* <label htmlFor="Email">Email</label> */}
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 mt-2"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
          />
        </div>
        <div className="flex flex-col py-4">
          {/* <label htmlFor="Password">Password</label> */}
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 mt-2"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
      </form>
    </div>
  )
}

export default Signin
