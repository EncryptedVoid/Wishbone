import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth()

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: profile?.dark_mode ? '#1f2937' : '#f9fafb',
        color: profile?.dark_mode ? 'white' : 'black',
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Welcome, {profile?.nickname || profile?.username || user?.email}!
          </h1>
          <div className="space-x-4">
            <Link
              to="/profile"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Profile
            </Link>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: profile?.dark_mode ? '#374151' : 'white',
              borderColor: profile?.favorite_color || '#3B82F6',
            }}
          >
            <h2 className="text-xl font-bold mb-4">Profile Info</h2>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            {profile && (
              <>
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Theme:</strong> {profile.dark_mode ? 'Dark' : 'Light'}
                </p>
                <div className="flex items-center mt-2">
                  <strong>Favorite Color:</strong>
                  <div
                    className="w-6 h-6 ml-2 rounded border"
                    style={{ backgroundColor: profile.favorite_color }}
                  />
                </div>
              </>
            )}
          </div>

          <div
            className="p-6 border rounded-lg"
            style={{
              backgroundColor: profile?.dark_mode ? '#374151' : 'white',
            }}
          >
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/profile"
                className="block text-blue-600 hover:text-blue-800"
              >
                Edit Profile
              </Link>
              <Link
                to="/settings"
                className="block text-blue-600 hover:text-blue-800"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
