import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { crmAPI } from '../api'
import AdminLayout from './AdminLayout'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [followUpNote, setFollowUpNote] = useState('')
  const [nextFollowUpDate, setNextFollowUpDate] = useState('')
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false)

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await crmAPI.getCustomer(id)
      setCustomer(response.data)
    } catch (error) {
      console.error('Error loading customer:', error)
      toast.error('Unable to load customer')
      navigate('/admin/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this customer and all related records?')) return
    try {
      await crmAPI.deleteCustomer(id)
      toast.success('Customer deleted')
      navigate('/admin/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Unable to delete customer')
    }
  }

  const handlePrint = () => window.print()

  const handleFollowUpSubmit = async (event) => {
    event.preventDefault()
    if (!followUpNote.trim()) return

    setSubmittingFollowUp(true)
    try {
      await crmAPI.addFollowUp(id, {
        note: followUpNote,
        next_follow_up_date: nextFollowUpDate || null,
      })
      toast.success('Follow-up added')
      setFollowUpNote('')
      setNextFollowUpDate('')
      fetchCustomer()
    } catch (error) {
      console.error('Error adding follow-up:', error)
      toast.error('Unable to add follow-up')
    } finally {
      setSubmittingFollowUp(false)
    }
  }

  const formatDateTime = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return `Rs. ${Number(value).toLocaleString()}`
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!customer) return null

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              customer.construction_status === 'Completed'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                : customer.construction_status === 'Ongoing'
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : customer.construction_status === 'On Hold'
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-gray-50 text-gray-600 border-gray-100'
            }`}>
              {customer.construction_status}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-100">
              {customer.project_type}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">{customer.full_name}</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Customer Detail Record</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={`/admin/customers/${id}/edit`} className="bg-accent text-primary px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all">Edit</Link>
          <button onClick={handlePrint} className="bg-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 border border-gray-100 hover:bg-gray-50 transition-all">Print</button>
          <button onClick={handlePrint} className="bg-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 border border-gray-100 hover:bg-gray-50 transition-all">Download PDF</button>
          <button onClick={handleDelete} className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 print:block">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</p>
                <p className="text-sm font-bold text-gray-900">{customer.phone_number}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Alternate</p>
                <p className="text-sm font-bold text-gray-900">{customer.alternate_phone || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</p>
                <p className="text-sm font-bold text-gray-900 break-all">{customer.email || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Budget</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(customer.estimated_budget)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-sm font-semibold text-gray-700">{customer.address || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">City</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">District</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.district || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Project Details</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">House Style</p>
                  <p className="text-sm font-semibold text-gray-700">{customer.house_style || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Floors</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.number_of_floors || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Source</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.customer_source || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Land Size</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.land_size || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Built-up Area</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.built_up_area || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Start Date</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.project_start_date || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completion</p>
                    <p className="text-sm font-semibold text-gray-700">{customer.completion_date || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Uploaded Images</h2>
            {(customer.images || []).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {customer.images.map((image) => (
                  <a key={image.id} href={image.url} target="_blank" rel="noreferrer" className="group rounded-2xl overflow-hidden bg-gray-100 aspect-square relative">
                    <img src={image.url} alt={image.caption || 'Project image'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 text-white text-[10px] font-bold px-3 py-2">{image.caption || 'Project image'}</div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-400">No project images uploaded yet.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Uploaded Documents</h2>
            {(customer.documents || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.documents.map((document) => (
                  <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 hover:bg-gray-100 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{document.title || document.document_type}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{document.document_type}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Open</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-400">No documents uploaded yet.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notes</h2>
            <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">{customer.notes || 'No notes added.'}</p>
          </div>
        </div>

        <div className="space-y-8 print:break-before-page">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Follow-up</h2>
            <form onSubmit={handleFollowUpSubmit} className="space-y-4">
              <textarea value={followUpNote} onChange={(e) => setFollowUpNote(e.target.value)} rows={5} placeholder="Add a follow-up note..." className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium" />
              <input type="date" value={nextFollowUpDate} onChange={(e) => setNextFollowUpDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium" />
              <button type="submit" disabled={submittingFollowUp} className="w-full px-5 py-3 rounded-2xl bg-accent text-primary text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all disabled:opacity-50">
                {submittingFollowUp ? 'Saving...' : 'Save Follow-up'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {(customer.timeline || []).map((event, index) => (
                <div key={`${event.type}-${index}`} className="relative pl-5 border-l border-gray-200 last:border-l-transparent">
                  <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-accent shadow-sm shadow-accent/20" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{event.title}</p>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{event.description}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent">{formatDateTime(event.date)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Follow-up History</h2>
            <div className="space-y-4">
              {(customer.follow_ups || []).map((followUp) => (
                <div key={followUp.id} className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-gray-700 whitespace-pre-line">{followUp.note}</p>
                  <div className="flex items-center justify-between mt-3 gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{followUp.created_by_name || 'System'}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">{formatDateTime(followUp.follow_up_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CustomerDetail