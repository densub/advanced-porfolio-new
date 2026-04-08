import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

/** Local dev: no backend. Set VITE_REQUIRE_AUTH=true to simulate auth_required after load. */
export function AuthProvider({ children }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      setIsLoadingPublicSettings(false)
      setIsLoadingAuth(false)
      const requireAuth = import.meta.env.VITE_REQUIRE_AUTH === 'true'
      if (requireAuth) {
        setAuthError({ type: 'auth_required' })
      } else {
        setAuthError(null)
      }
    }, 200)
    return () => window.clearTimeout(t)
  }, [])

  const navigateToLogin = useCallback(() => {
    window.location.href = '/'
  }, [])

  const value = useMemo(
    () => ({
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      navigateToLogin,
    }),
    [isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
