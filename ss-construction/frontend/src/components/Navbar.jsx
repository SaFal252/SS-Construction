import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAdmin, isAuthenticated } = useAuth()
  const { getFavoriteCount } = useFavorites()
  const favoriteCount = getFavoriteCount()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Property', path: '/buy' },
    { name: 'Sell Property', path: '/sell' },
    { name: 'Build Property', path: '/build-property' },
    { name: 'Home Improvement & Services', path: '/home-improvement' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === ''
    }

    return (
      location.pathname === path ||
      location.pathname === `${path}/` ||
      location.pathname.startsWith(`${path}/`)
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-lg shadow-lg shadow-black/20 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-3">
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo size="lg" className="mr-3" />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-secondary/80 hover:text-accent hover:scale-105'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/favorites"
              className="relative ml-2 px-3 py-2 text-sm font-medium transition-all duration-300 text-secondary/80 hover:text-accent group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                {isAdmin ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="ml-2 flex items-center gap-2 text-accent border border-accent/20 bg-accent/5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-accent/10 hover:border-accent/40"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-lg">👑</span>
                        Admin: {user?.first_name || user?.full_name?.split(' ')[0] || 'Admin'}
                      </span>
                      <svg className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-card border border-white/10 rounded-xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 mb-2 border-b border-white/5">
                          <p className="text-xs text-secondary/60 uppercase tracking-wider font-bold">Admin Panel</p>
                        </div>
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-accent/10 transition-colors">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link to="/admin/properties" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-accent/10 transition-colors">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Manage Properties
                        </Link>
                        <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-accent/10 transition-colors">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Manage Users
                        </Link>
                        <Link to="/admin/services" className="flex items-center gap-3 px-4 py-2.5 text-secondary hover:bg-accent/10 transition-colors">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Manage Services
                        </Link>
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-400/10 transition-colors font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="ml-2 flex items-center gap-2 text-[#F5C518] px-3 py-2 text-sm font-medium transition-all duration-300"
                    >
                      <span>👋 Welcome, {user?.first_name || user?.full_name?.split(' ')[0] || 'User'}!</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg py-2 z-50">
                        <Link to="/favorites" className="block px-4 py-2 text-secondary hover:bg-accent/10 transition-colors">My Favorites</Link>
                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors">Logout</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-white bg-[#f0b429] px-4 py-2 rounded-full font-semibold hover:opacity-90 transition-all duration-300 text-sm"
                >
                  Login / Sign Up
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-card rounded-lg shadow-lg py-2 z-50">
                    <Link to="/login" className="block px-4 py-2 text-secondary hover:bg-accent/10">Login</Link>
                    <Link to="/signup" className="block px-4 py-2 text-secondary hover:bg-accent/10">Sign Up</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link px-2 py-2 text-xs font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-accent'
                    : 'text-secondary/80 hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-secondary hover:text-accent hover:bg-white/10 transition-all duration-300"
              aria-label="Favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border border-primary">
                  {favoriteCount > 9 ? '9+' : favoriteCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-full border border-accent/30 bg-accent/15 text-accent hover:bg-accent hover:text-primary transition-all duration-300 shadow-lg shadow-accent/10"
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-[520px] opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="rounded-3xl border border-white/10 bg-primary/98 backdrop-blur-xl shadow-2xl shadow-black/30 p-4">
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-20 rounded-2xl border px-4 py-3 flex flex-col justify-center transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-accent/15 border-accent text-accent shadow-lg shadow-accent/10'
                      : 'bg-white/5 border-white/10 text-secondary/90 hover:bg-white/10 hover:border-white/20'
                  }`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] opacity-70">Menu</span>
                  <span className="text-sm font-semibold mt-1 leading-tight">{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-4 px-4 rounded-2xl font-medium transition-all duration-300 border border-white/10 bg-white/5 text-secondary/85 hover:text-accent hover:bg-white/10"
              >
                <span>Favorites</span>
                {favoriteCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-4 px-4 rounded-2xl font-semibold text-center text-accent bg-accent/10 border border-accent/15"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-4 px-4 rounded-2xl font-semibold text-red-400 border border-red-500/10 bg-red-500/5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-4 px-4 rounded-2xl text-center font-semibold border border-white/10 bg-white/5 text-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-4 px-4 rounded-2xl text-center font-semibold bg-[#B8860B] text-white shadow-lg shadow-[#B8860B]/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
