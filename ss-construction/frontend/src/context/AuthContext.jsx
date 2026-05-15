import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check for existing tokens on mount
    const accessToken = localStorage.getItem('access_token')
    const userData = localStorage.getItem('user')
    
    if (accessToken && userData) {
      try {
        setUser(JSON.parse(userData))
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      } catch (e) {
        // Invalid JSON in localStorage, clear it
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    const { token, refresh, user: userData } = response.data
    
    // Store tokens and user data
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', refresh)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Set axios default header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    setUser(userData)
    return userData
  }

  const register = async (userData) => {
    // Pass through all fields directly — the caller is responsible for
    // including all required fields (email, password, confirm_password,
    // full_name, username, phone)
    const payload = {
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirm_password || userData.password,
      full_name: userData.full_name,
      // Username is optional; backend will generate a unique one if omitted.
      username: userData.username,
      phone: userData.phone || '',
    }
    const response = await api.post('/auth/register/', payload)
    return response.data
  }

  const logout = async () => {
    // Try to blacklist the refresh token on the server
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken })
      }
    } catch (e) {
      // Ignore errors during logout - we'll clear local state anyway
    }

    // Clear storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    
    // Clear axios header
    delete api.defaults.headers.common['Authorization']
    
    setUser(null)
    navigate('/')
  }

  const updateProfile = async (data) => {
    const response = await api.put('/auth/me/', data)
    localStorage.setItem('user', JSON.stringify(response.data))
    setUser(response.data)
    return response.data
  }

  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    const response = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    })
    return response.data
  }

  // Computed values — consistent admin detection
  const isLoggedIn = !!user
  const isAdmin = user?.is_staff || user?.is_superuser || user?.role === 'admin'
  const isPublicUser = isLoggedIn && !isAdmin

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: isLoggedIn,
    isAdmin,
    isPublicUser,
    isStaff: user?.is_staff || user?.role === 'staff',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
