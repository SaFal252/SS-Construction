import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../api'
import AdminLayout from './AdminLayout'

const PropertyForm = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const locationState = useLocation().state
  const isEdit = Boolean(slug)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    size: '',
    size_unit: 'Sqft',
    bedrooms: '',
    bathrooms: '',
    description: '',
    status: '',
    house_type: 'Residential',
    is_featured: false,
    features: [],
    // New fields
    face_direction: '',
    road_access: false,
    floors: '',
  })
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [primaryImageId, setPrimaryImageId] = useState(null)

  useEffect(() => {
    if (isEdit) {
      fetchProperty()
    } else if (locationState) {
      setFormData(prev => ({
        ...prev,
        title: locationState.title || prev.title,
        price: locationState.price || locationState.asking_price || prev.price,
        location: locationState.location || prev.location,
        description: locationState.description || prev.description,
        house_type: locationState.property_type || prev.house_type,
        // Store the source request ID for later image copy
        source_request_id: locationState.source_request_id || null,
      }))
    }
  }, [slug, locationState])

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${slug}/`)
      const data = response.data
      setFormData({
        title: data.title || '',
        price: data.price || '',
        location: data.location || '',
        size: data.size || '',
        size_unit: data.size_unit || 'Sqft',
        bedrooms: data.bedrooms || '',
        bathrooms: data.bathrooms || '',
        description: data.description || '',
        status: data.status || '',
        house_type: data.house_type || 'Residential',
        is_featured: data.is_featured || false,
        features: data.features || [],
        // New fields
        face_direction: data.face_direction || '',
        road_access: data.road_access || false,
        floors: data.floors || '',
      })
      setExistingImages(data.images || [])
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])
  }

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeExistingImage = async (imageId) => {
    try {
      await api.delete(`/properties/images/${imageId}/`)
      setExistingImages(existingImages.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const setAsPrimary = (imageId) => {
    setPrimaryImageId(imageId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage('Saving property...')

    const cleanedData = {
      ...formData,
      is_featured: Boolean(formData.is_featured),
      price: formData.price !== '' ? parseFloat(formData.price) : null,
      size: formData.size !== '' ? parseFloat(formData.size) : null,
      bedrooms: formData.bedrooms !== '' ? parseInt(formData.bedrooms, 10) : null,
      bathrooms: formData.bathrooms !== '' ? parseInt(formData.bathrooms, 10) : null,
      road_access: Boolean(formData.road_access),
      floors: formData.floors !== '' ? parseInt(formData.floors, 10) : 1,
    }

    try {
      let propertySlug = slug

      if (isEdit) {
        await api.put(`/properties/${slug}/`, cleanedData)
      } else {
        const response = await api.post('/properties/', cleanedData)
        propertySlug = response.data.slug
      }

      if (images.length > 0) {
        setSaving(false)
        setUploadingImages(true)
        setSaveMessage('Uploading images...')

        for (const image of images) {
          const formDataImg = new FormData()
          formDataImg.append('image', image)
          if (primaryImageId === null && existingImages.length === 0 && images.indexOf(image) === 0) {
            formDataImg.append('is_primary', 'true')
          }
          await api.post(`/properties/${propertySlug}/upload_image/`, formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      }

      navigate('/admin/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      console.error('VALIDATION ERROR DETAIL:', JSON.stringify(error.response?.data, null, 2))
      alert(`Failed to save property. The server says: \n\n${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setSaving(false)
      setUploadingImages(false)
      setSaveMessage('')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/admin/properties" className="text-gray-500 hover:text-gray-700 mr-4">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Essential Info Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-[#B8860B] border-b pb-2 mb-4 uppercase tracking-wider">General Information</h2>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                required
                placeholder="Enter property name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (NPR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                required
                placeholder="e.g. 5000000"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                required
                placeholder="City, District"
                list="location-suggestions"
              />
              <datalist id="location-suggestions">
                <option value="Kathmandu" /><option value="Lalitpur" /><option value="Bhaktapur" />
                <option value="Pokhara" /><option value="Chitwan" /><option value="Butwal" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">House Type</label>
              <select
                name="house_type"
                value={formData.house_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Semi Bangalow">Semi Bangalow</option>
                <option value="Bangalow">Bangalow</option>
              </select>
            </div>

            {/* Specifications Section */}
            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-bold text-[#B8860B] border-b pb-2 mb-4 uppercase tracking-wider">Specifications</h2>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Total Size</label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                  placeholder="e.g. 1500"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
                <select
                  name="size_unit"
                  value={formData.size_unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-bold"
                >
                  <option value="Sqft">Sqft</option>
                  <option value="Aana">Aana</option>
                  <option value="Ropani">Ropani</option>
                </select>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Number of Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                placeholder="e.g. 3"
                min="0"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Number of Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                placeholder="e.g. 2"
                min="0"
              />
            </div>

            {/* Face Direction */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Facing Direction</label>
              <select
                name="face_direction"
                value={formData.face_direction}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
              >
                <option value="">Select Direction</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="North-East">North-East</option>
                <option value="North-West">North-West</option>
                <option value="South-East">South-East</option>
                <option value="South-West">South-West</option>
              </select>
            </div>

            {/* Number of Floors */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Number of Floors</label>
              <input
                type="number"
                name="floors"
                value={formData.floors}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                placeholder="e.g. 2"
                min="1"
              />
            </div>

            {/* Road Access */}
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                name="road_access"
                id="road_access"
                checked={formData.road_access}
                onChange={handleChange}
                className="w-5 h-5 text-[#B8860B] border-gray-300 rounded focus:ring-[#B8860B]"
              />
              <label htmlFor="road_access" className="text-sm font-bold text-gray-700">
                Road Access Available
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-bold"
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4">
              <h2 className="text-lg font-bold text-[#B8860B] border-b pb-2 mb-4 uppercase tracking-wider">Property Media & Details</h2>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                required
                placeholder="Describe features, amenities, nearby places, etc."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Images</label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group overflow-hidden rounded-xl border border-gray-200">
                    <img src={img.image_url} alt="" className="w-full h-32 object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAsPrimary(img.id)}
                        className={`p-2 rounded-lg transition-all ${img.is_primary ? 'bg-[#B8860B] text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        title="Set as Primary"
                      >
                        <svg className="w-5 h-5" fill={img.is_primary ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        title="Delete Image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    {img.is_primary && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#B8860B] text-white text-[10px] font-black uppercase rounded shadow-lg">Primary</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-[2rem] p-10 text-center hover:border-[#B8860B] group transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#B8860B]/10 transition-colors">
                    <svg className="w-8 h-8 text-gray-400 group-hover:text-[#B8860B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-700">Click or drag to upload property photos</p>
                    <p className="text-xs text-gray-400 font-medium">PNG, JPG up to 10MB each</p>
                  </div>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {images.map((img, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-[#B8860B]/20">
                      <img src={URL.createObjectURL(img)} alt="" className="w-full h-32 object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-6 mt-12 pt-8 border-t border-gray-100">
            <Link to="/admin/properties" className="px-10 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black uppercase tracking-widest hover:border-gray-200 hover:text-gray-600 transition-all text-xs">
              Discard Changes
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="px-10 py-4 bg-[#B8860B] text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-[#B8860B]/20 transition-all disabled:opacity-50 text-xs"
            >
              {saving ? 'Syncing...' : uploadingImages ? 'Hosting Media...' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default PropertyForm