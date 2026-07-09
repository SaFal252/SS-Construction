import { useState } from 'react'
import api from '../api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await api.post('/inquiries/', {
        ...formData,
        inquiry_type: 'general',
      })
      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      console.error('Error submitting:', err)
      setError(err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join(', ') || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      value: '+977 9810163311',
      link: 'tel:+9779810163311',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      title: 'WhatsApp',
      value: '+977 9810163311',
      link: 'https://wa.me/9779810163311',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      value: 'surajandsupriyaconstruction@gmail.com',
      link: 'mailto:surajandsupriyaconstruction@gmail.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Address',
      value: 'Tokha, Tarkeshwor, Kathmandu, Nepal',
      link: 'https://www.google.com/maps/place/SS+Construction+Nepal/@27.7616763,85.3091641,14z/data=!4m6!3m5!1s0x39eb1f056ca6105f:0xc9d02fee490a7767!8m2!3d27.7614987!4d85.3191094!16s%2Fg%2F11z7p9g2fq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D',
    },
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-primary-light pt-28 pb-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-2">Contact Us</h1>
          <p className="text-gray-400 text-lg">Get in touch with our team</p>
        </div>
      </div>

      <div className="container-custom py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-secondary mb-6">Get In Touch</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Have questions about our services or properties? We're here to help. 
              Reach out to us through any of the channels below.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="font-heading font-semibold text-secondary">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-gray-400 hover:text-accent transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-400">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-10">
              <h3 className="font-heading font-semibold text-secondary mb-4">Find Us</h3>
              <div className="bg-card rounded-2xl h-72 flex items-center justify-center overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=27.7614987,85.3191094&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="rounded-2xl"
                  title="Location Map"
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href="https://www.google.com/maps/place/SS+Construction+Nepal/@27.7616763,85.3091641,14z/data=!4m6!3m5!1s0x39eb1f056ca6105f:0xc9d02fee490a7767!8m2!3d27.7614987!4d85.3191094!16s%2Fg%2F11z7p9g2fq?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 btn-primary"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-6">Send Us a Message</h2>
              
              {success ? (
                <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-lg mb-1">Thank you for contacting us!</p>
                  <p className="text-sm">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-4">
                      {error}
                    </div>
                  )}
                  <div className="space-y-5">
                    <input
                      type="text"
                      placeholder="Your Name"
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
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      required
                    />
                    <textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-input"
                      rows="5"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full btn-primary"
                    >
                      {submitting ? 'Sending...' : 'Send Message'}
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

export default Contact
