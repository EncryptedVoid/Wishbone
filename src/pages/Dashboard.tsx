// src/routes/Dashboard.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../contexts/AuthContext'
import ProfileSettings from '../components/ProfileSettings'

const Dashboard = () => {
  const { session, userProfile, signOut, loading } = UserAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const [showProfile, setShowProfile] = useState(false)

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    try {
      await signOut()
      navigate('/')
    } catch (err) {
      setError('An unexpected error occurred.')
    }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <h2 className="text-xl">
            Welcome,{' '}
            {userProfile?.nickname ||
              userProfile?.username ||
              session?.user?.email}
            !
          </h2>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {showProfile ? 'Hide Profile' : 'Show Profile'}
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {userProfile && (
        <div
          className="mb-8 p-4 bg-gray-100 rounded"
          style={{
            backgroundColor: userProfile.dark_mode ? '#1f2937' : '#f3f4f6',
            color: userProfile.dark_mode ? 'white' : 'black',
          }}
        >
          <h3 className="font-bold mb-2">Quick Profile Overview:</h3>
          <p>
            <strong>Username:</strong> {userProfile.username}
          </p>
          <p>
            <strong>Nickname:</strong> {userProfile.nickname || 'Not set'}
          </p>
          <p>
            <strong>Theme:</strong>{' '}
            {userProfile.dark_mode ? 'Dark Mode' : 'Light Mode'}
          </p>
          <p>
            <strong>Favorite Color:</strong>
            <span
              className="inline-block w-4 h-4 ml-2 rounded border"
              style={{ backgroundColor: userProfile.favorite_color }}
            ></span>
          </p>
        </div>
      )}

      {showProfile && <ProfileSettings />}
    </div>
  )
}

export default Dashboard
