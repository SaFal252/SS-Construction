import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import RequestQuoteModal from '../components/RequestQuoteModal'

const ServiceDetail = () => {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQuote, setShowQuote] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}/`)
        setService(res.data)
      } catch (err) {
        console.error('Service detail fetch failed', err)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>
  if (!service) return <div className="p-8">Service not found.</div>

  return (
    <div className="min-h-screen bg-primary py-28">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {service.image && <img src={service.image} alt={service.name} className="w-full rounded-2xl mb-6 object-cover max-h-96" />}
            <h1 className="text-3xl font-heading font-bold text-white mb-3">{service.name}</h1>
            <p className="text-gray-300 mb-6">{service.description}</p>
            <div className="prose prose-invert text-gray-200">{service.long_description || ''}</div>
          </div>

          <aside className="bg-card p-6 rounded-2xl">
            <h4 className="text-lg font-semibold text-white mb-3">Get a Quote</h4>
            <p className="text-gray-300 mb-4">Quick request — we'll respond within 24 hours.</p>
            <button onClick={() => setShowQuote(true)} className="w-full px-4 py-3 bg-accent text-primary rounded-lg font-bold">Request Quote</button>
          </aside>
        </div>
      </div>

      <RequestQuoteModal open={showQuote} onClose={() => setShowQuote(false)} service={service} />
    </div>
  )
}

export default ServiceDetail
