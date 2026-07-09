import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [badgeCounts, setBadgeCounts] = useState({
    inquiries: 0,
    sellRequests: 0,
    buildRequests: 0,
    serviceRequests: 0,
    crmLeads: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef(null)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCounts()
    
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        performGlobalSearch()
      }, 300)
      return () => clearTimeout(delayDebounceFn)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  const performGlobalSearch = async () => {
    setSearching(true)
    setShowSearchResults(true)
    try {
      // Parallel search across different modules
      const [propRes, inqRes, buildRes] = await Promise.all([
        api.get(`/properties/?search=${searchQuery}`),
        api.get(`/inquiries/?search=${searchQuery}`),
        api.get(`/properties/build/?search=${searchQuery}`)
      ])

      const crmRes = await api.get(`/crm/customers/?search=${searchQuery}`)

      const results = [
        ...(propRes.data.results || propRes.data).map(item => ({ ...item, type: 'Property', link: `/admin/properties` })),
        ...(inqRes.data.results || inqRes.data).map(item => ({ ...item, type: 'Inquiry', link: `/admin/inquiry` })),
        ...(buildRes.data.results || buildRes.data).map(item => ({ ...item, type: 'Build Project', link: `/admin/build-projects` })),
        ...(crmRes.data.results || crmRes.data).map(item => ({ ...item, type: 'Customer', link: `/admin/customers/${item.id}` }))
      ].slice(0, 8) // Limit to top 8 results for the dropdown

      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearching(false)
    }
  }

  const fetchCounts = async () => {
    try {
      const [inquiriesRes, sellRes, buildRes, serviceReqRes] = await Promise.all([
        api.get('/inquiries/'),
        api.get('/inquiries/sell-requests/'),
        api.get('/properties/build/'),
        api.get('/services/requests/'),
      ])
      const crmSummaryRes = await api.get('/crm/reports/summary/')
      
      const inquiries = inquiriesRes.data.results || inquiriesRes.data
      const sellRequests = sellRes.data.results || sellRes.data
      
      // Split inquiries into general and build
      const generalInquiries = inquiries.filter(i => i.inquiry_type !== 'build_property')
      const buildRequests = inquiries.filter(i => i.inquiry_type === 'build_property')

      setBadgeCounts({
        inquiries: generalInquiries.filter(i => !i.is_read).length,
        sellRequests: sellRequests.length,
        buildRequests: buildRequests.filter(i => !i.is_read).length,
        serviceRequests: (serviceReqRes.data.results || serviceReqRes.data).filter(r => !r.is_read).length,
        crmLeads: crmSummaryRes.data.new_leads || 0,
      })
    } catch (error) {
      console.error('Error fetching layout counts:', error)
    }
  }

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
    },
    { 
      name: 'Buy Properties', 
      path: '/admin/properties', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' 
    },
    { 
      name: 'Inquiries', 
      path: '/admin/inquiries', 
      icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
      badge: badgeCounts.inquiries
    },
    { 
      name: 'Sell Requests', 
      path: '/admin/sell-requests', 
      icon: 'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10', 
      badge: badgeCounts.sellRequests 
    },
    { 
      name: 'Build Requests', 
      path: '/admin/build-requests', 
      icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-4.5 4.5 4.5M6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm3-3h.008v.008H9.75V12Zm3 0h.008v.008h-.008V12Zm0 3h.008v.008h-.008V15Z',
      badge: badgeCounts.buildRequests 
    },
    {
      name: 'Service Requests',
      path: '/admin/service-requests',
      icon: 'M3 8.5a4 4 0 014-4h10a4 4 0 014 4v7a4 4 0 01-4 4H7a4 4 0 01-4-4v-7z',
      badge: badgeCounts.serviceRequests || 0
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: 'M17 21h5v-2a4 4 0 00-5-3.87M9 21H4v-2a4 4 0 015-3.87m8-7.13a4 4 0 11-8 0 4 4 0 018 0z',
      badge: badgeCounts.crmLeads || 0,
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: 'M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5',
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || user?.role === 'admin')

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[#1a1a1a] transform transition-transform lg:w-64 lg:max-w-none lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-700">
          <Link to="/" className="text-xl font-bold text-[#B8860B]">SS Properties</Link>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between py-3 px-4 rounded-xl transition-all duration-300 group ${
                location.pathname === item.path
                  ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <svg className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? 'text-primary' : 'text-accent'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge > 0 && (
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full ${
                  location.pathname === item.path 
                    ? 'bg-primary text-accent' 
                    : 'bg-accent text-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 text-gray-300 hover:bg-gray-800 rounded transition-colors"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
          <div className="flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-accent transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-full lg:flex-1 lg:max-w-2xl lg:px-8" ref={searchRef}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search anything... (Property, Inquiry, Project)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-gray-400"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Search Results</p>
                    {searching && <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, idx) => (
                        <Link
                          key={idx}
                          to={result.link}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                            result.type === 'Property' ? 'bg-amber-50 text-amber-600' :
                            result.type === 'Inquiry' ? 'bg-indigo-50 text-indigo-600' :
                            'bg-emerald-50 text-emerald-600'
                          }`}>
                            {result.type.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none mb-1 group-hover:text-accent transition-colors">
                              {result.title || result.name || 'Untitled Record'}
                            </p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                {result.type} • {result.location || result.city || result.inquiry_type || 'General'}
                            </p>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                          {searching ? 'Querying records...' : 'No relevant records found'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
            <div className="flex items-center justify-between gap-4 lg:ml-auto lg:justify-normal lg:space-x-6">
              <div className="hidden md:flex flex-col text-right">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">{user?.full_name}</p>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider leading-none">{user?.role}</p>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 bg-accent text-primary rounded-xl flex items-center justify-center font-black shadow-lg shadow-accent/10 transition-transform group-hover:scale-110">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
