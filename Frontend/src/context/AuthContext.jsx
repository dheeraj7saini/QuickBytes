import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL } from '../config/api'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'food-app-auth'

function readStoredAuth() {
  try {
    const value = localStorage.getItem(AUTH_STORAGE_KEY)
    return value ? JSON.parse(value) : { token: null, user: null }
  } catch {
    return { token: null, user: null }
  }
}

function normalizeUser(user) {
  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role?.toLowerCase() ?? null,
    shopId: user.shopId ?? null,
    shopName: user.shopName ?? '',
  }
}

async function apiRequest(path, options = {}) {
  const { headers: customHeaders = {}, ...restOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
  })

  if (!response.ok) {
    let message = 'Request failed'
    try {
      const errorBody = await response.json()
      message = errorBody.message ?? message
    } catch {
      // Keep the fallback message when the response body is unavailable.
    }
    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function AuthProvider({ children }) {
  const storedAuth = readStoredAuth()
  const [token, setToken] = useState(storedAuth.token)
  const [user, setUser] = useState(storedAuth.user)
  const [vendorOptions, setVendorOptions] = useState([])

  const persistAuth = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: nextToken,
        user: nextUser,
      }),
    )
  }, [])

  const clearAuth = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  const refreshVendorOptions = useCallback(async () => {
    try {
      const options = await apiRequest('/auth/vendor-options')
      setVendorOptions(options.map((option) => option.shopName))
    } catch {
      setVendorOptions([])
    }
  }, [])

  useEffect(() => {
    refreshVendorOptions()
  }, [refreshVendorOptions])

  useEffect(() => {
    if (!token) {
      return
    }

    apiRequest('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((responseUser) => {
        persistAuth(token, normalizeUser(responseUser))
      })
      .catch(() => {
        clearAuth()
      })
  }, [clearAuth, persistAuth, token])

  const login = async ({ role, identifier, password }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      const nextUser = normalizeUser(response.user)
      if (nextUser?.role !== role) {
        return {
          success: false,
          error: `This account is not registered as a ${role}.`,
        }
      }

      persistAuth(response.token, nextUser)
      return { success: true, user: nextUser }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  const register = async (payload) => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role.toUpperCase(),
          shopName: payload.role === 'vendor' ? payload.shopName : null,
          shopCategory: payload.role === 'vendor' ? payload.shopCategory : null,
          shopCuisine: payload.role === 'vendor' ? payload.shopCuisine : null,
        }),
      })

      const nextUser = normalizeUser(response.user)
      persistAuth(response.token, nextUser)
      await refreshVendorOptions()
      return { success: true, user: nextUser }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  const logout = () => {
    clearAuth()
  }

  const role = user?.role ?? null

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      vendorOptions,
      login,
      register,
      logout,
      refreshVendorOptions,
    }),
    [login, logout, refreshVendorOptions, role, token, user, vendorOptions],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext)

export { AuthContext, AuthProvider, useAuth }
