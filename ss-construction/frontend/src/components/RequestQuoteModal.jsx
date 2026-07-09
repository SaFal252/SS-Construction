import { useState } from 'react'

const RequestQuoteModal = ({ open, onClose, service, requestType = 'quote' }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', details: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  if (!open) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess('')
    try {
      // POST real request to backend
      const payload = {
        service: service?.id || null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        details: form.details,
        request_type: requestType
      }
      const res = await (await import('../api')).default.post('/services/requests/', payload)
      if (res.status === 201 || res.status === 200) {
        setSuccess('Request submitted — we will contact you soon!')
      } else {
        setSuccess('Request submitted — thank you!')
      }
      setForm({ name: '', email: '', phone: '', details: '' })
    } catch (err) {
      console.error(err)
      setSuccess('Failed to submit request. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1200] flex items-start justify-center pt-[70px] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-[1201] w-full max-w-lg bg-card rounded-xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="text-2xl font-heading font-bold text-white mb-2">Request a Quote</h3>
        <p className="text-gray-300 mb-4">{service?.name || 'Service'}. Please share details and we’ll get back to you.</p>

        {success ? (
          <div className="bg-green-500/10 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">{success}</div>
        ) : null}

        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 gap-3">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="form-input" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="form-input" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="form-input" />
            <textarea name="details" value={form.details} onChange={handleChange} placeholder="Project details" className="form-input h-28" />
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-accent text-primary rounded-lg font-semibold">
                {submitting ? 'Sending…' : 'Send Request'}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2 bg-transparent border border-white/10 rounded-lg text-white">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestQuoteModal
