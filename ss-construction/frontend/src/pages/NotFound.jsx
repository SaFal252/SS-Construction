import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | SS Construction</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="text-center max-w-md">
          {/* 404 Image/Icon */}
          <div className="mb-8">
            <div className="text-[#B8860B] text-8xl font-bold opacity-20 mx-auto">404</div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B8860B] text-white rounded-lg hover:bg-[#9a7209] transition-colors"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
