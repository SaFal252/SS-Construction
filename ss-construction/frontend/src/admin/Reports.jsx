import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { crmAPI } from '../api'
import AdminLayout from './AdminLayout'

const Reports = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await crmAPI.getSummary()
      setSummary(response.data)
    } catch (error) {
      console.error('Error loading CRM summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderBars = (items = []) => {
    const maxValue = Math.max(...items.map((item) => item.value || 0), 1)
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Reports</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">CRM Performance Overview</p>
        </div>
        <Link to="/admin/customers/add" className="bg-accent text-primary px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all w-fit">
          + Add Customer
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          ['Total Customers', summary?.total_customers || 0],
          ['Residential', summary?.residential_projects || 0],
          ['Commercial', summary?.commercial_projects || 0],
          ['Completed', summary?.completed_projects || 0],
          ['Ongoing', summary?.ongoing_projects || 0],
          ['New Leads', summary?.new_leads || 0],
        ].map(([title, value]) => (
          <div key={title} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{title}</p>
            <p className="text-3xl font-black text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Project Type Mix</h2>
          <p className="text-xs font-medium text-gray-500 mb-6">Distribution of CRM customers by project type</p>
          {renderBars(summary?.project_type_breakdown || [])}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Monthly Growth</h2>
          <p className="text-xs font-medium text-gray-500 mb-6">Customer additions over the last 12 months</p>
          {renderBars(summary?.monthly_growth || [])}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {(summary?.recent_customers || []).map((customer) => (
            <Link key={customer.id} to={`/admin/customers/${customer.id}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
              <p className="text-sm font-bold text-gray-900 mb-1 truncate">{customer.full_name}</p>
              <p className="text-xs text-gray-500 font-medium mb-2">{customer.project_type}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-accent">{customer.construction_status}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Reports