import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import RequestQuoteModal from '../components/RequestQuoteModal'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services/')
      setServices(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const navigate = useNavigate()
  const [showQuote, setShowQuote] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [requestType, setRequestType] = useState('quote')

  return (
    <div className="min-h-screen bg-primary text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Home Improvement & Services</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">Professional trade services for your construction and home improvement needs</p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
              <div key={service.id} onClick={() => navigate(`/service/${service.id}`)} className="group cursor-pointer bg-card rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-white/5 overflow-hidden flex flex-col">
                {/* Service Image */}
                {service.image && (
                  <div className="h-48 overflow-hidden bg-primary-light">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-accent transition-colors">{service.name}</h3>
                  <p className="text-sm text-gray-300 mb-6 flex-1 leading-relaxed">{service.description}</p>

                  {/* Pricing removed per request */}

                  {/* Key Features */}
                  {service.features && (
                    <div className="mb-6 space-y-2">
                      {service.features.split('\n').slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-300">{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={(e) => { e.stopPropagation(); setSelectedService(service); setRequestType('quote'); setShowQuote(true); }} className="w-full py-3 bg-accent text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent/80 transition-all">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-card rounded-[3rem] border border-white/5">
            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No services available yet</p>
          </div>
        )}

        <RequestQuoteModal open={showQuote} onClose={() => setShowQuote(false)} service={selectedService} requestType={requestType} />

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-accent to-accent/80 rounded-[3rem] p-12 text-center">
          <h2 className="text-3xl font-black text-primary mb-4">Need Multiple Services?</h2>
          <p className="text-primary/90 mb-8 max-w-xl mx-auto">Get a free consultation from our expert team to discuss your project requirements</p>
          <button onClick={() => { setSelectedService(null); setRequestType('consultation'); setShowQuote(true); }} className="px-10 py-4 bg-primary text-accent rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
            Book Free Consultation
          </button>
        </div>
      </div>
    </div>
  )
}

export default Services
