import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import AdminLayout from './AdminLayout'

const BuildProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    plot_size: '',
    estimated_budget: '',
    build_type: 'Residential',
    status: 'Planning',
    floors: 1,
    parking_spaces: 0,
    design_style: 'Modern',
    description: '',
    is_featured: false
  })

  useEffect(() => {
    fetchProjects()
  }, [search, statusFilter])

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter) params.set('status', statusFilter)
      
      const response = await api.get(`/properties/build/?${params.toString()}`)
      setProjects(response.data.results || response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const cleanedData = {
        ...formData,
        estimated_budget: formData.estimated_budget !== '' ? parseFloat(formData.estimated_budget) : null,
        floors: formData.floors !== '' ? parseInt(formData.floors, 10) : 1,
        parking_spaces: formData.parking_spaces !== '' ? parseInt(formData.parking_spaces, 10) : 0,
      }
      
      await api.post('/properties/build/', cleanedData)
      setShowForm(false)
      setFormData({
        title: '',
        location: '',
        plot_size: '',
        estimated_budget: '',
        build_type: 'Residential',
        status: 'Planning',
        floors: 1,
        parking_spaces: 0,
        design_style: 'Modern',
        description: '',
        is_featured: false
      })
      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (slug) => {
    if (window.confirm('Are you sure you want to delete this build project?')) {
      try {
        await api.delete(`/properties/build/${slug}/`)
        fetchProjects()
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleStatusChange = async (slug, newStatus) => {
    try {
      await api.patch(`/properties/build/${slug}/`, { status: newStatus })
      fetchProjects()
    } catch (error) {
      console.error('Error:', error)
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Build Projects</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Construction Pipeline & Portfolio</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full md:w-auto px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
            showForm 
              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' 
              : 'bg-accent text-primary shadow-lg shadow-accent/20 hover:bg-accent/80'
          }`}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 mb-10 animate-in slide-in-from-top-4 duration-500">
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900">Initialize New Build</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Set project parameters and budget</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Modern Villa in Tokha"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Tokha, Kathmandu"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Plot Size</label>
                <input
                  type="text"
                  name="plot_size"
                  value={formData.plot_size}
                  onChange={handleChange}
                  placeholder="e.g. 5 Aana"
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Budget (NPR)</label>
                <input
                  type="number"
                  name="estimated_budget"
                  value={formData.estimated_budget}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Build Type</label>
                <select
                  name="build_type"
                  value={formData.build_type}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Design Style</label>
                <select
                  name="design_style"
                  value={formData.design_style}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                >
                  <option value="Modern">Modern</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Floors</label>
                <input
                  type="number"
                  name="floors"
                  value={formData.floors}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all font-bold text-gray-900"
                />
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-6 h-6 rounded-lg border-gray-300 text-accent focus:ring-accent/20"
                  />
                  <span className="ml-3 text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Featured Project</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Project Vision / Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the scope, architectural requirements, and goals..."
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-accent/20 transition-all font-medium text-gray-600 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50">
              <button
                type="submit"
                className="px-10 py-4 bg-accent text-primary rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-accent/80 transition-all shadow-xl shadow-accent/20"
              >
                Launch Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main View: Search & Grid */}
      <div className="space-y-6">
        <div className="bg-white rounded-[2rem] shadow-sm p-4 border border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search projects by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-6 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-black text-gray-700 cursor-pointer uppercase tracking-widest"
          >
            <option value="">All Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready to Build">Ready to Build</option>
          </select>
        </div>

        {/* Custom Project Cards */}
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-8 pb-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border ${
                      project.status === 'Planning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      project.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {project.status}
                    </div>
                    {project.is_featured && (
                      <span className="flex items-center text-xs font-black text-accent">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        FEATURED
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-accent transition-colors">{project.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {project.location}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-sm font-black font-mono text-gray-900">Rs. {(project.estimated_budget/100000).toFixed(1)}L</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{project.build_type}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto p-8 pt-0 flex flex-col sm:flex-row gap-2">
                  {project.status === 'Planning' && (
                    <button
                      onClick={() => handleStatusChange(project.slug, 'In Progress')}
                      className="flex-1 py-3 bg-accent text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all"
                    >
                      Initialize Build
                    </button>
                  )}
                  {project.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusChange(project.slug, 'Ready to Build')}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(project.slug)}
                    className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all self-start sm:self-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No construction projects tracked</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

\export default BuildProjects
