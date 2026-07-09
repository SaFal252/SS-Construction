import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AdminLayout from './AdminLayout'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    fetchProperties()
  }, [search, statusFilter])

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      
      const response = await api.get(`/properties/?${params.toString()}`)
      setProperties(response.data.results || response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await api.delete(`/properties/${slug}/`)
        fetchProperties()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleStatusChange = async (slug, newStatus) => {
    try {
      await api.patch(`/properties/${slug}/`, { status: newStatus })
      fetchProperties()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === properties.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(properties.map(p => p.id))
    }
  }

  const [deleting, setDeleting] = useState(false)

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} properties?`)) {
      setDeleting(true)
      try {
        await Promise.all(selectedIds.map(id => {
          const prop = properties.find(p => p.id === id)
          return api.delete(`/properties/${prop.slug}/`)
        }))
        setSelectedIds([])
        fetchProperties()
      } catch (error) {
        console.error('Bulk deletion error:', error)
      } finally {
        setDeleting(false)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Properties</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Inventory Management</p>
        </div>
        <Link
          to="/admin/properties/add"
          className="bg-accent text-primary px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all"
        >
          + Add Property
        </Link>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white rounded-[2.5rem] shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search properties by title or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-black text-gray-700 cursor-pointer uppercase tracking-widest"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Featured">Featured</option>
            </select>
          </div>

          {(selectedIds.length > 0 || deleting) && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
              <span className="text-sm font-bold text-gray-500">{deleting ? 'Deleting...' : `${selectedIds.length} selected`}</span>
              <button
                onClick={handleBulkDelete}
                disabled={deleting}
                className={`bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${deleting ? 'opacity-50' : 'hover:bg-rose-600 hover:text-white shadow-lg shadow-rose-200'}`}
              >
                {deleting ? 'Processing...' : 'Delete Selected'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-5 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === properties.length && properties.length > 0}
                      onChange={toggleSelectAll}
                      className="w-5 h-5 rounded-lg border-gray-300 text-accent focus:ring-accent/20"
                    />
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Property</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Value</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Specs</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Listed</th>
                  <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {properties.map((property) => (
                  <tr key={property.id} className={`group transition-colors hover:bg-gray-50/50 ${selectedIds.includes(property.id) ? 'bg-accent/5' : ''}`}>
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(property.id)}
                        onChange={() => toggleSelect(property.id)}
                        className="w-5 h-5 rounded-lg border-gray-300 text-accent focus:ring-accent/20"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                          {property.images?.[0] ? (
                            <img src={property.images[0].image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">No Img</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/property/${property.slug}`} target="_blank" className="text-sm font-bold text-gray-900 hover:text-accent transition-colors truncate block">
                            {property.title}
                          </Link>
                          <p className="text-xs text-gray-400 font-medium truncate flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">Rs. {parseInt(property.price).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Valuation</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {property.bedrooms || 0}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span>{property.size} {property.size_unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border w-fit ${
                          property.status === 'Available' || property.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          property.status === 'Sold' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {property.status}
                        </span>
                        {property.is_featured && (
                          <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-orange-50 text-orange-600 border border-orange-100 w-fit">
                            Exclusive
                          </span>
                        )}
                        {property.is_new && (
                          <span className="inline-flex px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">
                            Recent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-700">{formatDate(property.created_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/properties/${property.slug}/edit`}
                          className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(property.slug, property.status === 'Sold' ? 'Available' : 'Sold')}
                          className={`p-2 rounded-xl transition-all ${property.status === 'Sold' ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50' : 'text-orange-400 hover:text-orange-600 hover:bg-orange-50'}`}
                          title={property.status === 'Sold' ? 'Mark Available' : 'Mark Sold'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(property.slug)}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No properties found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default Properties
