import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const isValidEmail = (email) => {
  // Simple frontend validation; backend does authoritative validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const SignupOTP = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1: form, 2: otp, 3: success

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirm_password: '',
  })

  const [otp, setOtp] = useState('')

  const [timeLeft, setTimeLeft] = useState(60)
  const timerRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canVerify = useMemo(() => timeLeft > 0 && /^\d{6}$/.test(otp), [timeLeft, otp])
  const canResend = useMemo(() => timeLeft === 0 && !loading, [timeLeft, loading])

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startTimer = () => {
    stopTimer()
    setTimeLeft(60)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      stopTimer()
    }
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const sendOtp = async () => {
    setError('')
    setSuccess('')

    const normalizedEmail = form.email.trim().toLowerCase()
    if (!normalizedEmail) {
      setError('Email is required')
      return
    }
    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address')
      return
    }

    if (!form.full_name.trim()) {
      setError('Full name is required')
      return
    }

    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: normalizedEmail,
          username: form.username,
          phone: form.phone,
          password: form.password,
          confirm_password: form.confirm_password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || data?.detail || 'Failed to send OTP')
        return
      }

      setSuccess('OTP sent. Please check your email.')
      setStep(2)
      setOtp('')
      startTimer()
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setError('')
    setSuccess('')

    const normalizedEmail = form.email.trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      setError('Please enter a valid email address')
      return
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits')
      return
    }
    if (timeLeft === 0) {
      setError('OTP expired. Please resend OTP.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, otp }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || data?.detail || 'OTP verification failed')
        return
      }

      // If backend returns JWT tokens, store them so the user is logged in.
      if (data?.token) {
        localStorage.setItem('access_token', data.token)
      }
      if (data?.refresh) {
        localStorage.setItem('refresh_token', data.refresh)
      }
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setSuccess('Verified successfully!')
      setStep(3)
      stopTimer()

      setTimeout(() => {
        navigate('/')
      }, 1200)
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendOtp = async () => {
    if (!canResend) return
    await sendOtp()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F5C518]">SS Construction</h1>
          <p className="text-gray-400 mt-2">Sign up with Email OTP</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4 whitespace-pre-line">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Fill the form and click <span className="text-white font-semibold">Sign Up</span>. We’ll send a 6-digit OTP to your email.
            </p>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="full_name">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={form.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Choose a username (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Create a password (min 8 characters)"
                required
                minLength={8}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm_password">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="button"
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? 'Sending OTP…' : 'Sign Up'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#B8860B] hover:underline font-medium">
                  Go to login
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-4">
              <p className="text-gray-300 text-sm font-semibold">Please enter OTP</p>
              <p className="text-gray-400 text-sm mt-1">
                We sent a 6-digit OTP to <span className="font-semibold text-white">{form.email.trim().toLowerCase()}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="otp">
                Enter 6-digit OTP
              </label>
              <input
                id="otp"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#B8860B] transition-colors tracking-widest"
                placeholder="------"
                required
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">
                Time left: <span className="text-white font-semibold">{timeLeft}s</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  stopTimer()
                  setStep(1)
                  setOtp('')
                  setError('')
                  setSuccess('')
                }}
                className="text-gray-300 text-sm hover:text-white"
              >
                Edit details
              </button>
            </div>

            <button
              type="button"
              onClick={verifyOtp}
              disabled={loading || !canVerify}
              className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? 'Verifying…' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              onClick={resendOtp}
              disabled={!canResend}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>

            {timeLeft === 0 && (
              <p className="text-gray-400 text-sm mt-3">
                OTP expired. You can resend now.
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="text-green-500 font-semibold">Success! You’re verified.</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignupOTP
