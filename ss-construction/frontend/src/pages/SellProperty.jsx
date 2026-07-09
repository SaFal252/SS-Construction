import { useState } from 'react'
import api from '../api'

const SellProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    property_type: '',
    asking_price: '',
    description: '',
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Append new files to existing images
      const newImages = [...images, ...files]
      setImages(newImages)
      // Create preview URLs for new files only
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews([...imagePreviews, ...newPreviews])
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      console.log('Submitting form data:', formData)
      
      // Create FormData for file upload
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('phone', formData.phone)
      submitData.append('email', formData.email)
      submitData.append('location', formData.location)
      submitData.append('property_type', formData.property_type)
      submitData.append('asking_price', formData.asking_price)
      submitData.append('description', formData.description)
      
      // Append images if any
      if (images.length > 0) {
        images.forEach((image) => {
          submitData.append('images', image)
        })
      }
      
      await api.post('/inquiries/sell-requests/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setSuccess(true)
      setError('')
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        property_type: '',
        asking_price: '',
        description: '',
      })
      setImages([])
      setImagePreviews([])
    } catch (error) {
      console.error('Error submitting:', error)
      console.error('Error details:', error.response?.data)
      setError(error.response?.data?.detail || Object.values(error.response?.data || {}).flat().join(', ') || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const propertyTypes = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'semi_bungalow', label: 'Semi Bungalow' },
    { value: 'bungalow', label: 'Bungalow' },
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary-light pt-28 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-2">Sell Your Property</h1>
          <p className="text-gray-400 text-lg">Get the best value for your property</p>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-12 bg-primary-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary mb-4">Sell Your Property in Minutes</h2>
            <p className="text-gray-400 text-lg">
              List your property with us and reach thousands of potential buyers. 
              Our team will help you get the best price for your property.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 pb-24">
        <div className="container-custom">
          {success ? (
            <div className="bg-card max-w-2xl mx-auto rounded-2xl p-8 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-secondary mb-2">Thank You!</h3>
              <p className="text-gray-400">We've received your request. Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-heading font-semibold text-secondary mb-6">Property Details</h3>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input mt-6"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <input
                    type="text"
                    placeholder="Property Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    required
                  />
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Asking Price (NPR)"
                  value={formData.asking_price}
                  onChange={(e) => setFormData({ ...formData, asking_price: e.target.value })}
                  className="form-input mt-6"
                />
                <textarea
                  placeholder="Describe your property (size, features, amenities, etc.)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input mt-6"
                  rows="5"
                  required
                />
                
                {/* Image Upload Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#F5C518] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="property-images"
                    />
                    <label htmlFor="property-images" className="cursor-pointer block">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-400 mb-1">Click to upload property photos</p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 10MB each</p>
                    </label>
                  </div>
                  
                  {imagePreviews.length > 0 && (
                    <div className="mt-3 text-center">
                      <label htmlFor="property-images" className="cursor-pointer text-[#F5C518] hover:text-[#D4A017] text-sm font-medium">
                        + Add More Photos
                      </label>
                    </div>
                  )}
                  
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            Preview {index + 1}
                          </span>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary mt-6"
                >
                  {submitting ? 'Submitting...' : 'Submit Property'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default SellProperty
