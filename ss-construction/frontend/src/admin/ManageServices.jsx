import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AdminLayout from './AdminLayout'

const ManageServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    price_range_min: '',
    price_range_max: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [search])

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      
      const response = await api.get(`/services/?${params.toString()}`)
      setServices(response.data.results || response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('features', formData.features)
      formDataToSend.append('price_range_min', formData.price_range_min !== '' ? parseFloat(formData.price_range_min) : null)
      formDataToSend.append('price_range_max', formData.price_range_max !== '' ? parseFloat(formData.price_range_max) : null)
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      await api.post('/services/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setShowForm(false)
      setFormData({
        name: '',
        description: '',
        features: '',
        price_range_min: '',
        price_range_max: '',
        image: null
      })
      setImagePreview(null)
      fetchServices()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}/`)
        fetchServices()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Manage Services</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Home Improvement & Trade Services</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
            showForm 
              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
              : 'bg-accent text-primary shadow-lg shadow-accent/20 hover:bg-accent/80'
          }`}
        >
          {showForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 mb-10 animate-in slide-in-from-top-4 duration-500">
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900">Add New Service</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Create a new trade service offering</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Plumbing Services"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Service Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            {imagePreview && (
              <div className="rounded-2xl overflow-hidden h-48">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Brief description of the service..."
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-accent/20 transition-all font-medium text-gray-600 leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Key Features (one per line)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="4"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3&#10;Feature 4"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-accent/20 transition-all font-medium text-gray-600 leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Min Price (NPR)</label>
                <input
                  type="number"
                  name="price_range_min"
                  value={formData.price_range_min}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Max Price (NPR)</label>
                <input
                  type="number"
                  name="price_range_max"
                  value={formData.price_range_max}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50">
              <button
                type="submit"
                className="px-10 py-4 bg-accent text-primary rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-accent/80 transition-all shadow-xl shadow-accent/20"
              >
                Create Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] shadow-sm p-4 border border-gray-100">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search services by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold"
            />
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col">
                {service.image && (
                  <div className="h-40 overflow-hidden bg-gray-200">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-accent transition-colors">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-6 flex-1">{service.description}</p>

                  {service.price_range_min && service.price_range_max && (
                    <div className="mb-6 bg-gray-50 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price Range</p>
                      <p className="text-sm font-black text-gray-900">Rs. {(service.price_range_min/100000).toFixed(1)}L - {(service.price_range_max/100000).toFixed(1)}L</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto p-8 pt-0">
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="w-full p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-black text-sm uppercase tracking-widest"
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No services created yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ManageServices
