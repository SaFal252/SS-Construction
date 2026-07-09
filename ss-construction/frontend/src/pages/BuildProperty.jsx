import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import Footer from '../components/Footer'

const BuildProperty = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    house_style: 'Residential',
    floors: '',
    bedrooms: '',
    budget: '',
    message: ''
  })

  const houseStyles = ['Commercial', 'Residential', 'Semi Bangalow', 'Bangalow']
  const floorOptions = ['1', '2', '2.5', '3', '3.5+']
  const bedroomOptions = ['1', '2', '3', '4', '5+']
  const budgetOptions = ['Below 50 lakhs', '50 lakhs – 1 crore', '1 crore – 2 crore', '2 crore – 5 crore', 'Above 5 crore']

  const handleStyleToggle = (style) => {
    setFormData(prev => ({
      ...prev,
      house_style: prev.house_style === style ? '' : style
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/inquiries/', {
        name: formData.full_name,
        phone: formData.phone,
        email: '',
        message: `House Style: ${formData.house_style}\nFloors: ${formData.floors}\nBedrooms: ${formData.bedrooms}\nBudget: ${formData.budget}\nLocation: ${formData.location}\n\nAdditional: ${formData.message}`,
        inquiry_type: 'build_property'
      })
      setSuccess(true)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d1b2e' }}>
      

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Build your dream house <span className="text-2xl">🏡</span>
          </h1>
          <p className="text-lg" style={{ color: '#8fa3b8' }}>
            Tell us a little about what you want — our team in Tokha, Tarkeshwor will get in touch to plan everything with you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-4xl">
          
          {success ? (
            /* Success Card */
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: '#112240', border: '1px solid #1e3a5f' }}>
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#f0b429' }}>
                <svg className="w-10 h-10" style={{ color: '#0d1b2e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-8">Request received!</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-6" style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f' }}>
                  <p className="text-sm mb-2" style={{ color: '#8fa3b8' }}>Call/Viber</p>
                  <p className="text-white font-semibold">+977 9810163311</p>
                </div>
                <div className="rounded-xl p-6" style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f' }}>
                  <p className="text-sm mb-2" style={{ color: '#8fa3b8' }}>Email</p>
                  <p className="text-white font-semibold break-words whitespace-normal text-sm">surajandsupriyaconstruction@gmail.com</p>
                </div>
                <div className="rounded-xl p-6" style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f' }}>
                  <p className="text-sm mb-2" style={{ color: '#8fa3b8' }}>WhatsApp</p>
                  <p className="text-white font-semibold">Chat with us →</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              
              {/* Card 1 - Your Details */}
              <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: '#112240', border: '1px solid #1e3a5f' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#f0b429' }}>Your details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Full name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Your area / location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                      placeholder="e.g. Tokha, Baneshwor, Lalitpur"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 - Your Dream House */}
              <div className="rounded-2xl p-8 mb-6" style={{ backgroundColor: '#112240', border: '1px solid #1e3a5f' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#f0b429' }}>Your dream house</h2>
                
                {/* House Style Toggle Chips */}
                <div className="mb-6">
                  <label className="block text-sm mb-3" style={{ color: '#8fa3b8' }}>House style</label>
                  <div className="flex flex-wrap gap-2">
                    {houseStyles.map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => handleStyleToggle(style)}
                        className="px-4 py-2 rounded-full transition-colors"
                        style={{ 
                          backgroundColor: formData.house_style === style ? '#f0b429' : '#0d1b2e',
                          border: '1px solid #1e3a5f',
                          color: formData.house_style === style ? '#0d1b2e' : '#8fa3b8'
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Approx. floors</label>
                    <select
                      name="floors"
                      value={formData.floors}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                    >
                      <option value="">Select floors</option>
                      {floorOptions.map(floor => (
                        <option key={floor} value={floor}>{floor}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Bedrooms needed</label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                    >
                      <option value="">Select bedrooms</option>
                      {bedroomOptions.map(bed => (
                        <option key={bed} value={bed}>{bed}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#8fa3b8' }}>Budget range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg outline-none"
                      style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                    >
                      <option value="">Select budget</option>
                      {budgetOptions.map(budget => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 3 - Anything to add */}
              <div className="rounded-2xl p-8 mb-8" style={{ backgroundColor: '#112240', border: '1px solid #1e3a5f' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#f0b429' }}>Anything to add?</h2>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg outline-none resize-none"
                  style={{ backgroundColor: '#0d1b2e', border: '1px solid #1e3a5f', color: '#fff' }}
                  placeholder="e.g. East-facing main door, need puja kotha and terrace, earthquake resistant construction..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full font-semibold text-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#f0b429', color: '#0d1b2e' }}
              >
                {loading ? 'Sending...' : 'Send my request'}
              </button>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px" style={{ backgroundColor: '#1e3a5f' }}></div>
                <span className="px-4 text-sm" style={{ color: '#8fa3b8' }}>want to discuss in detail?</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#1e3a5f' }}></div>
              </div>

              {/* Contact Banner */}
              <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: '#112240', border: '1px solid #1e3a5f' }}>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Talk to our team directly</h3>
                  <p style={{ color: '#8fa3b8' }}>We're here to help with your construction needs</p>
                </div>
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full font-semibold transition-colors"
                  style={{ border: '2px solid #f0b429', color: '#f0b429' }}
                >
                  Go to Contact →
                </Link>
              </div>

            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0d1b2e', borderTop: '1px solid #1e3a5f' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" style={{ color: '#f0b429' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z"/>
                  <path d="M10 14h4v5h-4z"/>
                </svg>
                <span className="text-xl font-bold" style={{ color: '#f0b429' }}>SS</span>
              </div>
              <p className="text-sm mb-4" style={{ color: '#8fa3b8' }}>
                Building dreams since 2075. We specialize in premium construction and real estate in Tokha, Tarkeshwor, and surrounding areas of Kathmandu. Your dream home awaits.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-[#f0b429] transition-colors">Facebook</a>
                <a href="#" className="text-white hover:text-[#f0b429] transition-colors">Instagram</a>
                <a href="#" className="text-white hover:text-[#f0b429] transition-colors">TikTok</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Home</Link></li>
                <li><Link to="/buy" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Buy Property</Link></li>
                <li><Link to="/construction" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Construction</Link></li>
                <li><Link to="/portfolio" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Portfolio</Link></li>
                <li><Link to="/sell" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Sell Property</Link></li>
                <li><Link to="/about" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>About Us</Link></li>
                <li><Link to="/contact" className="text-sm hover:text-[#f0b429] transition-colors" style={{ color: '#8fa3b8' }}>Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm" style={{ color: '#8fa3b8' }}>
                <li className="flex items-center gap-2">
                  <span>📍</span> Tokha, Tarkeshwor, Kathmandu, Nepal
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +977 9810163311
                </li>
                <li className="flex items-center gap-2">
                  <span>✉</span> surajandsupriyaconstruction@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <span>💬</span> WhatsApp
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid #1e3a5f', color: '#4a6080' }}>
            © 2025 SS Real Estate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BuildProperty
