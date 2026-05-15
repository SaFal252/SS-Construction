import { useState } from 'react'
import api from '../api'

const Construction = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/inquiries/', {
        ...formData,
        inquiry_type: 'construction',
      })
      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', message: '' })
    } catch (error) {
      console.error('Error submitting inquiry:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const processes = [
    { step: 1, title: 'Planning', description: 'We discuss your requirements and create detailed blueprints' },
    { step: 2, title: 'Design', description: 'Our architects design your dream space with 3D visualizations' },
    { step: 3, title: 'Foundation', description: 'Expert groundwork and foundation laying with quality materials' },
    { step: 4, title: 'Build', description: 'Construction phase with regular progress updates' },
    { step: 5, title: 'Handover', description: 'Final touches and keys handover with documentation' },
  ]

  const materials = [
    'High-quality cement (OPC & PPC)',
    'Steel reinforcement (TMT bars)',
    'Bricks and blocks',
    'Sand and aggregates',
    'Tiles and flooring',
    'Paint and finishes',
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
            Professional <span className="text-accent">Construction</span> Services
          </h1>
          <p className="text-xl text-gray-200 animate-fade-in-up delay-200">
            Building quality structures since 2075
          </p>
        </div>
      </section>

      {/* Our Process */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-secondary">Our Process</h2>
            <p className="text-gray-400 mt-4">From concept to completion</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processes.map((process, index) => (
              <div 
                key={process.step} 
                className="bg-card p-6 rounded-2xl text-center card card-hover-border"
              >
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-heading font-semibold text-secondary mb-2">{process.title}</h3>
                <p className="text-gray-400 text-sm">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="section-padding bg-primary-light">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-secondary">Materials We Use</h2>
            <p className="text-gray-400 mt-4">Premium quality materials for lasting results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material, index) => (
              <div 
                key={index} 
                className="flex items-center bg-card p-5 rounded-xl"
              >
                <svg className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-secondary">{material}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supervision */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">Supervision & Quality</h2>
              <p className="text-gray-400 mb-6 text-lg">Every project is supervised by experienced engineers and architects.</p>
              <ul className="space-y-4">
                <li className="flex items-center text-secondary">
                  <svg className="w-6 h-6 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Daily site supervision
                </li>
                <li className="flex items-center text-secondary">
                  <svg className="w-6 h-6 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Regular quality audits
                </li>
                <li className="flex items-center text-secondary">
                  <svg className="w-6 h-6 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Material testing
                </li>
              </ul>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" 
                alt="Construction"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="section-padding bg-gradient-to-r from-accent-dark to-accent relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Book Free Consultation</h2>
            <p className="text-primary/80 text-lg">Discuss your construction project with our experts</p>
          </div>
          
          {success ? (
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-6 rounded-2xl text-center max-w-lg mx-auto">
              <p className="text-primary text-lg font-semibold">Thank you! We'll contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input mt-6"
                required
              />
              <textarea
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-input mt-6"
                rows="4"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary mt-6"
              >
                {submitting ? 'Sending...' : 'Book Free Consultation'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default Construction
