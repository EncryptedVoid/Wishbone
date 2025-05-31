import { React, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './useAuth'

function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) setProfile(data)
    setLoading(false)
  }

  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }))
    }

    return { error }
  }

  return { profile, loading, updateProfile }
}