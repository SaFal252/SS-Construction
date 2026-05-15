import { useState, useEffect } from 'react'
import api from '../api'
import AdminLayout from './AdminLayout'

const BuildRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [search])

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams()
      params.set('inquiry_type', 'build_property')
      if (search) params.set('search', search)
      
      const response = await api.get(`/inquiries/?${params.toString()}`)
      setRequests(response.data.results || response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/inquiries/${id}/mark_read/`)
      fetchRequests()
      if (selectedRequest?.id === id) {
        setSelectedRequest(prev => ({ ...prev, is_read: true }))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now'
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
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Build Requests</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Construction Pipeline Hub</p>
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
            placeholder="Search build inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-bold"
          />
        </div>
      </div>

      {/* Inbox List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Requirements</th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Received</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => {
                      setSelectedRequest(req);
                      if (!req.is_read) handleMarkRead(req.id);
                    }}
                    className={`group cursor-pointer transition-all ${req.is_read ? 'hover:bg-gray-50/50' : 'bg-accent-[3%] hover:bg-accent-[6%] shadow-inner'}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${req.is_read ? 'bg-gray-100 text-gray-400' : 'bg-accent text-primary shadow-lg shadow-accent/20'}`}>
                          {req.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm leading-none mb-1 ${req.is_read ? 'font-bold text-gray-600' : 'font-black text-gray-900'}`}>{req.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-tight leading-none">{req.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`text-sm mb-1 truncate max-w-md ${req.is_read ? 'text-gray-500 font-medium' : 'text-gray-900 font-black'}`}>
                        {req.message.split('\n')[0]}
                      </p>
                      <p className="text-xs text-gray-400 font-medium truncate max-w-md italic">"{req.message}"</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-500">{formatDate(req.created_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {!req.is_read && (
                        <span className="inline-block w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_12px_rgba(184,134,11,0.5)]"></span>
                      )}
                      {req.is_read && (
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
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">No build requests found</p>
          </div>
        )}
      </div>

      {/* Deep Dive Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-accent text-primary flex items-center justify-center text-2xl font-black shadow-xl shadow-accent/20">
                    {selectedRequest.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">{selectedRequest.name}</h2>
                    <p className="text-xs font-bold text-accent uppercase tracking-[0.2em]">Construction Lead</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="w-12 h-12 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Email Hash</p>
                    <p className="text-sm font-bold text-gray-900 break-all">{selectedRequest.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mobile Access</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRequest.phone}</p>
                  </div>
                </div>
                <div className="space-y-6 text-right">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Received Chrono</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Project Narrative</p>
                <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 relative overflow-hidden">
                  <p className="text-base font-medium text-gray-600 leading-relaxed italic relative z-10 whitespace-pre-wrap">"{selectedRequest.message}"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={`tel:${selectedRequest.phone}`}
                  className="flex-1 px-8 py-4 bg-accent text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent/80 transition-all shadow-xl shadow-accent/20 text-center"
                >
                  Call Lead
                </a>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-gray-200 hover:text-gray-600 transition-all"
                >
                  Close Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default BuildRequests
