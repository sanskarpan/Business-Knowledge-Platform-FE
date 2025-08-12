import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      {user ? (
        <div className="space-y-2">
          <div>
            <span className="text-gray-500 text-sm">Email</span>
            <div className="text-gray-900">{user.email}</div>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Role</span>
            <div className="text-gray-900">{user.role}</div>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Joined</span>
            <div className="text-gray-900">{new Date(user.created_at).toLocaleString()}</div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No user data.</p>
      )}
    </div>
  )
}

export default Profile


