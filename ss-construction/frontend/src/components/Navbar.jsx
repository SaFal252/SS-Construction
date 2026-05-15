import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const { user, logout, isAdmin, isPublicUser, isAuthenticated } = useAuth()
  const { getFavoriteCount } = useFavorites()
  const favoriteCount = getFavoriteCount()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy Property', path: '/buy' },
    { name: 'Sell Property', path: '/sell' },
    { name: 'Build Property', path: '/build-property' },
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
    return location.pathname === path
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-primary/95 backdrop-blur-lg shadow-lg shadow-black/20 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
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
            
            {/* Favorites Badge */}
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
            
            {/* Post Property Button - removed per user request */}
            
            {isAuthenticated ? (
              <div className="relative">
                {isAdmin ? (
                  // Admin user - show Admin badge and dropdown
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
                  // Public user - show welcome message and dropdown
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="ml-2 flex items-center gap-2 text-[#FFD700] px-3 py-2 text-sm font-medium transition-all duration-300"
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

          {/* Tablet Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover:text-accent transition-all duration-300 hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-accent bg-accent/10'
                    : 'text-secondary/80 hover:text-accent hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Favorites Link - Mobile */}
            <Link
              to="/favorites"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                isActive('/favorites')
                  ? 'text-accent bg-accent/10'
                  : 'text-secondary/80 hover:text-accent hover:bg-white/5'
              }`}
            >
              <span>My Favorites</span>
              {favoriteCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {favoriteCount}
                </span>
              )}
            </Link>
            
            {/* Post Property Button - Mobile */}
            <Link
              to={user ? "/dashboard" : "/login"}
              onClick={() => setIsOpen(false)}
              className="inline-block mt-4 bg-accent text-primary px-5 py-3 rounded-full font-semibold text-center hover:bg-accent-light transition-all duration-300"
            >
              Post Property
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 rounded-lg font-medium text-center text-accent bg-accent/10 mt-2"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="block w-full text-left py-3 px-4 rounded-lg font-medium text-red-500 mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="relative w-full">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="block w-full py-3 px-4 rounded-lg font-medium text-center bg-[#B8860B] text-white mt-2"
                >
                  Login / Sign Up
                  <svg className="w-4 h-4 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-card rounded-lg shadow-lg py-2 z-50">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-secondary hover:bg-accent/10">Login</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-secondary hover:bg-accent/10">Sign Up</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
