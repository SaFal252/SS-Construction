import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api, { crmAPI } from '../api'
import AdminLayout from './AdminLayout'

const defaultFormData = {
  full_name: '',
  phone_number: '',
  alternate_phone: '',
  email: '',
  address: '',
  city: '',
  district: '',
  project_type: 'Residential',
  house_style: '',
  number_of_floors: '',
  land_size: '',
  built_up_area: '',
  estimated_budget: '',
  construction_status: 'New Lead',
  project_start_date: '',
  completion_date: '',
  notes: '',
  assigned_engineer: '',
  customer_source: '',
}

const CustomerForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)
  const [formData, setFormData] = useState(defaultFormData)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditMode)
  const [customer, setCustomer] = useState(null)
  const [engineers, setEngineers] = useState([])
  const [projectImages, setProjectImages] = useState([])
  const [otherDocuments, setOtherDocuments] = useState([])
  const [blueprintPdf, setBlueprintPdf] = useState(null)
  const [agreementPdf, setAgreementPdf] = useState(null)

  useEffect(() => {
    fetchEngineers()
    if (isEditMode) {
      fetchCustomer()
    }
  }, [id])

  const fetchEngineers = async () => {
    try {
      const response = await api.get('/auth/users/')
      const users = response.data.results || response.data || []
      setEngineers(users.filter((user) => user.is_staff || user.is_superuser || user.role === 'admin'))
    } catch (error) {
      console.error('Error fetching engineers:', error)
    }
  }

  const fetchCustomer = async () => {
    try {
      const response = await crmAPI.getCustomer(id)
      const customerData = response.data
      setCustomer(customerData)
      setFormData({
        full_name: customerData.full_name || '',
        phone_number: customerData.phone_number || '',
        alternate_phone: customerData.alternate_phone || '',
        email: customerData.email || '',
        address: customerData.address || '',
        city: customerData.city || '',
        district: customerData.district || '',
        project_type: customerData.project_type || 'Residential',
        house_style: customerData.house_style || '',
        number_of_floors: customerData.number_of_floors ?? '',
        land_size: customerData.land_size ?? '',
        built_up_area: customerData.built_up_area ?? '',
        estimated_budget: customerData.estimated_budget ?? '',
        construction_status: customerData.construction_status || 'New Lead',
        project_start_date: customerData.project_start_date || '',
        completion_date: customerData.completion_date || '',
        notes: customerData.notes || '',
        assigned_engineer: customerData.assigned_engineer?.id || '',
        customer_source: customerData.customer_source || '',
      })
    } catch (error) {
      console.error('Error loading customer:', error)
      toast.error('Unable to load customer')
      navigate('/admin/customers')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const appendFiles = (formDataPayload, fieldName, files) => {
    Array.from(files || []).forEach((file) => {
      formDataPayload.append(fieldName, file)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const payload = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          payload.append(key, value)
        }
      })

      appendFiles(payload, 'project_images', projectImages)
      appendFiles(payload, 'other_documents', otherDocuments)
      if (blueprintPdf) payload.append('blueprint_pdf', blueprintPdf)
      if (agreementPdf) payload.append('agreement_pdf', agreementPdf)

      if (isEditMode) {
        await crmAPI.updateCustomer(id, payload)
        toast.success('Customer updated successfully')
        navigate(`/admin/customers/${id}`)
      } else {
        const response = await crmAPI.createCustomer(payload)
        toast.success('Customer created successfully')
        navigate(`/admin/customers/${response.data.id}`)
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      const message = error.response?.data?.detail || 'Unable to save customer'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const engineerOptions = useMemo(() => engineers, [engineers])

  const inputClassName = 'w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 transition-all text-sm font-medium text-gray-900'
  const labelClassName = 'block text-gray-700 text-sm font-semibold mb-2'

  return (
    <AdminLayout>
      <div className="flex justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-none mb-2">{isEditMode ? 'Edit Customer' : 'Add Customer'}</h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">CRM Customer Record</p>
        </div>
        <Link to="/admin/customers" className="bg-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-600 border border-gray-100 hover:bg-gray-50 transition-all">
          Back to Customers
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>Phone Number</label>
                <input name="phone_number" value={formData.phone_number} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>Alternate Phone</label>
                <input name="alternate_phone" value={formData.alternate_phone} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClassName} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClassName}>Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>City</label>
                <input name="city" value={formData.city} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>District</label>
                <input name="district" value={formData.district} onChange={handleChange} className={inputClassName} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>Project Type</label>
                <select name="project_type" value={formData.project_type} onChange={handleChange} className={inputClassName}>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Bangalow">Bangalow</option>
                  <option value="Semi-Bangalow">Semi-Bangalow</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>Construction Status</label>
                <select name="construction_status" value={formData.construction_status} onChange={handleChange} className={inputClassName}>
                  <option value="New Lead">New Lead</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>House Style</label>
                <input name="house_style" value={formData.house_style} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Number of Floors</label>
                <input type="number" name="number_of_floors" value={formData.number_of_floors} onChange={handleChange} className={inputClassName} min="0" />
              </div>
              <div>
                <label className={labelClassName}>Land Size</label>
                <input type="number" step="0.01" name="land_size" value={formData.land_size} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Built-up Area</label>
                <input type="number" step="0.01" name="built_up_area" value={formData.built_up_area} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Estimated Budget</label>
                <input type="number" step="0.01" name="estimated_budget" value={formData.estimated_budget} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Assigned Engineer</label>
                <select name="assigned_engineer" value={formData.assigned_engineer} onChange={handleChange} className={inputClassName}>
                  <option value="">Select Engineer</option>
                  {engineerOptions.map((engineer) => (
                    <option key={engineer.id} value={engineer.id}>
                      {engineer.full_name || engineer.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>Project Start Date</label>
                <input type="date" name="project_start_date" value={formData.project_start_date} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>Completion Date</label>
                <input type="date" name="completion_date" value={formData.completion_date} onChange={handleChange} className={inputClassName} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClassName}>Customer Source</label>
                <input name="customer_source" value={formData.customer_source} onChange={handleChange} className={inputClassName} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notes and Files</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className={labelClassName}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={5} className={inputClassName} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>Project Images</label>
                  <input type="file" multiple accept="image/*" onChange={(event) => setProjectImages(event.target.files)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-accent file:px-4 file:py-3 file:text-sm file:font-black file:text-primary hover:file:bg-accent-light" />
                </div>
                <div>
                  <label className={labelClassName}>Blueprint PDF</label>
                  <input type="file" accept="application/pdf" onChange={(event) => setBlueprintPdf(event.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-accent file:px-4 file:py-3 file:text-sm file:font-black file:text-primary hover:file:bg-accent-light" />
                </div>
                <div>
                  <label className={labelClassName}>Agreement PDF</label>
                  <input type="file" accept="application/pdf" onChange={(event) => setAgreementPdf(event.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-accent file:px-4 file:py-3 file:text-sm file:font-black file:text-primary hover:file:bg-accent-light" />
                </div>
                <div>
                  <label className={labelClassName}>Other Documents</label>
                  <input type="file" multiple accept="application/pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => setOtherDocuments(event.target.files)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-2xl file:border-0 file:bg-accent file:px-4 file:py-3 file:text-sm file:font-black file:text-primary hover:file:bg-accent-light" />
                </div>
              </div>

              {isEditMode && customer && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Existing Images</p>
                    <div className="grid grid-cols-2 gap-3">
                      {(customer.images || []).map((image) => (
                        <div key={image.id} className="rounded-2xl overflow-hidden bg-gray-100 aspect-square">
                          <img src={image.url} alt={image.caption || 'Customer image'} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Existing Documents</p>
                    <div className="space-y-2">
                      {(customer.documents || []).map((document) => (
                        <a key={document.id} href={document.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                          <span>{document.title || document.document_type}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Open</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end pb-6">
            <Link to={isEditMode ? `/admin/customers/${id}` : '/admin/customers'} className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-2xl bg-accent text-primary text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent/80 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}

export default CustomerForm