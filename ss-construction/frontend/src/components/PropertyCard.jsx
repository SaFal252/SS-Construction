import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

// Sample Nepali house images for demo
const sampleImages = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
]

const PropertyCard = ({ property }) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const isPropertyFavorite = isFavorite(property.id)
  
  // Check if it's a sample property (has type field)
  const isSampleProperty = property.type !== undefined && !property.house_type
  
  // For API properties, house_type is used; for sample, type is used
  const propertyType = property.house_type || property.type || 'Property'

  const formatPrice = (price) => {
    // For sample properties, show in Lakhs
    if (price >= 1000000) {
      const lakhs = price / 1000000
      return `Rs. ${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} Crore`
    }
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Get image
  const getImage = () => {
    if (isSampleProperty && property.image) {
      return property.image
    }
    if (property.images && property.images.length > 0) {
      return property.images[0]?.image_url || property.primary_image
    }
    const sampleIndex = (property.id || 0) % sampleImages.length
    return sampleImages[sampleIndex]
  }

  // Get location
  const getLocation = () => {
    if (isSampleProperty) return property.location
    return property.location
  }

  // Render star rating
  const renderRating = (rating) => {
    if (!rating) return null
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfFill">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#374151" />
              </linearGradient>
            </defs>
            <path fill="url(#halfFill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      }
    }
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-gray-400 text-sm ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <div className="card group hover:-translate-y-2 transition-transform duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getImage()}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isSampleProperty && property.isFeatured && (
            <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
              FEATURED
            </span>
          )}
          {isSampleProperty && property.isNew && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              NEW
            </span>
          )}
        </div>

        {/* Property Type Badge */}
        {isSampleProperty && (
          <span className="absolute top-3 right-3 bg-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium">
            {propertyType}
          </span>
        )}
        {!isSampleProperty && property.status && (
          <span className={`absolute top-3 right-3 property-badge ${
            property.status === 'Featured' ? 'property-badge-featured' :
            property.status === 'Approved' ? 'property-badge-available' :
            'property-badge-sold'
          }`}>
            {property.status}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(property)}
          className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isPropertyFavorite
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm'
          }`}
          aria-label="Add to favorites"
        >
          <svg
            className={`w-5 h-5 ${isPropertyFavorite ? 'fill-current' : ''}`}
            fill={isPropertyFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <p className="text-2xl font-heading font-bold text-accent mb-2">
          {formatPrice(property.price)}
        </p>

        {/* Title */}
        <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-gray-400 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{getLocation()}</span>
        </p>

        {/* Rating */}
        {isSampleProperty && property.rating && (
          <div className="mb-3">
            {renderRating(property.rating)}
          </div>
        )}

        {/* Features - for sample properties */}
        {isSampleProperty && property.features && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.features.slice(0, 4).map((feature, index) => (
              <span 
                key={index} 
                className="bg-primary-light text-gray-300 text-xs px-2 py-1 rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Features - for API properties */}
        {!isSampleProperty && (
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            {property.bedrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {property.bathrooms} Baths
              </span>
            )}
            {property.size && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.size} {property.size_unit || 'sqft'}
              </span>
            )}
          </div>
        )}

        {/* Area - for sample properties */}
        {isSampleProperty && property.area && (
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {property.area} sqft
            </span>
          </div>
        )}

        {/* View Button - gold hover effect */}
        <button
          onClick={() => navigate(`/property/${property.slug || property.id}`, { state: { from: '/buy' } })}
          className="block w-full text-center bg-primary-light text-secondary py-3 rounded-lg font-medium hover:bg-accent hover:text-primary transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/20"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default PropertyCard
