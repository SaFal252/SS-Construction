import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Simple in-memory cache
const cache = new Map()
const CACHE_DURATION = 30 * 1000 // 30 seconds - reduced for fresh data

const getCachedData = (key) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Generate cache key for GET requests
    if (config.method === 'get') {
      config.cacheKey = `${config.url}_${JSON.stringify(config.params || {})}`
      const cachedData = getCachedData(config.cacheKey)
      if (cachedData) {
        config.cachedData = cachedData
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get' && response.config.cacheKey) {
      setCachedData(response.config.cacheKey, response.data)
    }
    
    // Return cached data if available
    if (response.config.cachedData) {
      return response
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle network errors
    if (!error.response) {
      if (!originalRequest._retryNetwork) {
        originalRequest._retryNetwork = true
        toast.error('Network error. Please check your connection.')
      }
      return Promise.reject(error)
    }
    
    // Handle 401 - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access, refresh } = response.data
          localStorage.setItem('access_token', access)
          if (refresh) {
            localStorage.setItem('refresh_token', refresh)
          }
          
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Handle other errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.')
    }
    
    return Promise.reject(error)
  }
)

export default api

// Site Settings API
export const siteSettingsAPI = {
  getSettings: () => api.get('/site-settings/settings/'),
  getSetting: (key) => api.get(`/site-settings/settings/${key}/`),
  updateSetting: (key, value) => api.patch(`/site-settings/settings/${key}/`, { value }),
  
  // Services
  getServices: () => api.get('/site-settings/services/'),
  createService: (data) => api.post('/site-settings/services/', data),
  updateService: (id, data) => api.put(`/site-settings/services/${id}/`, data),
  deleteService: (id) => api.delete(`/site-settings/services/${id}/`),
  
  // Testimonials
  getTestimonials: () => api.get('/site-settings/testimonials/'),
  createTestimonial: (data) => api.post('/site-settings/testimonials/', data),
  updateTestimonial: (id, data) => api.put(`/site-settings/testimonials/${id}/`, data),
  deleteTestimonial: (id) => api.delete(`/site-settings/testimonials/${id}/`),
  
  // Why Choose Us
  getWhyChooseUs: () => api.get('/site-settings/why-choose-us/'),
  createWhyChooseUs: (data) => api.post('/site-settings/why-choose-us/', data),
  updateWhyChooseUs: (id, data) => api.put(`/site-settings/why-choose-us/${id}/`, data),
  deleteWhyChooseUs: (id) => api.delete(`/site-settings/why-choose-us/${id}/`)
}

export const crmAPI = {
  getSummary: () => api.get('/crm/reports/summary/'),
  getCustomers: (params = {}) => api.get('/crm/customers/', { params }),
  getCustomer: (id) => api.get(`/crm/customers/${id}/`),
  createCustomer: (formData) => api.post('/crm/customers/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCustomer: (id, formData) => api.patch(`/crm/customers/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCustomer: (id) => api.delete(`/crm/customers/${id}/`),
  addFollowUp: (id, data) => api.post(`/crm/customers/${id}/follow-ups/`, data),
}
