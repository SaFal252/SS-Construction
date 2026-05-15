import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthPage = ({ mode }) => {
  const [isLogin, setIsLogin] = useState(mode !== 'signup')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    phone: '',
    confirm_password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()

  // Sync with mode prop when it changes
  useEffect(() => {
    setIsLogin(mode !== 'signup')
  }, [mode])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, isAdmin, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const user = await login(formData.email, formData.password)
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      const errorData = err.response?.data
      if (errorData) {
        if (typeof errorData === 'string') {
          setError(errorData)
        } else if (errorData.error) {
          setError(errorData.error)
        } else if (errorData.detail) {
          setError(errorData.detail)
        } else {
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n')
          setError(errorMessages)
        }
      } else {
        setError('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        username: formData.username,
        phone: formData.phone || '',
        password: formData.password,
        confirm_password: formData.confirm_password,
      })
      setSuccess('Registration successful! Please check your email to verify your account.')
      setIsLogin(true)
      setError('')
      setFormData({ 
        email: formData.email, 
        password: '', 
        full_name: '', 
        username: '',
        phone: '',
        confirm_password: '' 
      })
    } catch (err) {
      const errorData = err.response?.data
      if (errorData) {
        if (typeof errorData === 'string') {
          setError(errorData)
        } else if (errorData.error) {
          setError(errorData.error)
        } else {
          // Handle field-specific errors from Django
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => {
              const msg = Array.isArray(value) ? value.join(', ') : value
              // Make field names more readable
              const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              return `${fieldName}: ${msg}`
            })
            .join('\n')
          setError(errorMessages)
        }
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#B8860B]">SS Construction</h1>
          <p className="text-gray-400 mt-2">Build Your Dream Home</p>
          
          {/* Toggle Switch */}
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-700 rounded-full p-1 flex">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'bg-[#B8860B] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { navigate('/signup-otp'); }}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-[#B8860B] text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4 whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Verification Message for Signup */}
        {success && isLogin === false && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
            Registration successful! Please check your email to verify your account.
          </div>
        )}

        {/* Error Message for Unverified Login */}
        {error && isLogin && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error.includes('verify') ? 'Email not verified. Please check your inbox.' : error}
          </div>
        )}

        {isLogin ? (
          /* Login Form */
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-full_name">
                Full Name
              </label>
              <input
                id="reg-full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-username">
                Username
              </label>
              <input
                id="reg-username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Choose a username (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-phone">
                Phone Number
              </label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors pr-12"
                  placeholder="Create a password (min 8 characters)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reg-confirm_password">
                Confirm Password
              </label>
              <input
                id="reg-confirm_password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#B8860B] font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Admin Login Link */}
        <div className="mt-4 text-center">
          <Link to="/admin/login" className="text-gray-500 text-xs hover:text-gray-400">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
