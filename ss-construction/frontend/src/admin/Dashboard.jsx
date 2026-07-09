import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { crmAPI } from '../api'
import AdminLayout from './AdminLayout'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    sellRequests: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [recentSellRequests, setRecentSellRequests] = useState([])
  const [crmSummary, setCrmSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [propertiesRes, inquiriesRes, sellRes, buildRes] = await Promise.all([
        api.get('/properties/'),
        api.get('/inquiries/'),
        api.get('/inquiries/sell-requests/'),
        api.get('/properties/build/'),
      ])
      const crmRes = await crmAPI.getSummary()

      const properties = propertiesRes.data.results || propertiesRes.data
      const inquiries = inquiriesRes.data.results || inquiriesRes.data
      const sellRequests = sellRes.data.results || sellRes.data
      const buildProjects = buildRes.data.results || buildRes.data

      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter(p => p.status === 'Available' || p.status === 'Approved').length,
        soldProperties: properties.filter(p => p.status === 'Sold').length,
        totalInquiries: inquiries.length,
        unreadInquiries: inquiries.filter(i => !i.is_read).length,
        sellRequests: sellRequests.length,
        buildProjects: buildProjects.length
      })

      // Combined feed for "Recent Activity"
      const combined = [
        ...inquiries.map(i => ({ ...i, feedType: 'Inquiry', date: i.created_at })),
        ...sellRequests.map(s => ({ ...s, feedType: 'Sell Request', date: s.created_at })),
        ...buildProjects.map(b => ({ ...b, feedType: 'Build Project', date: b.created_at }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date))

      setRecentInquiries(inquiries.filter(i => !i.is_read).slice(0, 5))
      setRecentSellRequests(sellRequests.slice(0, 5))
      setCrmSummary(crmRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const statCards = [
    { title: 'Total Properties', value: stats.totalProperties, color: 'bg-blue-600', textClass: 'text-blue-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { title: 'Available Units', value: stats.availableProperties, color: 'bg-emerald-600', textClass: 'text-emerald-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Sold Out', value: stats.soldProperties, color: 'bg-rose-600', textClass: 'text-rose-600', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'Inquiries', value: stats.totalInquiries, color: 'bg-indigo-600', textClass: 'text-indigo-600', icon: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4', badge: stats.unreadInquiries },
    { title: 'Sell Requests', value: stats.sellRequests, color: 'bg-amber-600', textClass: 'text-amber-600', icon: 'M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l.621-1.342a7 7 0 0112.758 0L16 17H2z' },
    { title: 'Build Projects', value: stats.buildProjects || 0, color: 'bg-cyan-600', textClass: 'text-cyan-600', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  ]

  const crmCards = [
    { title: 'Total Customers', value: crmSummary?.total_customers || 0, color: 'bg-amber-600', textClass: 'text-amber-600', icon: 'M17 21h5v-2a4 4 0 00-5-3.87M9 21H4v-2a4 4 0 015-3.87m8-7.13a4 4 0 11-8 0 4 4 0 018 0z' },
    { title: 'Residential Projects', value: crmSummary?.residential_projects || 0, color: 'bg-emerald-600', textClass: 'text-emerald-600', icon: 'M3 11l9-8 9 8M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3M9 21h6' },
    { title: 'Commercial Projects', value: crmSummary?.commercial_projects || 0, color: 'bg-blue-600', textClass: 'text-blue-600', icon: 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-3' },
    { title: 'Completed Projects', value: crmSummary?.completed_projects || 0, color: 'bg-rose-600', textClass: 'text-rose-600', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Ongoing Projects', value: crmSummary?.ongoing_projects || 0, color: 'bg-violet-600', textClass: 'text-violet-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { title: 'New Leads', value: crmSummary?.new_leads || 0, color: 'bg-orange-600', textClass: 'text-orange-600', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  const renderChartBars = (items = []) => {
    const maxValue = Math.max(...items.map(item => item.value || 0), 1)
    return items.map((item, index) => (
      <div key={index} className="mb-4 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-700">{item.label}</span>
          <span className="text-xs font-black text-accent">{item.value}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent-dark to-accent" style={{ width: `${(item.value / maxValue) * 100}%` }} />
        </div>
      </div>
    ))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div className={`${stat.color} bg-opacity-10 p-4 rounded-2xl ${stat.textClass} transition-transform group-hover:scale-110 duration-500`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                </svg>
              </div>
              {stat.badge > 0 && (
                <span className="flex items-center justify-center bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {stat.badge} NEW
                </span>
              )}
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-black text-gray-900 mb-1 group-hover:text-accent transition-colors duration-300 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
            </div>
            
            {/* Subtle background flair */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>

      {/* CRM Overview */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CRM Overview</h2>
            <p className="text-sm text-gray-500 font-medium">Customer pipeline, project mix, and lead activity</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/customers" className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-accent shadow-sm border border-gray-100 hover:bg-accent hover:text-white transition-all">View Customers</Link>
            <Link to="/admin/customers/add" className="bg-accent text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-accent-light transition-all">Add Customer</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {crmCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-6 border border-gray-100 relative overflow-hidden">
              <div className="flex items-start justify-between mb-8">
                <div className={`${stat.color} bg-opacity-10 p-4 rounded-2xl ${stat.textClass} transition-transform duration-500`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full`}></div>
            </div>
          ))}
        </div>

        {crmSummary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Project Type Mix</h3>
              <p className="text-xs font-medium text-gray-500 mb-6">Distribution of active CRM projects</p>
              {renderChartBars(crmSummary.project_type_breakdown || [])}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Monthly Customer Growth</h3>
              <p className="text-xs font-medium text-gray-500 mb-6">New customers added in the last 12 months</p>
              {renderChartBars(crmSummary.monthly_growth || [])}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Priority Inbox / Pending Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Priority Inbox</h2>
                <p className="text-xs text-gray-500 font-medium">Newest inquiries requiring your attention</p>
              </div>
              <Link to="/admin/inquiries" className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-accent shadow-sm border border-gray-100 hover:bg-accent hover:text-white transition-all">
                Manage Inbox
              </Link>
            </div>
            
            {recentInquiries.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{inquiry.name}</h3>
                        <p className="text-xs text-gray-500">{inquiry.email}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">{inquiry.inquiry_type}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{formatDate(inquiry.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <Link to="/admin/inquiries" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-accent">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 font-medium">Your inbox is crystal clear</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Sell Requests */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Sell Requests</h2>
              <p className="text-xs text-gray-500 font-medium">Verify incoming listings</p>
            </div>
            
            <div className="p-2">
              {recentSellRequests.length > 0 ? (
                <div className="space-y-1">
                  {recentSellRequests.map((request) => (
                    <div key={request.id} className="p-4 hover:bg-gray-50 rounded-2xl transition-all group flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M2 17l.621-1.342a7 7 0 0112.758 0L16 17H2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{request.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium mb-1 uppercase tracking-tight">{request.property_type} • {request.location.split(' ').pop()}</p>
                        <p className="text-xs font-black text-accent">{request.asking_price ? `Rs. ${parseInt(request.asking_price).toLocaleString()}` : 'Price not set'}</p>
                      </div>
                    </div>
                  ))}
                  <Link to="/admin/sell-requests" className="block text-center p-3 text-xs font-black text-gray-400 hover:text-accent transition-colors">
                    ALL SELL REQUESTS
                  </Link>
                </div>
              ) : (
                <p className="p-8 text-center text-gray-500 text-xs font-bold">NO PENDING SELL REQUESTS</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Quick Commands</h2>
          <p className="text-gray-400 mb-6 max-w-md">Perform common administrative tasks with a single click. Efficiency is at the core of SS Construction.</p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/properties/add"
              className="bg-accent text-primary px-6 py-3 rounded-xl font-bold hover:bg-accent-light transition-all duration-300 flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Property
            </Link>
            <Link
              to="/admin/inquiries"
              className="bg-white/10 text-white backdrop-blur-md px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Review Inquiries
            </Link>
            <Link
              to="/admin/users"
              className="bg-white/10 text-white backdrop-blur-md px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500 opacity-10 rounded-full blur-2xl"></div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
