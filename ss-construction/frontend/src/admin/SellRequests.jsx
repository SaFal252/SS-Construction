import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import AdminLayout from './AdminLayout'

const SellRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewingPhoto, setViewingPhoto] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await api.get('/inquiries/sell-requests/')
      setRequests(response.data.results || response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConvertToListing = async (request) => {
    if (!window.confirm(`Convert "${request.name}" in ${request.location} to property?`)) {
      return
    }
    try {
      await api.post(`/inquiries/sell-requests/${request.id}/convert_to_property/`)
      alert('Property created successfully!')
      fetchRequests()
    } catch (error) {
      console.error('Error converting:', error)
      alert('Error converting sell request. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    if (!price) return 'Not Set'
    return 'Rs. ' + parseInt(price).toLocaleString()
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">Sell Requests</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Incoming Listings for Verification</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Sender</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Assets</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Asking</th>
                  <th className="px-6 py-5 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((request) => (
                  <tr key={request.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                          {request.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none mb-1">{request.name}</p>
                          <p className="text-xs text-gray-400 font-medium tracking-tight leading-none">{request.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-700">{request.location}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Primary Site</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {request.property_type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">{formatPrice(request.asking_price)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-gray-500">{formatDate(request.created_at)}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-200 transition-all uppercase tracking-wider"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No sell requests found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-300" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {(selectedRequest.image_url || (selectedRequest.images_list && selectedRequest.images_list.length > 0)) ? (
                <div className="h-80 relative">
                  {selectedRequest.images_list && selectedRequest.images_list.length > 1 ? (
                    <>
                      <div className="grid grid-cols-2 gap-1 h-full">
                        <div className="col-span-2 h-48">
                          <img src={selectedRequest.images_list[0]} alt="Property" className="w-full h-full object-cover" />
                        </div>
                        {selectedRequest.images_list.slice(1, 5).map((img, idx) => (
                          <div key={idx} className="h-32">
                            <img src={img} alt={`Property ${idx + 2}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      {selectedRequest.images_list.length > 5 && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                          +{selectedRequest.images_list.length - 5} more
                        </div>
                      )}
                    </>
                  ) : selectedRequest.image_url ? (
                    <img src={selectedRequest.image_url} alt="Property" className="w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-8">
                    <h2 className="text-3xl font-black text-white leading-none mb-1">Request Details</h2>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{selectedRequest.property_type} In {selectedRequest.location}</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 pb-4">
                  <h2 className="text-3xl font-black text-gray-900 leading-none mb-1">Request Details</h2>
                  <p className="text-accent text-xs font-bold uppercase tracking-widest">{selectedRequest.property_type} In {selectedRequest.location}</p>
                </div>
              )}
              
              <button onClick={() => setSelectedRequest(null)} className="absolute top-6 right-8 w-10 h-10 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-primary rounded-full flex items-center justify-center transition-all z-10 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 pt-6">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Owner Name</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Contact Email</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-gray-900">{selectedRequest.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Asking Price</p>
                    <p className="text-lg font-black text-accent">{formatPrice(selectedRequest.asking_price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Submitted On</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Description</p>
                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
                  <p className="text-sm font-medium text-gray-600 leading-relaxed italic">"{selectedRequest.description}"</p>
                </div>
              </div>

              {/* All Images Gallery */}
              {selectedRequest.images_list && selectedRequest.images_list.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Property Photos ({selectedRequest.images_list.length})
                    </p>
                    <button 
                      onClick={() => setViewingPhoto({ images: selectedRequest.images_list, currentIndex: 0 })}
                      className="text-xs font-bold text-accent hover:text-accent/80 uppercase tracking-wider"
                    >
                      View All Photos →
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {selectedRequest.images_list.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setViewingPhoto({ images: selectedRequest.images_list, currentIndex: idx })}
                      >
                        <img 
                          src={img} 
                          alt={`Property ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold">View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-gray-200 hover:text-gray-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Photo Viewer Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center" onClick={() => setViewingPhoto(null)}>
          <button 
            onClick={() => setViewingPhoto(null)} 
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Previous Button */}
          {viewingPhoto.currentIndex > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setViewingPhoto({ ...viewingPhoto, currentIndex: viewingPhoto.currentIndex - 1 }) }}
              className="absolute left-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Next Button */}
          {viewingPhoto.currentIndex < viewingPhoto.images.length - 1 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setViewingPhoto({ ...viewingPhoto, currentIndex: viewingPhoto.currentIndex + 1 }) }}
              className="absolute right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {/* Main Image */}
          <img 
            src={viewingPhoto.images[viewingPhoto.currentIndex]} 
            alt={`Photo ${viewingPhoto.currentIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* Photo Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold">
            {viewingPhoto.currentIndex + 1} / {viewingPhoto.images.length}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default SellRequests
