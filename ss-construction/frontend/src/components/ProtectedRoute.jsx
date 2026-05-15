import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    // Regular users trying to access admin routes should go to home page
    return <Navigate to="/" replace />
  }

  if (userOnly && isAdmin) {
    // Admin users trying to access user routes should go to admin dashboard
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
