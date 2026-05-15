import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import MobileBottomBar from './components/MobileBottomBar'
// import Login from './pages/Login' // obsolete
// import Signup from './pages/Signup' // obsolete
// import Register from './pages/Register' // obsolete
import AuthPage from './pages/AuthPage'
import AdminLogin from './pages/AdminLogin'
import UserDashboard from './pages/UserDashboard'
import Home from './pages/Home'
import Houses from './pages/Houses'
import BuyProperty from './pages/BuyProperty'
import PropertyDetail from './pages/PropertyDetail'
import Portfolio from './pages/Portfolio'
import SellProperty from './pages/SellProperty'
import BuildProperty from './pages/BuildProperty'
import About from './pages/About'
import Contact from './pages/Contact'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'
import EmailVerification from './pages/EmailVerification'
import SignupOTP from './pages/SignupOTP'

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import('./admin/Dashboard'))
const Properties = lazy(() => import('./admin/Properties'))
const PropertyForm = lazy(() => import('./admin/PropertyForm'))
const Inquiries = lazy(() => import('./admin/Inquiries'))
const SellRequests = lazy(() => import('./admin/SellRequests'))
const BuildRequests = lazy(() => import('./admin/BuildRequests'))
const Users = lazy(() => import('./admin/Users'))
const Settings = lazy(() => import('./admin/Settings'))

// Loading fallback
const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B8860B]"></div>
  </div>
)

// Public layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <FloatingButtons />
    <MobileBottomBar />
  </>
)

function App() {
  return (
    <FavoritesProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          
          {/* AuthPage for Login/Signup */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <AuthPage mode="login" />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <Navigate to="/signup-otp" replace />
              </PublicLayout>
            }
          />

          <Route
            path="/signup-otp"
            element={
              <PublicLayout>
                <SignupOTP />
              </PublicLayout>
            }
          />
          <Route
            path="/houses"
            element={
              <PublicLayout>
                <Houses />
              </PublicLayout>
            }
          />
          <Route
            path="/buy"
            element={
              <PublicLayout>
                <BuyProperty />
              </PublicLayout>
            }
          />
          <Route
            path="/property/:slug"
            element={
              <PublicLayout>
                <PropertyDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PublicLayout>
                <Portfolio />
              </PublicLayout>
            }
          />
          <Route
            path="/sell"
            element={
              <PublicLayout>
                <SellProperty />
              </PublicLayout>
            }
          />
          <Route
            path="/build-property"
            element={
              <PublicLayout>
                <BuildProperty />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          
          {/* Favorites Page */}
          <Route
            path="/favorites"
            element={
              <PublicLayout>
                <Favorites />
              </PublicLayout>
            }
          />
          
          {/* Services Page */}
          <Route
            path="/services"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />
          
          {/* Blog Page */}
          <Route
            path="/blog"
            element={
              <PublicLayout>
                <Contact />
              </PublicLayout>
            }
          />

          <Route
            path="/verify-email/:token"
            element={
              <PublicLayout>
                <EmailVerification />
              </PublicLayout>
            }
          />

          {/* Protected User Dashboard Route - for authenticated users only (not admin) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userOnly>
                <PublicLayout>
                  <UserDashboard />
                </PublicLayout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <Properties />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/properties/add"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <PropertyForm />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/properties/:slug/edit"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <PropertyForm />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/build-requests"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <BuildRequests />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <Inquiries />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/sell-requests"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <SellRequests />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <Users />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly={true}>
                <Suspense fallback={<AdminLoadingFallback />}>
                  <Settings />
                </Suspense>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/create-user"
            element={
              <ProtectedRoute adminOnly={true}>
                <AuthPage mode="signup" />
              </ProtectedRoute>
            }
          />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </FavoritesProvider>
  )
}

export default App
