import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showInactivityModal, setShowInactivityModal] = useState(false)
  const navigate = useNavigate()

  // Refs for timers
  const inactivityTimer = useRef(null)
  const warningTimer = useRef(null)
  const lastActivity = useRef(Date.now())

  // Constants
  const INACTIVITY_TIME = 5 * 60 * 1000 // 5 minutes
  // const WARNING_TIME = 1 * 60 * 1000 // 1 minute warning
  const WARNING_TIME = 20 * 1000

  // Activity tracking
  const trackActivity = useCallback(() => {
    lastActivity.current = Date.now()
    setShowInactivityModal(false)

    // Clear existing timers
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (warningTimer.current) clearTimeout(warningTimer.current)

    // Only start timers if user is authenticated
    if (user) {
      // Set warning timer (4 minutes)
      warningTimer.current = setTimeout(() => {
        setShowInactivityModal(true)
      }, INACTIVITY_TIME - WARNING_TIME)

      // Set auto-logout timer (5 minutes)
      inactivityTimer.current = setTimeout(async () => {
        await handleInactivityLogout()
      }, INACTIVITY_TIME)
    }
  }, [user])

  // Handle automatic logout due to inactivity
  const handleInactivityLogout = async () => {
    try {
      setShowInactivityModal(false)
      await supabase.auth.signOut()
      // Navigation will be handled by the auth state change listener
    } catch (error) {
      console.error('Error during inactivity logout:', error)
    }
  }

  // Handle user confirming they're still active
  const handleStillActive = useCallback(() => {
    trackActivity()
  }, [trackActivity])

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Error getting initial user:', error)
        }

        setUser(user)

        // Only auto-redirect from auth page if user is authenticated
        // and we're currently on the auth page
        if (user && window.location.pathname === '/auth') {
          navigate('/dashboard', { replace: true })
        }

      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null
        setUser(newUser)

        if (event === 'SIGNED_OUT') {
          // Clear timers on sign out
          if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
          if (warningTimer.current) clearTimeout(warningTimer.current)
          setShowInactivityModal(false)

          // Only redirect to auth if we're on a protected route
          const protectedRoutes = ['/dashboard', '/memoirs', '/wishlist', '/events', '/friends', '/settings']
          const currentPath = window.location.pathname

          if (protectedRoutes.some(route => currentPath.startsWith(route))) {
            navigate('/auth', { replace: true })
          }
        }

        if (event === 'SIGNED_IN' && newUser) {
          // Start activity tracking for newly signed in user
          trackActivity()

          // Only auto-redirect if we're on the auth page
          if (window.location.pathname === '/auth') {
            navigate('/dashboard', { replace: true })
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      if (warningTimer.current) clearTimeout(warningTimer.current)
    }
  }, [navigate, trackActivity])

  // Set up activity listeners when user is authenticated
  useEffect(() => {
    if (user && !loading) {
      // Events to track as user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

      // Start initial activity tracking
      trackActivity()

      // Add activity listeners
      events.forEach(event => {
        document.addEventListener(event, trackActivity, true)
      })

      return () => {
        // Clean up listeners
        events.forEach(event => {
          document.removeEventListener(event, trackActivity, true)
        })
      }
    }
  }, [user, loading, trackActivity])

  return {
    user,
    loading,
    showInactivityModal,
    handleStillActive,
    handleInactivityLogout
  }
}