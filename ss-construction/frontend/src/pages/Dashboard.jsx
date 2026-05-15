import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-[#B8860B]">SS Construction</h1>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
        
        <nav className="p-4">
          <Link to="/admin/dashboard" className="block py-2 px-4 rounded bg-[#B8860B] text-white mb-2">
            Dashboard
          </Link>
          <Link to="/admin/properties" className="block py-2 px-4 rounded text-gray-300 hover:bg-gray-700 mb-2">
            Properties
          </Link>
          <Link to="/admin/inquiries" className="block py-2 px-4 rounded text-gray-300 hover:bg-gray-700 mb-2">
            Inquiries
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/users" className="block py-2 px-4 rounded text-gray-300 hover:bg-gray-700 mb-2">
              Users
            </Link>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-[#B8860B] flex items-center justify-center text-white font-bold">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">{user?.full_name}</p>
              <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Properties</p>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-3xl font-bold text-green-500 mt-2">0</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Inquiries</p>
            <p className="text-3xl font-bold text-blue-500 mt-2">0</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">Sell Requests</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">0</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-2">Welcome, {user?.full_name}!</h3>
          <p className="text-gray-400">
            This is your admin dashboard for SS Construction. Manage properties, inquiries, and users from here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
