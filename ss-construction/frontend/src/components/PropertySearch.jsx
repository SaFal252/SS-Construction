import { useState } from 'react'

const PropertySearch = ({ onSearch, properties = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    type: '',
    location: '',
    sort: 'newest',
  })

  // Extract unique values from properties for filter options
  const getUniqueLocations = () => {
    const locations = properties
      .map(p => p.location)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
    return locations.sort()
  }

  const getUniqueTypes = () => {
    const types = properties
      .map(p => p.type || p.house_type)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
    return types.sort()
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleReset = () => {
    setFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      type: '',
      location: '',
      sort: 'newest',
    })
    // Reset search
    onSearch({
      search: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      type: '',
      location: '',
      sort: 'newest',
    })
  }

  return (
    <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Advanced Search</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Search Bar */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by title, location..."
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
          />
        </div>

        {/* Grid Layout for Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Price Range */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Min Price (Rs)
            </label>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
              placeholder="Min price"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Max Price (Rs)
            </label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              placeholder="Max price"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Bedrooms
            </label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Bathrooms
            </label>
            <select
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Property Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            >
              <option value="">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Location
            </label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            >
              <option value="">All Locations</option>
              {getUniqueLocations().map(loc => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Sort By
            </label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-accent focus:bg-white/20 transition-all"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-accent text-primary py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Search Properties
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default PropertySearch
