import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import PropertyCard from '../components/PropertyCard'
import PropertyComparison from '../components/PropertyComparison'

const Favorites = () => {
  const { favorites, clearAllFavorites } = useFavorites()
  const [showComparison, setShowComparison] = useState(false)
  const [selectedForComparison, setSelectedForComparison] = useState([])

  const handleToggleComparison = (property) => {
    if (selectedForComparison.find(p => p.id === property.id)) {
      setSelectedForComparison(selectedForComparison.filter(p => p.id !== property.id))
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, property])
      }
    }
  }

  const handleRemoveFromComparison = (index) => {
    setSelectedForComparison(selectedForComparison.filter((_, i) => i !== index))
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      clearAllFavorites()
    }
  }

  return (
    <div className="min-h-screen bg-primary pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-400">
            You have {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        {favorites.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-white mb-2">No Favorites Yet</h2>
            <p className="text-gray-400 mb-6">
              Start exploring and save your favorite properties to compare and track them.
            </p>
            <Link
              to="/buy"
              className="inline-block bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            {/* Comparison Section */}
            {selectedForComparison.length > 0 && (
              <div className="mb-12 p-6 bg-primary-light rounded-xl border border-accent/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Compare {selectedForComparison.length} Properties
                  </h2>
                  <div className="space-x-3">
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                    >
                      {showComparison ? 'Hide' : 'Show'} Comparison
                    </button>
                    <button
                      onClick={() => setSelectedForComparison([])}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {showComparison && (
                  <PropertyComparison
                    properties={selectedForComparison}
                    onRemove={handleRemoveFromComparison}
                  />
                )}
              </div>
            )}

            {/* Favorites Grid */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  All Saved Properties ({favorites.length})
                </h2>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors text-sm"
                >
                  Clear All Favorites
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <div
                    key={property.id}
                    className="relative"
                    onMouseEnter={() => {}}
                  >
                    <PropertyCard property={property} />
                    
                    {/* Comparison Checkbox Overlay */}
                    <label className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer z-10">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.some(p => p.id === property.id)}
                        onChange={() => handleToggleComparison(property)}
                        disabled={
                          selectedForComparison.length >= 3 &&
                          !selectedForComparison.find(p => p.id === property.id)
                        }
                        className="w-5 h-5 rounded accent"
                      />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">
                        Compare
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-12 bg-gradient-to-r from-primary-light to-primary rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Tips for Using Favorites</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Save properties you like by clicking the heart icon on any property card</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Compare up to 3 properties side-by-side to make an informed decision</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Your favorites are automatically saved and will be available even if you close the browser</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Remove properties from favorites to keep your list organized and relevant</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Favorites
