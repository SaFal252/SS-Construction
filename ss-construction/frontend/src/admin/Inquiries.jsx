import { useState, useEffect } from 'react'
import api from '../api'
import AdminLayout from './AdminLayout'

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [filter, search])

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams()
      if (filter) params.set('inquiry_type', filter)
      if (search) params.set('search', search)
      
      const response = await api.get(`/inquiries/?${params.toString()}`)
      const allInquiries = response.data.results || response.data
      setInquiries(allInquiries.filter(i => i.inquiry_type !== 'build_property' && i.inquiry_type !== 'sell'))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/inquiries/${id}/mark_read/`)
      fetchInquiries()
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, is_read: true }))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Inquiries</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Customer Engagement Hub</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] shadow-sm p-4 border border-gray-100 flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, phone or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-6 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-black text-gray-700 cursor-pointer uppercase tracking-widest"
        >
          <option value="">All Leads</option>
          <option value="property">Property Leads</option>
          <option value="general">General Support</option>
        </select>
      </div>

      {/* Inbox List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject / Preview</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Received</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      if (!inquiry.is_read) handleMarkRead(inquiry.id);
                    }}
                    className={`group cursor-pointer transition-all ${inquiry.is_read ? 'hover:bg-gray-50/50' : 'bg-accent-[3%] hover:bg-accent-[6%] shadow-inner'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${inquiry.is_read ? 'bg-gray-100 text-gray-400' : 'bg-accent text-primary shadow-lg shadow-accent/20'}`}>
                          {inquiry.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm leading-none mb-1 ${inquiry.is_read ? 'font-bold text-gray-600' : 'font-black text-gray-900'}`}>{inquiry.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-tight leading-none">{inquiry.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`text-sm mb-1 truncate max-w-xs ${inquiry.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-black'}`}>
                        {inquiry.property_title ? `Property: ${inquiry.property_title}` : 'General Inquiry'}
                      </p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-md italic">"{inquiry.message}"</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                        inquiry.inquiry_type === 'property' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        inquiry.inquiry_type === 'sell' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {inquiry.inquiry_type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-500">{formatDate(inquiry.created_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {!inquiry.is_read && (
                        <span className="inline-block w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_12px_rgba(184,134,11,0.5)]"></span>
                      )}
                      {inquiry.is_read && (
                        <svg className="inline-block w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">No communications found</p>
          </div>
        )}
      </div>

      {/* Deep Dive Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300" onClick={() => setSelectedInquiry(null)}>
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-accent text-primary flex items-center justify-center text-2xl font-black shadow-xl shadow-accent/20">
                    {selectedInquiry.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{selectedInquiry.name}</h2>
                    <p className="text-xs font-bold text-accent uppercase tracking-[0.2em]">{selectedInquiry.inquiry_type} Stream Lead</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInquiry(null)} className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email Hash</p>
                    <p className="text-sm font-bold text-gray-900 break-all">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mobile Access</p>
                    <p className="text-sm font-bold text-gray-900">{selectedInquiry.phone}</p>
                  </div>
                </div>
                <div className="space-y-6 text-right">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Received Chrono</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedInquiry.created_at)}</p>
                  </div>
                  {selectedInquiry.property_title && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Linked Listing</p>
                      <p className="text-sm font-black text-accent">{selectedInquiry.property_title}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Engagement Narrative</p>
                <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C12.8079 14 11.017 12.2091 11.017 10V5C11.017 3.89543 11.9124 3 13.017 3H21.017C22.1216 3 23.017 3.89543 23.017 5V10C23.017 12.2091 21.2261 14 19.017 14V16C21.2261 16 23.017 17.7909 23.017 20V21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017V14H2.017C-0.192066 14 -1.98297 12.2091 -1.98297 10V5C-1.98297 3.89543 -1.08754 3 0.0170288 3H8.01703C9.1216 3 10.017 3.89543 10.017 5V10C10.017 12.2091 8.2261 14 6.01703 14V16C8.2261 16 10.017 17.7909 10.017 20V21H1.017Z" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-600 leading-relaxed italic relative z-10">"{selectedInquiry.message}"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex-1 px-8 py-4 bg-accent text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent/80 transition-all shadow-xl shadow-accent/20 text-center"
                >
                  Initiate Reply
                </a>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-gray-200 hover:text-gray-600 transition-all"
                >
                  Archive Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Inquiries
