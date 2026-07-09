import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { crmAPI } from '../api'
import AdminLayout from './AdminLayout'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [projectType, setProjectType] = useState('')
  const [status, setStatus] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [assignedEngineer, setAssignedEngineer] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [createdFrom, setCreatedFrom] = useState('')
  const [createdTo, setCreatedTo] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [search, projectType, status, city, district, assignedEngineer, budgetMin, budgetMax, createdFrom, createdTo])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (projectType) params.project_type = projectType
      if (status) params.construction_status = status
      if (city) params.city = city
      if (district) params.district = district
      if (assignedEngineer) params.assigned_engineer = assignedEngineer
      if (budgetMin) params.budget_min = budgetMin
      if (budgetMax) params.budget_max = budgetMax
      if (createdFrom) params.created_from = createdFrom
      if (createdTo) params.created_to = createdTo

      const [customersRes, summaryRes] = await Promise.all([
        crmAPI.getCustomers(params),
        crmAPI.getSummary(),
      ])

      setCustomers(customersRes.data.results || customersRes.data)
      setSummary(summaryRes.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer and all related records?')) return
    try {
      await crmAPI.deleteCustomer(id)
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return `Rs. ${Number(value).toLocaleString()}`
  }

  const summaryCards = [
    { title: 'Total Customers', value: summary?.total_customers || 0 },
    { title: 'Residential', value: summary?.residential_projects || 0 },
    { title: 'Commercial', value: summary?.commercial_projects || 0 },
    { title: 'Completed', value: summary?.completed_projects || 0 },
    { title: 'Ongoing', value: summary?.ongoing_projects || 0 },
    { title: 'New Leads', value: summary?.new_leads || 0 },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Customers</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">CRM Management Hub</p>
        </div>
        <Link
          to="/admin/customers/add"
          className="bg-accent text-primary px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all w-fit"
        >
          + Add Customer
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{card.title}</p>
            <p className="text-3xl font-black text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm p-6 border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <div className="relative xl:col-span-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, email, address, city, district, project type, status, budget, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
            />
          </div>

          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold text-gray-700 cursor-pointer"
          >
            <option value="">All Project Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Bangalow">Bangalow</option>
            <option value="Semi-Bangalow">Semi-Bangalow</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold text-gray-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="New Lead">New Lead</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />

          <input
            type="number"
            placeholder="Budget min"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />

          <input
            type="number"
            placeholder="Budget max"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />

          <input
            type="date"
            value={createdFrom}
            onChange={(e) => setCreatedFrom(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />

          <input
            type="date"
            value={createdTo}
            onChange={(e) => setCreatedTo(e.target.value)}
            className="px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-[220px] flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Assigned Engineer ID"
              value={assignedEngineer}
              onChange={(e) => setAssignedEngineer(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
            />
          </div>
          <button
            onClick={() => {
              setSearch('')
              setProjectType('')
              setStatus('')
              setCity('')
              setDistrict('')
              setAssignedEngineer('')
              setBudgetMin('')
              setBudgetMax('')
              setCreatedFrom('')
              setCreatedTo('')
            }}
            className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Type</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Created</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          {customer.primary_image ? (
                            <img src={customer.primary_image} alt={customer.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-black text-xs uppercase">CRM</div>
                          )}
                        </div>
                        <div>
                          <Link to={`/admin/customers/${customer.id}`} className="text-sm font-bold text-gray-900 hover:text-accent transition-colors block">
                            {customer.full_name}
                          </Link>
                          <p className="text-xs text-gray-400 font-medium">{customer.phone_number}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{customer.city || customer.district || 'No location'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border bg-amber-50 text-amber-600 border-amber-100">
                        {customer.project_type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">{formatCurrency(customer.estimated_budget)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                        customer.construction_status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : customer.construction_status === 'Ongoing'
                          ? 'bg-blue-50 text-blue-600 border-blue-100'
                          : customer.construction_status === 'On Hold'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {customer.construction_status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-500">{new Date(customer.created_at).toLocaleDateString('en-NP')}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/customers/${customer.id}`} className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all" title="View">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link to={`/admin/customers/${customer.id}/edit`} className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button onClick={() => handleDelete(customer.id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-6 0h6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">No customers found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Customers