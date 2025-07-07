// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { UserProfile } from '../lib/database.types'

interface AuthContextType {
  signUpNewUser: (
    email: string,
    password: string,
    username: string,
    nickname?: string
  ) => Promise<{
    success: boolean
    error?: string
    needsEmailConfirmation?: boolean
    data?: any
  }>
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; data?: any }>
  session: Session | null
  userProfile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ success: boolean; error?: string }>
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fetch user profile
const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error fetching profile:', error)
    return null
  }
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  console.log('🚀 AuthContextProvider RENDERING')

  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Sign up with additional profile data
  const signUpNewUser = async (
    email: string,
    password: string,
    username: string,
    nickname?: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: password,
        options: {
          data: {
            username: username,
            nickname: nickname || '',
          },
        },
      })

      if (error) {
        console.error('Error signing up: ', error)
        return { success: false, error: error.message }
      }

      // Check if user needs email confirmation
      if (data.user && !data.session) {
        return {
          success: true,
          needsEmailConfirmation: true,
          data,
        }
      }

      // If we get a session immediately (email confirmation disabled)
      return { success: true, data }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      return {
        success: false,
        error: 'An unexpected error occurred during signup.',
      }
    }
  }

  // Sign in
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      })

      if (error) {
        console.error('Sign-in error:', error.message)
        return { success: false, error: error.message }
      }

      console.log('Sign-in success:', data)
      return { success: true, data }
    } catch (error) {
      console.error(
        'Unexpected error during sign-in:',
        (error as Error).message
      )
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      }
    }
  }

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', session.user.id)

      if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null))
      return { success: true }
    } catch (error) {
      console.error('Unexpected error updating profile:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  useEffect(() => {
    console.log('🔥 useEffect STARTED')

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('📱 getSession result:', session?.user?.email || 'no session')
      setSession(session)

      if (session?.user) {
        console.log('👤 Fetching profile...')
        const profile = await fetchUserProfile(session.user.id)
        console.log('📋 Profile result:', profile?.username || 'no profile')
        setUserProfile(profile)
      }

      console.log('✅ Setting loading false')
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        '🔄 Auth change:',
        event,
        session?.user?.email || 'no session'
      )
      setSession(session)

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => {
      console.log('🧹 Cleaning up subscription')
      subscription.unsubscribe()
    }
  }, [])

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      setUserProfile(null)
    } catch (error) {
      console.error('Unexpected error during signout:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signUpNewUser,
        signInUser,
        session,
        userProfile,
        loading,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('UserAuth must be used within an AuthContextProvider')
  }
  return context
}
