import { createContext, useContext, useEffect, useState } from 'react'
import { api, clearToken, getToken, saveToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await api.me()
        setUser(me)
      } catch {
        clearToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  async function login(email, password) {
    const result = await api.login({ email, password })
    saveToken(result.token)
    setUser(result.user)
    return result.user
  }

  async function register(name, email, password) {
    await api.register({ name, email, password })

    return login(email, password)
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
