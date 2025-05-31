import { React, useState } from 'react';
import { supabase } from '../../lib/supabase';


function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    dateOfBirth: '',
    favoriteColor: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Create profile with metadata
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: formData.email,
          nickname: formData.nickname,
          date_of_birth: formData.dateOfBirth,
          favorite_color: formData.favoriteColor
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // User is created but profile failed - handle this gracefully
      }
    }

    setLoading(false)
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        placeholder="Password"
        required
      />

      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => updateField('confirmPassword', e.target.value)}
        placeholder="Confirm Password"
        required
      />

      <input
        type="text"
        value={formData.nickname}
        onChange={(e) => updateField('nickname', e.target.value)}
        placeholder="Nickname"
      />

      <input
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => updateField('dateOfBirth', e.target.value)}
      />

      <select
        value={formData.favoriteColor}
        onChange={(e) => updateField('favoriteColor', e.target.value)}
      >
        <option value="">Select favorite color</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}