import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api'
import PropertyCard from '../components/PropertyCard'
import PageLoader from '../components/PageLoader'

const BuyProperty = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Read current page from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  
  const [pagination, setPagination] = useState({
    page: currentPage,
    totalPages: 1,
    count: 0,
  })

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
  })

  useEffect(() => {
    fetchProperties()
  }, [searchParams])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams)
      // Note: Backend already filters for status='Approved' for non-admin users
      // Remove any invalid status parameter that might cause 400 error
      params.delete('status')
      const response = await api.get(`/properties/?${params.toString()}`)
      setProperties(response.data.results || response.data)
      setPagination({
        page: currentPage,
        totalPages: Math.ceil((response.data.count || 0) / 10),
        count: response.data.count || 0,
      })
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const locations = ['Tokha', 'Tarkeshwor', 'Machhapokhari', 'Kathmandu', 'Other']

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary-light pt-28 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-2">Buy Property</h1>
          <p className="text-gray-400 text-lg">Find your dream property in Kathmandu</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-card sticky top-20 z-40 shadow-lg shadow-black/20">
        <div className="container-custom py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location Filter */}
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="form-input"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Price Range */}
            <select
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="form-input"
            >
              <option value="">Max Price</option>
              <option value="5000000">Rs. 50 Lakhs</option>
              <option value="10000000">Rs. 1 Crore</option>
              <option value="20000000">Rs. 2 Crores</option>
              <option value="50000000">Rs. 5 Crores</option>
            </select>

            {/* Bedrooms */}
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="form-input"
            >
              <option value="">Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setFilters({ location: '', min_price: '', max_price: '', bedrooms: '' })
                setSearchParams({})
              }}
              className="px-4 py-3 bg-primary text-secondary rounded-lg hover:bg-accent hover:text-primary transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="container-custom py-8">
        {loading ? (
          <PageLoader />
        ) : properties.length > 0 ? (
          <>
            <p className="text-gray-400 mb-6">{pagination.count} properties found</p>
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  onClick={() => {
                    const newPage = currentPage - 1
                    const params = new URLSearchParams(searchParams)
                    if (newPage > 1) {
                      params.set('page', newPage.toString())
                    } else {
                      params.delete('page')
                    }
                    setSearchParams(params)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={currentPage === 1}
                  className="px-5 py-3 bg-card text-secondary border border-white/10 rounded-lg disabled:opacity-50 hover:bg-accent hover:text-primary transition-all"
                >
                  Previous
                </button>
                <span className="px-5 py-3 text-gray-400">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => {
                    const newPage = currentPage + 1
                    const params = new URLSearchParams(searchParams)
                    params.set('page', newPage.toString())
                    setSearchParams(params)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={currentPage === pagination.totalPages}
                  className="px-5 py-3 bg-card text-secondary border border-white/10 rounded-lg disabled:opacity-50 hover:bg-accent hover:text-primary transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-2xl font-heading font-semibold text-secondary mb-3">No Properties Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
            <Link to="/buy" className="text-accent hover:underline text-lg">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyProperty
