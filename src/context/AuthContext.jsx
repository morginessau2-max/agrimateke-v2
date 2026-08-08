import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (_event, session) => {
    setUser(session?.user ?? null)
    if (session?.user) {
      await fetchProfile(session.user.id)
      // Check for pending invite after login
      const pendingToken = sessionStorage.getItem('inviteToken')
      if (pendingToken) {
        // Token will be picked up by App.jsx inviteToken state
      }
    } else {
      setProfile(null)
      setLoading(false)
    }
  }
)

    return () => subscription.unsubscribe()
  }, [])

async function fetchProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle() // ← changed from .single() to .maybeSingle()

    if (error) throw error

    if (!data) {
      // Profile doesn't exist yet — create it
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id:       userId,
          full_name: '',
          plan:     'free',
          is_admin: false,
        })
        .select()
        .single()

      if (insertError) throw insertError
      setProfile(newProfile)
    } else {
      setProfile(data)
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    setProfile(null)
  } finally {
    setLoading(false)
  }
}

  



  async function signUp({ email, password, fullName, phone }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone }
      }
    })
    if (error) throw error

    // Create profile immediately
    if (data.user) {
      await supabase.from('profiles').insert({
        id:        data.user.id,
        full_name: fullName,
        phone:     phone,
        plan:      'free'
      })
    }
    return data
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
  async function resendVerification(email) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  })
  if (error) throw error
}


  async function updateProfile(updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      fetchProfile,
      resetPassword,
      resendVerification,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}