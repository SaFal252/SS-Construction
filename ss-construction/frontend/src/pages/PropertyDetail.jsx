import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api'
import PageLoader from '../components/PageLoader'
import { useAuth } from '../context/AuthContext'

const PropertyDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [inquiryImage, setInquiryImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchProperty()
    // Pre-fill form with logged-in user info
    if (user) {
      setInquiryForm({
        name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
        message: '',
      })
    }
  }, [slug, user])

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/properties/${slug}/`)
      setProperty(response.data)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', inquiryForm.name)
      formData.append('phone', inquiryForm.phone)
      formData.append('email', inquiryForm.email)
      formData.append('message', inquiryForm.message)
      formData.append('property', property.id)
      formData.append('inquiry_type', 'property')
      if (inquiryImage) {
        formData.append('image', inquiryImage)
      }
      await api.post('/inquiries/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(true)
      setInquiryForm({ name: '', phone: '', email: '', message: '' })
      setInquiryImage(null)
    } catch (error) {
      console.error('Error submitting inquiry:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return <PageLoader />
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-heading font-bold text-secondary mb-4">Property Not Found</h2>
          <Link to="/buy" className="text-accent hover:underline text-lg">
            ← Back to properties
          </Link>
        </div>
      </div>
    )
  }

  const images = property.images?.map(img => img.image_url) || [property.primary_image].filter(Boolean)

  return (
    <div className="min-h-screen bg-primary">
      {/* Breadcrumb */}
      <div className="bg-primary-light pt-24 pb-4">
        <div className="container-custom">
          <button 
              onClick={() => {
                // Get the URL from browser history and go back
                window.history.back()
              }} 
              className="text-gray-400 hover:text-accent transition-colors cursor-pointer"
            >
              ← Back
            </button>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 bg-card rounded-2xl overflow-hidden mb-4">
                {images.length > 0 ? (
                  <img
                    src={images[selectedImage]}
                    alt={property.title}
                    className="w-full h-96 md:h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-card flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                        selectedImage === index ? 'ring-2 ring-accent scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-card rounded-2xl p-6 md:p-8">
              <h1 className="text-3xl font-heading font-bold text-secondary mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-400 mb-6">
                <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location}
              </div>

              {/* Property Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {property.house_type && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-xl font-bold text-accent">{property.house_type}</p>
                    <p className="text-gray-400 text-sm">Property Type</p>
                  </div>
                )}
                {property.status && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className={`text-xl font-bold ${property.status === 'Available' ? 'text-green-400' : property.status === 'Sold' ? 'text-red-400' : 'text-yellow-400'}`}>{property.status}</p>
                    <p className="text-gray-400 text-sm">Status</p>
                  </div>
                )}
                {property.bedrooms > 0 && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.bedrooms}</p>
                    <p className="text-gray-400 text-sm">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.bathrooms}</p>
                    <p className="text-gray-400 text-sm">Bathrooms</p>
                  </div>
                )}
                {property.land_size && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.land_size}</p>
                    <p className="text-gray-400 text-sm">Land (sq ft)</p>
                  </div>
                )}
                {property.built_area && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.built_area}</p>
                    <p className="text-gray-400 text-sm">Built (sq ft)</p>
                  </div>
                )}
                {property.size && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.size}</p>
                    <p className="text-gray-400 text-sm">Size ({property.size_unit})</p>
                  </div>
                )}
                {property.build && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.build}</p>
                    <p className="text-gray-400 text-sm">Year Built</p>
                  </div>
                )}
                {property.floors > 0 && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-3xl font-bold text-accent">{property.floors}</p>
                    <p className="text-gray-400 text-sm">Floors</p>
                  </div>
                )}
                {property.face_direction && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-xl font-bold text-accent">{property.face_direction}</p>
                    <p className="text-gray-400 text-sm">Facing</p>
                  </div>
                )}
                {property.road_access && (
                  <div className="bg-primary p-4 rounded-xl text-center">
                    <p className="text-xl font-bold text-green-400">✓</p>
                    <p className="text-gray-400 text-sm">Road Access</p>
                  </div>
                )}
              </div>

              {/* Posted By Info */}
              {(property.posted_by_name || property.posted_by_phone) && (
                <div className="mb-6 p-4 bg-primary rounded-xl">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Contact Information</h3>
                  {property.posted_by_name && (
                    <p className="text-gray-400 mb-1">Name: {property.posted_by_name}</p>
                  )}
                  {property.posted_by_phone && (
                    <p className="text-gray-400">Phone: {property.posted_by_phone}</p>
                  )}
                </div>
              )}

              {/* Features List */}
              {property.features && property.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-heading font-semibold text-secondary mb-3">Features & Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, index) => (
                      <span key={index} className="px-4 py-2 bg-primary rounded-full text-gray-300 text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-heading font-semibold text-secondary mb-3">Description</h2>
                <p className="text-gray-400 whitespace-pre-line leading-relaxed">{property.description}</p>
              </div>

              {/* Parking */}
              {property.parking && (
                <div className="flex items-center mb-6">
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    ✓ Parking Available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-card rounded-2xl p-6 mb-6 sticky top-24">
              <p className="text-4xl font-heading font-bold text-accent mb-6">
                {formatPrice(property.price)}
              </p>

              {/* Contact Agent */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-heading font-semibold text-secondary mb-4">Interested? Contact Us</h3>
                <div className="space-y-4 mb-6">
                  <a 
                    href="tel:+9779810163311" 
                    className="flex items-center text-gray-400 hover:text-accent transition-colors p-3 bg-primary rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +977 9810163311
                  </a>
                  <a 
                    href="https://wa.me/9779810163311" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-green-400 transition-colors p-3 bg-primary rounded-lg"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-card rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-secondary mb-4">Send Inquiry</h3>
              
              {success ? (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-4 rounded-xl">
                  <p className="font-medium">Thank you! We'll contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="form-input"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="form-input"
                      required
                    />
                    <textarea
                      placeholder="Your Message"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="form-input"
                      rows="4"
                      required
                    />
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attach Photo (optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setInquiryImage(e.target.files[0])}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B8860B]/20 outline-none transition-all text-gray-900 font-medium"
                      />
                      {inquiryImage && (
                        <p className="text-sm text-green-600 mt-1">Selected: {inquiryImage.name}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {submitting ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
                                      
export default PropertyDetail
