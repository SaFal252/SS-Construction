import { Link } from 'react-router-dom'

const PropertyComparison = ({ properties = [], onRemove = () => {} }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-gray-400 mb-4">No properties to compare</p>
        <Link to="/buy" className="text-accent hover:underline">
          Browse Properties
        </Link>
      </div>
    )
  }

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `Rs. ${(price / 10000000).toFixed(1)} Cr`
    }
    return `Rs. ${price / 100000}L`
  }

  const getPropertyType = (property) => {
    return property.house_type || property.type || 'N/A'
  }

  const getLocation = (property) => {
    return property.location || 'N/A'
  }

  const getImage = (property) => {
    if (property.images && property.images.length > 0) {
      return property.images[0]?.image_url || property.primary_image
    }
    return property.image
  }

  const comparisonFields = [
    { label: 'Price', key: 'price', render: (p) => formatPrice(p.price) },
    { label: 'Type', key: 'type', render: (p) => getPropertyType(p) },
    { label: 'Location', key: 'location', render: (p) => getLocation(p) },
    { label: 'Bedrooms', key: 'bedrooms', render: (p) => p.bedrooms || 'N/A' },
    { label: 'Bathrooms', key: 'bathrooms', render: (p) => p.bathrooms || 'N/A' },
    { label: 'Area', key: 'area', render: (p) => `${p.area || 'N/A'} sqft` },
    { label: 'Furnishing', key: 'furnishing', render: (p) => p.furnishing || 'N/A' },
    { label: 'Parking', key: 'parking', render: (p) => p.parking ? 'Yes' : 'No' },
    { label: 'Garden', key: 'garden', render: (p) => p.garden ? 'Yes' : 'No' },
    { label: 'Security', key: 'security', render: (p) => p.security ? 'Yes' : 'No' },
  ]

  return (
    <div className="bg-primary-light rounded-xl overflow-hidden shadow-lg">
      {/* Mobile View */}
      <div className="md:hidden space-y-4 p-4">
        {properties.map((property, idx) => (
          <div key={property.id} className="card p-4">
            <button
              onClick={() => onRemove(idx)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <img
              src={getImage(property)}
              alt={property.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-white mb-2">{property.title}</h3>
            <p className="text-2xl font-bold text-accent mb-4">{formatPrice(property.price)}</p>
            
            <div className="space-y-2 text-sm">
              {comparisonFields.map(field => (
                <div key={field.key} className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-gray-400">{field.label}</span>
                  <span className="text-white font-medium">{field.render(property)}</span>
                </div>
              ))}
            </div>

            <Link
              to={`/property/${property.slug || property.id}`}
              className="block w-full mt-4 text-center bg-accent text-primary py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/50 border-b border-white/10">
              <th className="px-6 py-4 text-left text-white font-semibold">Features</th>
              {properties.map((property, idx) => (
                <th key={property.id} className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() => onRemove(idx)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <img
                      src={getImage(property)}
                      alt={property.title}
                      className="w-32 h-24 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-white text-sm truncate">
                      {property.title}
                    </h3>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {/* Price Row */}
            <tr className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-300">Price</td>
              {properties.map(property => (
                <td key={`price-${property.id}`} className="px-6 py-4 text-accent font-bold text-lg">
                  {formatPrice(property.price)}
                </td>
              ))}
            </tr>

            {/* Other Features */}
            {comparisonFields.map(field => (
              <tr key={field.key} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-300">{field.label}</td>
                {properties.map(property => (
                  <td key={`${field.key}-${property.id}`} className="px-6 py-4 text-white">
                    {field.render(property)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Action Row */}
            <tr>
              <td className="px-6 py-4"></td>
              {properties.map(property => (
                <td key={`action-${property.id}`} className="px-6 py-4">
                  <Link
                    to={`/property/${property.slug || property.id}`}
                    className="block text-center bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PropertyComparison
