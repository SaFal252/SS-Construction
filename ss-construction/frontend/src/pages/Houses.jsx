import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const HousesPage = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filters = ['All', 'Buy', 'Sell', 'Build']

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties/')
      setProperties(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const getListingType = (property) => {
    // Based on house_type, determine if it's Buy, Sell, or Build
    const houseType = property.house_type?.toLowerCase()
    if (houseType === 'buy') return 'Buy'
    if (houseType === 'sell') return 'Sell'
    return 'Build'
  }

  const filteredProperties = properties.filter((property) => {
    // Filter by listing type (Buy/Sell/Build)
    const listingType = getListingType(property)
    const typeMatch = activeFilter === 'All' || listingType === activeFilter
    
    // Filter by search query (name or location)
    const searchLower = searchQuery.toLowerCase()
    const searchMatch = !searchQuery || 
      (property.title?.toLowerCase().includes(searchLower)) ||
      (property.location?.toLowerCase().includes(searchLower))
    
    return typeMatch && searchMatch
  })

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Buy':
        return 'bg-blue-500'
      case 'Sell':
        return 'bg-red-500'
      case 'Build':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section - Dark Navy */}
      <div className="bg-[#1B6CA8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Browse our curated collection of properties across Nepal
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5C518] text-lg"
              />
              <svg 
                className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-[#B8860B] text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5C518]"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => {
              const listingType = getListingType(property)
              return (
                <Link
                  key={property.id}
                  to="#"
                  onClick={() => navigate(`/property/${property.slug}`, { state: { from: '/houses' } })}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {property.primary_image ? (
                      <img
                        src={property.primary_image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                    {/* Badge */}
                    <span className={`absolute top-3 left-3 ${getBadgeColor(listingType)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                      {listingType}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {property.title || 'Untitled Property'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 truncate">
                      {property.location || 'Location not specified'}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {property.bedrooms} bed
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          {property.bathrooms} bath
                        </span>
                      )}
                    </div>
                    
                    <div className="text-lg font-bold text-gray-900">
                      NPR {property.price ? parseInt(property.price).toLocaleString() : 'Price on request'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HousesPage
