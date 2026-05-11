import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../Lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext - getSession:', session ? 'existe' : 'null')
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext - onAuthStateChange:', session ? 'existe' : 'null')
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)