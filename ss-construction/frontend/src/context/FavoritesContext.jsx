import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('propertyFavorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.log('Error loading favorites:', e)
      }
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (property) => {
    if (!isFavorite(property.id)) {
      setFavorites([...favorites, property])
      toast.success('Added to favorites!')
      return true
    }
    return false
  }

  const removeFavorite = (propertyId) => {
    setFavorites(favorites.filter(p => p.id !== propertyId))
    toast.success('Removed from favorites')
    return true
  }

  const isFavorite = (propertyId) => {
    return favorites.some(p => p.id === propertyId)
  }

  const toggleFavorite = (property) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id)
    } else {
      addFavorite(property)
    }
  }

  const getFavoriteCount = () => {
    return favorites.length
  }

  const clearAllFavorites = () => {
    setFavorites([])
    toast.success('All favorites cleared')
  }

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoriteCount,
    clearAllFavorites,
    loading,
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
