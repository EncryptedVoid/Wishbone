import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'
import { RealtimePresence } from '@supabase/supabase-js'

export function useAuth() {
  const [ user, setUser ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user)
        setLoading(false)

        // Auto-redirect logic
        if (user && window.location.pathname.startsWith('/auth')) {
            navigate('/', {replace : true})
        }
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)


        // Redirect on login
        if (event === 'SIGNED_OUT') {
            navigate('/', { replace: true})
        }

        if (event === 'SIGNED_IN') {
            navigate('/dashboard', { replace: true })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

  return { user, loading }
}