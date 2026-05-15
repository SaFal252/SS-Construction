import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { Link, useNavigate } from 'react-router-dom'

const UserDashboard = () => {
  const { user, logout, isAdmin } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    size: '',
    size_unit: 'Sqft',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    description: '',
    house_type: 'Sell',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard')
      return
    }
    fetchMyProperties()
  }, [])

  const fetchMyProperties = async () => {
    try {
      const response = await api.get('/properties/my_properties/')
      setProperties(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.post('/properties/', formData)
      setShowForm(false)
      setFormData({
        title: '',
        price: '',
        size: '',
        size_unit: 'Sqft',
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        description: '',
        house_type: 'Sell',
      })
      fetchMyProperties()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit property')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-cream-DEFAULT pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta-DEFAULT to-deep-red-DEFAULT rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.full_name}!</h1>
                <p className="text-cream-DEFAULT">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2 bg-white text-terracotta-DEFAULT rounded-lg font-semibold hover:bg-cream-DEFAULT transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add Property'}
              </button>
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Property Submission Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Submit Your Property</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    placeholder="e.g., Beautiful House in Lazimpat"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Property Type *
                  </label>
                  <select
                    name="house_type"
                    value={formData.house_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                  >
                    <option value="Sell">For Sell</option>
                    <option value="Buy">For Buy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Price (NPR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    placeholder="e.g., 5000000"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Size *
                    </label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                      placeholder="e.g., 1500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Unit
                    </label>
                    <select
                      name="size_unit"
                      value={formData.size_unit}
                      onChange={handleChange}
                      className="w-full px-2 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    >
                      <option value="Sqft">Sqft</option>
                      <option value="Aana">Aana</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    placeholder="e.g., Lazimpat, Kathmandu"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-terracotta-DEFAULT"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-terracotta-DEFAULT text-white rounded-lg font-semibold hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Property'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Properties */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">My Properties</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta-DEFAULT"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">You haven't submitted any properties yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-terracotta-DEFAULT text-white rounded-lg font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Submit Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    {property.primary_image ? (
                      <img
                        src={property.primary_image}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-terracotta-DEFAULT text-white px-3 py-1 rounded-full text-xs font-semibold">
                      For {property.house_type}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-primary mb-1 truncate">{property.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{property.location}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      {property.size && <span>{property.size} {property.size_unit}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-terracotta-DEFAULT">
                        NPR {parseInt(property.price).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(property.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
