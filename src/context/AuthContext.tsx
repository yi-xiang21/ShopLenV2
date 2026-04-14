/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AuthContextType = {
  authData: string | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (token: unknown) => void
  logout: () => void
}

const AUTH_STORAGE_KEY = 'authData'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authData, setAuthData] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY)
  })

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== AUTH_STORAGE_KEY) {
        return
      }

      setAuthData(event.newValue)
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (token: unknown) => {
    const serialized = JSON.stringify(token)
    localStorage.setItem(AUTH_STORAGE_KEY, serialized)
    setAuthData(serialized)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthData(null)
  }

  const accessToken = useMemo(() => {
    if (!authData) {
      return null
    }

    try {
      const parsed = JSON.parse(authData) as unknown

      if (typeof parsed === 'string') {
        return parsed
      }

      if (parsed && typeof parsed === 'object' && 'token' in parsed) {
        const token = (parsed as { token?: unknown }).token
        return typeof token === 'string' ? token : null
      }

      return null
    } catch {
      return authData
    }
  }, [authData])

  const value = useMemo(() => {
    return {
      authData,
      accessToken,
      isAuthenticated: Boolean(authData),
      login,
      logout,
    }
  }, [accessToken, authData])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
